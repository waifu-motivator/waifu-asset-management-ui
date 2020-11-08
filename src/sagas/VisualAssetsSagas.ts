import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import {selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {S3ListObject} from "../types/AssetTypes";
import {createReceivedVisualS3List} from "../events/AssetEvents";

function* userProfileFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  try {
    const allVisualAssets: S3ListObject[] = yield call(() =>
      Storage.list("visuals/")
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

function* userSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, userProfileFetchSaga)
}

export default function* (): Generator {
  yield all([userSagas()]);
}
