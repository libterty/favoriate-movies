import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { UserRepository } from '../users/user.repository';
import { MovieRepository } from './movie.repository';
import { ActorRepository } from '../actors/actor.repository';
import { UploaderService } from '../uploaders/uploader.service';
import { CreateMovieDto } from './dtos';
import HTTPResponse from '../libs/response';
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
  ) {}

  /**
   * @description Create new movie service layer
   * @public
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {IMovie.BufferedFile} createMovieFileDto
   * @param {CreateMovieDto} createMovieDto
   * @returns {Promise<IShare.IResponseBase<Movie | string>>}
   */
  public async createMovie(user: IUser.IUserInfo | IUser.JwtPayload, createMovieFileDto: IMovie.BufferedFile, createMovieDto: CreateMovieDto): Promise<IShare.IResponseBase<Movie | string>> {
    try {
      // check if user is existed
      const isAdmin: boolean = user.role === EShare.EUserRole.ADMIN;
      const findUser = await this.userRepository.getUserById(user.id, isAdmin);
      if (!findUser) {
        throw new HttpException(
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
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `Movie ${createMovieDto.name} create Failed`,
          },
          HttpStatus.CONFLICT,
        );
      }
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
}
