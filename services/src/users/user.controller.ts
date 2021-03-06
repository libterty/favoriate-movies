import { Controller, Get, Post, UsePipes, ValidationPipe, Body, UseGuards, Headers, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entitiy';
import { UserService } from './user.service';
import { CurrentUser } from './get-user.decorator';
import { UserCreditDto, SigninCreditDto } from './dtos';
import * as IShare from '../shares/interfaces';
import * as IUser from './interfaces';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getRequest(): Promise<IShare.IResponseBase<string>> {
    return this.userService.getRequest();
  }

  /**
   * @Routes Get user informations from receiving payload
   * @param {IUser.IUserInfo} user
   * @returns {IShare.IResponseBase<{ user: IUser.IUserInfo } | string>}
   */
  @Get('/info')
  @UseGuards(AuthGuard(['jwt']))
  getUser(@CurrentUser() user: IUser.IUserInfo): IShare.IResponseBase<{ user: IUser.IUserInfo } | string> {
    return this.userService.getUser(user);
  }

  /**
   * @Routes Logout an user
   * @param {string} authorization
   * @returns {Promise<IShare.IResponseBase<string>>}
   */
  @Get('/logout')
  @UseGuards(AuthGuard(['jwt']))
  logOut(@Headers('authorization') authorization: string): Promise<IShare.IResponseBase<string>> {
    return this.userService.logOut(authorization);
  }

  /**
   * @Routes Get an user by id
   * @param {IUser.IUserInfo} user
   * @param {string} id
   * @returns {Promise<IShare.IResponseBase<User | string>>}
   */
  @Get('/:id/info')
  @UseGuards(AuthGuard(['jwt']))
  getUserById(@CurrentUser() user: IUser.IUserInfo, @Param('id', ParseUUIDPipe) id: string): Promise<IShare.IResponseBase<User | string>> {
    return this.userService.getUserById(id, user);
  }

  /**
   * @Routes SignUp routes
   * @param {UserCreditDto} userCreditDto
   * @returns {Promise<IShare.IResponseBase<User | string>>}
   */
  @Post('/signup')
  signUp(@Body(ValidationPipe) userCreditDto: UserCreditDto): Promise<IShare.IResponseBase<User | string>> {
    return this.userService.signUp(userCreditDto);
  }

  /**
   * @Routes SignIn routes
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<IShare.IResponseBase<string>>}
   */
  @Post('/signin')
  signIn(@Body(ValidationPipe) signinCreditDto: SigninCreditDto): Promise<IShare.IResponseBase<string>> {
    return this.userService.signIn(signinCreditDto);
  }
}
