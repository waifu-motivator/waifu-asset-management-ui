import {PayloadEvent} from './Event';
import {Anime, Waifu} from "../reducers/VisualAssetReducer";

export const RECEIVED_WAIFU_LIST = 'RECEIVED_WAIFU_LIST';
export const RECEIVED_ANIME_LIST = 'RECEIVED_ANIME_LIST';
export const CREATED_ANIME = 'CREATED_ANIME';
export const CREATED_WAIFU = 'CREATED_WAIFU';
export const UPDATED_WAIFU = 'UPDATED_WAIFU';
export const UPDATED_ANIME = 'UPDATED_ANIME';

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

export const createdAnime = (
  anime: Anime,
): PayloadEvent<Anime> => ({
  type: CREATED_ANIME,
  payload: anime,
});

export const createdWaifu = (
  waifu: Waifu,
): PayloadEvent<Waifu> => ({
  type: CREATED_WAIFU,
  payload: waifu,
});

export const updatedWaifu = (
  waifu: Waifu,
): PayloadEvent<Waifu> => ({
  type: UPDATED_WAIFU,
  payload: waifu,
});

export const updatedAnime = (
  anime: Anime,
): PayloadEvent<Anime> => ({
  type: UPDATED_ANIME,
  payload: anime,
});

