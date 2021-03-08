import { IsArray, IsEnum, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import * as EShare from '../../shares/enums';

export class CreateMovieDto {
  @IsString({
    message: 'Movie name must be a string type',
  })
  @MinLength(4, {
    message: 'Movie name is too short, min length is 4',
  })
  @MaxLength(20, {
    message: 'Movie name is too long, max length is 20',
  })
  name: string = '';

  @IsString({
    message: 'Movie description must be a string type',
  })
  @MinLength(4, {
    message: 'Movie description is too short, min length is 4',
  })
  @MaxLength(100, {
    message: 'Movie description is too long, max length is 20',
  })
  desc: string = '';

  @IsNumberString()
  ratings: number = 0;

  @IsString({
    message: 'Movie director must be a string type',
  })
  @MinLength(4, {
    message: 'Director name is too short, min length is 4',
  })
  @MaxLength(20, {
    message: 'Director name is too long, max length is 20',
  })
  director: string = '';

  @IsEnum(EShare.EMovieTypes)
  genre: EShare.EMovieTypes = EShare.EMovieTypes.News;

  @IsArray()
  actors: string[] = [];

  @IsOptional()
  image: any;
}

export class UpdateMovieDto {
  @IsOptional()
  @IsString({
    message: 'Movie name must be a string type',
  })
  name?: string = '';

  @IsOptional()
  @IsString({
    message: 'Movie description must be a string type',
  })
  desc?: string = '';

  @IsOptional()
  @IsNumber()
  ratings?: number = 0;

  @IsOptional()
  @IsString({
    message: 'Movie director must be a string type',
  })
  director?: string = '';

  @IsOptional()
  @IsEnum(EShare.EMovieTypes)
  genre?: EShare.EMovieTypes = EShare.EMovieTypes.News;

  @IsOptional()
  @IsArray()
  actors?: string[] = [];
}
