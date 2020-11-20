import {WaifuAssetCategory} from "../reducers/VisualAssetReducer";

export interface S3ListObject {
  eTag: string;
  key: string;
  lastModified: Date;
  size: number
}

export enum AssetGroupKeys {
  VISUAL = 'visuals',
  AUDIBLE = 'audible',
  TEXT = 'text',
  WAIFU = 'waifu',
  ANIME = 'anime',
}

export enum Assets {
  ANIME = 'ANIME',
  WAIFU = 'WAIFU',
  VISUAL = 'VISUAL',
  TEXT = 'TEXT',
  AUDIBLE = 'AUDIBLE'
}

export interface AssetDefinition {
  path: string;
  groupId?: string;
  categories: WaifuAssetCategory[];
}

export interface LocalAsset {
  file?: File;
}
