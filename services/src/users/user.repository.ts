import { Logger } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  getManager,
  Repository,
} from 'typeorm';
import { User } from './user.entitiy';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly repoManager: EntityManager = getManager();

  private readonly logger: Logger = new Logger('UserRepository');
}
