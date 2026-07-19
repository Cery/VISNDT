/**
 * Unified business context passed from Controller to Service layer.
 *
 * Populated from JWT (via @CurrentUser()) and optionally enriched
 * with the resolved OrganizationMember role.
 *
 * M7.1 — Organization Context Interface
 * Frozen: do not add DB fields, do not extend JWT payload.
 */
export interface OrganizationContext {
  /** User.id from JWT sub */
  userId: string;
  /** Primary organization from JWT organizationId */
  organizationId: string;
  /** Resolved role from OrganizationMember (optional, populated by RolesGuard or service) */
  role?: string;
}

/**
 * Creates an OrganizationContext from the AuthRequest user object.
 *
 * @param user — the user object populated by JwtStrategy.validate()
 * @param role — optional resolved role from OrganizationMember
 */
export function toOrganizationContext(
  user: { id: string; organizationId?: string | null },
  role?: string,
): OrganizationContext {
  return {
    userId: user.id,
    organizationId: user.organizationId ?? '',
    role,
  };
}