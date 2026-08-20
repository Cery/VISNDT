import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Spin,
  Alert,
  Button,
  Space,
  Table,
  Empty,
  Typography,
  Select,
  message,
  Modal,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { rfqService, rfqResponseService } from '../api';
import type { Rfq, RfqResponse } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';

const { Title, Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Rfq };

type ResponseState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: RfqResponse[] };

const RFQ_STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  OPEN: '开放',
  RESPONDING: '响应中',
  CLOSED: '已关闭',
  CANCELLED: '已取消',
};

const RFQ_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['OPEN'],
  OPEN: ['RESPONDING', 'CLOSED', 'CANCELLED'],
  RESPONDING: ['CLOSED', 'CANCELLED'],
  CLOSED: [],
  CANCELLED: [],
};

export default function RfqDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [responseState, setResponseState] = useState<ResponseState>({ status: 'loading' });
  const [updating, setUpdating] = useState(false);

  const fetchRfq = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await rfqService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载询价单失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  const fetchResponses = useCallback(async () => {
    if (!id) return;
    setResponseState({ status: 'loading' });
    try {
      const result = await rfqResponseService.getByRfqId(id, 1, 50);
      setResponseState({ status: 'success', data: result.data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载响应列表失败';
      setResponseState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchRfq();
    fetchResponses();
  }, [fetchRfq, fetchResponses]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setUpdating(true);
      await rfqService.update(id, { status: newStatus as Rfq['status'] });
      message.success(`询价单状态已更新为 ${RFQ_STATUS_LABEL_MAP[newStatus] || newStatus}`);
      fetchRfq();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '更新状态失败';
      message.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handlePublish = () => {
    if (!id) return;
    Modal.confirm({
      title: '发布询价单',
      content: '确定要发布此询价单吗？发布后供应商将可见。',
      okText: '发布',
      onOk: async () => {
        try {
          await rfqService.publish(id);
          message.success('询价单发布成功');
          fetchRfq();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '发布询价单失败';
          message.error(msg);
        }
      },
    });
  };

  const handleClose = () => {
    if (!id) return;
    Modal.confirm({
      title: '关闭询价单',
      content: '确定要关闭此询价单吗？此操作不可撤销。',
      okText: '关闭',
      okType: 'danger',
      onOk: async () => {
        try {
          await rfqService.close(id);
          message.success('询价单已关闭');
          fetchRfq();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '关闭询价单失败';
          message.error(msg);
        }
      },
    });
  };

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载询价单失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchRfq}>重试</Button>
            <Button onClick={() => navigate('/rfqs')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const rfq = pageState.data;
  const allowedTransitions = RFQ_TRANSITIONS[rfq.status] || [];

  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleString() : '-';

  const responseColumns = [
    {
      title: '组织',
      dataIndex: 'organization',
      key: 'organization',
      render: (org: RfqResponse['organization']) => org?.name || '-',
    },
    {
      title: '报价',
      dataIndex: 'offer',
      key: 'offer',
      render: (offer: RfqResponse['offer']) => offer?.product?.name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <StatusTag status={status} />
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (msg: string | undefined) => msg || '-',
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: RfqResponse) => (
        <Button
          type="link"
          onClick={() => navigate(`/rfq-responses/${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rfqs')}>
          返回列表
        </Button>
      </Space>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>RFQ Analysis</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          View RFQ details, responses and matching results
        </Text>
      </div>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">{rfq.id}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={rfq.status} label={RFQ_STATUS_LABEL_MAP[rfq.status] || rfq.status} />
          </Descriptions.Item>
          <Descriptions.Item label="需求">
            {rfq.demand?.title || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建者">
            {rfq.createdByUser?.name || rfq.createdByUser?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {formatDate(rfq.publishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="关闭时间">
            {formatDate(rfq.closedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {allowedTransitions.length > 0 && (
        <Card title="状态管理" style={{ marginBottom: 16 }}>
          <Space>
            <span>切换至：</span>
            <Select
              placeholder="选择新状态"
              loading={updating}
              disabled={updating}
              onChange={handleStatusChange}
              options={allowedTransitions.map((s) => ({
                value: s,
                label: RFQ_STATUS_LABEL_MAP[s] || s,
              }))}
              style={{ minWidth: 160 }}
            />
          </Space>
        </Card>
      )}

      {(rfq.status === 'DRAFT' || rfq.status === 'OPEN') && (
        <Card title="生命周期操作" style={{ marginBottom: 16 }}>
          <Space>
            {rfq.status === 'DRAFT' && (
              <Button type="primary" onClick={handlePublish}>
                发布
              </Button>
            )}
            {rfq.status === 'OPEN' && (
              <Button danger onClick={handleClose}>
                关闭
              </Button>
            )}
          </Space>
        </Card>
      )}

      <Card title="响应列表" style={{ marginBottom: 16 }}>
        {responseState.status === 'loading' ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : responseState.status === 'error' ? (
          <Alert
            type="warning"
            message="加载响应列表失败"
            description={responseState.message}
            action={
              <Button size="small" onClick={fetchResponses}>
                重试
              </Button>
            }
          />
        ) : responseState.data.length > 0 ? (
          <Table
            dataSource={responseState.data}
            columns={responseColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="暂无响应" />
        )}
      </Card>

      <Card title="时间线" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="创建时间">
            {formatDate(rfq.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(rfq.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rfqs')}>
        返回列表
      </Button>
    </div>
  );
}