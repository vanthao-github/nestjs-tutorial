import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import Config, { AppConfig, SwaggerConfig } from '#configs';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  // Load configs
  const appConfig = config.get(Config.App) as AppConfig;
  const swaggerConfig = config.get(Config.Swagger) as SwaggerConfig;

  // Setup app global settings
  app.useLogger(appConfig.loggerLevels as LogLevel[]);
  app.enableCors(appConfig.cors);
  app.setGlobalPrefix(appConfig.basePath);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(bodyParser.json({ limit: '15mb' }));
  app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));

  // Setup Swagger service
  if (swaggerConfig.enable) {
    (await import('./services/swagger')).setup(app, appConfig);
  }
  await app.listen(appConfig.port, appConfig.host);
}
bootstrap().catch((error: unknown) => {
  throw error;
});
