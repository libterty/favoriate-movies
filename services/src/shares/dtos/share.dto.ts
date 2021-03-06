import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import * as EShare from '../enums';

export class PagingSearchDto {
  @IsOptional()
  @IsNumberString()
  take?: number;

  @IsOptional()
  @IsNumberString()
  skip?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsIn([EShare.ESort.DESC, EShare.ESort.ASC])
  sort?: EShare.ESort;
}
