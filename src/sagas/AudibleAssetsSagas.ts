import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import {selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {S3ListObject} from "../types/AssetTypes";
import {createReceivedAudibleAssetList, createReceivedAudibleS3List} from "../events/AudibleAssetEvents";
import {AudibleAssetDefinition} from "../reducers/AudibleAssetReducer";

function* visualAssetFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  yield fork(assetJsonSaga);

  try {
    const allVisualAssets: S3ListObject[] = yield call(() =>
      Storage.list("audible/")
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
      Storage.get("audible/assets.json", {download: true})
        .then((result: any) => result.Body.text())
        .then(JSON.parse)
    );
    yield put(createReceivedAudibleAssetList(assetJson));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* audibleAssetSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, visualAssetFetchSaga)
}

export default function* (): Generator {
  yield all([audibleAssetSagas()]);
}
