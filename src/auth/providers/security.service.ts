import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class SecurityService {
  constructor(protected readonly jwtService: JwtService) {}

  public generate(payload: JwtPayload, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  public hash(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }
}
