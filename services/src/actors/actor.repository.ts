import { Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { Actor } from './actor.entity';

@EntityRepository(Actor)
export class ActorRepository extends Repository<Actor> {
  private readonly repoManager: EntityManager = getManager();

  private readonly logger: Logger = new Logger('ActorRepository');
}
