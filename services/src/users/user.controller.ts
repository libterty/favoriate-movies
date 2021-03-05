import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import * as IShare from '../shares/interfaces';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getRequest(): Promise<IShare.IResponseBase<string>> {
    return this.userService.getRequest();
  }
}
