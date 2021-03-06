import { Controller, Get, Query, SetMetadata, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from '../guards/local-guard';
import { ActorService } from './actor.service';
import * as DShare from '../shares/dtos';
import * as EShare from '../shares/enums';

@Controller('/actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('/paging')
  @SetMetadata('roles', [EShare.EUserRole.USER, EShare.EUserRole.ADMIN])
  @UseGuards(AuthGuard(['jwt']), RoleGuard)
  getActors(@Query(ValidationPipe) searchDto: DShare.PagingSearchDto) {
    return this.actorService.getActors(searchDto);
  }
}
