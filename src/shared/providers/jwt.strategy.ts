import { Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { JwtPayload } from '../interfaces/jwt.interface';
import { cookieExtractor } from './jwt.extractor';
import { env } from '../env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      jwtFromRequest: cookieExtractor,
      secretOrKey: env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub || !payload.ver || !payload.rex) {
      throw new Error('Invalid token payload');
    }
    return payload;
  }
}
