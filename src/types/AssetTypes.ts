export interface S3ListObject {
  eTag: string;
  key: string;
  lastModified: Date;
  size: number
}

export enum AssetCategory {
  VISUAL = 'visuals',
  AUDIBLE = 'audible',
  TEXT = 'text',
}

export enum Assets {
  ANIME = 'ANIME',
  WAIFU = 'WAIFU',
  VISUAL = 'VISUAL',
  TEXT = 'TEXT',
  AUDIBLE = 'AUDIBLE'
}
