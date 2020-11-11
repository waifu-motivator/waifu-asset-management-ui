import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import {selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {Anime, Waifu} from "../reducers/VisualAssetReducer";
import {createReceivedAnimeList, createReceivedWaifuList} from "../events/CharacterSourceEvents";

function* characterSourceAssetFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  yield fork(loadWaifuDefinitions);
  yield fork(loadAnimeDefinitions);
}

function* loadWaifuDefinitions() {
  try {
    const waifuList: Waifu[] = yield call(() =>
      Storage.get("waifu/list.json", {download: true})
        .then((result: any) => result.Body.text())
        .then(JSON.parse)
    );
    yield put(createReceivedWaifuList(waifuList));
  } catch (e) {
    console.warn("Unable to get waifu 囧", e)
  }
}

function* loadAnimeDefinitions() {
  try {
    const myAnimeList: Anime[] = yield call(() =>
      Storage.get("anime/list.json", {download: true})
        .then((result: any) => result.Body.text())
        .then(JSON.parse)
    );
    yield put(createReceivedAnimeList(myAnimeList));
  } catch (e) {
    console.warn("Unable to get anime 囧", e)
  }
}

function* characterSourceSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, characterSourceAssetFetchSaga)
}

export default function* (): Generator {
  yield all([characterSourceSagas()]);
}
