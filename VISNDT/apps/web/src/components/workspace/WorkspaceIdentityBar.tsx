'use client';

import { useAuth } from '@/auth/AuthProvider';
import IndustrialBadge from '@/components/brand/IndustrialBadge';
import CapabilityBadge from '@/components/capability/CapabilityBadge';

interface WorkspaceIdentityBarProps {
  title: string;
  subtitle: string;
  roleLabel: string;
  roleHint: string;
  roleTone?: 'cyan' | 'amber' | 'primary' | 'neutral';
}

/**
 * Workspace SaaS Experience — Identity & Role Awareness (Context First).
 *
 * Answers "我是谁 / 我在哪个角色 / 我的组织上下文" before any data or action.
 */
export default function WorkspaceIdentityBar({
  title,
  subtitle,
  roleLabel,
  roleHint,
  roleTone = 'cyan',
}: WorkspaceIdentityBarProps) {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || '用户';
  const organizationName = user?.organization?.name ?? null;
  const memberRole = user?.organizationMember?.role ?? null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-industrial-sm">
      <IndustrialBadge label="VISNDT 工作区" tone="cyan" />

      <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-foreground">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary">
            {displayName.slice(0, 1)}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {organizationName && (
          <div className="flex items-center gap-2 text-sm">
            <span className="w-1 h-1 rotate-45 bg-industrial-cyan" aria-hidden="true" />
            <span className="text-muted-foreground">组织</span>
            <span className="font-medium text-foreground">{organizationName}</span>
            {memberRole && <span className="text-xs text-muted-foreground">· {memberRole}</span>}
          </div>
        )}

        <CapabilityBadge label={roleLabel} tone={roleTone} hint={roleHint} />
      </div>
    </div>
  );
}