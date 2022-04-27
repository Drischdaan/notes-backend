import { Injectable } from '@nestjs/common';
import { IAccountEntity } from '../../account/models/account.models';
import { AccountService } from '../../account/services/account.service';
import { AuthDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { TokensDto } from '../dtos/tokens.dto';
import { JwtService } from '@nestjs/jwt';
import { ITokenData, TokenType } from '../models/token.models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  public async validateAccount(dto: AuthDto): Promise<IAccountEntity> {
    const account: IAccountEntity = await this.accountService.getAccountByName(dto.username, false);
    if(account === undefined)
      return undefined;
    const compareResult: boolean = await bcrypt.compare(dto.password, account.password);
    if(compareResult)
      return account;
    return undefined;
  }

  public async invalidateTokens(account: IAccountEntity): Promise<void> {
    await this.accountService.updateTokens(account.uuid, undefined, undefined);
  }

  public async generateTokens(account: IAccountEntity): Promise<TokensDto> {
    const tokenData: ITokenData = { uuid: account.uuid, username: account.username, type: TokenType.ACCESS };
    const accessToken: string = this.generateToken(tokenData, 'ACCESS_TOKEN_SECRET', 'ACCESS_TOKEN_EXPIRATION');
    tokenData.type = TokenType.REFRESH;
    const refreshToken: string = this.generateToken(tokenData, 'REFRESH_TOKEN_SECRET', 'REFRESH_TOKEN_EXPIRATION');
    await this.accountService.updateTokens(account.uuid, accessToken, refreshToken);
    return { accessToken, refreshToken };
  }

  private generateToken(tokenData: ITokenData, secret: string, expiresIn: string): string {
    return this.jwtService.sign(tokenData, { 
      secret: this.config.get<string>(secret), 
      expiresIn: this.config.get<string>(expiresIn),
    });
  }

}