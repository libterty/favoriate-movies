type TSort = 'ASC' | 'DESC';

interface IPage {
  take?: number;
  skip?: number;
}

export interface ISearch extends IPage {
  keyword?: string;
  sort?: TSort;
  [futureKey: string]: any;
}
