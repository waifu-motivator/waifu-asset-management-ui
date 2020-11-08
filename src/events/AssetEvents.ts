import {UserProfile} from '../types/User';
import {PayloadEvent} from './Event';
import {VisualAssetDefinition} from "../reducers/VisualAssetReducer";
import {S3ListObject} from "../types/AssetTypes";

export const RECEIVED_VISUAL_S3_LIST = 'RECEIVED_VISUAL_S3_LIST';

export const createReceivedVisualS3List = (
  visualAssets: S3ListObject[],
): PayloadEvent<S3ListObject[]> => ({
  type: RECEIVED_VISUAL_S3_LIST,
  payload: visualAssets,
});
