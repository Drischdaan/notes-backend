import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IAccountEntity } from "../../account/models/account.models";
import { AccountService } from "../../account/services/account.service";
import { ITokenData, TokenType } from "../models/token.models";
import * as bcrypt from "bcrypt";
import { Request } from "express";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {

  constructor(
    private readonly config: ConfigService,
    private readonly accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: config.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      passReqToCallback: true,
    });
  }

  public async validate(request: Request, payload: ITokenData) {
    if(payload.type !== TokenType.ACCESS)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const account: IAccountEntity = await this.accountService.getAccount(payload.uuid, false);
    if(account === undefined || account.accessToken === null)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const accessToken: string = request.headers.authorization.replace('Bearer ', '').trim();
    if(await bcrypt.compare(accessToken, account.accessToken))
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    return account;
  }

}