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
import * as IMovie from '../movies/interfaces';

@Component({})
export default class Movies extends Vue {
  public readonly selectMode = 'multi';
  public readonly fields = ['name', 'desc', 'ratings', 'director', 'genre'];
  public readonly perPage = 10;
  public currentPage = 1;
  public movies: IMovie.IMovieTable[] = [];

  /**
   * @LifeCycle
   * @Mounted
   */
  async mounted(): Promise<void> {
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
    this.$router.push({ name: 'MovieInfo', params: { id: items[0].id } });
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
