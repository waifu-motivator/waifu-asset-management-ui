import {
  RECEIVED_USER,
} from '../events/UserEvents';
import {LOGGED_OFF} from '../events/SecurityEvents';
import {User, UserOnBoarding} from '../types/UserTypes';

export type UserMiscellaneous = {
  hasItemsCached: boolean;
  onboarding: UserOnBoarding;
};

export type UserState = {
  information: User;
  miscellaneous: UserMiscellaneous;
};
export const INITIAL_USER_STATE: UserState = {
  information: {
    firstName: '',
    lastName: '',
    email: '',
    fullName: '',
    guid: '',
    userName: '',
  },
  miscellaneous: {
    hasItemsCached: false,
    onboarding: {},
  },
};

const userReducer = (state: UserState = INITIAL_USER_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_USER:
      return {
        ...state,
        information: {
          ...state.information,
          ...action.payload.information,
        },
        miscellaneous: {
          ...state.miscellaneous,
          onboarding: action.payload.misc.onboarding || {},
        },
      };
    case LOGGED_OFF:
      return INITIAL_USER_STATE;
    default:
      return state;
  }
};

export default userReducer;
