import {all, call, put, select, take, takeEvery} from 'redux-saga/effects';
import {
  selectAudibleAssetState,
  selectMotivationAssetState,
  selectTextAssetState,
  selectVisualAssetState
} from "../reducers";
import {createdVisualAsset, RECEIVED_VISUAL_ASSET_LIST, RECEIVED_VISUAL_S3_LIST} from "../events/VisualAssetEvents";
import {VisualAssetDefinition, VisualAssetState} from "../reducers/VisualAssetReducer";
import {
  createCurrentMotivationAssetEvent,
  createdMotivationAsset,
  UPDATED_MOTIVATION_ASSET,
  VIEWED_EXISTING_ASSET
} from "../events/MotivationAssetEvents";
import {PayloadEvent} from "../events/Event";
import {LocalMotivationAsset, MotivationAsset, MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {buildS3ObjectLink} from "../util/AWSTools";
import {AssetGroupKeys, S3ListObject} from "../types/AssetTypes";
import {AudibleAssetDefinition, AudibleAssetState} from "../reducers/AudibleAssetReducer";
import {createdAudibleAsset, RECEIVED_AUDIBLE_ASSET_LIST} from "../events/AudibleAssetEvents";
import {v4 as uuid} from 'uuid';
import {TextAssetState, TextualMotivationAsset} from "../reducers/TextAssetReducer";
import {flatten, isEmpty, omit, values} from 'lodash';
import {StringDictionary} from "../types/SupportTypes";
import {LOADED_ALL_TEXT_ASSETS} from "../events/TextAssetEvents";

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
      audioHref: buildS3ObjectLink(`${AssetGroupKeys.AUDIBLE}/${relevantAudibleAsset.path}`)
    }
  }

  return {};
}

function getTextMotivationAssets(textAssets: StringDictionary<TextualMotivationAsset[]>, groupId: string) {
  const relevantTextAsset = flatten(values(textAssets))
    .find(asset => asset.groupId === groupId);
  if (relevantTextAsset) {
    return {
      title: relevantTextAsset.title,
    }
  }

  return {};
}

function* resolveGroupedAudibleAsset(groupId: string) {
  const {assets: cachedAssets, unsyncedAssets}: AudibleAssetState = yield select(selectAudibleAssetState)
  if (cachedAssets.length) {
    // todo: viewing unsynced grouped assets
    const assetFromCache = getAudibleMotivationAssets(cachedAssets, groupId);
    return assetFromCache || getAudibleMotivationAssets(
      values(unsyncedAssets)
        .map(cachedAsset => cachedAsset.asset)
      , groupId);
  }

  const {payload: audibleAssets}: PayloadEvent<AudibleAssetDefinition[]> = yield take(RECEIVED_AUDIBLE_ASSET_LIST);
  return getAudibleMotivationAssets(audibleAssets, groupId);

}

function* resolveGroupedTextAsset(groupId: string) {
  const {textAssets: cachedAssets}: TextAssetState = yield select(selectTextAssetState);
  if (!isEmpty(cachedAssets)) {
    const titleFromCache = getTextMotivationAssets(cachedAssets, groupId);
    return titleFromCache; // todo: from unsynced
  }

  const {payload: allTextAssets}: PayloadEvent<StringDictionary<TextualMotivationAsset[]>> =
    yield take(LOADED_ALL_TEXT_ASSETS);
  return getTextMotivationAssets(allTextAssets, groupId);

}

function* yieldGroupedAssets(visualAssetDefinition: VisualAssetDefinition) {
  const groupId = visualAssetDefinition.groupId;
  if (groupId) {
    const {
      audibleAssets,
      textAssets,
    } = yield all({
      audibleAssets: call(resolveGroupedAudibleAsset, groupId),
      textAssets: call(resolveGroupedTextAsset, groupId),
    })
    return {
      ...audibleAssets,
      ...textAssets,
    }
  }

  return {};
}

function* motivationAssetAssembly(
  assetKey: string,
  assets: VisualAssetDefinition[],
) {
  const trimmedKey = assetKey.substring(`${AssetGroupKeys.VISUAL}/`.length);
  const visualAssetDefinition = assets.find(assetDef => assetDef.path === trimmedKey);
  if (visualAssetDefinition) {
    const groupedAssets = yield call(yieldGroupedAssets, visualAssetDefinition);
    const motivationAsset: MotivationAsset = {
      ...groupedAssets,
      visuals: visualAssetDefinition,
      // todo: image dimensions
      imageHref: buildS3ObjectLink(assetKey),
    };

    // todo: checksum generation
    yield put(createdMotivationAsset(motivationAsset));
    return motivationAsset;
  }
}

function getPath(visualAsset: VisualAssetDefinition) {
  const directory = visualAsset.path.split("/")[0];
  return directory.indexOf('.') < 0 && !!directory ? directory : '';
}

function* motivationAssetUpdateSaga({payload: motivationAsset}: PayloadEvent<LocalMotivationAsset>) {
  const visualAsset = motivationAsset.visuals;
  const groupId = visualAsset.groupId || uuid();
  if (motivationAsset.audioFile) {
    yield put(createdAudibleAsset({
      groupId,
      file: motivationAsset.audioFile,
      categories: visualAsset.categories,
      path: `${getPath(visualAsset)}${motivationAsset.audioFile.name}`
    }));
  }
  yield put(createdVisualAsset({
    ...omit(visualAsset, 'groupId'),
    file: motivationAsset.imageFile,
    ...(!!motivationAsset.audioFile || !!motivationAsset.title ? {groupId} : {}),
  }))
}

function* motivationAssetSagas() {
  yield takeEvery(VIEWED_EXISTING_ASSET, motivationAssetViewSaga);
  yield takeEvery(UPDATED_MOTIVATION_ASSET, motivationAssetUpdateSaga);
}

export default function* (): Generator {
  yield all([motivationAssetSagas()]);
}
