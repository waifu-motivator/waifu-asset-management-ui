import {PayloadEvent} from './Event';
import {S3ListObject} from "../types/AssetTypes";
import {LocalMotivationAsset} from "../reducers/MotivationAssetReducer";
import {LocalVisualAssetDefinition, VisualAssetDefinition} from "../reducers/VisualAssetReducer";

export const RECEIVED_VISUAL_S3_LIST = 'RECEIVED_VISUAL_S3_LIST';
export const UPDATED_VISUAL_S3_LIST = 'UPDATED_VISUAL_S3_LIST';
export const RECEIVED_VISUAL_ASSET_LIST = 'RECEIVED_VISUAL_ASSET_LIST';
export const UPDATED_VISUAL_ASSET_LIST = 'UPDATED_VISUAL_ASSET_LIST';
export const DROPPED_WAIFU = 'DROPPED_WAIFU';
export const CREATED_VISUAL_ASSET = 'CREATED_VISUAL_ASSET';
export const FILTERED_VISUAL_ASSETS = 'FILTERED_VISUAL_ASSETS';

export const createReceivedVisualS3List = (
  visualAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: RECEIVED_VISUAL_S3_LIST,
  payload: visualAssets,
});

export const createUpdatedVisualS3List = (
  visualAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: UPDATED_VISUAL_S3_LIST,
  payload: visualAssets,
});

export const createFilteredVisualS3List = (
  searchForAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: FILTERED_VISUAL_ASSETS,
  payload: searchForAssets,
});

export const createReceivedVisualAssetList = (
  visualAssets: VisualAssetDefinition[],
): PayloadEvent<VisualAssetDefinition[]> => ({
  type: RECEIVED_VISUAL_ASSET_LIST,
  payload: visualAssets,
});

export const createUpdatedVisualAssetList = (
  visualAssets: VisualAssetDefinition[],
): PayloadEvent<VisualAssetDefinition[]> => ({
  type: UPDATED_VISUAL_ASSET_LIST,
  payload: visualAssets,
});

export const droppedWaifu = (
  localMotivationAssets: LocalMotivationAsset[],
): PayloadEvent<LocalMotivationAsset[]> => ({
  type: DROPPED_WAIFU,
  payload: localMotivationAssets,
});

export const createdVisualAsset = (
  visualAsset: LocalVisualAssetDefinition,
): PayloadEvent<LocalVisualAssetDefinition> => ({
  type: CREATED_VISUAL_ASSET,
  payload: visualAsset,
});
