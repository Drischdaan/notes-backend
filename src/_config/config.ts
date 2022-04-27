import { ConfigModuleOptions } from "@nestjs/config";

export const configOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
}