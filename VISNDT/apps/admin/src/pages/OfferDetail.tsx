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
  message,
  Modal,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { offerService } from '../api';
import type { Offer } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Offer };

const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'default',
  SUBMITTED: 'processing',
  ACCEPTED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'warning',
  ACTIVE: 'blue',
  INACTIVE: 'default',
};

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchOffer = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await offerService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载报价失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  const handleSubmit = () => {
    if (!id) return;
    Modal.confirm({
      title: '提交报价',
      content: '确认提交此报价？',
      okText: '提交',
      onOk: async () => {
        try {
          await offerService.submit(id);
          message.success('报价提交成功');
          fetchOffer();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '提交报价失败';
          message.error(msg);
        }
      },
    });
  };

  const handleAccept = () => {
    if (!id) return;
    Modal.confirm({
      title: '接受报价',
      content: '确认接受此报价？',
      okText: '接受',
      onOk: async () => {
        try {
          await offerService.accept(id);
          message.success('报价已接受');
          fetchOffer();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '接受报价失败';
          message.error(msg);
        }
      },
    });
  };

  const handleReject = () => {
    if (!id) return;
    Modal.confirm({
      title: '拒绝报价',
      content: '确认拒绝此报价？',
      okText: '拒绝',
      okType: 'danger',
      onOk: async () => {
        try {
          await offerService.reject(id);
          message.success('报价已拒绝');
          fetchOffer();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '拒绝报价失败';
          message.error(msg);
        }
      },
    });
  };

  const handleWithdraw = () => {
    if (!id) return;
    Modal.confirm({
      title: '撤回报价',
      content: '确认撤回此报价？',
      okText: '撤回',
      okType: 'danger',
      onOk: async () => {
        try {
          await offerService.withdraw(id);
          message.success('报价已撤回');
          fetchOffer();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '撤回报价失败';
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
        message="加载报价失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchOffer}>重试</Button>
            <Button onClick={() => navigate('/offers')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const offer = pageState.data;

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleString() : '-';

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/offers')}>
          返回列表
        </Button>
      </Space>

      <Title level={3}>报价详情</Title>

      {/* Card 1: Offer Summary */}
      <Card title="报价摘要" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="报价编号">{offer.id}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLOR[offer.status] || 'default'}>
              {offer.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="标题">{offer.title}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDate(offer.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(offer.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Lifecycle Actions */}
      {['DRAFT', 'SUBMITTED'].includes(offer.status) && (
        <Card title="生命周期操作" style={{ marginBottom: 16 }}>
          <Space>
            {offer.status === 'DRAFT' && (
              <Button type="primary" onClick={handleSubmit}>
                提交
              </Button>
            )}
            {offer.status === 'SUBMITTED' && (
              <>
                <Button type="primary" onClick={handleAccept}>
                  接受
                </Button>
                <Button danger onClick={handleReject}>
                  拒绝
                </Button>
                <Button danger onClick={handleWithdraw}>
                  撤回
                </Button>
              </>
            )}
          </Space>
        </Card>
      )}

      {/* Card 2: Product Info */}
      {offer.product && (
        <Card title="产品信息" style={{ marginBottom: 16 }}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="产品名称">
              {offer.product.name}
            </Descriptions.Item>
            <Descriptions.Item label="型号">
              {offer.product.model || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {offer.product.status || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Card 3: Organization Info */}
      {offer.organization && (
        <Card title="组织信息" style={{ marginBottom: 16 }}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="组织名称">
              {offer.organization.name}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag>{offer.organization.type || '未知'}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {offer.description && (
        <Card title="描述" style={{ marginBottom: 16 }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {offer.description}
          </p>
        </Card>
      )}

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/offers')}>
        返回列表
      </Button>
    </div>
  );
}