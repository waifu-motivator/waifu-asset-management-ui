import {combineReducers} from 'redux';
import userReducer, {UserState} from './UserReducer';
import {Reducer} from 'react';
import {connectRouter, RouterState} from 'connected-react-router';
import {History} from 'history';
import visualAssetReducer, {VisualAssetState} from "./VisualAssetReducer";
import motivationAssetReducer, {MotivationAssetState} from "./MotivationAssetReducer";
import audibleAssetReducer, {AudibleAssetState} from "./AudibleAssetReducer";
import textAssetReducer, {TextAssetState} from "./TextAssetReducer";
import characterSourceReducer, {CharacterSourceState} from "./CharacterSourceReducer";

export interface GlobalState {
  user: UserState;
  router: RouterState;
  motivationAssets: MotivationAssetState;
  visualAssets: VisualAssetState;
  textAssets: TextAssetState;
  characterSources: CharacterSourceState;
  audibleAssets: AudibleAssetState;
}

// eslint-disable-next-line
const rootReducer = (history: History<any>): Reducer<any, any> =>
  combineReducers({
    user: userReducer,
    router: connectRouter(history),
    motivationAssets: motivationAssetReducer,
    visualAssets: visualAssetReducer,
    textAssets: textAssetReducer,
    characterSources: characterSourceReducer,
    audibleAssets: audibleAssetReducer,
  });

export const selectUserState = (globalState: GlobalState): UserState =>
  globalState.user;

export const selectRouterState = (globalState: GlobalState): RouterState =>
  globalState.router;

export const selectMotivationAssetState = (globalState: GlobalState): MotivationAssetState =>
  globalState.motivationAssets;

export const selectVisualAssetState = (globalState: GlobalState): VisualAssetState =>
  globalState.visualAssets;

export const selectAudibleAssetState = (globalState: GlobalState): AudibleAssetState =>
  globalState.audibleAssets;

export const selectTextAssetState = (globalState: GlobalState): TextAssetState =>
  globalState.textAssets;

export const selectCharacterSourceState = (globalState: GlobalState): CharacterSourceState =>
  globalState.characterSources;

export default rootReducer;
