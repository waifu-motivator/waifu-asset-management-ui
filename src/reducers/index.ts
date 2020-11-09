import {combineReducers} from 'redux';
import userReducer, {UserState} from './UserReducer';
import {Reducer} from 'react';
import {connectRouter, RouterState} from 'connected-react-router';
import {History} from 'history';
import visualAssetReducer, {VisualAssetState} from "./VisualAssetReducer";
import motivationAssetReducer, {MotivationAssetState} from "./MotivationAssetReducer";
import audibleAssetReducer, {AudibleAssetDefinition} from "./AudibleAssetReducer";

export interface GlobalState {
  user: UserState;
  router: RouterState;
  motivationAssets: MotivationAssetState;
  visualAssets: VisualAssetState;
  audibleAssets: AudibleAssetDefinition;
}

const rootReducer = (history: History<any>): Reducer<any, any> =>
  combineReducers({
    user: userReducer,
    visualAssets: visualAssetReducer,
    audibleAssets: audibleAssetReducer,
    motivationAssets: motivationAssetReducer,
    router: connectRouter(history),
  });

export const selectUserState = (globalState: GlobalState): UserState =>
  globalState.user;

export const selectVisualAssetState = (globalState: GlobalState): VisualAssetState =>
  globalState.visualAssets;

export const selectMotivationAssetState = (globalState: GlobalState): MotivationAssetState =>
  globalState.motivationAssets;

export const selectRouterState = (globalState: GlobalState): RouterState =>
  globalState.router;

export default rootReducer;
