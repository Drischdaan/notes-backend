import { IApiEntity } from "../../_common/models/entity.models";

export interface IAccount {
  username: string;
  password: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}

export interface IAccountEntity extends IApiEntity, IAccount {
  
}