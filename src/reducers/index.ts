import {combineReducers} from 'redux';
import userReducer, {UserState} from './UserReducer';
import {Reducer} from 'react';
import {connectRouter, RouterState} from 'connected-react-router';
import {History} from 'history';

export interface GlobalState {
  user: UserState;
  router: RouterState;
}

const rootReducer = (history: History<any>): Reducer<any, any> =>
  combineReducers({
    user: userReducer,
    router: connectRouter(history),
  });

export const selectUserState = (globalState: GlobalState): UserState =>
  globalState.user;

export const selectRouterState = (globalState: GlobalState): RouterState =>
  globalState.router;

export default rootReducer;
