export interface IPagingQueryResponse<T> {
  movies: T;
  take: number;
  skip: number;
  count: number;
}
