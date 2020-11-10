import {LOGGED_OFF} from '../events/SecurityEvents';
import {S3ListObject} from "../types/AssetTypes";
import {RECEIVED_TEXT_ASSET_LIST, RECEIVED_TEXT_S3_LIST} from "../events/TextAssetEvents";
import {WaifuAssetCategory} from "./VisualAssetReducer";

export type TextAssetDefinition = {
  path: string;
  categories: WaifuAssetCategory;
  groupId?: string;
}

export type TextualMotivationAsset = {
  title: string;
  groupId?: string;
}

export type TextAssetState = {
  assets: TextAssetDefinition[];
  s3List: S3ListObject[];
};

export const INITIAL_TEXT_ASSET_STATE: TextAssetState = {
  assets: [],
  s3List: [],
};

// eslint-disable-next-line
const textAssetReducer = (state: TextAssetState = INITIAL_TEXT_ASSET_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_TEXT_S3_LIST:
      return {
        ...state,
        s3List: action.payload,
      };
    case RECEIVED_TEXT_ASSET_LIST:
      return {
        ...state,
        assets: action.payload,
      };
    case LOGGED_OFF:
      return INITIAL_TEXT_ASSET_STATE;
    default:
      return state;
  }
};

export default textAssetReducer;
