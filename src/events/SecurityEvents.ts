import {Action} from "redux";

export const LOGGED_ON = 'LOGGED_ON';
export const LOGGED_OFF = 'LOGGED_OFF';

export const REQUESTED_LOGOFF = 'REQUESTED_LOGOFF';

export const requestLogoff = (): Action => ({
  type: REQUESTED_LOGOFF,
});

export const createLoggedOffEvent = (): Action => ({
  type: LOGGED_OFF,
});

export const createLoggedOnAction = (): Action => ({
  type: LOGGED_ON,
});
