import {LOGGED_OFF} from '../events/SecurityEvents';
import {S3ListObject} from "../types/AssetTypes";
import {RECEIVED_VISUAL_ASSET_LIST, RECEIVED_VISUAL_S3_LIST} from "../events/VisualAssetEvents";
import {HasId} from "../types/SupportTypes";


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

export interface VisualAssetDefinition {
  path: string;
  imageAlt: string;
  imageDimensions: ImageDimensions;
  categories: WaifuAssetCategory[];
  groupId?: string;
  characterIds?: string[]
  characters?: string[];
}

export type VisualAssetState = {
  assets: VisualAssetDefinition[];
  s3List: S3ListObject[];
};

export const INITIAL_VISUAL_ASSET_STATE: VisualAssetState = {
  assets: [],
  s3List: [],
};


// eslint-disable-next-line
const visualAssetReducer = (state: VisualAssetState = INITIAL_VISUAL_ASSET_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_VISUAL_S3_LIST:
      return {
        ...state,
        s3List: action.payload,
      };
    case RECEIVED_VISUAL_ASSET_LIST:
      return {
        ...state,
        assets: action.payload,
      };
    case LOGGED_OFF:
      return INITIAL_VISUAL_ASSET_STATE;
    default:
      return state;
  }
};

export default visualAssetReducer;
