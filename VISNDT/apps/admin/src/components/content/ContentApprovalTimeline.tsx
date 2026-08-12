import { useEffect, useState, useCallback } from 'react';
import { Timeline, Button, Typography, Empty, Spin, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { contentService } from '../../api/content.service';
import type {
  ContentApprovalTimelineItem,
  ContentWorkflowAction,
} from '../../types/content.types';

const ACTION_LABEL: Record<ContentWorkflowAction, string> = {
  CREATED: '创建',
  SUBMITTED: '提交审核',
  REVIEWED: '审核通过',
  OPENED: '发布',
  CLOSED: '归档',
};

const ACTION_COLOR: Record<ContentWorkflowAction, string> = {
  CREATED: 'gray',
  SUBMITTED: 'blue',
  REVIEWED: 'green',
  OPENED: 'green',
  CLOSED: 'red',
};

/**
 * Content approval timeline UI (ADMIN only, display-only).
 * Data source is the Content WorkflowEvent business-process history (not AuditLog,
 * not ContentRevision). Each item shows action / operator / time / status target.
 * No approval buttons, no workflow mutation, no reviewer assignment.
 */
export default function ContentApprovalTimeline({ contentId }: { contentId: string }) {
  const [items, setItems] = useState<ContentApprovalTimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTimeline = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.getApprovalTimeline(contentId);
      setItems(data);
    } catch {
      message.error('加载审核时间线失败');
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  const renderStatusTransition = (item: ContentApprovalTimelineItem) => {
    const to = item.metadata?.to;
    return to ? ` → ${to}` : '';
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          审核时间线
        </Typography.Title>
        <Button icon={<ClockCircleOutlined />} onClick={loadTimeline}>
          刷新
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : items.length === 0 ? (
        <Empty description="暂无流程记录。" />
      ) : (
        <Timeline
          items={items.map((item) => ({
            key: item.id,
            color: ACTION_COLOR[item.action] || 'gray',
            children: (
              <div>
                <Typography.Text strong>
                  {ACTION_LABEL[item.action] || item.action}
                </Typography.Text>
                {renderStatusTransition(item)}
                <Typography.Paragraph
                  type="secondary"
                  style={{ margin: 0, fontSize: 12 }}
                >
                  {item.operator?.name || item.operator?.id || '系统'} ·{' '}
                  {new Date(item.createdAt).toLocaleString()}
                </Typography.Paragraph>
              </div>
            ),
          }))}
        />
      )}
    </div>
  );
}