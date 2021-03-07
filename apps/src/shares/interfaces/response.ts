type Status = 'error' | 'success';

export interface IResponseBase<T> {
  status: Status;
  statusCode: number;
  message?: T;
}

export interface HttpException extends Error {
  response: string | Record<string, any>,
  status: number
}