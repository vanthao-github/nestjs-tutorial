import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { V1 } from '../v1';
import Config, { load } from '#configs';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: load() }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: ':',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get(Config.Database) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    V1,
  ],
  controllers: [AppController],
})

export class AppModule {}