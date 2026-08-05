import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, type ReactNode } from 'react';
import { apiClient, setCsrfToken } from '../api/client';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Fetch CSRF token on app initialization.
 * Stores the token in memory for the API client interceptor.
 */
async function initCsrfToken() {
  try {
    const res = await apiClient.get('/auth/csrf') as any;
    if (res?.data?.csrfToken) {
      setCsrfToken(res.data.csrfToken);
    }
  } catch {
    // Ignore failures — CSRF token will be fetched on next login
  }
}

function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    initCsrfToken();
  }, []);

  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
}

export default AppProvider;