import {combineReducers} from 'redux';
import userReducer, {UserState} from './UserReducer';
import {Reducer} from 'react';
import {connectRouter, RouterState} from 'connected-react-router';
import {History} from 'history';
import visualAssetReducer, {VisualAssetState} from "./VisualAssetReducer";

export interface GlobalState {
  user: UserState;
  router: RouterState;
  visualAssets: VisualAssetState;
}

const rootReducer = (history: History<any>): Reducer<any, any> =>
  combineReducers({
    user: userReducer,
    visualAssets: visualAssetReducer,
    router: connectRouter(history),
  });

export const selectUserState = (globalState: GlobalState): UserState =>
  globalState.user;

export const selectVisualAssetState = (globalState: GlobalState): VisualAssetState =>
  globalState.visualAssets;

export const selectRouterState = (globalState: GlobalState): RouterState =>
  globalState.router;

export default rootReducer;
