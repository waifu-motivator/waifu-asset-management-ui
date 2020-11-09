import {LOGGED_OFF} from '../events/SecurityEvents';
import {S3ListObject} from "../types/AssetTypes";
import {DROPPED_WAIFU, RECEIVED_VISUAL_S3_LIST} from "../events/AssetEvents";


export interface LocalMotivationAsset {
  btoa: string;
  checkSum: string;
  file: File;
}

export type MotivationAssetState = {
  motivationAssetsToUpload: LocalMotivationAsset[]
};

export const INITIAL_MOTIVATION_ASSET_STATE: MotivationAssetState = {
  motivationAssetsToUpload: []
};


// eslint-disable-next-line
const motivationAssetReducer = (state: MotivationAssetState = INITIAL_MOTIVATION_ASSET_STATE, action: any) => {
  switch (action.type) {
    case DROPPED_WAIFU:
      return {
        ...state,
        motivationAssetsToUpload: [
          ...state.motivationAssetsToUpload,
          ...action.payload,
        ],
      };
    case LOGGED_OFF:
      return INITIAL_MOTIVATION_ASSET_STATE;
    default:
      return state;
  }
};

export default motivationAssetReducer;
