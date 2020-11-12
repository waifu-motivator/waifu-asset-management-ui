import {PayloadEvent} from './Event';
import {S3ListObject} from "../types/AssetTypes";
import {TextAssetDefinition, TextualMotivationAsset} from "../reducers/TextAssetReducer";
import {StringDictionary} from "../types/SupportTypes";

export const RECEIVED_TEXT_S3_LIST = 'RECEIVED_TEXT_S3_LIST';
export const RECEIVED_TEXT_ASSET_LIST = 'RECEIVED_TEXT_ASSET_LIST';
export const LOADED_ALL_TEXT_ASSETS = 'LOADED_ALL_TEXT_ASSETS';

export const createReceivedTextS3List = (
  textAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: RECEIVED_TEXT_S3_LIST,
  payload: textAssets,
});

export const createReceivedTextAssetList = (
  textAssets: TextAssetDefinition[],
): PayloadEvent<TextAssetDefinition[]> => ({
  type: RECEIVED_TEXT_ASSET_LIST,
  payload: textAssets,
});

export const createLoadedAllTextAssets = (
  motivationAssets: StringDictionary<TextualMotivationAsset[]>,
): PayloadEvent<StringDictionary<TextualMotivationAsset[]>> => ({
  type: LOADED_ALL_TEXT_ASSETS,
  payload: motivationAssets,
});

