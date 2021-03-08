import Axios from 'axios';
import * as IShare from '../shares/interfaces';

export default abstract class ActorsApi {
  private static movieAxios = Axios.create();

  /**
   * @description Get all actors
   * @static
   * @public
   * @param {IShare.IPagingSearch} searchDto
   * @param {string} token
   * @returns {Promise<IShare.IResponseBase<IShare.IMovieSearch<IShare.IActor[]>>>}
   */
  static async getAllAcotrs(searchDto: IShare.IPagingSearch, token: string): Promise<IShare.IResponseBase<IShare.IMovieSearch<IShare.IActor[]>>> {
    const url = 'http://localhost:7080/v1/api/actors/paging';
    const response = await this.movieAxios.get<IShare.IResponseBase<IShare.IMovieSearch<IShare.IActor[]>>>(url, { params: searchDto, headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  }
}
