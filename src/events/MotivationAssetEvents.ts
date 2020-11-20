import {PayloadEvent} from './Event';
import {LocalMotivationAsset, MotivationAsset} from "../reducers/MotivationAssetReducer";

export const VIEWED_EXISTING_ASSET = 'VIEWED_EXISTING_ASSET';
export const VIEWED_UPLOADED_ASSET = 'VIEWED_UPLOADED_ASSET';
export const CREATED_MOTIVATION_ASSET = 'CREATED_MOTIVATION_ASSET';
export const UPDATED_MOTIVATION_ASSET = 'UPDATED_MOTIVATION_ASSET';
export const FOUND_CURRENT_ASSET = 'FOUND_CURRENT_ASSET';
export const SEARCHED_FOR_ASSET = 'SEARCHED_FOR_ASSET';
export const CLEANED_UP_ASSETS = 'CLEANED_UP_ASSETS';

export const createViewedExistingAssetEvent = (
  s3Etag: string
): PayloadEvent<string> => ({
  type: VIEWED_EXISTING_ASSET,
  payload: s3Etag,
});

export const createViewedLocalAssetEvent = (
  s3Etag: string
): PayloadEvent<string> => ({
  type: VIEWED_UPLOADED_ASSET,
  payload: s3Etag,
});

export const searchForItem = (
  keywordToSearch: string
): PayloadEvent<string> => ({
  type: SEARCHED_FOR_ASSET,
  payload: keywordToSearch,
});

export const createdMotivationAsset = (
  motivationAsset: MotivationAsset,
): PayloadEvent<MotivationAsset> => ({
  type: CREATED_MOTIVATION_ASSET,
  payload: motivationAsset,
});

export const cleanedUpMotivationAssets = (
  localMotivationAssets: LocalMotivationAsset[],
): PayloadEvent<LocalMotivationAsset[]> => ({
  type: CLEANED_UP_ASSETS,
  payload: localMotivationAssets,
});


export const updatedMotivationAsset = (
  motivationAsset: LocalMotivationAsset,
): PayloadEvent<LocalMotivationAsset> => ({
  type: UPDATED_MOTIVATION_ASSET,
  payload: motivationAsset,
});

export const createCurrentMotivationAssetEvent = (
  motivationAsset: MotivationAsset,
): PayloadEvent<MotivationAsset> => ({
  type: FOUND_CURRENT_ASSET,
  payload: motivationAsset,
});
