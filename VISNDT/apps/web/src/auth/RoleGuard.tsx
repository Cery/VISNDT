'use client';

import { type ReactNode } from 'react';
import { useAuth } from './AuthProvider';

type Role = 'BUYER' | 'SUPPLIER' | 'ADMIN';

interface RoleGuardProps {
  children: ReactNode;
  roles: Role[];
  fallback?: ReactNode;
}

export default function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // TODO: Implement role checking based on user.organizationId and organization.type
  const hasRole = roles.includes('BUYER');

  if (!hasRole) {
    return <>{fallback ?? <p className="text-sm text-muted-foreground p-4">Access denied</p>}</>;
  }

  return <>{children}</>;
}