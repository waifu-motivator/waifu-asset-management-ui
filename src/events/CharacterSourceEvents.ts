import {PayloadEvent} from './Event';
import {Anime, Waifu} from "../reducers/VisualAssetReducer";

export const RECEIVED_WAIFU_LIST = 'RECEIVED_WAIFU_LIST';
export const RECEIVED_ANIME_LIST = 'RECEIVED_ANIME_LIST';

export const createReceivedWaifuList = (
  waifu: Waifu[],
): PayloadEvent<Waifu[]> => ({
  type: RECEIVED_WAIFU_LIST,
  payload: waifu,
});

export const createReceivedAnimeList = (
  anime: Anime[],
): PayloadEvent<Anime[]> => ({
  type: RECEIVED_ANIME_LIST,
  payload: anime,
});

