import * as bcryptjs from 'bcryptjs';

import { Injectable } from '@nestjs/common';

import { env } from '../env';

@Injectable()
export class HashingService {
  constructor() {}

  public password(text: string): string {
    const rounds = Number(env.PASSWORD_HASH_SALT_ROUNDS);
    const salt = bcryptjs.genSaltSync(rounds);
    return bcryptjs.hashSync(text, salt);
  }

  public compare(text: string, hash: string): boolean {
    return bcryptjs.compareSync(text, hash);
  }
}
