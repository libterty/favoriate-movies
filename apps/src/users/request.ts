import Axios from 'axios';
import * as IShare from '../shares/interfaces';

export default abstract class UsersApi {
  private static usersAxios = Axios.create();

  static async requestTest(): Promise<IShare.IResponseBase<string>> {
    const url = 'http://localhost:7080/v1/api/users';
    const response = await this.usersAxios.get<IShare.IResponseBase<string>>(url);
    return response.data;
  }
}
