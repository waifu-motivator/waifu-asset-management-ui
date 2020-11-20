import {LOGGED_OFF} from '../events/SecurityEvents';
import {CREATED_VISUAL_ASSET, DROPPED_WAIFU} from "../events/VisualAssetEvents";
import {StringDictionary} from "../types/SupportTypes";
import {VisualAssetDefinition} from "./VisualAssetReducer";
import {AudibleAssetDefinition} from "./AudibleAssetReducer";
import {
  CLEANED_UP_ASSETS,
  CREATED_MOTIVATION_ASSET,
  FOUND_CURRENT_ASSET, SEARCHED_FOR_ASSET,
  UPDATED_MOTIVATION_ASSET
} from "../events/MotivationAssetEvents";
import {omit, values} from 'lodash';
import {AssetGroupKeys, Assets} from "../types/AssetTypes";
import {CREATED_ANIME, CREATED_WAIFU, UPDATED_ANIME, UPDATED_WAIFU} from "../events/CharacterSourceEvents";
import {SYNCED_ASSET} from "../events/ApplicationLifecycleEvents";
import {CREATED_AUDIBLE_ASSET} from "../events/AudibleAssetEvents";


export interface MotivationAsset {
  imageHref: string;
  visuals: VisualAssetDefinition;

  // grouped assets
  audioHref?: string;
  audio?: AudibleAssetDefinition;
  title?: string;
}

export interface LocalMotivationAsset extends MotivationAsset {
  audioFile?: File
  imageChecksum?: string;
  imageFile?: File;
}

export type MotivationAssetState = {
  assets: StringDictionary<LocalMotivationAsset>;
  currentViewedAsset?: LocalMotivationAsset;
  unsyncedAssets: StringDictionary<Assets>;
  searchTerm?: string;
};

export const INITIAL_MOTIVATION_ASSET_STATE: MotivationAssetState = {
  assets: {},
  unsyncedAssets: {},
};

const addToSync = (state: MotivationAssetState, anime: Assets): MotivationAssetState => ({
  ...state,
  unsyncedAssets: {
    ...state.unsyncedAssets,
    [anime]: anime
  }
});

function getKey(motivationAsset: LocalMotivationAsset) {
  return motivationAsset.imageChecksum ||
    `${AssetGroupKeys.VISUAL}/${motivationAsset.visuals.path}`;
}

function constructMotivationAssets(motivationAssets: LocalMotivationAsset[]) {
  return motivationAssets.reduce((accum, motivationAsset) => ({
    ...accum,
    [getKey(motivationAsset)]: motivationAsset
  }), {} as StringDictionary<LocalMotivationAsset>);
}

// eslint-disable-next-line
const motivationAssetReducer = (
  state: MotivationAssetState = INITIAL_MOTIVATION_ASSET_STATE,
  action: any
) => {
  switch (action.type) {
    case DROPPED_WAIFU: {
      const motivationAssets: LocalMotivationAsset[] = action.payload;
      return {
        ...state,
        assets: {
          ...state.assets,
          ...constructMotivationAssets(motivationAssets),
        }
      }
    }
    case SEARCHED_FOR_ASSET: {
      return {
        ...state,
        searchTerm: action.payload
      }
    }
    case CLEANED_UP_ASSETS: {
      const motivationAssets: LocalMotivationAsset[] = action.payload;
      return {
        ...state,
        assets: constructMotivationAssets(motivationAssets),
      }
    }
    case FOUND_CURRENT_ASSET: {
      return {
        ...state,
        currentViewedAsset: action.payload
      }
    }
    case UPDATED_MOTIVATION_ASSET:
    case CREATED_MOTIVATION_ASSET: {
      const motivationAsset: MotivationAsset = action.payload;
      return {
        ...state,
        assets: {
          ...state.assets,
          [getKey(motivationAsset)]: motivationAsset,
        }
      }
    }
    case '@@router/LOCATION_CHANGE': {
      const navigatedToPath = action.payload.location.pathname;
      return !navigatedToPath.startsWith('/assets/view') ?
        omit(state, 'currentViewedAsset') :
        state;
    }
    case UPDATED_ANIME:
    case CREATED_ANIME:
      return addToSync(state, Assets.ANIME);

    case UPDATED_WAIFU:
    case CREATED_WAIFU:
      return addToSync(state, Assets.WAIFU);

    case CREATED_AUDIBLE_ASSET:
      return addToSync(state, Assets.AUDIBLE);

    case CREATED_VISUAL_ASSET:
      return addToSync(state, Assets.VISUAL);

    case SYNCED_ASSET:
      return {
        ...state,
        unsyncedAssets: values(state.unsyncedAssets)
          .filter(asset => asset !== action.payload)
          .reduce((accum, next) => ({
            ...accum,
            [next]: next
          }), {})
      }


    case LOGGED_OFF:
      return INITIAL_MOTIVATION_ASSET_STATE;
    default:
      return state;
  }
};

export default motivationAssetReducer;
