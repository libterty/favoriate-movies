import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, In, Like, Repository } from 'typeorm';
import { Actor } from './actor.entity';
import * as DShare from '../shares/dtos';
import * as IShare from '../shares/interfaces';
import * as IActor from './interfaces';

@EntityRepository(Actor)
export class ActorRepository extends Repository<Actor> {
  private readonly repoManager: EntityManager = getManager();

  private readonly logger: Logger = new Logger('ActorRepository');

  /**
   * @description Get actors by paging and keywords
   * @public
   * @param {DShare.PagingSearchDto} searchDto
   * @returns {Promise<IActor.IPagingQueryResponse<Actor[]>>}
   */
  public async getActors(searchDto: DShare.PagingSearchDto): Promise<IActor.IPagingQueryResponse<Actor[]>> {
    const searchOpts: IShare.IQueryPaging = {
      take: Number(searchDto.take),
      skip: Number(searchDto.skip),
      order: {
        updatedAt: searchDto.sort,
      },
      where: {},
    };

    // keyword searching for actor name
    if (searchDto.keyword.length > 0) {
      searchOpts.where.name = Like(`%${searchDto.keyword}%`);
    }

    try {
      const [actors, count] = await this.repoManager.findAndCount(Actor, searchOpts);
      return {
        actors,
        take: Number(searchDto.take),
        skip: Number(searchDto.skip),
        count,
      };
    } catch (error) {
      this.logger.error(error.message, '', 'GetActorsRepoError');
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Get related actors by name search
   * @public
   * @param {string[]} actorNames
   * @returns {Promise<Actor[]>}
   */
  public async getRelationActors(actorNames: string[]): Promise<Actor[]> {
    try {
      return await this.repoManager.find(Actor, {
        where: {
          name: In(actorNames),
        },
      });
    } catch (error) {
      this.logger.error(error.message, '', 'GetRelationActorsRepoError');
      throw new InternalServerErrorException(error.message);
    }
  }
}
