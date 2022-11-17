import { readdirSync } from 'fs';
import { registerAs } from '@nestjs/config';

export function load(): any[] {
  return readdirSync(__dirname)
    .filter((file) => !file.includes('index.js'))
    .map((file) => registerAs(file.replace('.js', '').toUpperCase(), () => import(`./${file}`)));
}

export type AppConfig = typeof import('./app');
export type DatabaseConfig = typeof import('./database');
export type SwaggerConfig = typeof import('./swagger');

enum Config {
  App = 'APP',
  Database = 'DATABASE',
  Swagger = 'SWAGGER',
}

export default Config;
