'use client';

import PageErrorBoundary from '@/components/common/PageErrorBoundary';

export default function RegisterError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageErrorBoundary
      reset={reset}
      title="注册页面加载异常"
      message="无法加载注册页面，请重试或返回首页。"
    />
  );
}