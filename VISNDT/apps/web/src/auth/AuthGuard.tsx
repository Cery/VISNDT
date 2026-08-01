'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import Loading from '@/components/common/Loading';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

export default function AuthGuard({ children, fallbackPath = '/login' }: AuthGuardProps) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  if (!token || !user) {
    if (typeof window !== 'undefined') {
      router.replace(fallbackPath);
    }
    return null;
  }

  return <>{children}</>;
}