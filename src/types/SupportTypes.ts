export interface StringDictionary<T> {
  [key: string]: T
}

export interface HasId {
  id: string;
}

export enum SyncType {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

export interface UnsyncedAsset<T> {
  syncType: SyncType;
  asset: T
}
