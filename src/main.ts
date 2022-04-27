import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get<ConfigService>(ConfigService);
  const port: number = config.get('PORT', 3001);

  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });
  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(`🚀 Server running on port ${port}`, 'NestApplication');
}
bootstrap();