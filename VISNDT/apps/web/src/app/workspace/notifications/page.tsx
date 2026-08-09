'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  type NotificationItem,
} from '@/lib/api/notifications';

const PAGE_SIZE = 20;

type NotificationRecord = NotificationItem & {
  status?: string | null;
};

function isNotificationRead(notification: NotificationRecord): boolean {
  if (typeof notification.isRead === 'boolean') {
    return notification.isRead;
  }

  return notification.status === 'READ';
}

function formatNotificationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SYSTEM: '系统通知',
    DEMAND_UPDATE: '需求更新',
    RFQ_UPDATE: '询价更新',
    RESPONSE_UPDATE: '响应更新',
  };

  return labels[type] || type;
}

function NotificationsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const toggleSidebar = useCallback(() => setSidebarOpen((value) => !value), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [notificationsResult, unreadResult] = await Promise.all([
        getNotifications(page, PAGE_SIZE),
        getUnreadCount(),
      ]);

      setNotifications(notificationsResult.data || []);
      setTotal(notificationsResult.total || 0);
      setUnreadCount(unreadResult);
    } catch {
      setError('加载通知失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);
  const hasUnread = unreadCount > 0;

  const handleMarkAsRead = useCallback(async (id: string) => {
    setMarkingId(id);
    setError('');

    try {
      await markAsRead(id);
      setNotifications((current) => current.map((item) => {
        if (item.id !== id || isNotificationRead(item)) {
          return item;
        }

        return {
          ...item,
          isRead: true,
          status: 'READ',
        };
      }));
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch {
      setError('标记已读失败，请稍后重试。');
    } finally {
      setMarkingId(null);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    setIsMarkingAll(true);
    setError('');

    try {
      await markAllAsRead();
      setNotifications((current) => current.map((item) => ({
        ...item,
        isRead: true,
        status: 'READ',
      })));
      setUnreadCount(0);
    } catch {
      setError('全部标记已读失败，请稍后重试。');
    } finally {
      setIsMarkingAll(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">通知中心</h2>
                <p className="text-slate-500 text-sm mt-1">
                  查看最新通知并管理未读状态。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                  未读 {unreadCount}
                </span>
                <button
                  onClick={loadNotifications}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  刷新
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={!hasUnread || isLoading || isMarkingAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {isMarkingAll ? '处理中...' : '全部标记已读'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">通知总数</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading ? '...' : total}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">未读通知</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading ? '...' : unreadCount}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">当前页</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading ? '...' : page}
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span>{error}</span>
                  <button
                    onClick={loadNotifications}
                    className="text-sm font-medium underline hover:text-red-800"
                  >
                    重试
                  </button>
                </div>
              </div>
            )}

            <section className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-28 rounded-lg border border-slate-200 bg-white animate-pulse"
                    />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
                  <h3 className="text-base font-semibold text-slate-900">暂无通知</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    当前没有可展示的通知，后续新消息会显示在这里。
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const read = isNotificationRead(notification);

                    return (
                      <article
                        key={notification.id}
                        className={`rounded-lg border bg-white p-5 transition-colors ${
                          read
                            ? 'border-slate-200'
                            : 'border-slate-300 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                {getTypeLabel(notification.type)}
                              </span>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                  read
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {read ? '已读' : '未读'}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-base font-semibold text-slate-900">
                                {notification.title}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {notification.message || '暂无通知详情。'}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <span>时间：{formatNotificationDate(notification.createdAt)}</span>
                              {notification.referenceType && (
                                <span>关联类型：{notification.referenceType}</span>
                              )}
                              {notification.referenceId && (
                                <span className="font-mono">
                                  关联 ID：{notification.referenceId.slice(0, 8)}...
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={read || markingId === notification.id || isMarkingAll}
                              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                              {markingId === notification.id ? '处理中...' : '标记已读'}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      pageNumber === page
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <RoleGuard
        roles={['BUYER', 'SUPPLIER']}
        fallback={(
          <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
              <h2 className="text-base font-semibold text-slate-900">无法访问通知中心</h2>
              <p className="mt-2 text-sm text-slate-500">
                当前账号未映射到可用工作区角色。
              </p>
            </div>
          </div>
        )}
      >
        <NotificationsContent />
      </RoleGuard>
    </AuthGuard>
  );
}
