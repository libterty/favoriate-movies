<template>
  <div class="footer">
    <v-col
      class="blue-grey py-4 text-center white--text"
      cols="12"
    >
      © {{ new Date().getFullYear() }} —
      <strong>Favorite Movies | All Rights Reserved.</strong>
    </v-col>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Footer extends Vue {
  public icons: string[] = [
    'fab fa-facebook',
    'fab fa-twitter',
    'fab fa-google-plus',
    'fab fa-linkedin',
    'fab fa-instagram',
  ];
}
</script>

<style scoped>
.footer {
  height: 50px;
  background-color: #17a2b8;
}
</style>
