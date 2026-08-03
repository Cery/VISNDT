import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.refreshExpiresIn = parseInt(
      configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '604800', // 7 days
      10,
    );
  }

  /**
   * Create a new refresh token and store its hash in the database.
   * Returns the raw token to be sent to the client (via HttpOnly cookie).
   */
  async createRefreshToken(userId: string): Promise<string> {
    // Generate 64 random bytes → 128 hex chars
    const rawToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    const expiresAt = new Date(Date.now() + this.refreshExpiresIn * 1000);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });

    return rawToken;
  }

  /**
   * Validate a raw refresh token.
   * Returns the token record (with user) if valid, or throws.
   */
  async validateRefreshToken(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);

    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            organizationId: true,
          },
        },
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (token.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    return token;
  }

  /**
   * Revoke a single refresh token (used during logout).
   */
  async revokeRefreshToken(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Revoke all refresh tokens for a user (e.g., on password change).
   */
  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Delete expired tokens (cleanup — can be called by a cron job).
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return result.count;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}