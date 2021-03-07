import { Controller, Post, UseInterceptors, Request, UploadedFile, Body, ValidationPipe, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import RoleGuard from '../guards/local-guard';
import { CurrentUser } from '../users/get-user.decorator';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dtos';
import { isImageFilter } from '../libs/utils';
import { Movie } from './movie.entity';
import * as EShare from '../shares/enums';
import * as IShare from '../shares/interfaces';
import * as IMovie from './interfaces';
import * as IUser from '../users/interfaces';

@Controller('/movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * @Routes Create new movies routes
   * @Post
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {IMovie.BufferedFile} createMovieFileDto
   * @param {CreateMovieDto} createMovieDto
   * @returns {Promise<IShare.IResponseBase<Movie | string>>}
   */
  @Post()
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: isImageFilter,
    }),
  )
  createMovie(@CurrentUser() user: IUser.IUserInfo | IUser.JwtPayload, @UploadedFile() createMovieFileDto: IMovie.BufferedFile, @Body(ValidationPipe) createMovieDto: CreateMovieDto): Promise<IShare.IResponseBase<Movie | string>> {
    return this.movieService.createMovie(user, createMovieFileDto, createMovieDto);
  }
}
