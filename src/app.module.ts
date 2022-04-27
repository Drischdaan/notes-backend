import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './_config/config';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}