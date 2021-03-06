import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entitiy';
import { UserRepository } from './user.repository';
import { UserCreditDto, SigninCreditDto } from './dtos';
import HTTPResponse from '../libs/response';
import * as IShare from '../shares/interfaces';
import * as IUser from './interfaces';

@Injectable()
export class UserService {
  private readonly httpResponse = new HTTPResponse();

  private readonly logger: Logger = new Logger('UserService');

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
}
