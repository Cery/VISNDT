import { Card, Statistic, Skeleton, Space } from 'antd';
import type { ReactNode } from 'react';

interface OperationCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  loading?: boolean;
  onClick?: () => void;
  suffix?: ReactNode;
}

export default function OperationCard({
  title,
  value,
  icon,
  color,
  loading = false,
  onClick,
  suffix,
}: OperationCardProps) {
  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    );
  }

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={color ? { borderTop: `3px solid ${color}` } : undefined}
    >
      <Space>
        {icon && (
          <span style={{ fontSize: 24, color: color || '#2563eb' }}>{icon}</span>
        )}
        <Statistic
          title={title}
          value={value}
          suffix={suffix}
        />
      </Space>
    </Card>
  );
}