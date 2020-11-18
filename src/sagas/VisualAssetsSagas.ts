import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION, REQUESTED_SYNC_CHANGES} from "../events/ApplicationLifecycleEvents";
import {selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {AssetGroupKeys, Assets, S3ListObject} from "../types/AssetTypes";
import {createReceivedVisualAssetList, createReceivedVisualS3List} from "../events/VisualAssetEvents";
import {LocalVisualAssetDefinition, VisualAssetDefinition, VisualAssetState} from "../reducers/VisualAssetReducer";
import {assetUpload, downloadAsset, extractAddedAssets, syncSaga} from "./CommonSagas";
import {omit, values} from "lodash";

function* visualAssetFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  yield fork(assetJsonSaga);

  try {
    const allVisualAssets: S3ListObject[] = yield call(() =>
      Storage.list(`${AssetGroupKeys.VISUAL}/`)
        .then((result: S3ListObject[]) => result.filter(ob =>
          !(ob.key.endsWith("checksum.txt") || ob.key.endsWith(".json"))
        ))
    );
    yield put(createReceivedVisualS3List(allVisualAssets.map(s3Asset => ({
      ...s3Asset,
      eTag: s3Asset.eTag.replaceAll('"', '')
    }))));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* assetJsonSaga() {
  try {
    const assetJson: VisualAssetDefinition[] = yield call(() =>
      Storage.get(`${AssetGroupKeys.VISUAL}/assets.json`, {download: true})
        .then((result: any) => result.Body.text())
        .then(JSON.parse)
    );
    yield put(createReceivedVisualAssetList(assetJson));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

const VISUAL_ASSET_LIST_KEY = `${AssetGroupKeys.VISUAL}/assets.json`;

const VISUAL_ASSET_BLACKLIST = [
  "file"
]

function* getVisualAssetDefinitions() {
  try {
    const visualAssetDefinitions: VisualAssetDefinition[] =
      yield call(() => downloadAsset(VISUAL_ASSET_LIST_KEY));
    return visualAssetDefinitions;
  } catch (e) {
    console.warn("Unable to get to get visual assets 囧", e)
  }
}

function* uploadVisualAssets(assetsToUpload: LocalVisualAssetDefinition[]) {
  yield call(() =>
    assetsToUpload.reduce(
      (accum, assetToUpload) =>
        accum.then(() =>
          assetUpload(
            `${AssetGroupKeys.VISUAL}/${assetToUpload.path}`,
            assetToUpload.file,
            assetToUpload.file?.type || ''
          )),
      Promise.resolve()
    )
  );
}

function* attemptToSyncVisualAssets() {
  try {
    const freshVisualList: VisualAssetDefinition[] | undefined = yield call(getVisualAssetDefinitions);
    const definedVisualList = freshVisualList || [];
    const {unsyncedAssets}: VisualAssetState = yield select(selectVisualAssetState);
    const addedVisualAssets = extractAddedAssets<LocalVisualAssetDefinition>(unsyncedAssets);
    yield call(uploadVisualAssets, addedVisualAssets);

    const newVisualAssets = values(
      definedVisualList.concat(addedVisualAssets)
        .map(asset => omit(asset, VISUAL_ASSET_BLACKLIST) as VisualAssetDefinition)
        .reduce((accum, asset) => ({
          ...accum,
          [asset.path]: asset
        }), {}),
    );
    console.log('visuals', newVisualAssets)
    // yield call(uploadAsset, VISUAL_ASSET_LIST_KEY, JSON.stringify(newVisualAssets), ContentType.JSON);
    // yield put(syncedChanges(Assets.VISUAL));
  } catch (e) {
    console.warn("unable to sync images for raisins", e)
  }
}

function* visualAssetSyncSaga() {
  yield fork(syncSaga, Assets.VISUAL, attemptToSyncVisualAssets);
}

function* visualAssetSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, visualAssetFetchSaga)
  yield takeEvery(REQUESTED_SYNC_CHANGES, visualAssetSyncSaga)
}

export default function* (): Generator {
  yield all([visualAssetSagas()]);
}
