import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION, REQUESTED_SYNC_CHANGES} from "../events/ApplicationLifecycleEvents";
import {selectAudibleAssetState, selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {AssetGroupKeys, Assets, S3ListObject} from "../types/AssetTypes";
import {createReceivedAudibleAssetList, createReceivedAudibleS3List} from "../events/AudibleAssetEvents";
import {AudibleAssetDefinition, AudibleAssetState, LocalAudibleAssetDefinition} from "../reducers/AudibleAssetReducer";
import {assetUpload, downloadAsset, extractAddedAssets, syncSaga} from "./CommonSagas";
import {omit, values} from "lodash";

function* audibleAssetFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  yield fork(assetJsonSaga);

  try {
    const allVisualAssets: S3ListObject[] = yield call(() =>
      Storage.list(`${AssetGroupKeys.AUDIBLE}/`)
        .then((result: S3ListObject[]) => result.filter(ob =>
          !(ob.key.endsWith("checksum.txt") || ob.key.endsWith(".json"))
        ))
    );
    yield put(createReceivedAudibleS3List(allVisualAssets.map(s3Asset => ({
      ...s3Asset,
      eTag: s3Asset.eTag.replaceAll('"', '')
    }))));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* assetJsonSaga() {
  try {
    const assetJson: AudibleAssetDefinition[] = yield call(() =>
      Storage.get(`${AssetGroupKeys.AUDIBLE}/assets.json`, {download: true})
        .then((result: any) => result.Body.text())
        .then(JSON.parse)
    );
    yield put(createReceivedAudibleAssetList(assetJson));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

const AUDIBLE_ASSET_LIST_KEY = `${AssetGroupKeys.AUDIBLE}/assets.json`;

const AUDIBLE_ASSET_BLACKLIST = [
  "file"
]

function* uploadAudibleAssets(assetsToUpload: LocalAudibleAssetDefinition[]) {
  yield call(() => assetsToUpload.reduce(
    (accum, assetToUpload) =>
      accum.then(() =>
        assetUpload(
          `${AssetGroupKeys.AUDIBLE}/${assetToUpload.path}`,
          assetToUpload.file,
          assetToUpload.file.type
        )),
    Promise.resolve()
    )
  );
}

function* attemptToSyncAudibleAssets() {
  try {
    const freshAudibleList: AudibleAssetDefinition[] | undefined = yield call(getAudibleAssetDefinitions);
    const definedAudibleList = freshAudibleList || [];
    const {unsyncedAssets}: AudibleAssetState = yield select(selectAudibleAssetState);
    const addedAudibleAssets = extractAddedAssets<LocalAudibleAssetDefinition>(unsyncedAssets);
    yield call(uploadAudibleAssets, addedAudibleAssets);

    const newAudibleAssets = values(
      definedAudibleList.concat(addedAudibleAssets)
        .map(asset => omit(asset, AUDIBLE_ASSET_BLACKLIST) as AudibleAssetDefinition)
        .reduce((accum, asset) => ({
          ...accum,
          [asset.path]: asset
        }), {}),
    );
    console.log('audible', newAudibleAssets)
    // yield call(uploadAsset, AUDIBLE_ASSET_LIST_KEY, JSON.stringify(newAudibleAssets), ContentType.JSON);
    // yield put(syncedChanges(Assets.AUDIBLE));
  } catch (e) {
    console.warn("unable to sync audio for raisins", e)
  }
}

function* getAudibleAssetDefinitions() {
  try {
    const audibleAssetDefinitions: AudibleAssetDefinition[] = yield call(() =>
      downloadAsset(AUDIBLE_ASSET_LIST_KEY));
    return audibleAssetDefinitions;
  } catch (e) {
    console.warn("Unable to get to get audible assets 囧", e)
  }
}

function* audibleAssetSyncSaga() {
  yield fork(syncSaga, Assets.AUDIBLE, attemptToSyncAudibleAssets);
}

function* audibleAssetSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, audibleAssetFetchSaga);
  yield takeEvery(REQUESTED_SYNC_CHANGES, audibleAssetSyncSaga);
}

export default function* (): Generator {
  yield all([audibleAssetSagas()]);
}
