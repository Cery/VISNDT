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
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['featured-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
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