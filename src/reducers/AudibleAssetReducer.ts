import {LOGGED_OFF} from '../events/SecurityEvents';
import {AssetDefinition, LocalAsset, S3ListObject} from "../types/AssetTypes";
import {CREATED_AUDIBLE_ASSET, RECEIVED_AUDIBLE_ASSET_LIST, RECEIVED_WAIFU_LIST} from "../events/AudibleAssetEvents";
import {StringDictionary, SyncType, UnsyncedAsset} from "../types/SupportTypes";

export type AudibleAssetDefinition = AssetDefinition

export interface LocalAudibleAssetDefinition extends AudibleAssetDefinition, LocalAsset {
}

export type AudibleAssetState = {
  assets: AudibleAssetDefinition[];
  s3List: S3ListObject[];
  unsyncedAssets: StringDictionary<UnsyncedAsset<LocalAudibleAssetDefinition>>
};

export const INITIAL_AUDIBLE_ASSET_STATE: AudibleAssetState = {
  assets: [],
  s3List: [],
  unsyncedAssets: {}
};

// eslint-disable-next-line
const audibleAssetReducer = (state: AudibleAssetState = INITIAL_AUDIBLE_ASSET_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_WAIFU_LIST:
      return {
        ...state,
        s3List: action.payload,
      };
    case RECEIVED_AUDIBLE_ASSET_LIST:
      return {
        ...state,
        assets: action.payload,
      };

    case CREATED_AUDIBLE_ASSET: {
      return {
        ...state,
        assets: [
          ...state.assets,
          action.payload,
        ],
        unsyncedAssets: {
          ...state.unsyncedAssets,

          // todo: what about duplicate file names?
          [action.payload.path]: {
            syncType: SyncType.CREATE,
            asset: action.payload,
          } as UnsyncedAsset<LocalAudibleAssetDefinition>
        }
      };
    }
    case LOGGED_OFF:
      return INITIAL_AUDIBLE_ASSET_STATE;
    default:
      return state;
  }
};

export default audibleAssetReducer;
