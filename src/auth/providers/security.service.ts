import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../interfaces/jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityService {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  public generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN'),
    });
  }

  public hash(text: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(text, salt);
  }

  public compare(text: string, hash: string): boolean {
    return bcrypt.compareSync(text, hash);
  }
}
