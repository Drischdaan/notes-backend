import { CacheModuleAsyncOptions } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const cacheOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    ttl: configService.get<number>("CACHE_TTL", 5),
    max: configService.get<number>("CACHE_MAX", 100),
    isGlobal: true,
  }),
  inject: [ConfigService],
};