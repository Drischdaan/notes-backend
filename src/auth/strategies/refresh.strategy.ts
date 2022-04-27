import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IAccountEntity } from "../../account/models/account.models";
import { AccountService } from "../../account/services/account.service";
import { TokenType } from "../models/token.models";
import * as bcrypt from "bcrypt";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {

  constructor(
    private readonly config: ConfigService,
    private readonly accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: config.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      passReqToCallback: true,
    });
  }

  public async validate(request: Request, payload: any) {
    if(payload.type !== TokenType.REFRESH)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const account: IAccountEntity = await this.accountService.getAccount(payload.uuid, false);
    if(account === undefined || account.refreshToken === null)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    const refreshToken: string = request.headers.authorization.replace('Bearer ', '').trim();
    if(await bcrypt.compare(refreshToken, account.refreshToken))
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    return account;
  }

}