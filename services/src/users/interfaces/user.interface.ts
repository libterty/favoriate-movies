import * as EUser from '../../shares/enums';

export interface IUserInfo {
  id?: string;
  role?: string;
  username?: string;
  licence?: string;
  expiredDate?: string;
  [futureKey: string]: any;
}

export interface IFindOne {
  id?: string;
  username?: any;
  status?: boolean;
  role?: EUser.EUserRole;
  [futureKey: string]: any;
}
