'use client';

import { type ReactNode } from 'react';
import { useAuth } from './AuthProvider';

type Role = 'BUYER' | 'SUPPLIER';

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

  const workspaceRole = user.workspaceRole;
  if (!workspaceRole) {
    return <>{fallback ?? <p className="text-sm text-muted-foreground p-4">Workspace role not configured</p>}</>;
  }

  const hasRole = roles.includes(workspaceRole);

  if (!hasRole) {
    return <>{fallback ?? <p className="text-sm text-muted-foreground p-4">Access denied</p>}</>;
  }

  return <>{children}</>;
}
