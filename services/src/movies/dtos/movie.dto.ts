import { IsArray, IsEnum, IsInstance, IsNumberString, IsOptional, IsString } from 'class-validator';
import * as EMovie from '../enums';

export class CreateMovieDto {
  @IsString()
  name: string;

  @IsString()
  desc: string;

  @IsNumberString()
  ratings: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  director: string;

  @IsEnum(EMovie.EMovieTypes)
  genre: EMovie.EMovieTypes;

  @IsArray()
  actors: string[];
}
