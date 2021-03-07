import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actor } from './actor.entity';
import { ActorRepository } from './actor.repository';
import HTTPResponse from '../libs/response';
import * as DShare from '../shares/dtos';
import * as IShare from '../shares/interfaces';
import * as EShare from '../shares/enums';
import * as IActor from './interfaces';

@Injectable()
export class ActorService {
  private readonly httpResponse = new HTTPResponse();

  private readonly logger: Logger = new Logger('ActorService');

  constructor(
    @InjectRepository(ActorRepository)
    private readonly actorRepository: ActorRepository,
  ) {}

  /**
   * @description Get actors by paging and keywords
   * @public
   * @param {DShare.PagingSearchDto} searchDto
   * @returns {Promise<IShare.IResponseBase<IActor.IPagingQueryResponse<Actor[]> | string>>}
   */
  public async getActors(searchDto: DShare.PagingSearchDto): Promise<IShare.IResponseBase<IActor.IPagingQueryResponse<Actor[]> | string> | HttpException> {
    if (!searchDto.take) searchDto.take = 10;
    if (!searchDto.skip) searchDto.skip = 0;
    if (!searchDto.keyword) searchDto.keyword = '';
    if (!searchDto.sort) searchDto.sort = EShare.ESort.DESC;

    try {
      const { actors, take, skip, count } = await this.actorRepository.getActors(searchDto);

      if (!actors || !count) {
        this.logger.error('No actor records has been found', '', 'GetActorsServiceError');
        return new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No actor records has been found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.httpResponse.StatusOK({
        actors,
        take,
        skip,
        count,
      });
    } catch (error) {
      this.logger.error(error.message, '', 'GetActorsServiceError');
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
