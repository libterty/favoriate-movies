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

              <b-button-group>
                <b-button :href="editPath" variant="primary">Update Movie!</b-button>
                <b-button @click.prevent="deleteMovie" variant="danger">Delete Movie!</b-button>
              </b-button-group>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import MoivessApi from '../movies/request';
import ComponentHelper from '../utils/component.helper';
import LocalStorageHelper from '../localstorages/localstorage.provider';
import * as IShare from '../shares/interfaces';
import * as IMovie from '../movies/interfaces';

const profile = namespace('Profile');

@Component({})
export default class MovieDetail extends Vue {
  public movie: IMovie.IMovieTable;
  public serveStaticUrl = 'http://localhost:7080/';
  public actors: IMovie.IActor[] = [];
  public editPath = `${document.location.pathname}/edit`;

  // Vuex Area
  @profile.State
  public user!: IShare.IUserInfo;

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
      if (typeof result === 'undefined') {
        ComponentHelper.alertMsg('GetMovie', 'Something went wrong', 'error');
        return;
      }
      if (result.status !== 'success') {
        ComponentHelper.alertMsg('GetMovie', `Get movie ${id} failed`, 'error');
        return;
      }
      this.movie = result.message;
      if (result.message.image) {
        this.serveStaticUrl += result.message.image;
      }
      if (result.message.actors.length > 0) {
        this.actors = result.message.actors.map((actor) => ({ id: actor.id, name: actor.name }));
      }
    } catch (error) {
      ComponentHelper.alertMsg('GetMovie', 'Something went wrong', 'error');
    }
  }

  /**
   * @description Get auth token
   * @private
   * @returns {string}
   */
  private getTokens(): string {
    if (!this.user) return null;
    if (!this.user.id) return null;
    const localStr = LocalStorageHelper.getWithExpiry(this.user.id);
    if (typeof localStr !== 'string') return null;
    return localStr;
  }

  public async deleteMovie() {
    try {
      const token = this.getTokens();
      if (!token) {
        return ComponentHelper.alertMsg('Validate', 'Invalid request', 'error');
      }
      const id = document.location.pathname.replace(/\/movies\//gi, '');
      const result = await MoivessApi.deleteMovie(id, token);
      if (typeof result === 'undefined') throw new Error('Something went wrong');
      if (result.status !== 'success') {
        return ComponentHelper.alertMsg('DeleteMovie', 'Delete movie failed', 'error');
      }
      return ComponentHelper
        .alertMsgWithoutIcon('DeleteMovie', 'Delete movie success')
        .then(() => {
          this.$router.push({ name: 'Movies' });
        })
        .catch((err) => {
          throw new Error(err.message);
        })
        .finally(() => {
          this.$router.push({ name: 'Movies' });
        });
    } catch (error) {
      return ComponentHelper.alertMsg('DeleteMovie', 'Something went wrong', 'error');
    }
  }
}
</script>

<style scoped>
.MovieDetail {
  height: calc(100% - 50px);
}
</style>
