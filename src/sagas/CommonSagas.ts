import {Storage} from "aws-amplify";
import {AssetDefinition, Assets, LocalAsset} from "../types/AssetTypes";
import {MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {call, select} from "redux-saga/effects";
import {selectMotivationAssetState} from "../reducers";
import {StringDictionary, SyncType, UnsyncedAsset} from "../types/SupportTypes";
import {values} from "lodash";
import {readFile} from "../components/Upload";
import md5 from "js-md5";

export function downloadAsset<T>(key: string, noCache: boolean = false): Promise<T> {
  return Storage.get(key, {
    download: true,
    ...(noCache ? {cacheControl: 'no-cache'} : {}),
  })
    .then((result: any) => result.Body.text())
    .then(JSON.parse);
}

// eslint-disable-next-line
export function* syncSaga(asset: Assets, sagaToRun: () => void) {
  const {unsyncedAssets}: MotivationAssetState = yield select(selectMotivationAssetState);
  if (unsyncedAssets[asset]) {
    yield call(sagaToRun);
  }
}

export enum ContentType {
  JSON = "application/json",
  TEXT = "text/plain",
}

export const assetUpload = <T>(assetKey: string, asset: T, type: ContentType | string): Promise<any> =>
  Storage.put(assetKey, asset, {
    contentType: type,
    level: 'public',
  });

export function* uploadAsset<T>(assetKey: string, asset: T, type: ContentType): Generator {
  yield call(() =>
    assetUpload(assetKey, asset, type)
  );
}

export function extractAddedAssets<T>(unSyncedAnime: StringDictionary<UnsyncedAsset<T>>): T[] {
  return values(unSyncedAnime)
    .filter(unsyncedAsset => unsyncedAsset.syncType === SyncType.CREATE)
    .map(unsyncedAsset => unsyncedAsset.asset);
}

export function* uploadAssetsSaga<T extends (AssetDefinition & LocalAsset)>(
  assetGroupKey: string,
  assetsToUpload: T[]
): Generator {
  yield call(() => assetsToUpload
    .filter(assetToUpload => !!assetToUpload.file)
    .reduce((accum, assetToUpload) => {
      return accum.then(() => readFile(assetToUpload.file!))
        .then(({result}) =>
          assetUpload(
            `${assetGroupKey}/${assetToUpload.path}.checksum.txt`,
            md5(result),
            ContentType.TEXT
          )
        );
    }, Promise.resolve()))

  yield call(() =>
    assetsToUpload
      .filter(asset => !!asset.file)
      .reduce(
        (accum, assetToUpload) => {
          return accum.then(() =>
            assetUpload(
              `${assetGroupKey}/${assetToUpload.path}`,
              assetToUpload.file,
              assetToUpload.file?.type || ''
            ));
        },
        Promise.resolve()
      )
  );
}
