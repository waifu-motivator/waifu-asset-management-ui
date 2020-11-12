import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION, REQUESTED_SYNC_CHANGES} from "../events/ApplicationLifecycleEvents";
import {selectCharacterSourceState} from "../reducers";
import {Storage} from "aws-amplify";
import {Anime, Waifu} from "../reducers/VisualAssetReducer";
import {createReceivedAnimeList, createReceivedWaifuList} from "../events/CharacterSourceEvents";
import {CharacterSourceState} from "../reducers/CharacterSourceReducer";
import {isEmpty} from "lodash";

function* characterSourceAssetFetchSaga() {
  const {anime, waifu}: CharacterSourceState = yield select(selectCharacterSourceState)
  if (!(isEmpty(anime) || isEmpty(waifu))) return;

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

function* characterSourceSyncSaga() {
  console.tron("finna work on sync")
}

function* characterSourceSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, characterSourceAssetFetchSaga)
  yield takeEvery(REQUESTED_SYNC_CHANGES, characterSourceSyncSaga);
}

export default function* (): Generator {
  yield all([characterSourceSagas()]);
}
