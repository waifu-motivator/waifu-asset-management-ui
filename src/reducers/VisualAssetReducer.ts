import {LOGGED_OFF} from '../events/SecurityEvents';
import {AssetDefinition, LocalAsset, S3ListObject} from "../types/AssetTypes";
import {
  CREATED_VISUAL_ASSET,
  FILTERED_VISUAL_ASSETS,
  RECEIVED_VISUAL_ASSET_LIST,
  RECEIVED_VISUAL_S3_LIST,
  UPDATED_VISUAL_ASSET_LIST,
  UPDATED_VISUAL_S3_LIST
} from "../events/VisualAssetEvents";
import {HasId, StringDictionary, SyncType, UnsyncedAsset} from "../types/SupportTypes";

export enum WaifuAssetCategory {
  ACKNOWLEDGEMENT = 'ACKNOWLEDGEMENT',
  FRUSTRATION = 'FRUSTRATION',
  ENRAGED = 'ENRAGED',
  CELEBRATION = 'CELEBRATION',
  HAPPY = 'HAPPY',
  SMUG = 'SMUG',
  WAITING = 'WAITING',
  MOTIVATION = 'MOTIVATION',
  WELCOMING = 'WELCOMING',
  DEPARTURE = 'DEPARTURE',
  ENCOURAGEMENT = 'ENCOURAGEMENT',
  TSUNDERE = 'TSUNDERE',
  MOCKING = 'MOCKING',
  SHOCKED = 'SHOCKED',
  DISAPPOINTMENT = 'DISAPPOINTMENT' // you don't want to disappoint your waifu now do you?
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface Anime extends HasId {
  name: string;
}

export interface Waifu extends HasId {
  name: string;
  animeId: string;
}

export interface VisualAssetDefinition extends AssetDefinition {
  imageAlt: string;
  imageDimensions: ImageDimensions;
  characterIds?: string[]
  characters?: string[];
}

export interface LocalVisualAssetDefinition extends VisualAssetDefinition, LocalAsset {
  imageChecksum?: string;
}

export type VisualAssetState = {
  assets: VisualAssetDefinition[];
  s3List: S3ListObject[];
  displayS3List: S3ListObject[];
  unsyncedAssets: StringDictionary<UnsyncedAsset<LocalVisualAssetDefinition>>
};

export const INITIAL_VISUAL_ASSET_STATE: VisualAssetState = {
  assets: [],
  s3List: [],
  displayS3List: [],
  unsyncedAssets: {},
};


// eslint-disable-next-line
const visualAssetReducer = (state: VisualAssetState = INITIAL_VISUAL_ASSET_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_VISUAL_S3_LIST:
      return {
        ...state,
        s3List: action.payload,
        displayS3List: action.payload,
      };
    case UPDATED_VISUAL_S3_LIST:
      return {
        ...state,
        s3List: action.payload,
      };
    case UPDATED_VISUAL_ASSET_LIST:
    case RECEIVED_VISUAL_ASSET_LIST:
      return {
        ...state,
        assets: action.payload,
      };

    case FILTERED_VISUAL_ASSETS: {
      return {
        ...state,
        displayS3List: action.payload
      }
    }
    case CREATED_VISUAL_ASSET: {
      return {
        ...state,
        assets: [
          ...state.assets,
          action.payload,
        ],
        unsyncedAssets: {
          ...state.unsyncedAssets,
          [action.payload.imageChecksum || action.payload.path]: {
            syncType: SyncType.CREATE,
            asset: action.payload,
          } as UnsyncedAsset<LocalVisualAssetDefinition>
        }
      };
    }
    case LOGGED_OFF:
      return INITIAL_VISUAL_ASSET_STATE;
    default:
      return state;
  }
};

export default visualAssetReducer;
