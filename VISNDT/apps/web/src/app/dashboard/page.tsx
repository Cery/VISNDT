'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import StatCard from '@/components/workspace/StatCard';
import { getDemands } from '@/services/demand.service';
import { getMyInquiries } from '@/services/inquiry.service';
import { getUnreadCount } from '@/lib/api/notifications';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ demands: 0, inquiries: 0, unreadNotifications: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [demandsRes, inquiriesRes, unreadRes] = await Promise.allSettled([
          getDemands(1, 1),
          getMyInquiries(1, 1),
          getUnreadCount(),
        ]);
        setStats({
          demands:
            demandsRes.status === 'fulfilled' ? demandsRes.value.total : 0,
          inquiries:
            inquiriesRes.status === 'fulfilled' ? inquiriesRes.value.total : 0,
          unreadNotifications:
            unreadRes.status === 'fulfilled' ? unreadRes.value : 0,
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
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          欢迎回来{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-slate-500 mt-1">
          {user?.organizationId
            ? '组织仪表盘'
            : '我的仪表盘'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="我的需求"
          value={isLoading ? '...' : stats.demands}
          description="活跃需求"
          icon="📋"
        />
        <StatCard
          label="收到的询价"
          value={isLoading ? '...' : stats.inquiries}
          description="收到的询价请求"
          icon="📄"
        />
        <StatCard
          label="未读通知"
          value={isLoading ? '...' : stats.unreadNotifications}
          description={stats.unreadNotifications > 0 ? '有待处理通知' : '全部已读'}
          icon="🔔"
        />
        <StatCard
          label="组织"
          value={user?.organizationId ? '已激活' : '待处理'}
          description={
            user?.organizationId ? '成员' : '加入组织'
          }
          icon="🏢"
        />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          快捷操作
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/products"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">🔍</span>
            <h3 className="font-medium text-sm text-slate-900">
              浏览产品
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              探索工业检测设备
            </p>
          </Link>
          <Link
            href="/workspace/demands"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">📋</span>
            <h3 className="font-medium text-sm text-slate-900">
              我的需求
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              管理您的需求列表
            </p>
          </Link>
          <Link
            href="/workspace/rfqs"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">📄</span>
            <h3 className="font-medium text-sm text-slate-900">询价单</h3>
            <p className="text-xs text-slate-400 mt-1">
              查看和回复询价
            </p>
          </Link>
          <Link
            href="/workspace/matches"
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <span className="text-2xl mb-2 block">🔗</span>
            <h3 className="font-medium text-sm text-slate-900">匹配结果</h3>
            <p className="text-xs text-slate-400 mt-1">
              查看需求-产品匹配
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