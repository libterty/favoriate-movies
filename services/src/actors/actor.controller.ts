import { Controller, Get, Query, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from '../guards/local-guard';
import { Actor } from './actor.entity';
import { ActorService } from './actor.service';
import * as DShare from '../shares/dtos';
import * as EShare from '../shares/enums';
import * as IShare from '../shares/interfaces';
import * as IActor from './interfaces';

@Controller('/actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  /**
   * @Routes Get actors with paging and keyword search
   * @Get
   * @param {DShare.PagingSearchDto} searchDto
   * @returns {Promise<IShare.IResponseBase<User | string>>}
   */
  @Get('/paging')
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getActors(@Query(ValidationPipe) searchDto: DShare.PagingSearchDto): Promise<IShare.IResponseBase<IActor.IPagingQueryResponse<Actor[]> | string>> {
    return this.actorService.getActors(searchDto);
  }
}
