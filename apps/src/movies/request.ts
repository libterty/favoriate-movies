import Axios from 'axios';
import * as IShare from '../shares/interfaces';

export default abstract class MoivessApi {
  private static movieAxios = Axios.create();

  static async getAllMovies(): Promise<IShare.IResponseBase<IShare.IMovieSearch<IShare.IMovie[]>>> {
    const url = 'http://localhost:7080/v1/api/movies/paging';
    const response = await this.movieAxios.get<IShare.IResponseBase<IShare.IMovieSearch<IShare.IMovie[]>>>(url);
    return response.data;
  }
}
