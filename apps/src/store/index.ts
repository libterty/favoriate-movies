import Vue from 'vue';
import Vuex from 'vuex';
import * as IShare from '../shares/interfaces';

Vue.use(Vuex);

export default new Vuex.Store<IShare.IState>({
  state: {
    user: {},
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
