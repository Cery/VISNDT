'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import Loading from '@/components/common/Loading';

/**
 * M33 Final Bounded Repair — Supplier Legacy Entry Perception
 *
 * /workspace/supplier  historically served as a Compatibility Shell.
 * To eliminate the ambiguous platform state, this route now immediately
 * redirects authenticated Supplier users to the formal Supplier Dashboard.
 *
 * No business logic, role authorization, or Dashboard architecture is changed.
 */
function SupplierWorkspaceContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/supplier');
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="text-center space-y-3">
        <Loading />
        <p className="text-sm text-muted-foreground">
          正在进入供应商工作台…
        </p>
      </div>
    </div>
  );
}

export default function SupplierWorkspacePage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierWorkspaceContent />
      </RoleGuard>
    </AuthGuard>
  );
}
