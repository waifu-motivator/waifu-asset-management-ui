import {LOGGED_OFF} from '../events/SecurityEvents';
import {RECEIVED_USER_PROFILE} from "../events/UserEvents";
import {UserProfile} from "../types/User";

export type UserState = {
  profile?: UserProfile;
};
export const INITIAL_USER_STATE: UserState = {};

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
    case LOGGED_OFF:
      return INITIAL_USER_STATE;
    default:
      return state;
  }
};

export default userReducer;
