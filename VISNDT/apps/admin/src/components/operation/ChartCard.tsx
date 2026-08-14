import { Card, Spin, Alert, Empty } from 'antd';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyText?: string;
  children: ReactNode;
  extra?: ReactNode;
  height?: number;
}

export default function ChartCard({
  title,
  loading = false,
  error,
  isEmpty = false,
  emptyText = '暂无数据',
  children,
  extra,
  height = 300,
}: ChartCardProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Spin />
        </div>
      );
    }

    if (error) {
      return <Alert type="error" message={error} showIcon />;
    }

    if (isEmpty) {
      return <Empty description={emptyText} />;
    }

    return <div style={{ height }}>{children}</div>;
  };

  return (
    <Card title={title} extra={extra}>
      {renderContent()}
    </Card>
  );
}