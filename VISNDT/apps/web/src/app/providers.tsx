'use client';

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/auth/AuthProvider';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** 811 Batch A (D1 跟进修复)：路由感知目录失效器。
 * Next App Router 客户端导航返回缓存路由时，页面组件可能不重新挂载（refetchOnMount
 * 不触发）；本组件常驻于 Provider，用 usePathname 监听进入公共目录页（/、/categories、
 * /products）时 invalidate 目录相关查询，命中已常驻观察者强制重拉，确保管理端变更即时反映。
 * 跳过首次挂载（首载已由挂载查询拉取），仅对后续路由变化失效。
 */
const CATALOG_ROUTE = /^\/(products|categories)?$/;

function CatalogRouteInvalidator() {
  const pathname = usePathname();
  const qc = useQueryClient();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (pathname && CATALOG_ROUTE.test(pathname)) {
      // 811 收口(D2): invalidateQueries 默认 refetchType:'active' 只重拉"活跃观察者"挂载中的查询，
      // Next App Router 缓存还原导航时观察者未必处于 active；改为 refetchType:'all' 防御性强制刷入缓存，
      // 确保无论组件是否 remount/observer 是否 active，任何渲染都读到最新目录，删除分类不残留。
      qc.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' });
      qc.invalidateQueries({ queryKey: ['featured-products'], refetchType: 'all' });
      qc.invalidateQueries({ queryKey: ['products'], refetchType: 'all' });
    }
  }, [pathname, qc]);
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CatalogRouteInvalidator />
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}