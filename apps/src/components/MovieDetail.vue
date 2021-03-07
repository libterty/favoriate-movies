<template>
  <div class="MovieDetail">
    <div>
      <b-card no-body class="overflow-hidden" align="center">
        <b-row no-gutters>
          <b-col md="6">
            <b-card-img :src="serveStaticUrl" :alt="movie.name" class="rounded-0"></b-card-img>
          </b-col>
          <b-col md="6">
            <b-card-body :title="movie.name">
              <b-card-text>
                {{movie.desc}}
              </b-card-text>
              <hr style="border:1px dashed #0000fff"/>

              <b-col md="3">
                <h5>All Actors: </h5>
                <b-list-group horizontal="md">
                  <b-list-group-item v-for="(actor, index) in actors" :key='index'>{{actor.name}}</b-list-group-item>
                </b-list-group>
              </b-col>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MoivessApi from '../movies/request';
import * as IMovie from '../movies/interfaces';

@Component({})
export default class MovieDetail extends Vue {
  public movie: IMovie.IMovieTable;
  public serveStaticUrl = 'http://localhost:7080/';
  public actors: IMovie.IActor[] = [];

  /**
   * @LifeCycle
   * @Mounted
   */
  public async mounted(): Promise<void> {
    await this.getMovieId();
  }

  /**
   * @description Get movie id
   * @private
   * @returns {Promise<void>}
   */
  private async getMovieId(): Promise<void> {
    try {
      const id = document.location.pathname.replace(/\/movies\//gi, '');
      const result = await MoivessApi.getMovieById(id);
      if (typeof result === 'undefined') throw new Error('Something went wrong');
      if (result.status === 'success') {
        this.movie = result.message;
        if (result.message.image) {
          this.serveStaticUrl += result.message.image;
        }
        if (result.message.actors.length > 0) {
          this.actors = result.message.actors.map((actor) => ({ id: actor.id, name: actor.name }));
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
</script>

<style scoped>
.MovieDetail {
  height: calc(100% - 50px);
}
</style>
