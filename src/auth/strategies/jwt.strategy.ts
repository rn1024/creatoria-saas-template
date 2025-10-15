import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number; // user id
  username: string;
  roles?: string[];
  permissions?: string[];
  tenantId?: number;
  iat?: number;
  exp?: number;
}

/**
 * JWT 策略，对齐 RuoYi-Vue-Pro 的认证机制
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(
        'JWT_SECRET',
        'abcdefghijklmnopqrstuvwxyz123456789',
      ),
    });
  }

  /**
   * 验证 JWT payload
   */
  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
      tenantId: payload.tenantId,
    };
  }
}
