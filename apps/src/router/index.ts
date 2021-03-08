import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Movies from '../components/Movies.vue';
import CreateMovie from '../components/CreateMovie.vue';
import MovieDetail from '../components/MovieDetail.vue';
import UpdateMovie from '../components/UpdateMovie.vue';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
  },
  {
    path: '/movies/create',
    name: 'CreateMovie',
    component: CreateMovie,
  },
  {
    path: '/movies/:id',
    name: 'MovieDetail',
    component: MovieDetail,
  },
  {
    path: '/movies/:id/edit',
    name: 'UpdateMovie',
    component: UpdateMovie,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
