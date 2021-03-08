import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import * as IShare from '../../shares/interfaces';

@Module({ namespaced: true, name: 'Profile' })
export default class Profile extends VuexModule {
  public user?: IShare.IUserInfo;

  @Mutation
  public setUser(userData: IShare.IUserInfo): void {
    this.user = userData;
  }

  @Action
  public updateUser(userData: IShare.IUserInfo): void {
    this.user = userData;
  }
}
