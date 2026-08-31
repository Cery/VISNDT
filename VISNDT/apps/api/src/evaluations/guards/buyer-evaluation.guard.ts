import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthRequest } from '../../auth/interfaces/auth-request.interface';

/**
 * M34.6 Evaluation Guard — verifies the authenticated user acts as a BUYER.
 *
 * Evaluation State is Buyer-owned (ADR-M34-13 Option B). This guard uses the
 * `workspaceRole` resolved from the user's Organization type (see AuthService),
 * NOT the OrganizationMember role, so a MEMBER within a BUYER organization is
 * entitled to evaluate. Supplier / Admin are rejected for Buyer-Evaluation access.
 *
 * Composition: request flow = JwtAuthGuard (authenticate) -> BuyerGuard (authorize).
 */
@Injectable()
export class BuyerEvaluationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (user.workspaceRole !== 'BUYER') {
      throw new ForbiddenException(
        'Evaluation requires a BUYER workspace role (organization type = BUYER)',
      );
    }

    return true;
  }
}