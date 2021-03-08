<template>
  <div class="CreateMovie">
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
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Movie Description:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.desc"
          type="text"
          placeholder="Enter movie description"
          required
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
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Movie Director:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.director"
          type="text"
          placeholder="Enter movie director"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="Movie Director:" label-for="input-5">
        <b-form-select v-model="form.genre" :options="genreOptions" required></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-6" label="Movie Actors:" label-for="input-6">
        <b-form-select v-model="form.actors" :options="actorsOptions" multiple required></b-form-select>
      </b-form-group>

      <b-form-file v-model="form.image" class="mt-3" plain required></b-form-file>

      <b-button-group>
        <b-button type="submit" variant="primary">Create New Movie!</b-button>
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
import { CreateMovieDto } from '../movies/dtos';
import * as EShare from '../shares/enums';
import * as IShare from '../shares/interfaces';
import * as EMovie from '../movies/interfaces';

const profile = namespace('Profile');

@Component
export default class CreateMovie extends Vue {
  public readonly perPage = 1000;
  public currentPage = 1;
  public form: EMovie.CreateMovieDto = {
    name: '',
    desc: '',
    ratings: 0,
    director: '',
    genre: EShare.EMovieTypes.News,
    actors: [],
    image: null,
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
        ComponentHelper.alertMsg('Validate', 'Invalid request', 'error');
        return;
      }
      const result = await ActorsApi.getAllAcotrs({
        take: this.perPage,
        skip: this.currentPage - 1,
        keyword: '',
        sort: 'DESC',
      }, token);
      if (typeof result === 'undefined') {
        ComponentHelper.alertMsg('Validate', 'Caught promise rejection', 'error');
        return;
      }
      if (result.status === 'success') {
        result.message.actors.forEach((actor) => {
          this.actorsOptions.push({ value: actor.name, text: actor.name });
        });
      }
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
    const createMovieDto = new CreateMovieDto();
    createMovieDto.name = this.form.name;
    createMovieDto.desc = this.form.desc;
    createMovieDto.ratings = this.form.ratings;
    createMovieDto.director = this.form.director;
    createMovieDto.genre = this.form.genre;
    createMovieDto.actors = this.form.actors;
    createMovieDto.image = this.form.image;
    await this.validateOrRejectDto(createMovieDto);
  }

  /**
   * @description Validate Dto
   * @private
   * @param {CreateMovieDto} createMovieDto
   * @returns {Promise<void>}
   */
  private async validateOrRejectDto(createMovieDto: CreateMovieDto): Promise<void> {
    try {
      await validateOrReject(createMovieDto)
        .then(() => {
          this.createMovie(createMovieDto);
        })
        .catch((error) => {
          ComponentHelper.alertMsg('Validate', ComponentHelper.parseValidationErrorMsg(error), 'error');
        });
    } catch (error) {
      ComponentHelper.alertMsg('Validate', 'Caught promise rejection', 'error');
    }
  }

  /**
   * @description Create movie
   * @private
   * @param {CreateMovieDto} createMovieDto
   * @returns {Promise<unknown>}
   */
  private async createMovie(createMovieDto: CreateMovieDto): Promise<unknown> {
    try {
      const token = this.getTokens();
      if (!token) {
        return ComponentHelper
          .alertMsg('Validate', 'Invalid request', 'error')
          .then(() => {
            this.$router.push('/login');
          });
      }
      const result = await MoivessApi.createMovie(createMovieDto, token);
      console.log('result: ', result);
      if (typeof result === 'undefined') {
        return ComponentHelper.alertMsg('CreateMovie', 'Something went wrong', 'error');
      }
      if (result.status !== 'success') {
        return ComponentHelper.alertMsg('CreateMovie', 'Create movie failed', 'error');
      }
      this.onReset();
      return ComponentHelper
        .alertMsgWithoutIcon('CreateMovie', 'Create movie success')
        .then(() => {
          this.$router.push('/movies');
        });
    } catch (error) {
      return ComponentHelper.alertMsg('CreateMovie', 'Something went wrong', 'error');
    }
  }

  /**
   * @description Rest form
   * @private
   * @returns {void}
   */
  private onReset(): void {
    this.form.name = '';
    this.form.desc = '';
    this.form.ratings = 0;
    this.form.director = '';
    this.form.genre = EShare.EMovieTypes.News;
    this.form.actors = [];
    this.form.image = null;
  }
}
</script>

<style scoped>
.CreateMovie {
  height: calc(100% - 50px);
}
</style>
