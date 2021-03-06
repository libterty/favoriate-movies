import { Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { Movie } from './movie.entity';

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  private readonly repoManager: EntityManager = getManager();

  private readonly logger: Logger = new Logger('MovieRepository');
}
