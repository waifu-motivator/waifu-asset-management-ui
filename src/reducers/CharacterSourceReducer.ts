import {LOGGED_OFF} from '../events/SecurityEvents';
import {RECEIVED_ANIME_LIST, RECEIVED_WAIFU_LIST} from "../events/CharacterSourceEvents";
import {Anime, Waifu} from "./VisualAssetReducer";
import {StringDictionary} from "../types/SupportTypes";
import {dictionaryReducer} from "../util/FunctionalTools";


export interface CharacterSourceState {
  anime: StringDictionary<Anime>;
  waifu: StringDictionary<Waifu>;
}

export const INITIAL_SOURCE_STATE: CharacterSourceState = {
  anime: {},
  waifu: {},
};

// eslint-disable-next-line
const characterSourceReducer = (state: CharacterSourceState = INITIAL_SOURCE_STATE, action: any) => {
  switch (action.type) {
    case RECEIVED_WAIFU_LIST:
      return {
        ...state,
        waifu: action.payload.reduce(dictionaryReducer, {}),
      };
    case RECEIVED_ANIME_LIST:
      return {
        ...state,
        anime: action.payload.reduce(dictionaryReducer, {}),
      };
    case LOGGED_OFF:
      return INITIAL_SOURCE_STATE;
    default:
      return state;
  }
};

export default characterSourceReducer;
