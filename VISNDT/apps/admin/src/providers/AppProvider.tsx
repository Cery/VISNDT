import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, type ReactNode } from 'react';
import { ensureCsrfToken } from '../api/client';
import { VISNDT_COLORS } from '../components/design-system/tokens';

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    ensureCsrfToken();
  }, []);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: VISNDT_COLORS.primary,
          colorInfo: VISNDT_COLORS.industrialCyan,
          colorLink: VISNDT_COLORS.primary,
          colorSuccess: VISNDT_COLORS.success,
          colorWarning: VISNDT_COLORS.warning,
          colorError: VISNDT_COLORS.error,
          colorTextBase: '#0f172a',
          borderRadius: 8,
          colorBgLayout: VISNDT_COLORS.layoutBg,
          fontSize: 14,
        },
        components: {
          Layout: {
            headerBg: VISNDT_COLORS.headerBg,
            headerHeight: 56,
            headerPadding: '0 24px',
            bodyBg: VISNDT_COLORS.layoutBg,
            siderBg: VISNDT_COLORS.siderBg,
          },
          Menu: {
            darkItemBg: VISNDT_COLORS.siderBg,
            darkSubMenuItemBg: '#0b1220',
            darkItemColor: 'rgba(255, 255, 255, 0.72)',
            darkItemHoverBg: 'rgba(37, 99, 235, 0.16)',
            darkItemSelectedBg: VISNDT_COLORS.primary,
            darkItemSelectedColor: '#ffffff',
          },
          Table: {
            headerBg: VISNDT_COLORS.tableHeaderBg,
            headerColor: '#334155',
          },
          Card: {
            borderRadiusLG: 10,
          },
          Tag: {
            defaultBg: '#e2e8f0',
            defaultColor: '#475569',
          },
        },
      }}
    >
      <AntdApp>
        {children}
      </AntdApp>
    </ConfigProvider>
  );
}

export default AppProvider;