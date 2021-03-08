import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Profile from './modules/profile.module';
import * as IShare from '../shares/interfaces';

Vue.use(Vuex);

const store: StoreOptions<IShare.IState> = {
  modules: {
    Profile,
  },
  plugins: [createPersistedState()],
};

export default new Vuex.Store<IShare.IState>(store);
