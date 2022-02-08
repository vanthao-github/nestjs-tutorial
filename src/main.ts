import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LogLevel, ValidationPipe } from '@nestjs/common';

import dotenv from 'dotenv';

import { AppModule } from '#app/app.module';
import Config, { AppConfig, SwaggerConfig } from '#configs';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Load configs
  const appConfig = config.get(Config.App) as AppConfig;
  const swaggerConfig = config.get(Config.Swagger) as SwaggerConfig;

  // setup app global settings

  app.useLogger(appConfig.loggerLevels as LogLevel[]);
  app.enableCors(appConfig.cors);
  app.setGlobalPrefix(appConfig.basePath);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Setup Swagger service
  if (swaggerConfig.enable) {
    (await import('./services/swagger')).setup(app, appConfig);
  }

  // Laynch app
  await app.listen(appConfig.port, appConfig.host);
}
//Explicitly throw error
bootstrap().catch((error: unknown) => { throw error});
