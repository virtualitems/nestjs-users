import { Request } from 'express';
import { diskStorage } from 'multer';

function filename(
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + '-' + file.originalname;
  callback(null, filename);
}

export function multerDiskStorage(
  diskStorageDestination: string,
  maxFileSize?: number,
) {
  return {
    storage: diskStorage({
      destination: diskStorageDestination,
      filename: filename,
    }),
    limits: {
      fileSize: maxFileSize ?? 1024 * 1024 * 5, // 5MB
    },
  };
}
