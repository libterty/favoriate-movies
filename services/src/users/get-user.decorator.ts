import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as IUser from './interfaces';

export const CurrentUser = createParamDecorator(
  /**
   * @description Get current user decorator
   * @public
   * @param {unknown} data
   * @param {ExecutionContext} ctx
   * @returns {unknown | IUser.UserInfo}
   */
  (data: unknown, ctx: ExecutionContext): unknown | IUser.IUserInfo => {
    const { user } = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line
    delete user['password'];
    // eslint-disable-next-line
    delete user['salt'];
    return user;
  },
);
