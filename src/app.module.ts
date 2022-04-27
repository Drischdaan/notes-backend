import { CacheModule, ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cacheOptions } from './_config/cache.config';
import { configOptions } from './_config/config';
import { typeormConfig } from './_config/typeorm.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    CacheModule.registerAsync(cacheOptions),
    TypeOrmModule.forRootAsync(typeormConfig),
    HealthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}