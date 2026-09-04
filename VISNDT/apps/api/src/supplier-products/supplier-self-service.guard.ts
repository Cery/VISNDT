import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

/**
 * 819 Permission Foundation — SupplierProduct Self-Service gate.
 *
 * Reuses the EXISTING identity/authorization stack (no second RBAC, no new claim):
 *   - authenticated (JwtAuthGuard runs first)
 *   - valid OrganizationMember of the authenticated organization (existing membership)
 *   - the authenticated organization is operationally a SUPPLIER (workspaceRole === 'SUPPLIER')
 *   - the organization has been explicitly ENABLED for SupplierProduct self-service
 *     by a Platform Admin (Organization.supplierProductManagementEnabled, opt-in default false)
 *
 * Denied for: unauthenticated, buyer orgs, non-members, and disabled supplier orgs.
 * org isolation is additionally enforced by the service (scope = user.organizationId).
 */
@Injectable()
export class SupplierSelfServiceGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Insufficient permissions');
    }
    if (!user.organizationId) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Reuse existing organization membership boundary.
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: user.organizationId,
          userId: user.id,
        },
      },
      select: { id: true },
    });
    if (!membership) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Supplier-only self-service (workspaceRole derived from existing org type).
    if (user.workspaceRole !== 'SUPPLIER') {
      throw new ForbiddenException(
        'Supplier product self-service is only available to supplier organizations',
      );
    }

    // Admin-controlled org-level enablement (opt-in).
    const org = await this.prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { id: true, supplierProductManagementEnabled: true },
    });
    if (!org || !org.supplierProductManagementEnabled) {
      throw new ForbiddenException(
        'Supplier product self-service is not enabled for this organization',
      );
    }

    return true;
  }
}