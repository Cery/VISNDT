import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { InvitationService } from './invitation.service';
import { RefreshTokenService } from './refresh-token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly invitationService: InvitationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(dto: RegisterDto) {
    // Validate invitation token
    if (!dto.inviteToken) {
      throw new UnauthorizedException('Invitation token is required');
    }

    const invitation = await this.invitationService.validateInvitation(dto.inviteToken);
    if (!invitation) {
      throw new UnauthorizedException('Invalid or expired invitation token');
    }

    // Verify email matches invitation
    if (invitation.email !== dto.email) {
      throw new UnauthorizedException('Email does not match invitation');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        organizationId: invitation.organizationId,
      },
    });

    // Create OrganizationMember record
    await this.prisma.organizationMember.create({
      data: {
        organizationId: invitation.organizationId,
        userId: user.id,
        role: invitation.role,
      },
    });

    // Consume invitation
    await this.invitationService.consumeInvitation(dto.inviteToken);

    const accessToken = this.generateToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
    });

    const refreshToken = await this.refreshTokenService.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organizationId,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
    });

    const refreshToken = await this.refreshTokenService.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organizationId,
      },
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   * Implements token rotation: old refresh token is revoked, new one is issued.
   */
  async refreshTokens(rawRefreshToken: string) {
    const tokenRecord = await this.refreshTokenService.validateRefreshToken(rawRefreshToken);

    // Revoke old refresh token (rotation)
    await this.refreshTokenService.revokeRefreshToken(rawRefreshToken);

    const user = tokenRecord.user;

    const accessToken = this.generateToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
    });

    const refreshToken = await this.refreshTokenService.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organizationId,
      },
    };
  }

  /**
   * Logout: revoke the refresh token.
   */
  async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      await this.refreshTokenService.revokeRefreshToken(rawRefreshToken);
    }
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
    };
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}