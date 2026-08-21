import { Card, List, Empty, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import StatusTag from '../design-system/StatusTag';
import { VISNDT_COLORS } from '../design-system/tokens';

const { Text } = Typography;

export interface QueueRow {
  id: string;
  title: string;
  status?: string;
  updatedAt?: string;
}

interface OperationQueueCardProps {
  title: React.ReactNode;
  rows: QueueRow[];
  loading?: boolean;
  emptyHint?: string;
  onRowClick?: (id: string) => void;
}

function formatTime(date?: string) {
  if (!date) return '';
  const d = new Date(date);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 60000);
  if (diff < 1) return '刚刚';
  if (diff < 60) return `${diff}分钟前`;
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
  return d.toLocaleDateString();
}

/**
 * 运营待办队列卡片 —— 展示近期运营对象（产品 / 内容 / 组织 / 业务）待处理快照。
 * 语义状态统一由 StatusTag 治理，行点击跳转对应 CRUD 详情。
 */
export default function OperationQueueCard({
  title,
  rows,
  loading = false,
  emptyHint = '暂无待办事项',
  onRowClick,
}: OperationQueueCardProps) {
  return (
    <Card title={title} loading={loading} style={{ height: '100%' }}>
      {rows.length === 0 ? (
        <Empty description={emptyHint} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          dataSource={rows}
          renderItem={(row) => (
            <List.Item
              onClick={onRowClick ? () => onRowClick(row.id) : undefined}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                padding: '8px 0',
              }}
            >
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text ellipsis style={{ maxWidth: '60%', fontWeight: 500 }} title={row.title}>
                    {row.title}
                  </Text>
                  {row.status && <StatusTag status={row.status} />}
                </div>
                {row.updatedAt && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <ClockCircleOutlined style={{ marginRight: 4, color: VISNDT_COLORS.neutral }} />
                    {formatTime(row.updatedAt)}
                  </Text>
                )}
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}