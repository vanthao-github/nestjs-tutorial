export = {
  name: String(process.env.APP_NAME),
  version: String(process.env.APP_VERSION),
  host: String(process.env.APP_HOST),
  port: Number(process.env.APP_PORT),
  basePath: String(process.env.APP_BASE_PATH),
  jwt: {
    secret: String(process.env.APP_JWT_SECRET),
    signOptions: {
      expiresIn: Number(process.env.APP_JWT_ACCESS_TOKEN_EXPIRES),
    },
  },
  cors: {
    origin: process.env.APP_CORS_ORIGIN?.split(',').map((address) => new RegExp(address, 'u')),
    credentials: true,
    preflightContinue: false,
    methods: ['HEAD', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    exposedHeaders: ['Content-Length', 'Content-Range', 'X-Content-Range'],
    allowedHeaders: [
      'Origin',
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'Range',
      'token',
      'crossdomain',
    ],
  },
  loggerLevels: process.env.APP_LOGGER_LEVEL?.split(',') || ['error', 'warn'],
};
