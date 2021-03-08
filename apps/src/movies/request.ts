import Axios from 'axios';
import { CreateMovieDto } from './dtos';
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

  /**
   * @description Create movie
   * @public
   * @static
   * @param {CreateMovieDto} createMovieDto
   * @param {string} token
   * @returns {Promise<IShare.IResponseBase<IShare.IMovie>>}
   */
  static async createMovie(createMovieDto: CreateMovieDto, token: string): Promise<IShare.IResponseBase<IShare.IMovie>> {
    try {
      const url = 'http://localhost:7080/v1/api/movies';
      const formData = new FormData();
      formData.append('name', createMovieDto.name);
      formData.append('desc', createMovieDto.desc);
      formData.append('ratings', createMovieDto.ratings.toString());
      formData.append('director', createMovieDto.director);
      formData.append('genre', createMovieDto.genre);
      createMovieDto.actors.forEach((actor) => {
        formData.append('actors', actor);
      });
      formData.append('image', createMovieDto.image);
      const response = await this.movieAxios.post<IShare.IResponseBase<IShare.IMovie>>(url, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
