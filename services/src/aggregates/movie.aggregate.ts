import { Injectable } from '@nestjs/common';
import { Movie } from '../movies/movie.entity';
import * as EAgg from './enums';
import * as IAgg from './interfaces';

@Injectable()
export class MovieAggregate {
  /**
   * @description create movie aggregate
   * @public
   * @param {Movie} movie
   * @returns {IAgg.IAggregateResponse<Movie>}
   */
  getCreateMovieAggregate(movie: Movie): IAgg.IAggregateResponse<Movie> {
    return Object.freeze({
      type: EAgg.ESocketEvent.CREATEMOVIE,
      data: movie,
    });
  }

  /**
   * @description update movie aggregate
   * @public
   * @param {Movie} movie
   * @returns {IAgg.IAggregateResponse<Movie>}
   */
  getUpdateMovieAggreagte(movie: Movie): IAgg.IAggregateResponse<Movie> {
    return Object.freeze({
      type: EAgg.ESocketEvent.UPDATEMOVIE,
      data: movie,
    });
  }

  /**
   * @description delete movie aggregate
   * @public
   * @param {string} id
   * @returns {IAgg.IAggregateResponse<{ id: string }>}
   */
  getDeleteMovieAggregate(id: string): IAgg.IAggregateResponse<{ id: string }> {
    return Object.freeze({
      type: EAgg.ESocketEvent.DELETEMOVIE,
      data: {
        id,
      },
    });
  }
}
