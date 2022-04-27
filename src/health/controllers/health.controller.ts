import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {

  constructor(
    private readonly health: HealthCheckService,
    private readonly databaseHealth: TypeOrmHealthIndicator,
    private readonly httpHealth: HttpHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  public async getHealthCheck() {
    return this.health.check([
      async () => await this.databaseHealth.pingCheck('database', { timeout: 5000 }),
      async () => await this.httpHealth.pingCheck('frontend', this.config.get<string>('FRONTEND_URL', 'http://localhost:4200')),
    ]);
  }

}