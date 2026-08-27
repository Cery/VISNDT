import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

/**
 * Custom JWT extractor:
 * 1. Priority: explicit Authorization Bearer header.
 *    Each frontend sends its own token in the header (e.g. admin stores its
 *    access token in localStorage), which is immune to the HttpOnly cookie
 *    that is SHARED across localhost ports (cookies ignore ports). Relying on
 *    the cookie first caused cross-role 403: logging into web (buyer/supplier)
 *    overwrote the shared `access_token` cookie, and admin requests were then
 *    rejected by RolesGuard despite carrying a valid admin Bearer header.
 * 2. Fallback: HttpOnly cookie `access_token` (cookie-based clients such as web).
 */
const cookieAndBearerExtractor = (req: Request): string | null => {
  // Priority: Bearer header
  const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (bearer) {
    return bearer;
  }
  // Fallback: cookie
  return req?.cookies?.access_token ?? null;
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