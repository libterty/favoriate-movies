import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { User } from '../users/user.entitiy';
import { Movie } from './movie.entity';
import { Actor } from '../actors/actor.entity';
import { CreateMovieDto, GetMovieByIdDto } from './dtos';

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
      console.error(error);
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
      return await this.findOne({
        relations: ['actors', 'rateUsers', 'contributors'],
        where: {
          id: getMovieByIdDto.id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
