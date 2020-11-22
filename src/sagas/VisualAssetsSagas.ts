import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {
  INITIALIZED_APPLICATION,
  REQUESTED_SYNC_CHANGES,
  SYNCED_ASSET,
  syncedChanges
} from "../events/ApplicationLifecycleEvents";
import {selectMotivationAssetState, selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {AssetGroupKeys, Assets, S3ListObject} from "../types/AssetTypes";
import {
  createdVisualAsset,
  createReceivedVisualAssetList,
  createReceivedVisualS3List,
  createUpdatedVisualAssetList,
  createUpdatedVisualS3List,
  DROPPED_WAIFU
} from "../events/VisualAssetEvents";
import {LocalVisualAssetDefinition, VisualAssetDefinition, VisualAssetState} from "../reducers/VisualAssetReducer";
import {ContentType, downloadAsset, extractAddedAssets, syncSaga, uploadAssetSaga, uploadAssetsSaga} from "./CommonSagas";
import {omit, values} from "lodash";
import {PayloadEvent} from "../events/Event";
import {LocalMotivationAsset, MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {cleanedUpMotivationAssets} from "../events/MotivationAssetEvents";
import {StringDictionary} from "../types/SupportTypes";

function* fetchS3List() {
  const allVisualAssets: S3ListObject[] = yield call(() =>
    Storage.list(`${AssetGroupKeys.VISUAL}/`, {cacheControl: 'no-cache'})
      .then((result: S3ListObject[]) => result.filter(ob =>
        !(ob.key.endsWith("checksum.txt") || ob.key.endsWith(".json"))
      ))
  );
  return allVisualAssets.map(s3Asset => ({
    ...s3Asset,
    eTag: s3Asset.eTag.replaceAll('"', '')
  }));
}

function* visualAssetFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  yield fork(assetJsonSaga);

  try {
    const visualAssets = yield call(fetchS3List);
    yield put(createReceivedVisualS3List(visualAssets));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

// todo: consolidate string literals
const VISUAL_ASSET_LIST_KEY = `${AssetGroupKeys.VISUAL}/assets.json`;

function* assetJsonSaga() {
  try {
    const assetJson: VisualAssetDefinition[] = yield call(() =>
      Storage.get(VISUAL_ASSET_LIST_KEY,
        {download: true, cacheControl: 'no-cache'})
        .then((result: any) => result.Body.text())
        .then(JSON.parse)
    );
    yield put(createReceivedVisualAssetList(assetJson));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

const VISUAL_ASSET_BLACKLIST = [
  "file"
]

function* getVisualAssetDefinitions() {
  try {
    const visualAssetDefinitions: VisualAssetDefinition[] =
      yield call(() => downloadAsset(VISUAL_ASSET_LIST_KEY, true));
    return visualAssetDefinitions;
  } catch (e) {
    console.warn("Unable to get to get visual assets 囧", e)
  }
}

function* attemptToSyncVisualAssets() {
  try {
    const freshVisualList: VisualAssetDefinition[] | undefined = yield call(getVisualAssetDefinitions);
    const definedVisualList = freshVisualList || [];
    const {unsyncedAssets}: VisualAssetState = yield select(selectVisualAssetState);
    const addedVisualAssets = extractAddedAssets<LocalVisualAssetDefinition>(unsyncedAssets);

    yield call(uploadAssetsSaga, AssetGroupKeys.VISUAL, addedVisualAssets);

    const newVisualAssets = values(
      definedVisualList.concat(addedVisualAssets)
        .map(asset => omit(asset, VISUAL_ASSET_BLACKLIST) as VisualAssetDefinition)
        .reduce((accum, asset) => ({
          ...accum,
          [asset.path]: asset
        }), {} as StringDictionary<VisualAssetDefinition>),
    );

    yield put(createUpdatedVisualAssetList(newVisualAssets));
    yield call(uploadAssetSaga,
      AssetGroupKeys.VISUAL, 'assets.json', // todo: consolidate string literals2
      JSON.stringify(newVisualAssets), ContentType.JSON
    );
    yield put(syncedChanges(Assets.VISUAL));
  } catch (e) {
    console.warn("unable to sync images for raisins", e)
  }
}

function* visualAssetExtractionSaga({payload}: PayloadEvent<LocalMotivationAsset[]>) {
  yield all(
    payload.filter(asset => !!asset.visuals)
      .map(asset => put(createdVisualAsset({
        ...asset.visuals,
        imageChecksum: asset.imageChecksum,
        file: asset.imageFile
      })))
  );
}

function* localAssetCleanupSaga({payload: syncedAsset}: PayloadEvent<Assets>) {
  if (syncedAsset === Assets.VISUAL) {
    // todo: move to motivation asset sagas
    const {assets}: MotivationAssetState = yield select(selectMotivationAssetState);
    yield put(cleanedUpMotivationAssets(
      values(assets)
        .filter(asset => !asset.imageChecksum)
    ));
    const newAssetList = yield call(fetchS3List);
    yield put(createUpdatedVisualS3List(newAssetList))
  }
}

function* visualAssetSyncSaga() {
  yield fork(syncSaga, Assets.VISUAL, attemptToSyncVisualAssets);
}

function* visualAssetSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, visualAssetFetchSaga);
  yield takeEvery(DROPPED_WAIFU, visualAssetExtractionSaga);
  yield takeEvery(REQUESTED_SYNC_CHANGES, visualAssetSyncSaga);
  yield takeEvery(SYNCED_ASSET, localAssetCleanupSaga);
}

export default function* (): Generator {
  yield all([visualAssetSagas()]);
}
