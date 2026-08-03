import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CsrfService } from './csrf.service';

/**
 * CSRF middleware using Double Submit Cookie pattern.
 *
 * Validates that X-CSRF-Token header matches csrf_token cookie
 * for all state-changing requests (POST, PUT, PATCH, DELETE).
 *
 * Excluded:
 *   - GET, HEAD, OPTIONS
 *   - Auth endpoints (login, register, refresh) — they set cookies
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private readonly csrfService: CsrfService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Skip safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Skip auth endpoints that set cookies
    const path = req.path;
    if (
      path === '/api/v1/auth/login' ||
      path === '/api/v1/auth/register' ||
      path === '/api/v1/auth/refresh'
    ) {
      return next();
    }

    // CSRF token validation
    const headerToken = req.headers['x-csrf-token'] as string | undefined;
    const cookieToken = req.cookies?.['csrf_token'] as string | undefined;

    if (!headerToken) {
      throw new ForbiddenException('CSRF token missing in X-CSRF-Token header');
    }

    if (!cookieToken) {
      throw new ForbiddenException('CSRF token missing in csrf_token cookie');
    }

    if (!this.csrfService.verifyToken(headerToken, cookieToken)) {
      throw new ForbiddenException('CSRF token mismatch');
    }

    next();
  }
}