import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../../account/services/account.service';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  let mockedAuthService = {

  };

  let mockedAccountService = {

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AuthController
      ],
      providers: [
        AuthService,
        AccountService,
      ]
    })
    .overrideProvider(AuthService).useValue(mockedAuthService)
    .overrideProvider(AccountService).useValue(mockedAccountService)
    .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
});