import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import HTTPResponse from '../libs/response';

@Injectable()
export class MovieService {
  private readonly httpResponse = new HTTPResponse();

  private readonly logger: Logger = new Logger('MovieService');

  constructor(
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository,
  ) {}
}
