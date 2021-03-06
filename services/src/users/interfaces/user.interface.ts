export interface IUserInfo {
  id?: string;
  role?: string;
  username?: string;
  licence?: string;
  expiredDate?: string;
  [futureKey: string]: any;
}
