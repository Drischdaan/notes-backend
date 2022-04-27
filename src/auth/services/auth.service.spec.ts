import faker from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { IAccountEntity } from '../../account/models/account.models';
import { AccountService } from '../../account/services/account.service';
import { configOptions } from '../../_config/config';
import { jwtOptions } from '../../_config/jwt.config';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  let accounts: IAccountEntity[] = [];
  for(let i = 0; i < 10; i++) {
    accounts.push({
      uuid: faker.datatype.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      avatar: faker.internet.avatar(),
      accessToken: undefined,
      refreshToken: undefined,
    });
  }

  let mockedAccountService = {
    getAccountByName: jest.fn().mockImplementation(async (username: string): Promise<IAccountEntity> => {
      const account: IAccountEntity = accounts.find(account => account.username === username);
      if(account !== undefined)
        account.password = bcrypt.hashSync(account.password, 10);
      return account;
    }),
    updateTokens: jest.fn().mockImplementation(async (uuid: string, accessToken: string, refreshToken: string): Promise<void> => {
      const account: IAccountEntity = accounts.find(account => account.uuid === uuid);
      if(accessToken !== undefined)
        account.accessToken = await bcrypt.hash(accessToken, 10);
      if(refreshToken !== undefined)
        account.refreshToken = await bcrypt.hash(refreshToken, 10);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: faker.datatype.uuid(),
          signOptions: { expiresIn: '1m' },
        }),
        ConfigModule.forRoot(configOptions),
      ],
      providers: [
        AuthService,
        AccountService,
      ],
    }).overrideProvider(AccountService).useValue(mockedAccountService).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAccount', () => {
    it('should return undefined if account is not found', async () => {
      const result = await service.validateAccount({ username: 'test', password: 'test' });
      expect(result).toBeUndefined();
    });

    it('should return account if account is found', async () => {
      const result = await service.validateAccount({ username: accounts[0].username, password: accounts[0].password });
      expect(result).toEqual(accounts[0]);
    });

    it('should return undefined if password is invalid', async () => {
      const result = await service.validateAccount({ username: accounts[0].username, password: 'test' });
      expect(result).toBeUndefined();
    });
  });

  describe('invalidateTokens', () => {
    it('should update tokens to undefined', async () => {
      await service.invalidateTokens(accounts[0]);
      expect(mockedAccountService.updateTokens).toBeCalledWith(accounts[0].uuid, undefined, undefined);
    });
  });

  describe('generateTokens', () => {
    it('should generate access token', async () => {
      const result = await service.generateTokens(accounts[0]);
      expect(result.accessToken).toBeDefined();
    });

    it('should generate refresh token', async () => {
      const result = await service.generateTokens(accounts[0]);
      expect(result.refreshToken).toBeDefined();
    });

    it('should update tokens', async () => {
      const result = await service.generateTokens(accounts[0]);
      expect(mockedAccountService.updateTokens).toBeCalledWith(accounts[0].uuid, result.accessToken, result.refreshToken);
    });
  });
  
});