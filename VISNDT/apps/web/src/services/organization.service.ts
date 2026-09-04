/**
 * Organization Service Layer
 *
 * Encapsulates Organization API calls for page-level consumption.
 * Underlying HTTP calls are delegated to lib/api/organizations.ts.
 */
import { getOrganization as fetchOrganization, updateOrganization as apiUpdateOrganization, getOrganizationMembers as apiGetOrganizationMembers, createOrganizationInvitation as apiCreateInvitation, updateOrganizationMemberRole as apiUpdateMemberRole, type OrganizationMemberItem, type CreateInvitationInput } from '@/lib/api/organizations';
import type { Organization } from '@/types/organization';

/**
 * Get a single organization by ID (public info).
 * GET /organizations/:id
 */
export async function getOrganization(id: string): Promise<Organization> {
  return fetchOrganization(id);
}

/**
 * Update organization information (self-service for members).
 * PATCH /organizations/:id
 * Only allows name, type for non-admin users.
 */
export async function updateOrganization(
  id: string,
  data: { name?: string; type?: string },
): Promise<Organization> {
  return apiUpdateOrganization(id, data);
}

/**
 * List members of an organization.
 * GET /organizations/:id/members
 * M35 Supplier Multi-user — 复用小组成员承载实现组织作用域可见性。
 */
export async function getOrganizationMembers(id: string): Promise<OrganizationMemberItem[]> {
  return apiGetOrganizationMembers(id);
}

/**
 * Create a user invitation for the caller's organization（仅 ADMIN）。
 * M35 Supplier Multi-user Invitation —— 复用既有邀请架构的最小 Web 接入。
 */
export async function createInvitation(input: CreateInvitationInput) {
  return apiCreateInvitation(input);
}

/**
 * Change an existing member's role（仅 ADMIN；复用 OrganizationMember 现有 role 语义）。
 * M35 Basic Role Management —— 不建立第二套权限系统。
 */
export async function updateMemberRole(
  id: string,
  memberId: string,
  role: 'ADMIN' | 'MEMBER',
): Promise<OrganizationMemberItem> {
  return apiUpdateMemberRole(id, memberId, role);
}