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

      <b-button type="submit" variant="primary">Submit</b-button>
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
  form = {
    username: '',
    password: '',
  };
  show = true;

  // Vuex Area
  @profile.State
  public user!: IShare.IUserInfo;
  @profile.Mutation
  public setUser!: (userData: IShare.IUserInfo) => void;

  async onSubmit(event) {
    event.preventDefault();
    const signinCreditDto = new SigninCreditDto();
    signinCreditDto.username = this.form.username;
    signinCreditDto.password = this.form.password;
    await this.validateOrRejectDto(signinCreditDto);
  }

  async validateOrRejectDto(signinCreditDto: SigninCreditDto): Promise<void> {
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

  async signIn(signinCreditDto: SigninCreditDto) {
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
      return ComponentHelper.alertMsg('Login', 'Login success', 'success');
    } catch (error) {
      return ComponentHelper.alertMsg('Login', 'Something went wrong', 'error');
    }
  }

  async getUserInfo(token: string): Promise<IShare.IGetUserInfoAPIResponse> {
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

  onReset() {
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
