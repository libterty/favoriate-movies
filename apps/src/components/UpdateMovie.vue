<template>
  <div class="UpdateMovie">
    <b-form class="Login-Form" @submit="onSubmit" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Moviename"
        label-for="input-1"
        description="Enter your movie name here"
      >
        <b-form-input
          id="input-1"
          v-model="form.name"
          type="text"
          placeholder="Enter movie name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Movie Description:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.desc"
          type="text"
          placeholder="Enter movie description"
        ></b-form-input>
      </b-form-group>
      
      <b-form-group id="input-group-3" label="Movie Ratings:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.ratings"
          type="number"
          min="0"
          max="10"
          placeholder="Enter movie ratings"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Movie Director:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.director"
          type="text"
          placeholder="Enter movie director"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="Movie Director:" label-for="input-5">
        <b-form-select v-model="form.genre" :options="genreOptions"></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-6" label="Movie Actors:" label-for="input-6">
        <b-form-select v-model="form.actors" :options="actorsOptions" multiple></b-form-select>
      </b-form-group>

      <b-button-group>
        <b-button type="submit" variant="primary">Update New Movie!</b-button>
        <b-button href="/movies" variant="primary">Back to Movie List!</b-button>
      </b-button-group>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { validateOrReject } from 'class-validator';
import MoivessApi from '../movies/request';
import ActorsApi from '../actors/request';
import ComponentHelper from '../utils/component.helper';
import LocalStorageHelper from '../localstorages/localstorage.provider';
import { UpdateMovieDto } from '../movies/dtos';
import * as EShare from '../shares/enums';
import * as IShare from '../shares/interfaces';
import * as EMovie from '../movies/interfaces';

const profile = namespace('Profile');

@Component
export default class UpdateMovie extends Vue {
  public readonly perPage = 1000;
  public currentPage = 1;
  public form: EMovie.UpdateMovieByIdDto = {
    name: null,
    desc: null,
    ratings: null,
    director: null,
    genre: null,
    actors: null,
  };
  public file: any;
  public genreOptions = [];
  public actorsOptions = [];
  public show = true;

  // Vuex Area
  @profile.State
  public user!: IShare.IUserInfo;

  /**
   * @LifeCycle
   * @public
   * @Mounted
   */
  async mounted() {
    Object.keys(EShare.EMovieTypes).forEach((type) => {
      this.genreOptions.push({ value: EShare.EMovieTypes[type], text: EShare.EMovieTypes[type] });
    });
    await this.getAllActors();
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

  /**
   * @description Get all actors
   * @private
   * @returns {Promise<void>}
   */
  private async getAllActors(): Promise<void> {
    try {
      const token = this.getTokens();
      if (!token) {
        ComponentHelper
          .alertMsg('Validate', 'Invalid request', 'error')
          .then(() => {
            this.$router.push('/login');
          });
        return;
      }
      const result = await ActorsApi.getAllAcotrs({
        take: this.perPage,
        skip: this.currentPage - 1,
        keyword: '',
        sort: 'DESC',
      }, token);
      if (typeof result === 'undefined') {
        ComponentHelper.alertMsg('GetAllActors', 'Caught promise rejection', 'error');
        return;
      }
      if (result.status !== 'success') {
        ComponentHelper.alertMsg('GetAllActors', 'Get all actors fail', 'error');
        return;
      }
      result.message.actors.forEach((actor) => {
        this.actorsOptions.push({ value: actor.name, text: actor.name });
      });
    } catch (error) {
      ComponentHelper.alertMsg('Validate', 'Caught promise rejection', 'error');
    }
  }

  /**
   * @description Submit Form
   * @public
   * @returns {Promise<void>}
   */
  public async onSubmit(event): Promise<void> {
    event.preventDefault();
    const updateMovieDto = new UpdateMovieDto();
    if (this.form.name) updateMovieDto.name = this.form.name;
    if (this.form.desc) updateMovieDto.desc = this.form.desc;
    if (this.form.ratings) updateMovieDto.ratings = Number(this.form.ratings);
    if (this.form.director) updateMovieDto.director = this.form.director;
    if (this.form.genre) updateMovieDto.genre = this.form.genre;
    if (this.form.actors) updateMovieDto.actors = this.form.actors;
    await this.validateOrRejectDto(updateMovieDto);
  }

  /**
   * @description Validate Dto
   * @private
   * @param {UpdateMovieDto} updateMovieDto
   * @returns {Promise<void>}
   */
  private async validateOrRejectDto(updateMovieDto: UpdateMovieDto): Promise<void> {
    try {
      await validateOrReject(updateMovieDto)
        .then(() => {
          this.updateMovie(updateMovieDto);
        })
        .catch((error) => {
          ComponentHelper.alertMsg('Validate', ComponentHelper.parseValidationErrorMsg(error), 'error');
        });
    } catch (error) {
      ComponentHelper.alertMsg('Validate', 'Caught promise rejection', 'error');
    }
  }

  /**
   * @description Update movie
   * @private
   * @param {UpdateMovieDto} updateMovieDto
   * @returns {Promise<unknown>}
   */
  private async updateMovie(updateMovieDto: UpdateMovieDto): Promise<unknown> {
    try {
      const token = this.getTokens();
      if (!token) {
        return ComponentHelper
          .alertMsg('Validate', 'Invalid request', 'error')
          .then(() => {
            this.$router.push('/login');
          });
      }
      const id = document.location.pathname.replace(/\/movies\//gi, '').replace(/\/edit/gi, '');
      if (!id) {
        return ComponentHelper.alertMsg('Validate', 'Invalid request', 'error');
      }
      const result = await MoivessApi.updateMovie(updateMovieDto, id, token);
      if (typeof result === 'undefined') {
        return ComponentHelper.alertMsg('UpdateMovie', 'Something went wrong', 'error');
      }
      if (result.status !== 'success') {
        return ComponentHelper.alertMsg('UpdateMovie', 'Update movie failed', 'error');
      }
      this.onReset();
      return ComponentHelper.alertMsgWithoutIcon('UpdateMovie', 'Update movie success');
    } catch (error) {
      return ComponentHelper.alertMsg('UpdateMovie', 'Something went wrong', 'error');
    }
  }

  /**
   * @description Rest form
   * @private
   * @returns {void}
   */
  private onReset(): void {
    this.form.name = null;
    this.form.desc = null;
    this.form.ratings = null;
    this.form.director = null;
    this.form.genre = null;
    this.form.actors = null;
  }
}
</script>

<style scoped>
.UpdateMovie {
  height: calc(100% - 50px);
}
</style>
