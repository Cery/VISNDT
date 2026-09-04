import { Prisma } from '@prisma/client';

/**
 * PublicUserProjection
 *
 * The ONLY safe set of User scalar fields allowed in any public API response.
 * Explicit allow-list: future fields added to the User model will NOT
 * automatically become visible — they must be deliberately added here.
 *
 * CRITICAL: `passwordHash` (and any credential material) must never appear
 * in this projection. A bcrypt hash must never be part of a public DTO.
 */
export const PUBLIC_USER_SELECT = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  status: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
});