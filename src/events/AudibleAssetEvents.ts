import {PayloadEvent} from './Event';
import {S3ListObject} from "../types/AssetTypes";
import {AudibleAssetDefinition, LocalAudibleAssetDefinition} from "../reducers/AudibleAssetReducer";

export const RECEIVED_WAIFU_LIST = 'RECEIVED_AUDIBLE_S3_LIST';
export const RECEIVED_AUDIBLE_ASSET_LIST = 'RECEIVED_AUDIBLE_ASSET_LIST';
export const CREATED_AUDIBLE_ASSET = 'CREATED_AUDIBLE_ASSET';

export const createReceivedAudibleS3List = (
  audibleAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: RECEIVED_WAIFU_LIST,
  payload: audibleAssets,
});

export const createReceivedAudibleAssetList = (
  audibleAssets: AudibleAssetDefinition[],
): PayloadEvent<AudibleAssetDefinition[]> => ({
  type: RECEIVED_AUDIBLE_ASSET_LIST,
  payload: audibleAssets,
});

export const createdAudibleAsset = (
  audibleAssets: LocalAudibleAssetDefinition,
): PayloadEvent<LocalAudibleAssetDefinition> => ({
  type: CREATED_AUDIBLE_ASSET,
  payload: audibleAssets,
});
