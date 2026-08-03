import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CsrfService {
  private readonly tokenLength = 32; // bytes

  /**
   * Generate a cryptographically random CSRF token.
   * Returns the raw hex token (sent to client).
   */
  generateToken(): string {
    return crypto.randomBytes(this.tokenLength).toString('hex');
  }

  /**
   * Hash a token for optional server-side storage.
   * Currently unused — we use double-submit cookie pattern.
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify a CSRF token.
   * Uses timing-safe comparison to prevent timing attacks.
   */
  verifyToken(token: string, expected: string): boolean {
    if (!token || !expected) return false;
    if (token.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  }
}