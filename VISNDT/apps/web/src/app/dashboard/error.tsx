'use client';

import PageErrorBoundary from '@/components/common/PageErrorBoundary';

export default function DashboardError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorBoundary
      reset={reset}
      title="工作台加载异常"
      message="无法加载工作台内容，请重试或返回首页。"
    />
  );
}