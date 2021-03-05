import { Injectable } from '@nestjs/common';
import HTTPResponse from '../libs/response';
import * as IShare from '../shares/interfaces';

@Injectable()
export class UserService {
  private readonly httpResponse = new HTTPResponse();

  public async getRequest(): Promise<IShare.IResponseBase<string>> {
    return this.httpResponse.StatusOK("Hello World!");
  }
}
