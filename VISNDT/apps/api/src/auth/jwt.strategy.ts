import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

/**
 * Custom JWT extractor:
 * 1. Priority: HttpOnly cookie `access_token`
 * 2. Fallback: Authorization Bearer header (backward compatibility)
 */
const cookieAndBearerExtractor = (req: Request): string | null => {
  // Priority: cookie
  if (req?.cookies?.access_token) {
    return req.cookies.access_token;
  }
  // Fallback: Bearer token
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: cookieAndBearerExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateUser(payload);
  }
}