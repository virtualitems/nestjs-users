import { diskStorage } from 'multer';
import { env } from './shared/env';
import { resolve } from 'node:path';

export function filename(file: Express.Multer.File) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return uniqueSuffix + '-' + file.originalname;
}

export function destination(file: Express.Multer.File) {
  return resolve(env.MEDIA_STORAGE_PATH, filename(file));
}

export function multerDiskStorage(
  diskStorageDestination: string,
  maxFileSize?: number,
) {
  return {
    storage: diskStorage({
      destination: diskStorageDestination,
      filename: (req, file, cb) => {
        cb(null, filename(file));
      },
    }),
    limits: {
      fileSize: maxFileSize ?? 1024 * 1024 * 5, // 5MB
    },
  };
}
