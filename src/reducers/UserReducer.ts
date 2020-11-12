import {LOGGED_OFF} from '../events/SecurityEvents';
import {RECEIVED_USER_PROFILE} from "../events/UserEvents";
import {UserProfile} from "../types/User";
import {Assets} from "../types/AssetTypes";
import {SYNCED_ASSET} from "../events/ApplicationLifecycleEvents";
import {CREATED_ANIME, UPDATED_ANIME} from "../events/CharacterSourceEvents";

export type UserState = {
  profile?: UserProfile;
  unsyncedAssets: Assets[];
};
export const INITIAL_USER_STATE: UserState = {
  unsyncedAssets: [],
};


// eslint-disable-next-line
const userReducer = (state: UserState = INITIAL_USER_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_USER_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };
    // todo: this
    case UPDATED_ANIME:
    case CREATED_ANIME:
      return {
        ...state,
        unsyncedAssets: [
          ...state.unsyncedAssets,
        ]
      }
    case SYNCED_ASSET:
      return {
        ...state,
        unsyncedAssets: state.unsyncedAssets.filter(asset => asset !== action.payload)
      }
    case LOGGED_OFF:
      return INITIAL_USER_STATE;
    default:
      return state;
  }
};

export default userReducer;
