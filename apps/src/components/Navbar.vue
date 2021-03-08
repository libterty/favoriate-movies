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
          <b-dropdown-item v-if="!isLogin" href="/login">Sign In</b-dropdown-item>
          <b-dropdown-item v-if="isLogin" href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import * as IShare from '../shares/interfaces';

const profile = namespace('Profile');

@Component
export default class Navbar extends Vue {
  // state area
  public isLogin: boolean = false;

  // Vuex Area
  @profile.State
  public user!: IShare.IUserInfo;

  mounted() {
    if (this.user && this.user.username) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }
}
</script>
