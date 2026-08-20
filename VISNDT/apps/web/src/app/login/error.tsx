'use client';

import PageErrorBoundary from '@/components/common/PageErrorBoundary';

export default function LoginError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorBoundary
      reset={reset}
      title="登录页面加载异常"
      message="无法加载登录页面，请重试或返回首页。"
    />
  );
}