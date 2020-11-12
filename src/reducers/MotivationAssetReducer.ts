import {LOGGED_OFF} from '../events/SecurityEvents';
import {DROPPED_WAIFU} from "../events/VisualAssetEvents";
import {StringDictionary} from "../types/SupportTypes";
import {VisualAssetDefinition} from "./VisualAssetReducer";
import {AudibleAssetDefinition} from "./AudibleAssetReducer";
import {CREATED_MOTIVATION_ASSET, FOUND_CURRENT_ASSET} from "../events/MotivationAssetEvents";
import { omit } from 'lodash';
import {AssetCategory} from "../types/AssetTypes";


export interface LocalMotivationAsset {
  btoa: string;
  checkSum: string;
  file: File;
}

export interface MotivationAsset {
  imageHref: string;
  visuals: VisualAssetDefinition;

  // grouped assets
  audioHref?: string;
  audio?: AudibleAssetDefinition;
  title?: string;
}

export type MotivationAssetState = {
  motivationAssetsToUpload: LocalMotivationAsset[];
  assets: StringDictionary<MotivationAsset>;
  currentViewedAsset?: MotivationAsset;
};

export const INITIAL_MOTIVATION_ASSET_STATE: MotivationAssetState = {
  motivationAssetsToUpload: [],
  assets: {},
};

// eslint-disable-next-line
const motivationAssetReducer = (state: MotivationAssetState = INITIAL_MOTIVATION_ASSET_STATE, action: any) => {
  switch (action.type) {
    case DROPPED_WAIFU: {
      return {
        ...state,
        motivationAssetsToUpload: [
          ...state.motivationAssetsToUpload,
          ...action.payload,
        ],
      };
    }
    case FOUND_CURRENT_ASSET: {
      return {
        ...state,
        currentViewedAsset: action.payload
      }
    }
    case CREATED_MOTIVATION_ASSET: {
      const motivationAsset: MotivationAsset = action.payload;
      return {
        ...state,
        assets: {
          ...state.assets,
          [`${AssetCategory.VISUAL}/${motivationAsset.visuals.path}`]: motivationAsset,
        }
      }
    }
    case '@@router/LOCATION_CHANGE': {
      const navigatedToPath = action.payload.location.pathname;
      return !navigatedToPath.startsWith('/assets/view') ?
        omit(state, 'currentViewedAsset') :
        state;
    }
    case LOGGED_OFF:
      return INITIAL_MOTIVATION_ASSET_STATE;
    default:
      return state;
  }
};

export default motivationAssetReducer;
