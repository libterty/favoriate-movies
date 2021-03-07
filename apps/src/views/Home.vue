<template>
  <div class="home"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MoivessApi from '../movies/request';

@Component({})
export default class Home extends Vue {
  async mounted() {
    const result = await MoivessApi.getAllMovies();
    console.log('reuslt: ', result);
  }
}
</script>
