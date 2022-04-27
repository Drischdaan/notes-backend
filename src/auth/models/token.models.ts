export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface ITokenData {
  uuid: string;
  username: string;
  type: TokenType;
}