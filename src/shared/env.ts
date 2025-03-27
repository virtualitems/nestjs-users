import * as dotenv from 'dotenv';

export const { parsed: env = {} } = dotenv.config();

const keys = [
  'BASE_URL',
  'DATABASE_HOST',
  'DATABASE_NAME',
  'DATABASE_PASSWORD',
  'DATABASE_PORT',
  'DATABASE_USER',
  'JWT_EXPIRES_IN',
  'JWT_SECRET',
  'LISTEN_TO',
  'MEDIA_STORAGE_PATH',
  'NODE_ENV',
  'USER_ACTIVATION_TOKEN_EXPIRES_IN',
  'USER_ACTIVATION_TOKEN_SECRET',
  'USER_PASSWORD_RESET_TOKEN_EXPIRES_IN',
  'USER_PASSWORD_RESET_TOKEN_SECRET',
];

for (const key of keys) {
  if (!(key in env)) {
    throw new Error(`${key} is not defined in .env file`);
  }
}
