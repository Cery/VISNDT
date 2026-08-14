import { List, Card, Empty, Spin } from 'antd';
import type { ReactNode } from 'react';

interface MobileCardListProps<T> {
  data: T[];
  renderCard: (item: T, index: number) => ReactNode;
  loading?: boolean;
  emptyText?: string;
}

export default function MobileCardList<T>({
  data,
  renderCard,
  loading = false,
  emptyText = '暂无数据',
}: MobileCardListProps<T>) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin />
      </div>
    );
  }

  if (data.length === 0) {
    return <Empty description={emptyText} />;
  }

  return (
    <div className="admin-mobile-card-list">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 0,
          lg: 0,
          xl: 0,
          xxl: 0,
        }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <Card>{renderCard(item, index)}</Card>
          </List.Item>
        )}
      />
    </div>
  );
}