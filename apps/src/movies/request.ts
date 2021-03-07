import Axios from 'axios';
import * as IShare from '../shares/interfaces';

export default abstract class MoivessApi {
  private static movieAxios = Axios.create();

  /**
   * @description Get all movies
   * @static
   * @public
   * @param {IShare.IPagingSearch} searchDto
   * @returns {Promise<IShare.IResponseBase<IShare.IMovieSearch<IShare.IMovie[]>>>}
   */
  static async getAllMovies(searchDto: IShare.IPagingSearch): Promise<IShare.IResponseBase<IShare.IMovieSearch<IShare.IMovie[]>>> {
    const url = 'http://localhost:7080/v1/api/movies/paging';
    const response = await this.movieAxios.get<IShare.IResponseBase<IShare.IMovieSearch<IShare.IMovie[]>>>(url, { params: searchDto });
    return response.data;
  }

  /**
   * @description Get movie by id
   * @static
   * @public
   * @param {string} id
   * @returns {Promise<IShare.IResponseBase<IShare.IMovie>>}
   */
  static async getMovieById(id: string): Promise<IShare.IResponseBase<IShare.IMovie>> {
    const url = `http://localhost:7080/v1/api/movies/${id}/info`;
    const response = await this.movieAxios.get<IShare.IResponseBase<IShare.IMovie>>(url);
    return response.data;
  }
}
