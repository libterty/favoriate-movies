import Redis from 'ioredis';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entitiy';
import { UserRepository } from './user.repository';
import { UserCreditDto, SigninCreditDto } from './dtos';
import HTTPResponse from '../libs/response';
import * as IShare from '../shares/interfaces';
import * as IUser from './interfaces';
import * as EUser from '../shares/enums';
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
   * @returns {Promise<IShare.IResponseBase<User | string> | HttpException>}
   */
  public async signUp(userCreditDto: UserCreditDto): Promise<IShare.IResponseBase<User | string> | HttpException> {
    try {
      const user = await this.userRepository.signUp(userCreditDto);
      if (!user) {
        this.logger.error(`User ${userCreditDto.username} create fail`, '', 'SignUpServiceError');
        return new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `User ${userCreditDto.username} create fail`,
          },
          HttpStatus.CONFLICT,
        );
      }
      delete user.password;
      delete user.salt;
      return this.httpResponse.StatusCreated(user);
    } catch (error) {
      this.logger.error(error.message, '', 'SignUpServiceError');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Sign in user service action
   * @public
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<IShare.IResponseBase<string> | HttpException>}
   */
  public async signIn(signinCreditDto: SigninCreditDto): Promise<IShare.IResponseBase<string> | HttpException> {
    try {
      const user = await this.userRepository.signIn(signinCreditDto);
      if (!user) {
        this.logger.error('Invalid request', '', 'SignInServiceError');
        return new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Invalid request',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Get user information
   * @public
   * @param {IUser.IUserInfo} user
   * @returns {IShare.IResponseBase<{ user: IUser.IUserInfo } | string > | HttpException}
   */
  public getUser(user: IUser.IUserInfo): IShare.IResponseBase<{ user: IUser.IUserInfo } | string> | HttpException {
    if (!user) {
      this.logger.error('No user existed', '', 'GetUserServiceError');
      return new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'No user existed',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
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
   * @returns {Promise<IShare.IResponseBase<User | string> | HttpException>}
   */
  public async getUserById(id: string, payload: IUser.IUserInfo): Promise<IShare.IResponseBase<User | string> | HttpException> {
    const isAdmin: boolean = payload.role === EUser.EUserRole.ADMIN;
    try {
      const user = await this.userRepository.getUserById(id, isAdmin);
      if (!user) {
        this.logger.error(`Cannot find user ${id}`, '', 'GetUserByIdServiceError');
        return new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Cannot find user ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return this.httpResponse.StatusOK(user);
    } catch (error) {
      this.logger.error(error.message, '', 'GetUserByIdServiceError');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
