import { customOptions } from 'nestjs-xion/swagger';
import { posix } from 'path';

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfig } from '#configs';
import { ModuleV1 } from '#v1';

import { AUTH_STRATEGY } from '#constants';

export function setup(app: INestApplication, { name, basePath }: AppConfig): void {
  const config = new DocumentBuilder()
    .setTitle(`${name} APIs`)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, AUTH_STRATEGY)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [ModuleV1],
    deepScanRoutes: true,
  });

  SwaggerModule.setup(posix.join(basePath, 'docs'), app, document, customOptions(name));
}
