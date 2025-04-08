import { Request } from 'express';
import { env } from '../env';

export function cookieExtractor(req: Request): string | null {
  if (req && req.cookies) {
    return (req.cookies[env.JWT_COOKIE_NAME] as string) ?? null;
  }
  return null;
}
