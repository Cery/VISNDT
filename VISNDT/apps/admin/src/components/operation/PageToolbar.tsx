import { Typography, Space } from 'antd';
import type { ReactNode } from 'react';

const { Title, Paragraph } = Typography;

interface PageToolbarProps {
  title: string;
  description?: string;
  actions?: ReactNode[];
}

export default function PageToolbar({
  title,
  description,
  actions,
}: PageToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
      }}
    >
      <div>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        {description && (
          <Paragraph type="secondary" style={{ margin: '4px 0 0 0' }}>
            {description}
          </Paragraph>
        )}
      </div>
      {actions && actions.length > 0 && (
        <Space wrap>{actions}</Space>
      )}
    </div>
  );
}