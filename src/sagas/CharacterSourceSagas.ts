import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION, REQUESTED_SYNC_CHANGES} from "../events/ApplicationLifecycleEvents";
import {selectCharacterSourceState} from "../reducers";
import {Anime, Waifu} from "../reducers/VisualAssetReducer";
import {createReceivedAnimeList, createReceivedWaifuList} from "../events/CharacterSourceEvents";
import {CharacterSourceState} from "../reducers/CharacterSourceReducer";
import {isEmpty, values} from "lodash";
import {Assets} from "../types/AssetTypes";
import {SyncType} from "../types/SupportTypes";
import {dictionaryReducer} from "../util/FunctionalTools";
import {ContentType, downloadAsset, syncSaga, uploadAsset} from "./CommonSagas";

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

const WAIFU_ASSET_LIST_KEY = "waifu/list.json";

function* getWaifuDefinitions() {
  try {
    const waifuList: Waifu[] = yield call(() => downloadAsset(WAIFU_ASSET_LIST_KEY));
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
    const myAnimeList: Anime[] = yield call(() => downloadAsset("anime/list.json"));
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
    const addedWaifu = values(unSyncedWaifu)
      .filter(waifuSyncAsset => waifuSyncAsset.syncType === SyncType.CREATE)
      .map(waifuSyncAsset => waifuSyncAsset.asset);
    const newWaifuList = values(
      definedCharacterList.concat(addedWaifu)
        .reduce(dictionaryReducer, {})
    )

    yield call(uploadAsset, WAIFU_ASSET_LIST_KEY, JSON.stringify(newWaifuList), ContentType.JSON)
  } catch (e) {
    console.warn("unable to sync waifu for raisins", e)
  }
}

function* attemptAnimeSync() {
  console.tron("finna anime sync")
}

function* characterSourceSyncSaga() {
  yield fork(syncSaga, Assets.WAIFU, attemptCharacterSync);
  yield fork(syncSaga, Assets.ANIME, attemptAnimeSync);
}

function* characterSourceSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, characterSourceAssetFetchSaga)
  yield takeEvery(REQUESTED_SYNC_CHANGES, characterSourceSyncSaga);
}

export default function* (): Generator {
  yield all([characterSourceSagas()]);
}
