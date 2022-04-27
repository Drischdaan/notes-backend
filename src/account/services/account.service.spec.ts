import faker from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AccountCreateDto } from '../dtos/create.dto';
import { AccountEntity } from '../entities/account.entity';
import { IAccountEntity } from '../models/account.models';
import { AccountRepository } from '../repositories/account.repository';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  let accounts: IAccountEntity[] = [];
  for(let i = 0; i < 10; i++) {
    accounts.push({
      uuid: faker.datatype.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      avatar: faker.internet.avatar(),
    });
  }

  let mockedAccountRepository = {
    find: jest.fn().mockImplementation((query: FindManyOptions<AccountEntity>) => accounts.slice(0, query.take)),
    findOne: jest.fn().mockImplementation((query: FindOneOptions<AccountEntity>) => accounts.find(account => account.uuid === (<any>query.where).uuid)),
    create: jest.fn().mockImplementation((dto: AccountCreateDto) => {
      const account: IAccountEntity = {
        uuid: faker.datatype.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        username: dto.username,
        password: dto.password,
        avatar: faker.internet.avatar(),
      };
      return account;
    }),
    save: jest.fn().mockImplementation((account: AccountEntity) => {
      accounts.push(account);
      return account;
    }),
    update: jest.fn().mockImplementation((query: { uuid: string }, dto: any) => {
      const account = accounts.find(account => account.uuid === query.uuid);
      Object.assign(account, dto);
      return account;
    }),
    delete: jest.fn().mockImplementation((uuid: string) => { accounts.splice(accounts.findIndex(account => account.uuid === uuid), 1); }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, AccountRepository],
    }).overrideProvider(AccountRepository).useValue(mockedAccountRepository).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all accounts', async () => {
    const result: IAccountEntity[] = await service.getPaginated();
    expect(result.length).toBe(accounts.length);
    expect(result).toEqual(accounts);
  });

  it('should return paginated list of accounts', async () => {
    const result: IAccountEntity[] = await service.getPaginated(undefined, { limit: 5 });
    expect(result.length).toBe(5);
    expect(result).toEqual(accounts.slice(0, 5));
  });

  it('should return one account', async () => {
    const result: IAccountEntity = await service.getAccount(accounts[0].uuid);
    expect(result).toEqual(accounts[0]);
  });

  it('should create an account', async () => {
    const result: IAccountEntity = await service.createAccount(new AccountCreateDto());
    expect(result).toEqual(accounts[accounts.length - 1]);
  });

  it('should update an account', async () => {
    const result: IAccountEntity = await service.updateAccount(accounts[0].uuid, { username: 'newUsername' });
    expect(result).toEqual(accounts[0]);
  });

  it('should delete an account', async () => {
    const length: number = accounts.length;
    await service.deleteAccount(accounts[0].uuid);
    expect(accounts.length).toBe(length - 1);
  });

});