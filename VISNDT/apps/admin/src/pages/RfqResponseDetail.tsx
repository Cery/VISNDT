import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Spin,
  Alert,
  Button,
  Space,
  Typography,
  Select,
  message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BusinessIdentityBadge } from '@visndt/design-system';
import { rfqResponseService } from '../api';
import type { RfqResponse } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: RfqResponse };

const STATUS_COLOR: Record<string, string> = {
  SUBMITTED: 'blue',
  VIEWED: 'cyan',
  ACCEPTED: 'green',
  REJECTED: 'red',
};

const RESPONSE_STATUS_LABEL_MAP: Record<string, string> = {
  SUBMITTED: '已提交',
  VIEWED: '已查看',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
};

const RESPONSE_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ['VIEWED'],
  VIEWED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: [],
  REJECTED: [],
};

export default function RfqResponseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [updating, setUpdating] = useState(false);

  const fetchResponse = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await rfqResponseService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载响应详情失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchResponse();
  }, [fetchResponse]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      setUpdating(true);
      await rfqResponseService.update(id, { status: newStatus });
      message.success(`响应状态已更新为 ${RESPONSE_STATUS_LABEL_MAP[newStatus] || '未知状态'}`);
      fetchResponse();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '更新状态失败';
      message.error(msg);
    } finally {
      setUpdating(false);
    }
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
        message="加载响应详情失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchResponse}>重试</Button>
            <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
              返回
            </Button>
          </Space>
        }
      />
    );
  }

  const response = pageState.data;
  const allowedTransitions = RESPONSE_TRANSITIONS[response.status] || [];

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleString() : '-';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
      </Space>

      <Title level={3}>RFQ 响应详情</Title>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="业务编号"><BusinessIdentityBadge type="RFQ_RESPONSE" id={response.id} createdAt={response.createdAt} /></Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLOR[response.status] || 'default'}>
              {RESPONSE_STATUS_LABEL_MAP[response.status] || '未知状态'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="组织">
            {response.organization?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="报价">
            {response.offer?.product?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="询价单ID">
            {response.rfqId}
          </Descriptions.Item>
          <Descriptions.Item label="提交时间">
            {formatDate(response.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {response.message && (
        <Card title="消息" style={{ marginBottom: 16 }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {response.message}
          </p>
        </Card>
      )}

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
                label: RESPONSE_STATUS_LABEL_MAP[s] || '未知状态',
              }))}
              style={{ minWidth: 160 }}
            />
          </Space>
        </Card>
      )}

      <Card title="时间线" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="创建时间">
            {formatDate(response.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(response.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        返回
      </Button>
    </div>
  );
}