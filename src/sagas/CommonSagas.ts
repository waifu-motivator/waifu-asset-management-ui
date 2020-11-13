import {Storage} from "aws-amplify";
import {Assets} from "../types/AssetTypes";
import {MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {call, select} from "redux-saga/effects";
import {selectMotivationAssetState} from "../reducers";

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

export function* uploadAsset<T>(assetKey: string, asset: T, type: ContentType) {
  yield call(()=>
    Storage.put(assetKey, asset, {
      contentType: type
    })
  );
}
