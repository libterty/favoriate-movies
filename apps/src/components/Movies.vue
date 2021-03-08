<template>
  <div class="Movies">
    <b-table
      striped
      hover
      :fields="fields"
      :select-mode="selectMode"
      responsive="sm"
      :items="movies"
      ref="selectableTable"
      selectable
      @row-selected="onRowSelected"
    ></b-table>
    <div class="mt-3 MoviesPagination">
      <b-pagination
        align="center"
        v-model="currentPage"
        :total-rows="movies.length"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import router from '../router';
import MoivessApi from '../movies/request';
import MovieEventHandler from '../sockets/movie.socket';
import * as IMovie from '../movies/interfaces';
import * as EShare from '../shares/enums';
import * as IShare from '../shares/interfaces';

@Component({})
export default class Movies extends Vue {
  public readonly movieEventHandler: MovieEventHandler = new MovieEventHandler();
  public readonly selectMode = 'multi';
  public readonly fields = ['name', 'desc', 'ratings', 'director', 'genre'];
  public readonly perPage = 10;
  public currentPage = 1;
  public movies: IMovie.IMovieTable[] = [];
  public events = [];

  /**
   * @LifeCycle
   * @public
   * @Created
   */
  public created() {
    this.movieEventHandler.$connection.onmessage = ($event) => {
      this.getBroadcastMsg($event);
    };
  }

  /**
   * @description Get broadcast msg from ws
   * @private
   * @returns {void}
   */
  private getBroadcastMsg($event: MessageEvent): void {
    const eventStr = $event.data;
    if (!eventStr) return null;
    const eventData: IShare.IMovieSocketEvent = JSON.parse(eventStr);
    
    switch (eventData.type) {
      case EShare.ESocketEvent.CREATEMOVIE:
        return this.handleCreateMovie(eventData.data as IShare.IMovie);
      case EShare.ESocketEvent.UPDATEMOVIE:
        return this.handleUpdateMovie(eventData.data as IShare.IMovie);
      case EShare.ESocketEvent.DELETEMOVIE:
        return this.handleDeleteMovie(eventData.data as IShare.IDeleteMovieEvent);
      default:
        return null;
    }
  }

  /**
   * @description Create new movie by ws
   * @private
   * @param {IShare.IMovie} newMovie
   * @returns {void}
   */
  private handleCreateMovie(newMovie: IShare.IMovie): void {
    this.movies.push(newMovie);
  }

  /**
   * @description Update new movie by ws
   * @private
   * @param {IShare.IMovie} updateMovie
   * @returns {void}
   */
  private handleUpdateMovie(updateMovie: IShare.IMovie): void {
    this.movies.forEach((movie, index, movies) => {
      if (movie.id === updateMovie.id) this.movies.splice(index, 1);
    });
    this.movies.unshift(updateMovie);
  }

  /**
   * @description Delete new movie by ws
   * @private
   * @param {IShare.IDeleteMovieEvent} removeMovie
   * @returns {void}
   */
  private handleDeleteMovie(removeMovie: IShare.IDeleteMovieEvent): void {
    const index = this.movies.findIndex((movie) => movie.id === removeMovie.id);
    if (index > -1) {
      this.movies.splice(index, 1);
    }
  }

  /**
   * @LifeCycle
   * @public
   * @Mounted
   */
  public async mounted(): Promise<void> {
    await this.getAllMovies();
  }

  /**
   * @description Get all movies
   * @private
   * @returns {Promise<void>}
   */
  private async getAllMovies() {
    try {
      const result = await MoivessApi.getAllMovies({
        take: this.perPage,
        skip: this.currentPage - 1,
        keyword: '',
        sort: 'DESC',
      });
      if (typeof result === 'undefined') throw new Error('Something went wrong');
      if (result.status === 'success') {
        result.message.movies.forEach((movie) => {
          this.movies.push({
            id: movie.id,
            name: movie.name,
            desc: movie.desc,
            ratings: movie.ratings,
            director: movie.director,
            genre: movie.genre,
          });
        });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * @description Select row and navigate
   * @param {IMovie.IMovieTable[]} items
   * @returns {void}
   */
  public onRowSelected(items: IMovie.IMovieTable[]): void {
    this.$router.push(`/movies/${items[0].id}`);
  }
}
</script>

<style scoped>
.Movies {
  height: calc(100% - 50px);
}
.MoviesPagination {
  position: fixed;
  bottom: 50px;
  left: calc(100% - 55%);
}
</style>
