import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import Profile from './modules/profile.module';
import * as IShare from '../shares/interfaces';

Vue.use(Vuex);

const store: StoreOptions<IShare.IState> = {
  modules: {
    Profile,
  },
};

export default new Vuex.Store<IShare.IState>(store);
