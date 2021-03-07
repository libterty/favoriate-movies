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