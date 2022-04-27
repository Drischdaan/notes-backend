import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";
import { DatabaseType } from "typeorm";

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: config.get<string>('DATABASE_HOST', 'localhost'),
    port: config.get<number>('DATABASE_PORT', 3306),
    username: config.get<string>('DATABASE_USERNAME', 'root'),
    password: config.get<string>('DATABASE_PASSWORD'),
    database: config.get<string>('DATABASE_NAME', 'notes-app'),
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    retryAttempts: config.get<number>('DATABASE_RETRY_ATTEMPTS', 5),
    retryDelay: config.get<number>('DATABASE_RETRY_DELAY', 3000),
    synchronize: config.get<boolean>('DATABASE_SYNCHRONIZE', true),
  }),
  inject: [ConfigService],
};