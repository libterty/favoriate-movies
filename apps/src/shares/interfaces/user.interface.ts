import { ActionTree, GetterTree, ModuleTree, MutationTree } from 'vuex';
import Profile from '../../store/modules/profile.module';
import * as EShare from '../enums';
import * as IShare from './index';

interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: ActionTree<S, R>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<R>;
}
export interface IUser {
  id: string;
  role: EShare.EUserRole;
  username: string;
  status: boolean;
  rateMovies: IShare.IMovie[];
  contributings: IShare.IMovie[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInfo {
  id?: string;
  role?: string;
  username?: string;
  licence?: string;
  expiredDate?: string;
  [futureKey: string]: any;
}

export interface IState {
  user?: IUserInfo;
  modules?: {
    Profile: Profile,
  }
}

export interface IProfileState {
  user?: IUserInfo;
  error: boolean;
}