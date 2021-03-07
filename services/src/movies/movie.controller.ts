import { Controller, Post, UseInterceptors, UploadedFile, Body, ValidationPipe, SetMetadata, UseGuards, Get, Param, HttpException, Query, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import RoleGuard from '../guards/local-guard';
import { CurrentUser } from '../users/get-user.decorator';
import { MovieService } from './movie.service';
import { CreateMovieDto, GetMovieByIdDto, UpdateMovieByIdDto, RemoveMovieByIdDto } from './dtos';
import { isImageFilter } from '../libs/utils';
import { Movie } from './movie.entity';
import * as DShare from '../shares/dtos';
import * as EShare from '../shares/enums';
import * as IShare from '../shares/interfaces';
import * as IMovie from './interfaces';
import * as IUser from '../users/interfaces';

@Controller('/movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * @Routes Get movies with paging and keyword search
   * @Get
   * @param {DShare.PagingSearchDto} searchDto
   * @returns {Promise<IShare.IResponseBase<IMovie.IPagingQueryResponse<Movie[]> | string> | HttpException>}
   */
  @Get('/paging')
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getActors(@Query(ValidationPipe) searchDto: DShare.PagingSearchDto): Promise<IShare.IResponseBase<IMovie.IPagingQueryResponse<Movie[]> | string> | HttpException> {
    return this.movieService.getMoviesWithPaging(searchDto);
  }

  /**
   * @Routes Get movie by id
   * @Get
   * @param {GetMovieByIdDto} getMovieByIdDto
   * @returns {Promise<IShare.IResponseBase<Movie | string> | HttpException>}
   */
  @Get('/:id/info')
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getMovieById(@Param(ValidationPipe) getMovieByIdDto: GetMovieByIdDto): Promise<IShare.IResponseBase<Movie | string> | HttpException> {
    return this.movieService.getMovieById(getMovieByIdDto);
  }

  /**
   * @Routes Create new movies routes
   * @Post
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {IMovie.BufferedFile} createMovieFileDto
   * @param {CreateMovieDto} createMovieDto
   * @returns {Promise<IShare.IResponseBase<Movie | string> | HttpException>}
   */
  @Post()
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: isImageFilter,
    }),
  )
  createMovie(@CurrentUser() user: IUser.IUserInfo | IUser.JwtPayload, @UploadedFile() createMovieFileDto: IMovie.BufferedFile, @Body(ValidationPipe) createMovieDto: CreateMovieDto): Promise<IShare.IResponseBase<Movie | string> | HttpException> {
    return this.movieService.createMovie(user, createMovieFileDto, createMovieDto);
  }

  /**
   * @description Update existed movie by id
   * @Put
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {GetMovieByIdDto} getMovieByIdDto
   * @param {UpdateMovieByIdDto} updateMovieByIdDto
   * @returns {Promise<IShare.IResponseBase<Movie | string> | HttpException>}
   */
  @Put('/:id')
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  updateMovie(@CurrentUser() user: IUser.IUserInfo | IUser.JwtPayload, @Param(ValidationPipe) getMovieByIdDto: GetMovieByIdDto, @Body(ValidationPipe) updateMovieByIdDto: UpdateMovieByIdDto): Promise<IShare.IResponseBase<Movie | string> | HttpException> {
    return this.movieService.updateMovie(user, getMovieByIdDto, updateMovieByIdDto);
  }

  /**
   * @Routes Soft delete movie by id
   * @Delete
   * @param {IUser.IUserInfo | IUser.JwtPayload} user
   * @param {RemoveMovieByIdDto} removeMovieByIdDto
   * @returns {Promise<IShare.IResponseBase<unknown | string> | HttpException>}
   */
  @Delete('/:id')
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  removeMovie(@CurrentUser() user: IUser.IUserInfo | IUser.JwtPayload, @Param(ValidationPipe) removeMovieByIdDto: RemoveMovieByIdDto): Promise<IShare.IResponseBase<unknown | string> | HttpException> {
    return this.movieService.removeMovie(user, removeMovieByIdDto);
  }
}
