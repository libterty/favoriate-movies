import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as EUser from '../shares/enums';

@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * @description Check if role can be activate or not
   * @param {ExecutionContext} ctx
   * @returns {boolean}
   */
  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    // eslint-disable-next-line
    const role = ctx.switchToHttp().getRequest<Request>().user['role'];

    // Grant all acess to admin
    if (role === EUser.EUserRole.ADMIN) return true;

    // check access for user role
    if (roles.indexOf(role) < 0) return false;

    return true;
  }
}
