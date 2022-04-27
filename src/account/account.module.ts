import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from './repositories/account.repository';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountRepository,
    ]),
  ],
  providers: [
    AccountService,
  ],
  controllers: [
    AccountController,
  ],
  exports: [
    AccountService,
  ]
})
export class AccountModule {}