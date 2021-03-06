import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActorRepository } from './actor.repository';
import HTTPResponse from '../libs/response';

@Injectable()
export class ActorService {
  private readonly httpResponse = new HTTPResponse();

  private readonly logger: Logger = new Logger('ActorService');

  constructor(
    @InjectRepository(ActorRepository)
    private readonly actorRepository: ActorRepository,
  ) {}
}
