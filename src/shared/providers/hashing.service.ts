import * as bcryptjs from 'bcryptjs';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashingService {
  constructor(protected readonly configService: ConfigService) {}

  public encrypt(text: string): string {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(text, salt);
  }

  public compare(text: string, hash: string): boolean {
    return bcryptjs.compareSync(text, hash);
  }
}
