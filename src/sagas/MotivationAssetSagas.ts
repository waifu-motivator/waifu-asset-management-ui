import {all, call, put, select, take, takeEvery} from 'redux-saga/effects';
import {selectAudibleAssetState, selectMotivationAssetState, selectVisualAssetState} from "../reducers";
import {RECEIVED_VISUAL_ASSET_LIST, RECEIVED_VISUAL_S3_LIST} from "../events/VisualAssetEvents";
import {VisualAssetDefinition, VisualAssetState} from "../reducers/VisualAssetReducer";
import {
  createCurrentMotivationAssetEvent,
  createdMotivationAsset,
  VIEWED_EXISTING_ASSET
} from "../events/MotivationAssetEvents";
import {PayloadEvent} from "../events/Event";
import {MotivationAsset, MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {buildS3ObjectLink} from "../util/AWSTools";
import {AssetCategory, S3ListObject} from "../types/AssetTypes";
import {AudibleAssetDefinition, AudibleAssetState} from "../reducers/AudibleAssetReducer";
import {RECEIVED_AUDIBLE_ASSET_LIST} from "../events/AudibleAssetEvents";

function getKey(freshS3List: S3ListObject[], s3Etag: string) {
  return freshS3List.find(obj => obj.eTag === s3Etag)?.key;
}

function* fetchAssetKey(s3Etag: string) {
  const {s3List}: VisualAssetState = yield select(selectVisualAssetState);
  if (!s3List.length) {
    const {payload: freshS3List}: PayloadEvent<S3ListObject[]> =
      yield take(RECEIVED_VISUAL_S3_LIST);
    return getKey(freshS3List, s3Etag);
  }

  return getKey(s3List, s3Etag);
}


function* motivationAssetViewSaga({payload: s3Etag}: PayloadEvent<string>) {
  const motivationAsset = yield call(fetchAssetForEtag, s3Etag);
  yield put(createCurrentMotivationAssetEvent(motivationAsset));
}

function* fetchAssetForEtag(s3Etag: string) {
  const assetKey = yield call(fetchAssetKey, s3Etag);
  const {assets}: MotivationAssetState = yield select(selectMotivationAssetState)
  const cachedAsset = assets[assetKey];
  if (cachedAsset)
    return cachedAsset;

  const {assets: visualAssetDefinitions}: VisualAssetState = yield select(selectVisualAssetState);
  if (!visualAssetDefinitions.length) {
    const {payload: freshVisualAssetDefinitions}: PayloadEvent<VisualAssetDefinition[]> = yield take(RECEIVED_VISUAL_ASSET_LIST);
    return yield call(motivationAssetAssembly, assetKey, freshVisualAssetDefinitions)
  } else {
    return yield call(motivationAssetAssembly, assetKey, visualAssetDefinitions);
  }
}

function getAudibleMotivationAssets(audibleAssets: AudibleAssetDefinition[], groupId: string) {
  const relevantAudibleAsset = audibleAssets.find(asset => asset.groupId === groupId);
  if (relevantAudibleAsset) {
    return {
      audio: relevantAudibleAsset,
      audioHref: buildS3ObjectLink(`${AssetCategory.AUDIBLE}/${relevantAudibleAsset.path}`)
    }
  }

  return {};
}

function* resolveGroupedAudibleAsset(groupId: string) {
  const {assets: cachedAssets}: AudibleAssetState = yield select(selectAudibleAssetState)
  if (cachedAssets.length) {
    return getAudibleMotivationAssets(cachedAssets, groupId);
  }

  const {payload: audibleAssets}: PayloadEvent<AudibleAssetDefinition[]> = yield take(RECEIVED_AUDIBLE_ASSET_LIST);
  return getAudibleMotivationAssets(audibleAssets, groupId);

}

function* yieldGroupedAssets(visualAssetDefinition: VisualAssetDefinition) {
  const groupId = visualAssetDefinition.groupId;
  if (groupId) {
    const {audibleAssets} = yield all({
      audibleAssets: call(resolveGroupedAudibleAsset, groupId)
    })
    return {
      ...audibleAssets,
    }
  }

  return {};
}

function* motivationAssetAssembly(
  assetKey: string,
  assets: VisualAssetDefinition[],
) {
  const trimmedKey = assetKey.substring(`${AssetCategory.VISUAL}/`.length);
  const visualAssetDefinition = assets.find(assetDef => assetDef.path === trimmedKey);
  if (visualAssetDefinition) {
    const groupedAssets = yield call(yieldGroupedAssets, visualAssetDefinition);
    const motivationAsset: MotivationAsset = {
      ...groupedAssets,
      visuals: visualAssetDefinition,
      imageHref: buildS3ObjectLink(assetKey),
    };
    yield put(createdMotivationAsset(motivationAsset));
    return motivationAsset;
  } else {
    // todo: what do?
  }
}

function* motivationAssetSagas() {
  yield takeEvery(VIEWED_EXISTING_ASSET, motivationAssetViewSaga)
}

export default function* (): Generator {
  yield all([motivationAssetSagas()]);
}
