import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { UserRepository } from '../users/user.repository';
import { MovieRepository } from './movie.repository';
import { ActorRepository } from '../actors/actor.repository';
import { UploaderService } from '../uploaders/uploader.service';
import { EventGateway } from '../events/event.gateway';
import { CreateMovieDto, GetMovieByIdDto, UpdateMovieByIdDto, RemoveMovieByIdDto } from './dtos';
import HTTPResponse from '../libs/response';
import * as DShare from '../shares/dtos';
import * as EShare from '../shares/enums';
import * as IShare from '../shares/interfaces';
import * as IUser from '../users/interfaces';
import * as IMovie from './interfaces';

@Injectable()
export class MovieService {
  private readonly httpResponse = new HTTPResponse();

  private readonly logger: Logger = new Logger('MovieService');

  constructor(
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(ActorRepository)
    private readonly actorRepository: ActorRepository,
    private readonly uploaderService: UploaderService,
    private readonly eventGateway: EventGateway,
  ) {}

  /**
   * @description Create new movie service layer
   * @public
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {IMovie.BufferedFile} createMovieFileDto
   * @param {CreateMovieDto} createMovieDto
   * @returns {Promise<IShare.IResponseBase<Movie | string>>}
   */
  public async createMovie(user: IUser.IUserInfo | IUser.JwtPayload, createMovieFileDto: IMovie.BufferedFile, createMovieDto: CreateMovieDto): Promise<IShare.IResponseBase<Movie | string> | HttpException> {
    try {
      // check if user is existed
      const isAdmin: boolean = user.role === EShare.EUserRole.ADMIN;
      const findUser = await this.userRepository.getUserById(user.id, isAdmin);
      if (!findUser) {
        return new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Invalid user',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      // get image local file system path
      createMovieDto.image = await this.uploaderService.writeStream(createMovieFileDto);
      // check actors if not found is empty list
      const actors = await this.actorRepository.getRelationActors(createMovieDto.actors);
      const movie = await this.movieRepository.createMovie(findUser, actors, createMovieDto);
      // `Movie ${createMovieDto.name} create Failed`
      if (!movie) {
        this.logger.error(`Movie ${createMovieDto.name} create Failed`, '', 'CreateMovieServiceError');
        return new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `Movie ${createMovieDto.name} create Failed`,
          },
          HttpStatus.CONFLICT,
        );
      }
      this.eventGateway.sendNewMovie(movie);
      return this.httpResponse.StatusCreated(movie);
    } catch (error) {
      this.logger.error(error.message, '', 'CreateMovieServiceError');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Get movie by id dto
   * @public
   * @param {GetMovieByIdDto} getMovieByIdDto
   * @returns {Promise<IShare.IResponseBase<Movie | string> | HttpException>}
   */
  public async getMovieById(getMovieByIdDto: GetMovieByIdDto): Promise<IShare.IResponseBase<Movie | string> | HttpException> {
    try {
      const movie = await this.movieRepository.getMovieById(getMovieByIdDto);
      if (!movie) {
        this.logger.error(`Movie ${getMovieByIdDto.id} not found`, '', 'GetMovieByIdServiceError');
        return new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Movie ${getMovieByIdDto.id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return this.httpResponse.StatusOK(movie);
    } catch (error) {
      this.logger.error(error.message, '', 'GetMovieByIdServiceError');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Get movies by paging and keywords
   * @public
   * @param {DShare.PagingSearchDto} searchDto
   * @returns {Promise<IShare.IResponseBase<IMovie.IPagingQueryResponse<Movie[]> | string> | HttpException>}
   */
  public async getMoviesWithPaging(searchDto: DShare.PagingSearchDto): Promise<IShare.IResponseBase<IMovie.IPagingQueryResponse<Movie[]> | string> | HttpException> {
    if (!searchDto.take) searchDto.take = 10;
    if (!searchDto.skip) searchDto.skip = 0;
    if (!searchDto.keyword) searchDto.keyword = '';
    if (!searchDto.sort) searchDto.sort = EShare.ESort.DESC;

    try {
      const { movies, take, skip, count } = await this.movieRepository.getMoviesWithPaging(searchDto);

      if (!movies || !count) {
        this.logger.error('No movie records has been found', '', 'GetMoviesWithPagingServiceError');
        return new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No movie records has been found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.httpResponse.StatusOK({
        movies,
        take,
        skip,
        count,
      });
    } catch (error) {
      this.logger.error(error.message, '', 'GetMoviesWithPagingServiceError');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Update movie by id
   * @public
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {GetMovieByIdDto} getMovieByIdDto
   * @param {UpdateMovieByIdDto} updateMovieByIdDto
   * @returns {Promise<IShare.IResponseBase<Movie | string> | HttpException>}
   */
  public async updateMovie(user: IUser.IUserInfo | IUser.JwtPayload, getMovieByIdDto: GetMovieByIdDto, updateMovieByIdDto: UpdateMovieByIdDto): Promise<IShare.IResponseBase<Movie | string> | HttpException> {
    try {
      // check if user is existed
      const isAdmin: boolean = user.role === EShare.EUserRole.ADMIN;
      const findUser = await this.userRepository.getUserById(user.id, isAdmin);
      if (!findUser) {
        return new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Invalid user',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      // check actors if not found is empty list
      const actors = await this.actorRepository.getRelationActors(updateMovieByIdDto.actors);
      const updateMovie = await this.movieRepository.updateMovie(findUser, actors, getMovieByIdDto, updateMovieByIdDto);
      if (!updateMovie) {
        this.logger.error(`Movie ${updateMovieByIdDto.name} update conflict`, '', 'CreateMovieServiceError');
        return new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `Movie ${updateMovieByIdDto.name} update conflict`,
          },
          HttpStatus.CONFLICT,
        );
      }
      this.eventGateway.sendUpdateMovie(updateMovie);
      return this.httpResponse.StatusOK(updateMovie);
    } catch (error) {
      this.logger.error(error.message, '', 'UpdateMovieServiceError');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Soft remove movie by id
   * @public
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {RemoveMovieByIdDto} removeMovieByIdDto
   * @returns {Promise<IShare.IResponseBase<unknown | string> | HttpException>}
   */
  public async removeMovie(user: IUser.IUserInfo | IUser.JwtPayload, removeMovieByIdDto: RemoveMovieByIdDto): Promise<IShare.IResponseBase<unknown | string> | HttpException> {
    try {
      // check if user is existed
      const isAdmin: boolean = user.role === EShare.EUserRole.ADMIN;
      const findUser = await this.userRepository.getUserById(user.id, isAdmin);
      if (!findUser) {
        return new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Invalid user',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const delResult = await this.movieRepository.removeMovie(removeMovieByIdDto);
      if (!delResult) {
        this.logger.error(`Movie ${removeMovieByIdDto.id} delete conflict`, '', 'RemoveMovieServiceError');
        return new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `Movie ${removeMovieByIdDto.id} delete conflict`,
          },
          HttpStatus.CONFLICT,
        );
      }
      this.eventGateway.sendDeleteMovie(removeMovieByIdDto.id);
      return this.httpResponse.StatusNoContent();
    } catch (error) {
      this.logger.error(error.message, '', 'RemoveMovieServiceError');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
