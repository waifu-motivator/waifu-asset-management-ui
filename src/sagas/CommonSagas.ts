import {Storage} from "aws-amplify";
import {Assets} from "../types/AssetTypes";
import {MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {call, select} from "redux-saga/effects";
import {selectMotivationAssetState} from "../reducers";
import {StringDictionary, SyncType, UnsyncedAsset} from "../types/SupportTypes";
import {values} from "lodash";

export function downloadAsset(key: string) {
  return Storage.get(key, {download: true})
    .then((result: any) => result.Body.text())
    .then(JSON.parse);
}


export const syncSaga = function* (asset: Assets, sagaToRun: () => void) {
  const {unsyncedAssets}: MotivationAssetState = yield select(selectMotivationAssetState);
  if (unsyncedAssets[asset]) {
    yield call(sagaToRun);
  }
};

export enum ContentType {
  JSON = "application/json"
}

export const assetUpload = <T>(assetKey: string, asset: T, type: ContentType | string): Promise<any> =>
  Storage.put(assetKey, asset, {
    contentType: type
  });

export function* uploadAsset<T>(assetKey: string, asset: T, type: ContentType) {
  yield call(() =>
    assetUpload(assetKey, asset, type)
  );
}

export function extractAddedAssets<T>(unSyncedAnime: StringDictionary<UnsyncedAsset<T>>) {
  return values(unSyncedAnime)
    .filter(unsyncedAsset => unsyncedAsset.syncType === SyncType.CREATE)
    .map(unsyncedAsset => unsyncedAsset.asset);
}
