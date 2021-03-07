<template>
  <div class="Movies">
    <b-table striped hover :items="movies"></b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MoivessApi from '../movies/request';
import * as IMovie from '../movies/interfaces';

@Component({})
export default class Movies extends Vue {
  public movies: IMovie.IMovieTable[] = [];

  async mounted() {
    try {
      const result = await MoivessApi.getAllMovies();
      if (typeof result === 'undefined') throw new Error('Api is die');
      if (result.status === 'success') {
        result.message.movies.forEach((movie) => {
          this.movies.push({
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
}
</script>
