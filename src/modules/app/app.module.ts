import Config, { load } from '#configs';
import { ModuleV1 } from '#modules/v1';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: load() }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.get(Config.Database) as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    ModuleV1,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
