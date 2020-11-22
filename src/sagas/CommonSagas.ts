import {Storage} from "aws-amplify";
import {AssetDefinition, AssetGroupKeys, Assets, LocalAsset} from "../types/AssetTypes";
import {MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {call, put, select} from "redux-saga/effects";
import {selectMotivationAssetState} from "../reducers";
import {StringDictionary, SyncType, UnsyncedAsset} from "../types/SupportTypes";
import {values} from "lodash";
import {readFile} from "../components/Upload";
import md5 from "js-md5";
import {completedSyncAttempt, startedSyncAttempt} from "../events/ApplicationLifecycleEvents";

export function downloadAsset<T>(key: string, noCache = false): Promise<T> {
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
    yield put(startedSyncAttempt(asset));
    try {
      yield call(sagaToRun);
    } catch (e) {
    }
    yield put(completedSyncAttempt(asset));
  }
}

export enum ContentType {
  JSON = "application/json",
  TEXT = "text/plain",
}

const assetUpload = <T>(assetKey: string, asset: T, type: ContentType | string): Promise<any> =>
  Storage.put(assetKey, asset, {
    contentType: type,
    level: 'public',
  });

/**
 * Good for uploading a single asset (such as list metadata)
 * @param assetGroup
 * @param assetKey
 * @param asset
 * @param type
 */
export function* uploadAssetSaga(assetGroup: AssetGroupKeys,
                                 assetKey: string,
                                 asset: string,
                                 type: ContentType): Generator {
  yield call(() =>
    uploadChecksum(assetGroup, assetKey, asset)
  );
  yield call(() =>
    assetUpload(`${assetGroup}/${assetKey}`, asset, type) // todo: consolidate string literals
  );
}

export function extractAddedAssets<T>(unSyncedAnime: StringDictionary<UnsyncedAsset<T>>): T[] {
  return values(unSyncedAnime)
    .filter(unsyncedAsset => unsyncedAsset.syncType === SyncType.CREATE)
    .map(unsyncedAsset => unsyncedAsset.asset);
}

function uploadChecksum(assetGroupKey: string, path: string, result: ArrayBuffer | string) {
  return assetUpload(
    `${assetGroupKey}/${path}.checksum.txt`,
    md5(result),
    ContentType.TEXT
  );
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
          uploadChecksum(assetGroupKey, assetToUpload.path, result)
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
