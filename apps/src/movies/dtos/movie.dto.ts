import { IsArray, IsEnum, IsInstance, IsNumber, IsNumberString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
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
}
