'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import Loading from '@/components/common/Loading';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

export default function AuthGuard({ children, fallbackPath = '/login' }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(fallbackPath);
    }
  }, [isLoading, isAuthenticated, router, fallbackPath]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}