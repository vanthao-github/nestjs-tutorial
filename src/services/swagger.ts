import { customOptions } from 'nestjs-xion/swagger';
import { posix } from 'path';

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfig } from 'src/configs';
import { V1 } from '../modules/v1';

export function setup(app: INestApplication, { name, basePath }: AppConfig): void {
  const config = new DocumentBuilder().setTitle(`${name} APIs`).addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' });

  SwaggerModule.setup(posix.join(basePath, 'doc'), app, SwaggerModule.createDocument(app, config.build(), {
    include: [V1], deepScanRoutes: true,
  }), customOptions(name),)
}