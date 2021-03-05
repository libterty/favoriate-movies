import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import HTTPResponse from '../libs/response';
import * as IShare from '../shares/interfaces';

@Injectable()
export class UserService {
  private readonly httpResponse = new HTTPResponse();

  private readonly logger: Logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async getRequest(): Promise<IShare.IResponseBase<string>> {
    return this.httpResponse.StatusOK('Hello World!');
  }
}
