import {PayloadEvent} from './Event';
import {S3ListObject} from "../types/AssetTypes";
import {AudibleAssetDefinition} from "../reducers/AudibleAssetReducer";

export const RECEIVED_WAIFU_LIST = 'RECEIVED_AUDIBLE_S3_LIST';
export const RECEIVED_AUDIBLE_ASSET_LIST = 'RECEIVED_AUDIBLE_ASSET_LIST';

export const createReceivedAudibleS3List = (
  visualAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: RECEIVED_WAIFU_LIST,
  payload: visualAssets,
});

export const createReceivedAudibleAssetList = (
  visualAssets: AudibleAssetDefinition[],
): PayloadEvent<AudibleAssetDefinition[]> => ({
  type: RECEIVED_AUDIBLE_ASSET_LIST,
  payload: visualAssets,
});

