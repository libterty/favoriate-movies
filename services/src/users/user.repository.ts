import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entitiy';
import { UserCreditDto, SigninCreditDto } from './dtos';
import * as IShare from '../shares/interfaces';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly repoManager: EntityManager = getManager();

  private readonly logger: Logger = new Logger('UserRepository');

  /**
   * @description hash password
   * @private
   * @param {string} password
   * @param {string} string
   * @returns {Promise<string>}
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  /**
   * @description Sign up user repository action
   * @public
   * @param {UserCreditDto} userCreditDto
   * @returns {Promise<User>}
   */
  public async signUp(userCreditDto: UserCreditDto): Promise<User> {
    const { username, password } = userCreditDto;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      this.logger.error(error.message, '', 'SignUpRepoError');
      if (error.code === '23505') {
        // throw 409 error when duplicate username
        throw new ConflictException(`Username: ${username} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  /**
   * @description Validate user password
   * @public
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<string>}
   */
  public async signIn(signinCreditDto: SigninCreditDto): Promise<User> {
    const { username, password } = signinCreditDto;
    const user = await this.findOne({ where: { username, status: true } });
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
