import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Descriptions, Typography, message } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { contentService } from '../../api/content.service';
import type {
  ContentRevisionSummary,
  ContentRevisionDetail,
} from '../../types/content.types';

/**
 * Content revision history UI (ADMIN only).
 * Lists every snapshot version (version / creator / created time) and lets the
 * admin inspect a specific historical snapshot. Restore and diff are NOT in scope.
 */
export default function ContentRevisionHistory({ contentId }: { contentId: string }) {
  const [revisions, setRevisions] = useState<ContentRevisionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ContentRevisionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadRevisions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.listRevisions(contentId);
      setRevisions(data);
    } catch {
      message.error('加载版本历史失败');
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    loadRevisions();
  }, [loadRevisions]);

  const openDetail = async (version: number) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const data = await contentService.getRevision(contentId, version);
      setDetail(data);
    } catch {
      message.error('加载版本快照失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const columns: ColumnsType<ContentRevisionSummary> = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 90,
      render: (version: number) => (
        <Typography.Text strong>v{version}</Typography.Text>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: string) => createdBy || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: ContentRevisionSummary) => (
        <Button type="link" size="small" onClick={() => openDetail(record.version)}>
          查看
        </Button>
      ),
    },
  ];

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
          版本历史
        </Typography.Title>
        <Button icon={<HistoryOutlined />} onClick={loadRevisions}>
          刷新
        </Button>
      </div>

      <Table<ContentRevisionSummary>
        columns={columns}
        dataSource={revisions}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={false}
        locale={{ emptyText: '暂无版本记录。' }}
      />

      <Modal
        title={detail ? `版本 v${detail.version} 快照` : '版本快照'}
        open={!!detail}
        loading={detailLoading}
        onCancel={() => setDetail(null)}
        footer={null}
        width={720}
        destroyOnClose
      >
        {detail && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="标题">{detail.title}</Descriptions.Item>
            <Descriptions.Item label="摘要">{detail.summary || '-'}</Descriptions.Item>
            <Descriptions.Item label="SEO 标题">{detail.seoTitle || '-'}</Descriptions.Item>
            <Descriptions.Item label="SEO 描述">
              {detail.seoDescription || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="SEO 关键词">
              {detail.seoKeywords || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="封面图 ID">
              {detail.coverImageId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建人">{detail.createdBy || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {new Date(detail.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="正文">
              <Typography.Paragraph
                style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}
              >
                {detail.content || '-'}
              </Typography.Paragraph>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}