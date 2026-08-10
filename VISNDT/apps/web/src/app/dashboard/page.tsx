'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import Loading from '@/components/common/Loading';

function DashboardEntryContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user?.workspaceRole === 'BUYER') {
      router.replace('/dashboard/buyer');
      return;
    }

    if (user?.workspaceRole === 'SUPPLIER') {
      router.replace('/dashboard/supplier');
      return;
    }

    router.replace('/workspace');
  }, [isLoading, router, user?.workspaceRole]);

  return <Loading />;
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardEntryContent />
    </AuthGuard>
  );
}
