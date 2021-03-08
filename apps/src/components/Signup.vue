<template>
  <div class="Signup">
    <b-form class="Signup-Form" @submit="onSubmit" v-if="show">
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
        <b-button type="submit" variant="primary">SignUp Now!</b-button>
        <b-button href="/login" variant="primary">Already have account?!</b-button>
      </b-button-group>
    </b-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { validateOrReject } from 'class-validator';
import { namespace } from 'vuex-class';
import router from '../router';
import UsersApi from '../users/request';
import ComponentHelper from '../utils/component.helper';
import LocalStorageHelper from '../localstorages/localstorage.provider';
import { UserCreditDto } from '../users/dtos';
import * as IShare from '../shares/interfaces';

const profile = namespace('Profile');

@Component
export default class Signup extends Vue {
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

  mounted() {
    this.checkStatus();
  }

  /**
   * @description Check user status
   * @returns {void}
   */
  private checkStatus(): void {
    if (!this.user) {
      return;
    }
    if (!this.user.id) {
      return;
    }
    const localStr = LocalStorageHelper.getWithExpiry(this.user.id);
    if (!localStr) {
      return;
    }
    this.$router.push('/movies');
  }

  /**
   * @description Submit Form
   * @public
   * @returns {Promise<void>}
   */
  public async onSubmit(event) {
    event.preventDefault();
    const userCreditDto = new UserCreditDto();
    userCreditDto.username = this.form.username;
    userCreditDto.password = this.form.password;
    await this.validateOrRejectDto(userCreditDto);
  }

  /**
   * @description Validate Dto
   * @private
   * @param {UserCreditDto} userCreditDto
   * @returns {Promise<void>}
   */
  private async validateOrRejectDto(userCreditDto: UserCreditDto): Promise<void> {
    try {
      await validateOrReject(userCreditDto)
        .then(() => {
          this.signUp(userCreditDto);
        })
        .catch((error) => {
          ComponentHelper.alertMsg('Validate', ComponentHelper.parseValidationErrorMsg(error), 'error');
        });
    } catch (error) {
      ComponentHelper.alertMsg('Validate', 'Caught promise rejection', 'error');
    }
  }

  /**
   * @description Sign up
   * @private
   * @param {UserCreditDto} userCreditDto
   * @returns {Promise<unknown>}
   */
  private async signUp(userCreditDto: UserCreditDto): Promise<unknown> {
    try {
      const result = await UsersApi.signUpUser(userCreditDto);
      if (typeof result === 'undefined') {
        return ComponentHelper.alertMsg('Signup', 'Something went wrong', 'error');
      }
      if (result.status !== 'success') {
        return ComponentHelper.alertMsg('Signup', result.message, 'error');
      }
      this.onReset();
      return ComponentHelper
        .alertMsgWithoutIcon('Signup', 'Signup success')
        .then(() => this.$router.push({ name: 'Login' }));
    } catch (error) {
      return ComponentHelper.alertMsg('Signup', 'Something went wrong', 'error');
    }
  }

  /**
   * @description Rest form
   * @private
   * @returns {void}
   */
  private onReset() {
    this.form.username = '';
    this.form.password = '';
  }
}
</script>

<style scoped>
.Signup {
  height: calc(100% - 50px);
}
.Signup-Form {
  max-width: 80%;
  margin: 5rem auto;
}
</style>
