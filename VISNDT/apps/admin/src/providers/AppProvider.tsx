import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return <ConfigProvider>{children}</ConfigProvider>;
}

export default AppProvider;