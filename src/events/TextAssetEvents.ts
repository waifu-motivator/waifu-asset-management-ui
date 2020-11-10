import {PayloadEvent} from './Event';
import {S3ListObject} from "../types/AssetTypes";
import {TextAssetDefinition} from "../reducers/TextAssetReducer";

export const RECEIVED_TEXT_S3_LIST = 'RECEIVED_TEXT_S3_LIST';
export const RECEIVED_TEXT_ASSET_LIST = 'RECEIVED_TEXT_ASSET_LIST';

export const createReceivedTextS3List = (
  visualAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: RECEIVED_TEXT_S3_LIST,
  payload: visualAssets,
});

export const createReceivedTextAssetList = (
  visualAssets: TextAssetDefinition[],
): PayloadEvent<TextAssetDefinition[]> => ({
  type: RECEIVED_TEXT_ASSET_LIST,
  payload: visualAssets,
});

