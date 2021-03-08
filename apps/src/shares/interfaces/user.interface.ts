import * as EShare from '../enums';
import * as IShare from './index';

export interface IUser {
  id: string;
  role: EShare.EUserRole;
  username: string;
  status: boolean;
  rateMovies: IShare.IMovie[];
  contributings: IShare.IMovie[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInfo {
  id?: string;
  role?: string;
  username?: string;
  licence?: string;
  expiredDate?: string;
  [futureKey: string]: any;
}

export interface IState {
  user?: IUserInfo;
}