export interface IPagingQueryResponse<T> {
  actors: T;
  take: number;
  skip: number;
  count: number;
}
