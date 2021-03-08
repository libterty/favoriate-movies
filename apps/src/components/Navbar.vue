<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/">Favorite Movie</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em v-if="isLogin">Welcome back {{user.username}}!!</em>
            <em v-if="!isLogin">Hi Anonymous please login!!</em>
          </template>
          <b-dropdown-item id="dropdown-1" v-if="!isLogin" href="/login">Sign In</b-dropdown-item>
          <b-dropdown-item id="dropdown-2" @click="logOutUser" v-if="isLogin" class="m-md-2">Sign Out</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item id="dropdown-3" href="/movies/create">Create New Movie</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import UsersApi from '../users/request';
import ComponentHelper from '../utils/component.helper';
import LocalStorageHelper from '../localstorages/localstorage.provider';
import * as IShare from '../shares/interfaces';

const profile = namespace('Profile');

@Component
export default class Navbar extends Vue {
  // state area
  public isLogin: boolean = false;

  // Vuex Area
  @profile.State
  public user!: IShare.IUserInfo;
  @profile.Mutation
  public setUser!: (userData: IShare.IUserInfo) => void;

  /**
   * @LifeCycle
   * @public
   * @Mounted
   */
  mounted() {
    this.checkStatus();
  }

  @Watch('user')
  userStateChange(next: IShare.IUserInfo, prev: IShare.IUserInfo) {
    this.setUser(next);
    this.checkStatus();
  }

  /**
   * @description Check user status
   * @private
   * @returns {void}
   */
  private checkStatus(): void {
    if (!this.user) {
      this.isLogin = false;
      return;
    }
    if (!this.user.id) {
      this.isLogin = false;
      return;
    }
    const localStr = LocalStorageHelper.getWithExpiry(this.user.id);
    
    if (!localStr) {
      this.isLogin = false;
      return;
    }
    this.isLogin = true;
  }

  /**
   * @description Log out user
   * @public
   * @returns {Promise<unknown>}
   */
  async logOutUser(): Promise<unknown> {
    const localStrToken = LocalStorageHelper.getWithExpiry(this.user.id);
    if (typeof localStrToken !== 'string') return null;
    try {
      const result = await UsersApi.logOutUser(localStrToken);
      if (typeof result === 'undefined') {
        return ComponentHelper.alertMsg('Logout', 'Something went wrong', 'error');
      }
      if (result.status !== 'success') {
        return ComponentHelper.alertMsg('Logout', result.message, 'error');
      }
      this.isLogin = false;
      LocalStorageHelper.removeToken(this.user.id);
      return ComponentHelper
        .alertMsgWithoutIcon('Logout', 'Logout success')
        .then(() => {
          this.setUser(null);
        })
        .catch((err) => {
          throw new Error(err.message);
        })
        .finally(() => {
          this.$router.push('/login');
        });
    } catch (error) {
      return ComponentHelper.alertMsg('Logout', 'Something went wrong', 'error');
    }
  }
}
</script>
