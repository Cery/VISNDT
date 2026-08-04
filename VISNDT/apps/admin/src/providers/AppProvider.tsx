import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Fetch CSRF token on app initialization.
 * The token is set as a cookie (httpOnly: false) and read by the API client.
 */
async function initCsrfToken() {
  try {
    await axios.get('/api/v1/auth/csrf');
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