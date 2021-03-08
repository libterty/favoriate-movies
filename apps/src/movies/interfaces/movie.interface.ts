import * as EShare from '../../shares/enums';

export interface IMovieTable {
  id: string;
  name: string;
  desc: string;
  ratings: number;
  director: string;
  genre: string;
  image?: string;
}

export interface IActor {
  id: string;
  name: string;
}

export interface CreateMovieDto {
  name: string;
  desc: string;
  ratings: number;
  director: string;
  genre: EShare.EMovieTypes;
  actors: string[];
}

export interface UpdateMovieByIdDto {
  name?: string;
  desc?: string;
  ratings?: number;
  director?: string;
  genre: EShare.EMovieTypes;
  actors?: string[];
}