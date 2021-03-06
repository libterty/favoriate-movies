import Redis from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entitiy';
import { UserRepository } from './user.repository';
import { UserCreditDto, SigninCreditDto } from './dtos';
import HTTPResponse from '../libs/response';
import * as IShare from '../shares/interfaces';
import * as IUser from './interfaces';
import * as EUser from './enums';
import { config } from '../../config';

@Injectable()
export class UserService {
  private readonly httpResponse = new HTTPResponse();

  private readonly logger: Logger = new Logger('UserService');

  private readonly redisClient: Redis.Redis = new Redis(config.REDIS_URL);

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description Test only or can use for ping server
   */
  public async getRequest(): Promise<IShare.IResponseBase<string>> {
    return this.httpResponse.StatusOK('Hello World!');
  }

  /**
   * @description Sign up user service action
   * @public
   * @param {UserCreditDto} userCreditDto
   * @returns {Promise<IShare.IResponseBase<User | string>>}
   */
  public async signUp(userCreditDto: UserCreditDto): Promise<IShare.IResponseBase<User | string>> {
    try {
      const user = await this.userRepository.signUp(userCreditDto);
      if (!user) return this.httpResponse.InternalServerError(`User ${userCreditDto.username} create fail`);
      delete user.password;
      delete user.salt;
      return this.httpResponse.StatusCreated(user);
    } catch (error) {
      this.logger.error(error.message, '', 'SignUpServiceError');
      return this.httpResponse.InternalServerError(error.message);
    }
  }

  /**
   * @description Sign in user service action
   * @public
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<IShare.IResponseBase<string>>}
   */
  public async signIn(signinCreditDto: SigninCreditDto): Promise<IShare.IResponseBase<string>> {
    try {
      const user = await this.userRepository.signIn(signinCreditDto);
      if (!user) return this.httpResponse.UnAuthorizedError('Invalid request');
      const payload: IUser.JwtPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
        licence: '11',
      };
      const accessToken = await this.jwtService.sign(payload);
      return this.httpResponse.StatusOK(accessToken);
    } catch (error) {
      this.logger.error(error.message, '', 'SignInServiceError');
      return this.httpResponse.InternalServerError(error.message);
    }
  }

  /**
   * @description Get user information
   * @public
   * @param {IUser.IUserInfo} user
   * @returns {IShare.IResponseBase<{ user: IUser.IUserInfo } | string>}
   */
  public getUser(user: IUser.IUserInfo): IShare.IResponseBase<{ user: IUser.IUserInfo } | string> {
    if (!user) return this.httpResponse.UnAuthorizedError('No user existed');
    return this.httpResponse.StatusOK({
      user: {
        id: user.id,
        role: user.role,
        username: user.username,
        licence: user.licence || '11',
        expiredDate: user.expiredDate,
      },
    });
  }

  /**
   * @description Get User by id
   * @public
   * @param {string} id
   * @param {IUser.IUserInfo} user
   * @returns {Promise<User>}
   */
  public async getUserById(id: string, payload: IUser.IUserInfo): Promise<IShare.IResponseBase<User | string>> {
    const isAdmin: boolean = payload.role === EUser.EUserRole.ADMIN;
    try {
      const user = await this.userRepository.getUserById(id, isAdmin);
      if (!user) return this.httpResponse.NotFoundError(`Cannot find user ${id}`);
      return this.httpResponse.StatusOK(user);
    } catch (error) {
      this.logger.error(error.message, '', 'GetUserByIdServiceError');
      return this.httpResponse.InternalServerError(error.message);
    }
  }

  /**
   * @description Log out an user
   * @public
   * @param {string} token
   * @returns {Promise<IShare.IResponseBase<string>>}
   */
  public async logOut(token: string): Promise<IShare.IResponseBase<string>> {
    try {
      await this.redisClient.lpush('blacklist', token);
      return this.httpResponse.StatusOK('Logout success');
    } catch (error) {
      this.logger.error(error.message, '', 'LogOutServiceError');
      return this.httpResponse.InternalServerError(error.message);
    }
  }
}
