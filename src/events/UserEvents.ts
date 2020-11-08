import {UserProfile, UserResponse} from '../types/UserTypes';
import {BaseEvent, PayloadEvent} from './Event';

export const FAILED_REQUESTED_USER: 'FAILED_REQUESTED_USER' =
  'FAILED_REQUESTED_USER';
export const RECEIVED_USER: 'RECEIVED_USER' = 'RECEIVED_USER';
export const RECEIVED_USER_PROFILE: 'RECEIVED_USER_PROFILE' = 'RECEIVED_USER_PROFILE';
export const RECEIVED_PARTIAL_USER: 'RECEIVED_PARTIAL_USER' = 'RECEIVED_PARTIAL_USER';
export const SELECTED_AVATAR: 'SELECTED_AVATAR' = 'SELECTED_AVATAR';
export const UPLOADED_AVATAR: 'UPLOADED_AVATAR' = 'UPLOADED_AVATAR';
export const DOWNLOADED_AVATAR: 'DOWNLOADED_AVATAR' = 'DOWNLOADED_AVATAR';
export const FAILED_TO_UPLOAD_AVATAR: 'FAILED_TO_UPLOAD_AVATAR' = 'FAILED_TO_UPLOAD_AVATAR';
export const UPDATED_SHARED_DASHBOARD: 'UPDATED_SHARED_DASHBOARD' = 'UPDATED_SHARED_DASHBOARD';
export const SYNCED_SHARED_DASHBOARD: 'SYNCED_SHARED_DASHBOARD' = 'SYNCED_SHARED_DASHBOARD';
export const CHECKED_CACHES: 'CHECKED_CACHES' = 'CHECKED_CACHES';
export const CACHED_DATA: 'CACHED_DATA' = 'CACHED_DATA';
export const SYNCED_DATA: 'SYNCED_DATA' = 'SYNCED_DATA';
export const REQUESTED_SYNC: 'REQUESTED_SYNC' = 'REQUESTED_SYNC';
export const LANDED_ON_SHARE: 'LANDED_ON_SHARE' = 'LANDED_ON_SHARE';

export const createReceivedUserEvent = (
  user: UserResponse,
): PayloadEvent<UserResponse> => ({
  type: RECEIVED_USER,
  payload: user,
});

export const createReceivedPartialUserEvent = (
  userIdentifier: string,
): PayloadEvent<string> => ({
  type: RECEIVED_PARTIAL_USER,
  payload: userIdentifier,
});

export const createReceivedUserProfileEvent = (
  userProfile: UserProfile,
): PayloadEvent<UserProfile> => ({
  type: RECEIVED_USER_PROFILE,
  payload: userProfile,
});

export const createUploadAvatarEvent = (
  avatarUrl: string,
): PayloadEvent<string> => ({
  type: SELECTED_AVATAR,
  payload: avatarUrl,
});

export const createUploadedAvatarEvent = (
  avatarUrl: string,
): PayloadEvent<string> => ({
  type: UPLOADED_AVATAR,
  payload: avatarUrl,
});

export const createDownloadedAvatarEvent = (
  avatarUrl: string,
): PayloadEvent<string> => ({
  type: DOWNLOADED_AVATAR,
  payload: avatarUrl,
});

export const createFailedToUploadAvatarEvent = (
  avatarUrl: string,
): PayloadEvent<string> => ({
  type: FAILED_TO_UPLOAD_AVATAR,
  payload: avatarUrl,
});

export const createUserUpdatedSharedDashboardEvent = (
  hasShared: boolean,
): PayloadEvent<boolean> => ({
  type: UPDATED_SHARED_DASHBOARD,
  payload: hasShared,
});
export const createSyncedSharedDashboardUpdateEvent = (
  hasShared: boolean,
): PayloadEvent<boolean> => ({
  type: SYNCED_SHARED_DASHBOARD,
  payload: hasShared,
});

export const createRequestedSyncEvent = (): BaseEvent => ({
  type: REQUESTED_SYNC,
});

export const createCheckedCachesEvent = (
  hasItemsToCache: boolean,
): PayloadEvent<boolean> => ({
  type: CHECKED_CACHES,
  payload: hasItemsToCache,
});

export const createCachedDataEvent = (): BaseEvent => ({
  type: CACHED_DATA,
});

export const createSyncedDataEvent = (): BaseEvent => ({
  type: SYNCED_DATA,
});

export const createFailedToGetUserEvent = (
  error: Error,
): PayloadEvent<Error> => ({
  type: FAILED_REQUESTED_USER,
  payload: error,
});

export const createLandedOnSharedBridgeEvent = (
  shareId: string,
): PayloadEvent<string> => ({
  type: LANDED_ON_SHARE,
  payload: shareId
});
