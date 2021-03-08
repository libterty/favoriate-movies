<template>
  <div class="Home"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {}
</script>

<style scoped>
.Home {
  height: calc(100% - 50px);
}
</style>
