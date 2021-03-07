export interface IPagingSearch {
  take?: number;
  skip?: number;
  keyword?: string;
  sort?: 'DESC' | 'AESC';
}