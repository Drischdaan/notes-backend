import { Test, TestingModule } from '@nestjs/testing';
import { IPaginationOptions } from '../../_common/pagination/models/pagination.models';
import { AccountCreateDto } from '../dtos/create.dto';
import { IAccountEntity } from '../models/account.models';
import { AccountService } from '../services/account.service';
import { AccountController } from './account.controller';

import faker from '@faker-js/faker';

describe('AccountController', () => {
  let controller: AccountController;

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

  let mockedAccountService = {
    getPaginated: jest.fn().mockImplementation((where: any, pagination: IPaginationOptions) => accounts.slice(0, pagination.limit)),
    getAccount: jest.fn().mockImplementation((uuid: string) => accounts.find(account => account.uuid === uuid)),
    createAccount: jest.fn().mockImplementation((dto: AccountCreateDto) => accounts.push({ 
      uuid: faker.datatype.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      avatar: faker.internet.avatar(),
    })),
    updateAccount: jest.fn().mockImplementation((uuid: string, dto: any) => {
      const account = accounts.find(account => account.uuid === uuid);
      Object.assign(account, dto);
      return account;
    }),
    deleteAccount: jest.fn().mockImplementation((uuid: string) => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    }).overrideProvider(AccountService).useValue(mockedAccountService).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all accounts', async () => {
    const result: IAccountEntity[] = await controller.getAccounts({});
    expect(result.length).toBe(accounts.length);
    expect(result).toEqual(accounts);
  });

  it('should return a single account', async () => {
    const result: IAccountEntity = await controller.getAccount(accounts[0].uuid);
    expect(result).toEqual(accounts[0]);
  });

});