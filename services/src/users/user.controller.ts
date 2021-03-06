import {
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { User } from './user.entitiy';
import { UserService } from './user.service';
import { UserCreditDto, SigninCreditDto } from './dtos';
import * as IShare from '../shares/interfaces';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getRequest(): Promise<IShare.IResponseBase<string>> {
    return this.userService.getRequest();
  }

  /**
   * @Routes SignUp routes
   * @param {UserCreditDto} userCreditDto
   * @returns {Promise<IShare.IResponseBase<User | string>>}
   */
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) userCreditDto: UserCreditDto,
  ): Promise<IShare.IResponseBase<User | string>> {
    return this.userService.signUp(userCreditDto);
  }

  /**
   * @Routes SignIn routes
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<IShare.IResponseBase<string>>}
   */
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signinCreditDto: SigninCreditDto,
  ): Promise<IShare.IResponseBase<string>> {
    return this.userService.signIn(signinCreditDto);
  }
}
