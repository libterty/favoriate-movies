<template>
  <div class="Login">
    <b-form class="Login-Form" @submit="onSubmit" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Username"
        label-for="input-1"
        description="Enter your usenmae here"
      >
        <b-form-input
          id="input-1"
          v-model="form.username"
          type="text"
          placeholder="Enter usenmae"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="text"
          placeholder="Enter your password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button-group>
        <b-button type="submit" variant="primary">LogIn Now!</b-button>
        <b-button href="/signup" variant="primary">Don't have account?!</b-button>
      </b-button-group>
    </b-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { validateOrReject } from 'class-validator';
import { namespace } from 'vuex-class';
import UsersApi from '../users/request';
import ComponentHelper from '../utils/component.helper';
import LocalStorageHelper from '../localstorages/localstorage.provider';
import { SigninCreditDto } from '../users/dtos';
import * as IShare from '../shares/interfaces';

const profile = namespace('Profile');

@Component
export default class Login extends Vue {
  public form = {
    username: '',
    password: '',
  };
  public show = true;

  // Vuex Area
  @profile.State
  public user!: IShare.IUserInfo;
  @profile.Mutation
  public setUser!: (userData: IShare.IUserInfo) => void;

  /**
   * @description Submit Form
   * @public
   * @returns {Promise<void>}
   */
  public async onSubmit(event): Promise<void> {
    event.preventDefault();
    const signinCreditDto = new SigninCreditDto();
    signinCreditDto.username = this.form.username;
    signinCreditDto.password = this.form.password;
    await this.validateOrRejectDto(signinCreditDto);
  }

  /**
   * @description Validate Dto
   * @private
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<void>}
   */
  private async validateOrRejectDto(signinCreditDto: SigninCreditDto): Promise<void> {
    try {
      await validateOrReject(signinCreditDto)
        .then(() => {
          this.signIn(signinCreditDto);
        })
        .catch((error) => {
          ComponentHelper.alertMsg('Validate', ComponentHelper.parseValidationErrorMsg(error), 'error');
        });
    } catch (error) {
      ComponentHelper.alertMsg('Validate', 'Caught promise rejection', 'error');
    }
  }

  /**
   * @description Sign in
   * @private
   * @param {SigninCreditDto} signinCreditDto
   * @returns {Promise<unknown>}
   */
  private async signIn(signinCreditDto: SigninCreditDto): Promise<unknown> {
    try {
      const result = await UsersApi.signInUser(signinCreditDto);
      if (typeof result === 'undefined') {
        return ComponentHelper.alertMsg('Login', 'Something went wrong', 'error');
      }
      if (result.status !== 'success') {
        return ComponentHelper.alertMsg('Login', result.message, 'error');
      }
      const userResult = await this.getUserInfo(result.message);
      if (!userResult) return ComponentHelper.alertMsg('Login', 'Invalid Credits', 'error');
      LocalStorageHelper.setWithExpiry(userResult.user.id, { token: userResult.token }, 3600);
      this.onReset();
      return ComponentHelper
        .alertMsgWithoutIcon('Login', 'Login success')
        .then(() => this.$router.push({ name: 'Movies' }));
    } catch (error) {
      return ComponentHelper.alertMsg('Login', 'Something went wrong', 'error');
    }
  }

  /**
   * @description get user information
   * @private
   * @param {string} token
   * @returns {Promise<void>}
   */
  private async getUserInfo(token: string): Promise<IShare.IGetUserInfoAPIResponse> {
    try {
      const result = await UsersApi.getUserInfo(token);
      if (typeof result === 'undefined') {
        ComponentHelper.alertMsg('Login', 'Something went wrong', 'error');
        return null;
      }
      this.setUser(result.message.user);
      return {
        token,
        user: result.message.user,
      };
    } catch (error) {
      ComponentHelper.alertMsg('Login', 'Something went wrong', 'error');
      return null;
    }
  }

  /**
   * @description Rest form
   * @private
   * @returns {void}
   */
  private onReset(): void {
    this.form.username = '';
    this.form.password = '';
  }
}
</script>

<style scoped>
.Login {
  height: calc(100% - 50px);
}
.Login-Form {
  max-width: 80%;
  margin: 5rem auto;
}
</style>
