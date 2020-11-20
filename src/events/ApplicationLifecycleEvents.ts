import {Action} from "redux";
import {PayloadEvent} from "./Event";
import {Assets} from "../types/AssetTypes";

export const INITIALIZED_APPLICATION =
  'INITIALIZED_APPLICATION';

export const REQUESTED_SYNC_CHANGES = 'REQUESTED_SYNC_CHANGES';
export const SYNCED_ASSET = 'SYNCED_ASSET';
export const STARTED_SYNC_ATTEMPT = 'STARTED_SYNC_ATTEMPT';
export const COMPLETED_SYNC_ATTEMPT = 'COMPLETED_SYNC_ATTEMPT';

export const createApplicationInitializedEvent = (): Action => ({
  type: INITIALIZED_APPLICATION,
});

export const requestSyncChanges = (): Action => ({
  type: REQUESTED_SYNC_CHANGES,
});

export const syncedChanges = (assetSynced: Assets): PayloadEvent<Assets> => ({
  type: SYNCED_ASSET,
  payload: assetSynced,
});

export const startedSyncAttempt = (assetSynced: Assets): PayloadEvent<Assets> => ({
  type: STARTED_SYNC_ATTEMPT,
  payload: assetSynced,
});

export const completedSyncAttempt = (assetSynced: Assets): PayloadEvent<Assets> => ({
  type: COMPLETED_SYNC_ATTEMPT,
  payload: assetSynced,
});
