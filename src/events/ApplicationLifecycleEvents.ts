import {Action} from "redux";

export const INITIALIZED_APPLICATION =
  'INITIALIZED_APPLICATION';

export const SYNC_CHANGES = 'SYNC_CHANGES';

export const createApplicationInitializedEvent = (): Action => ({
  type: INITIALIZED_APPLICATION,
});

export const createSyncChangesEvent = (): Action => ({
  type: SYNC_CHANGES,
});
