import Axios from 'axios';
import { SigninCreditDto, UserCreditDto } from './dtos';
import * as IShare from '../shares/interfaces';

export default abstract class UsersApi {
  private static usersAxios = Axios.create();

  static async requestTest(): Promise<IShare.IResponseBase<string>> {
    const url = 'http://localhost:7080/v1/api/users';
    const response = await this.usersAxios.get<IShare.IResponseBase<string>>(url);
    return response.data;
  }

  /**
   * @description Singin user
   * @public
   * @static
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<IShare.IResponseBase<string>>}
   */
  static async signInUser(signinCreditDto: SigninCreditDto): Promise<IShare.IResponseBase<string>> {
    try {
      const url = 'http://localhost:7080/v1/api/users/signin';
      const response = await this.usersAxios.post<IShare.IResponseBase<string>>(url, signinCreditDto);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * @description Signup user
   * @public
   * @static
   * @param {UserCreditDto} userCreditDto
   * @returns {Promise<IShare.IResponseBase<string>>}
   */
  static async signUpUser(userCreditDto: UserCreditDto): Promise<IShare.IResponseBase<string>> {
    try {
      const url = 'http://localhost:7080/v1/api/users/signup';
      const response = await this.usersAxios.post<IShare.IResponseBase<string>>(url, userCreditDto);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * @description Get user information
   * @public
   * @static
   * @param {string} token
   * @returns {Promise<IShare.IResponseBase<{ user: IShare.IUserInfo }>>}
   */
  static async getUserInfo(token: string): Promise<IShare.IResponseBase<{ user: IShare.IUserInfo }>> {
    try {
      const url = 'http://localhost:7080/v1/api/users/info';
      const response = await this.usersAxios.get<IShare.IResponseBase<{ user: IShare.IUserInfo }>>(url, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * @description Logout user
   * @public
   * @static
   * @param {string} token
   * @returns {Promise<IShare.IResponseBase<any>>}
   */
  static async logOutUser(token: string): Promise<IShare.IResponseBase<any>> {
    try {
      const url = 'http://localhost:7080/v1/api/users/logout';
      const response = await this.usersAxios.get<IShare.IResponseBase<any>>(url, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
