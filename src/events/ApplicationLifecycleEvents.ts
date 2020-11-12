import {Action} from "redux";
import {PayloadEvent} from "./Event";
import {Assets} from "../types/AssetTypes";

export const INITIALIZED_APPLICATION =
  'INITIALIZED_APPLICATION';

export const REQUESTED_SYNC_CHANGES = 'REQUESTED_SYNC_CHANGES';
export const SYNCED_ASSET = 'SYNCED_ASSET';

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
