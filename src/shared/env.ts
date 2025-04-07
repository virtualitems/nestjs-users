import * as dotenv from 'dotenv';

export const { parsed: env = {} } = dotenv.config();

const keys = [
  'BASE_URL',
  'DATABASE_HOST',
  'DATABASE_NAME',
  'DATABASE_PASSWORD',
  'DATABASE_PORT',
  'DATABASE_USER',
  'JWT_COOKIE_MAX_AGE',
  'JWT_COOKIE_NAME',
  'JWT_EXPIRATION_TIME',
  'JWT_REFRESH_EXPIRATION_TIME',
  'JWT_SECRET',
  'LISTEN_TO',
  'MEDIA_STORAGE_PATH',
  'NODE_ENV',
  'PASSWORD_HASH_SALT_ROUNDS',
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
