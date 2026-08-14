import { Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface FilterPanelProps {
  children: ReactNode;
  onReset?: () => void;
  onSearch?: () => void;
  loading?: boolean;
}

export default function FilterPanel({
  children,
  onReset,
  onSearch,
  loading = false,
}: FilterPanelProps) {
  return (
    <div className="admin-filter-bar">
      <Space wrap style={{ marginBottom: 16 }}>
        {children}
        {onSearch && (
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={loading}
            onClick={onSearch}
          >
            搜索
          </Button>
        )}
        {onReset && (
          <Button icon={<ReloadOutlined />} onClick={onReset}>
            重置
          </Button>
        )}
      </Space>
    </div>
  );
}