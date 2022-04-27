import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '../../_common/pagination/services/pagination.service';
import { AccountCreateDto } from '../dtos/create.dto';
import { AccountUpdateDto } from '../dtos/update.dto';
import { AccountEntity } from '../entities/account.entity';
import { IAccountEntity } from '../models/account.models';
import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class AccountService extends PaginationService<AccountEntity> {

  constructor(
    @InjectRepository(AccountRepository) private readonly accountRepository: AccountRepository,
  ) {
    super(accountRepository);
  }

  public async getAccount(uuid: string): Promise<IAccountEntity> {
    const account: IAccountEntity = await this.accountRepository.findOne({ where: { uuid } });
    if(account === undefined)
      throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
    return account;
  }

  public async createAccount(dto: AccountCreateDto): Promise<IAccountEntity> {
    let account: IAccountEntity = await this.accountRepository.findOne({ where: { username: dto.username } });
    if(account !== undefined)
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    account = await this.accountRepository.create(dto);
    account = await this.accountRepository.save(account);
    return account;
  }

  public async updateAccount(uuid: string, dto: AccountUpdateDto): Promise<IAccountEntity> {
    const account: IAccountEntity = await this.getAccount(uuid);
    if(account === undefined)
      throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
    await this.accountRepository.update({ uuid }, dto);
    Object.assign(account, dto);
    return account;
  }

  public async deleteAccount(uuid: string): Promise<void> {
    const account: IAccountEntity = await this.getAccount(uuid);
    await this.accountRepository.delete(uuid);
  }

}