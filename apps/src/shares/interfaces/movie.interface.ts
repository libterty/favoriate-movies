import * as EShare from '../enums';
import * as IShare from './index';

export interface IDeleteMovieEvent {
  id: string;
}
export interface IMovie {
  id: string;
  name: string;
  desc: string;
  ratings: number;
  image?: string;
  director: string;
  genre: EShare.EMovieTypes;
  actors: IShare.IActor[];
  rateUsers: IShare.IUser[];
  contributors: IShare.IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMovieSocketEvent {
  type: EShare.ESocketEvent;
  data: IMovie | IDeleteMovieEvent;
}