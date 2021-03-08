export interface IStoreContent {
  token: string;
  [futureKey: string]: any;
}

export type TStorageDataVal = string | {
  [key: string]: any;
}

export interface IStorageData {
  value: string | {
    [key: string]: any;
  }
  exp: number;
}