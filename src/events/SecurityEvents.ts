import {Action} from "redux";

export const LOGGED_ON = 'LOGGED_ON';
export const LOGGED_OFF = 'LOGGED_OFF';


export const createLoggedOffEvent = (): Action => ({
  type: LOGGED_OFF,
});

export const createLoggedOnAction = (): Action => ({
  type: LOGGED_ON,
});
