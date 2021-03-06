type TSort = 'ASC' | 'DESC';

interface IPage {
  take?: number;
  skip?: number;
}

export interface IQueryPaging extends IPage {
  select?: any[];
  order: {
    [futureKey: string]: TSort;
  };
  where?: {
    [futureKey: string]: any;
  };
  [futureKey: string]: any;
}
