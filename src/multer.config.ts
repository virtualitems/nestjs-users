import { join } from 'node:path';
import { Request } from 'express';
import { diskStorage } from 'multer';

export const uploadPath = join(__dirname, '..', 'media');

export const diskStorageConfiguration = {
  destination: uploadPath,
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + '-' + file.originalname;
    callback(null, filename);
  },
};

export const multerConfiguration = {
  storage: diskStorage(diskStorageConfiguration),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
};
