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