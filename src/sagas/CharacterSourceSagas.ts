import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION, REQUESTED_SYNC_CHANGES, syncedChanges} from "../events/ApplicationLifecycleEvents";
import {selectCharacterSourceState} from "../reducers";
import {Anime, Waifu} from "../reducers/VisualAssetReducer";
import {createReceivedAnimeList, createReceivedWaifuList} from "../events/CharacterSourceEvents";
import {CharacterSourceState} from "../reducers/CharacterSourceReducer";
import {isEmpty, values} from "lodash";
import {AssetGroupKeys, Assets} from "../types/AssetTypes";
import {dictionaryReducer} from "../util/FunctionalTools";
import {ContentType, downloadAsset, extractAddedAssets, syncSaga, uploadAssetSaga} from "./CommonSagas";

function* characterSourceAssetFetchSaga() {
  const {anime, waifu}: CharacterSourceState = yield select(selectCharacterSourceState)
  if (!(isEmpty(anime) || isEmpty(waifu))) return;

  yield fork(loadWaifuDefinitions);
  yield fork(loadAnimeDefinitions);
}

function* loadWaifuDefinitions() {
  const waifuList: Waifu[] | undefined = yield call(getWaifuDefinitions);
  if (waifuList) {
    yield put(createReceivedWaifuList(waifuList));
  }
}

// todo: consolidate string literals
const WAIFU_ASSET_LIST_KEY = "waifu/list.json";
const ANIME_ASSET_LIST_KEY = "anime/list.json";

function* getWaifuDefinitions() {
  try {
    const waifuList: Waifu[] = yield call(() => downloadAsset(WAIFU_ASSET_LIST_KEY, true));
    return waifuList;
  } catch (e) {
    console.warn("Unable to get waifu 囧", e)
  }
}

function* loadAnimeDefinitions() {
  const myAnimeList: Anime[] | undefined = yield call(getAnimeDefinitions);
  if (myAnimeList) {
    yield put(createReceivedAnimeList(myAnimeList));
  }
}

function* getAnimeDefinitions() {
  try {
    const myAnimeList: Anime[] = yield call(() => downloadAsset(ANIME_ASSET_LIST_KEY, true));
    return myAnimeList;
  } catch (e) {
    console.warn("Unable to get anime 囧", e)
  }
}


function* attemptCharacterSync() {
  try {
    const freshCharacterList: Waifu[] | undefined = yield call(getWaifuDefinitions);
    const definedCharacterList = freshCharacterList || [];
    const {unSyncedWaifu}: CharacterSourceState = yield select(selectCharacterSourceState);
    const addedWaifu = extractAddedAssets(unSyncedWaifu);
    const newWaifuList = values(
      definedCharacterList.concat(addedWaifu)
        .reduce(dictionaryReducer, {})
    )
    yield call(uploadAssetSaga,
      AssetGroupKeys.WAIFU, 'list.json', // todo: consolidate string literals
      JSON.stringify(newWaifuList), ContentType.JSON
    );
    yield put(syncedChanges(Assets.WAIFU));
  } catch (e) {
    console.warn("unable to sync waifu for raisins", e)
  }
}

function* attemptAnimeSync() {
  try {
    const freshAnimeList: Anime[] | undefined = yield call(getAnimeDefinitions);
    const definedAnimeList = freshAnimeList || [];
    const {unSyncedAnime}: CharacterSourceState = yield select(selectCharacterSourceState);
    const addedAnime = extractAddedAssets(unSyncedAnime);
    const newAnimeList = values(
      definedAnimeList.concat(addedAnime)
        .reduce(dictionaryReducer, {})
    )
    yield call(uploadAssetSaga,
      AssetGroupKeys.ANIME, 'list.json',
      JSON.stringify(newAnimeList), ContentType.JSON
    );
    yield put(syncedChanges(Assets.ANIME));
  } catch (e) {
    console.warn("unable to sync anime for raisins", e)
  }
}

function* characterSourceSyncSaga() {
  yield fork(syncSaga, Assets.WAIFU, attemptCharacterSync);
  yield fork(syncSaga, Assets.ANIME, attemptAnimeSync);
}

function* characterSourceSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, characterSourceAssetFetchSaga);
  yield takeEvery(REQUESTED_SYNC_CHANGES, characterSourceSyncSaga);
}

export default function* (): Generator {
  yield all([characterSourceSagas()]);
}
