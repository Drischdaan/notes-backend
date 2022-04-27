import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get<ConfigService>(ConfigService);
  const port: number = config.get('PORT', 3001);

  await app.listen(port);
  Logger.log(`🚀 Server running on port ${port}`, 'NestApplication');
}
bootstrap();