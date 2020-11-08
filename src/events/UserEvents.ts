import {UserProfile} from '../types/User';
import {PayloadEvent} from './Event';

export const RECEIVED_USER_PROFILE = 'RECEIVED_USER_PROFILE';

export const createReceivedUserProfileEvent = (
  userProfile: UserProfile,
): PayloadEvent<UserProfile> => ({
  type: RECEIVED_USER_PROFILE,
  payload: userProfile,
});
