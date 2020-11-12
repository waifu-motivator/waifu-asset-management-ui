import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import {selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {AssetCategory, S3ListObject} from "../types/AssetTypes";
import {createReceivedVisualAssetList, createReceivedVisualS3List} from "../events/VisualAssetEvents";
import {VisualAssetDefinition} from "../reducers/VisualAssetReducer";

function* visualAssetFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  yield fork(assetJsonSaga);

  try {
    const allVisualAssets: S3ListObject[] = yield call(() =>
      Storage.list(`${AssetCategory.VISUAL}/`)
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
      Storage.get(`${AssetCategory.VISUAL}/assets.json`, {download: true})
        .then((result: any) => result.Body.text())
        .then(JSON.parse)
    );
    yield put(createReceivedVisualAssetList(assetJson));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* visualAssetSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, visualAssetFetchSaga)
}

export default function* (): Generator {
  yield all([visualAssetSagas()]);
}
