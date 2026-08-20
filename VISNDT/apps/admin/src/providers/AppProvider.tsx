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

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#2563eb',
          colorInfo: '#0891b2',
          colorLink: '#2563eb',
          colorSuccess: '#16a34a',
          colorWarning: '#d97706',
          colorError: '#dc2626',
          borderRadius: 8,
          colorBgLayout: '#f5f7fa',
          fontSize: 14,
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            headerHeight: 56,
            headerPadding: '0 24px',
            bodyBg: '#f5f7fa',
            siderBg: '#0f172a',
          },
          Menu: {
            darkItemBg: '#0f172a',
            darkSubMenuItemBg: '#0b1220',
            darkItemColor: 'rgba(255, 255, 255, 0.72)',
            darkItemHoverBg: 'rgba(37, 99, 235, 0.16)',
            darkItemSelectedBg: '#2563eb',
            darkItemSelectedColor: '#ffffff',
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#334155',
          },
          Card: {
            borderRadiusLG: 10,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default AppProvider;