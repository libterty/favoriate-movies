import { IsArray, IsEnum, IsInstance, IsNumber, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';
import * as EMovie from '../enums';

class GetMovieBaseDto {
  @IsUUID()
  id: string;
}

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

export class GetMovieByIdDto extends GetMovieBaseDto {}

export class UpdateMovieByIdDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsNumber()
  ratings?: number;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsEnum(EMovie.EMovieTypes)
  genre: EMovie.EMovieTypes;

  @IsOptional()
  @IsArray()
  actors?: string[];
}

export class RemoveMovieByIdDto extends GetMovieBaseDto {}
