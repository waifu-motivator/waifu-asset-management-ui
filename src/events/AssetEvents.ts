import {PayloadEvent} from './Event';
import {S3ListObject} from "../types/AssetTypes";
import {LocalMotivationAsset} from "../reducers/MotivationAssetReducer";

export const RECEIVED_VISUAL_S3_LIST = 'RECEIVED_VISUAL_S3_LIST';
export const DROPPED_WAIFU = 'DROPPED_WAIFU';

export const createReceivedVisualS3List = (
  visualAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: RECEIVED_VISUAL_S3_LIST,
  payload: visualAssets,
});

export const droppedWaifu = (
  localMotivationAssets: LocalMotivationAsset[],
): PayloadEvent<LocalMotivationAsset[]> => ({
  type: DROPPED_WAIFU,
  payload: localMotivationAssets,
});
