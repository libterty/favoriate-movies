import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Like, Repository } from 'typeorm';
import { User } from '../users/user.entitiy';
import { Movie } from './movie.entity';
import { Actor } from '../actors/actor.entity';
import { CreateMovieDto, GetMovieByIdDto, UpdateMovieByIdDto, RemoveMovieByIdDto } from './dtos';
import * as DShare from '../shares/dtos';
import * as IShare from '../shares/interfaces';
import * as IMovie from './interfaces';
import { isEmptyObj } from '../libs/utils';

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  private readonly repoManager: EntityManager = getManager();

  private readonly logger: Logger = new Logger('MovieRepository');

  /**
   * @description Create new movie
   * @public
   * @param {User} user
   * @param {Actor[]} actors
   * @param {CreateMovieDto} createMovieDto
   * @returns {Promise<Movie>}
   */
  public async createMovie(user: User, actors: Actor[], createMovieDto: CreateMovieDto): Promise<Movie> {
    const { name, desc, ratings, image, director, genre } = createMovieDto;
    const movie = new Movie();
    movie.name = name;
    movie.desc = desc;
    movie.ratings = ratings;
    if (image) movie.image = image;
    movie.director = director;
    movie.genre = genre;
    if (!movie.actors) {
      movie.actors = [];
      movie.actors.push(...actors);
    } else {
      movie.actors.push(...actors);
    }
    if (!movie.rateUsers) {
      movie.rateUsers = [];
      movie.rateUsers.push(user);
    } else {
      movie.rateUsers.push(user);
    }
    if (!movie.contributors) {
      movie.contributors = [];
      movie.contributors.push(user);
    } else {
      movie.contributors.push(user);
    }
    try {
      await movie.save();
    } catch (error) {
      this.logger.error(error.message, '', 'createMovieRepoError');
      if (error.code === '23505') {
        throw new ConflictException(`Movie name: ${name} already exists`);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
    return movie;
  }

  /**
   * @description Get movie by id
   * @public
   * @param {GetMovieByIdDto} getMovieByIdDto
   * @returns {Promise<Movie>}
   */
  public async getMovieById(getMovieByIdDto: GetMovieByIdDto): Promise<Movie> {
    try {
      const movie = await this.findOne({
        relations: ['actors', 'rateUsers', 'contributors'],
        where: {
          id: getMovieByIdDto.id,
        },
      });
      if (!movie) return null;
      movie.rateUsers.forEach((user) => {
        delete user.password;
        delete user.salt;
      });
      movie.contributors.forEach((user) => {
        delete user.password;
        delete user.salt;
      });
      return movie;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Get movies by paging and keywords
   * @public
   * @param {DShare.PagingSearchDto} searchDto
   * @returns {Promise<IMovie.IPagingQueryResponse<Movie[]>>}
   */
  public async getMoviesWithPaging(searchDto: DShare.PagingSearchDto): Promise<IMovie.IPagingQueryResponse<Movie[]>> {
    const searchOpts: IShare.IQueryPaging = {
      take: Number(searchDto.take),
      skip: Number(searchDto.skip),
      order: {
        updatedAt: searchDto.sort,
      },
      relations: ['actors', 'rateUsers', 'contributors'],
      where: {},
    };

    // keyword searching for movie name
    if (searchDto.keyword.length > 0) {
      searchOpts.where.name = Like(`%${searchDto.keyword}%`);
    }

    try {
      const [movies, count] = await this.repoManager.findAndCount(Movie, searchOpts);
      return {
        movies,
        take: Number(searchDto.take),
        skip: Number(searchDto.skip),
        count,
      };
    } catch (error) {
      this.logger.error(error.message, '', 'GetMoviesWithPagingRepoError');
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Handle rate updates when new contributors submit rate
   * @private
   * @param {User} user
   * @param {Movie} movie
   * @param {number} newRatings
   * @returns {Movie}
   */
  private handleRateUpdates(user: User, movie: Movie, newRatings: number): Movie {
    let isExistedRaters = false;
    movie.rateUsers.forEach((rateUser) => {
      if (rateUser.id === user.id) isExistedRaters = true;
    });
    if (!isExistedRaters) {
      // O(1) operation for list like
      movie.rateUsers.push(user);

      movie.ratings = (movie.ratings + newRatings) / movie.rateUsers.length;
    }
    return movie;
  }

  /**
   * @description Update movie by id
   * @public
   * @param {User} user
   * @param {Actor[]} newActors
   * @param {GetMovieByIdDto} getMovieByIdDto
   * @param {UpdateMovieByIdDto} updateMovieByIdDto
   * @returns {Promise<Movie>}
   */
  public async updateMovie(user: User, newActors: Actor[], getMovieByIdDto: GetMovieByIdDto, updateMovieByIdDto: UpdateMovieByIdDto): Promise<Movie> {
    const { name, desc, ratings, director, genre, actors } = updateMovieByIdDto;
    let movie = await this.getMovieById(getMovieByIdDto);
    if (!movie) return null;

    if (name) movie.name = name;
    if (desc) movie.desc = desc;
    if (ratings) movie = this.handleRateUpdates(user, movie, ratings);
    if (director) movie.director = director;
    if (genre) movie.genre = genre;
    if (actors) movie.actors = newActors;
    if (user && !isEmptyObj(updateMovieByIdDto)) movie.contributors.push(user);

    try {
      await movie.save();
    } catch (error) {
      this.logger.error(error.message, '', 'UpdateMovieRepoError');
      if (error.code === '23505') {
        throw new ConflictException(`Movie name: ${name} already exists`);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
    return movie;
  }

  /**
   * @description Soft remove movie by id
   * @public
   * @param {RemoveMovieByIdDto} removeMovieByIdDto
   * @returns {Promise<boolean>}
   */
  public async removeMovie(removeMovieByIdDto: RemoveMovieByIdDto): Promise<boolean> {
    try {
      const movie = await this.getMovieById(removeMovieByIdDto);
      const delResult = await movie.remove();
      if (!delResult) return false;
      return true;
    } catch (error) {
      this.logger.error(error.message, '', 'RemoveMovieRepoError');
      throw new InternalServerErrorException(error.message);
    }
  }
}
