type Status = 'error' | 'success';
type TSort = 'ASC' | 'DESC'

export interface IResponseBase<T> {
  status: Status;
  statusCode: number;
  message?: T;
}

export interface HttpException extends Error {
  response: string | Record<string, any>,
  status: number
}

interface IPage {
  take?: number;
  skip?: number;
}

export interface IMovieSearch<T> extends IPage {
  keyword?: string;
  sort?: TSort;
  movies: T;
}