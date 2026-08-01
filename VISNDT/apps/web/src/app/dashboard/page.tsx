'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import StatCard from '@/components/workspace/StatCard';
import { getDemands } from '@/services/demand.service';
import { getRfqs } from '@/services/rfq.service';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ demands: 0, rfqs: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [demandsRes, rfqsRes] = await Promise.allSettled([
          getDemands(1, 1),
          getRfqs(),
        ]);
        setStats({
          demands:
            demandsRes.status === 'fulfilled' ? demandsRes.value.total : 0,
          rfqs: rfqsRes.status === 'fulfilled' ? rfqsRes.value.total : 0,
        });
      } catch {
        // Stats are optional — show 0 on error
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-slate-500 mt-1">
          {user?.organizationId
            ? 'Organization Dashboard'
            : 'Your Dashboard'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="My Demands"
          value={isLoading ? '...' : stats.demands}
          description="Active demands"
          icon="📋"
        />
        <StatCard
          label="RFQs Received"
          value={isLoading ? '...' : stats.rfqs}
          description="Incoming requests"
          icon="📄"
        />
        <StatCard
          label="Organization"
          value={user?.organizationId ? 'Active' : 'Pending'}
          description={
            user?.organizationId ? 'Member' : 'Join an organization'
          }
          icon="🏢"
        />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/products"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">🔍</span>
            <h3 className="font-medium text-sm text-slate-900">
              Browse Products
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Explore industrial inspection equipment
            </p>
          </Link>
          <Link
            href="/workspace/demands"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">📋</span>
            <h3 className="font-medium text-sm text-slate-900">
              My Demands
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Manage your demand listings
            </p>
          </Link>
          <Link
            href="/workspace/rfqs"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">📄</span>
            <h3 className="font-medium text-sm text-slate-900">RFQs</h3>
            <p className="text-xs text-slate-400 mt-1">
              View and respond to RFQs
            </p>
          </Link>
          <Link
            href="/workspace/matches"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">🔗</span>
            <h3 className="font-medium text-sm text-slate-900">Matches</h3>
            <p className="text-xs text-slate-400 mt-1">
              Review demand-product matches
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}