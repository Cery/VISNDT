import {
  Injectable,
  BadRequestException,
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

type WorkspaceRole = 'SUPPLIER' | 'BUYER' | null;

interface AuthUserContext {
  id: string;
  email: string;
  name: string | null;
  organizationId: string | null;
  organization: {
    id: string;
    name: string;
    type: string;
  } | null;
  organizationMember: {
    role: string;
  } | null;
  workspaceRole: WorkspaceRole;
}

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
      throw new BadRequestException('注册需要邀请码，请联系管理员获取。');
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
    const authUser = await this.buildAuthUser(user.id);

    return {
      accessToken,
      refreshToken,
      user: authUser!,
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
    const authUser = await this.buildAuthUser(user.id);

    return {
      accessToken,
      refreshToken,
      user: authUser!,
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
    const authUser = await this.buildAuthUser(user.id);

    return {
      accessToken,
      refreshToken,
      user: authUser!,
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
      select: { id: true },
    });
    if (!user) return null;

    return this.buildAuthUser(payload.sub);
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private async buildAuthUser(userId: string): Promise<AuthUserContext | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const organizationMember = user.organizationId
      ? await this.prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: user.organizationId,
              userId: user.id,
            },
          },
          select: {
            role: true,
          },
        })
      : null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            type: user.organization.type,
          }
        : null,
      organizationMember: organizationMember
        ? {
            role: organizationMember.role,
          }
        : null,
      workspaceRole: this.resolveWorkspaceRole(user.organization?.type ?? null),
    };
  }

  private resolveWorkspaceRole(organizationType: string | null): WorkspaceRole {
    if (!organizationType) {
      return null;
    }

    if (
      organizationType === 'SUPPLIER' ||
      organizationType === 'MANUFACTURER' ||
      organizationType === 'DISTRIBUTOR'
    ) {
      return 'SUPPLIER';
    }

    if (organizationType === 'BUYER') {
      return 'BUYER';
    }

    return null;
  }
}
