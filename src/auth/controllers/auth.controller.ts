import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AccountCreateDto } from '../../account/dtos/create.dto';
import { IAccountEntity } from '../../account/models/account.models';
import { AccountService } from '../../account/services/account.service';
import { CurrentAccount } from '../decorators/account.decorator';
import { TokensDto } from '../dtos/tokens.dto';
import { AccessTokenGuard } from '../guards/access.guard';
import { LocalGuard } from '../guards/local.guard';
import { RefreshTokenGuard } from '../guards/refresh.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
  ) {}

  @Post('register')
  public async registerLocal(
    @Body() dto: AccountCreateDto,
  ): Promise<IAccountEntity> {
    return await this.accountService.createAccount(dto);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  public async loginLocal(
    @CurrentAccount() account: IAccountEntity
  ): Promise<TokensDto> {
    return this.authService.generateTokens(account);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  public async refreshTokens(
    @Query('refreshToken') refreshToken: string,
    @CurrentAccount() account: IAccountEntity
  ): Promise<TokensDto> {
    return this.authService.generateTokens(account);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  public async logout(
    @CurrentAccount() account: IAccountEntity
  ): Promise<void> {
    await this.authService.invalidateTokens(account);
  }

}