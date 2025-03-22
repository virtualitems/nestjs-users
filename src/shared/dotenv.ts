import * as dotenv from 'dotenv';

export const { parsed: env = {} } = dotenv.config();

if (process.env.BASE_URL === undefined) {
  throw new Error('BASE_URL is not defined in .env file');
}

if (process.env.JWT_EXPIRES_IN === undefined) {
  throw new Error('JWT_EXPIRES_IN is not defined in .env file');
}

if (process.env.JWT_SECRET === undefined) {
  throw new Error('JWT_SECRET is not defined in .env file');
}

if (process.env.LISTEN_TO === undefined) {
  throw new Error('LISTEN_TO is not defined in .env file');
}

if (process.env.MEDIA_STORAGE_PATH === undefined) {
  throw new Error('MEDIA_STORAGE_PATH is not defined in .env file');
}

if (process.env.NODE_ENV === undefined) {
  throw new Error('NODE_ENV is not defined in .env file');
}
