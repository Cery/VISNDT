import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRequest } from '../interfaces/auth-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Insufficient permissions');
    }

    if (!user.organizationId) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: user.organizationId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const hasRole = requiredRoles.some((role) => membership.role === role);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}