import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { PaginationDto } from '../../_common/pagination/dtos/pagination.dto';
import { AccountCreateDto } from '../dtos/create.dto';
import { AccountUpdateDto } from '../dtos/update.dto';
import { IAccountEntity } from '../models/account.models';
import { AccountService } from '../services/account.service';

@Controller('accounts')
export class AccountController {

  constructor(
    private readonly accountService: AccountService,
  ) {}

  @Get()
  public async getAccounts(
    @Query() pagination: PaginationDto
  ): Promise<IAccountEntity[]> {
    return await this.accountService.getPaginated(undefined, pagination);
  }

  @Get(':uuid')
  public async getAccount(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<IAccountEntity> {
    return await this.accountService.getAccount(uuid);
  }

  @Post()
  public async createAccount(
    @Body() dto: AccountCreateDto
  ): Promise<IAccountEntity> {
    return await this.accountService.createAccount(dto);
  }

  @Post(':uuid')
  public async updateAccount(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: AccountUpdateDto,
  ): Promise<IAccountEntity> {
    return await this.accountService.updateAccount(uuid, dto);
  }

  @Delete(':uuid')
  public async deleteAccount(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<void> {
    return await this.accountService.deleteAccount(uuid);
  }

}