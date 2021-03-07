import Axios from 'axios';
import * as IShare from '../shares/interfaces';

export default abstract class MoivessApi {
  private static movieAxios = Axios.create();

  static async getAllMovies(): Promise<IShare.IResponseBase<IShare.IMovie[] | string> | IShare.HttpException> {
    const url = 'http://localhost:7080/v1/api/movies/paging';
    const response = await this.movieAxios.get<IShare.IResponseBase<IShare.IMovie[] | string> | IShare.HttpException>(url);
    return response.data;
  }
}
