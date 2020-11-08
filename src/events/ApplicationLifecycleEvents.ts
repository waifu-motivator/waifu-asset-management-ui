import {Action} from "redux";

export const INITIALIZED_APPLICATION =
  'INITIALIZED_APPLICATION';

export const createApplicationInitializedEvent = (): Action => ({
  type: INITIALIZED_APPLICATION,
});
