import {LOGGED_OFF} from '../events/SecurityEvents';
import {S3ListObject} from "../types/AssetTypes";
import {RECEIVED_AUDIBLE_ASSET_LIST, RECEIVED_AUDIBLE_S3_LIST} from "../events/AudibleAssetEvents";
import {WaifuAssetCategory} from "./VisualAssetReducer";


export type AudibleAssetDefinition = {
  path: string;
  categories: WaifuAssetCategory;
  groupId?: string;
}

export type AudibleAssetState = {
  assets: AudibleAssetDefinition[];
  s3List: S3ListObject[];
};

export const INITIAL_AUDIBLE_ASSET_STATE: AudibleAssetState = {
  assets: [],
  s3List: [],
};

// eslint-disable-next-line
const audibleAssetReducer = (state: AudibleAssetState = INITIAL_AUDIBLE_ASSET_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_AUDIBLE_S3_LIST:
      return {
        ...state,
        s3List: action.payload,
      };
    case RECEIVED_AUDIBLE_ASSET_LIST:
      return {
        ...state,
        assets: action.payload,
      };
    case LOGGED_OFF:
      return INITIAL_AUDIBLE_ASSET_STATE;
    default:
      return state;
  }
};

export default audibleAssetReducer;
