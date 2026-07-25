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
  DRAFT: 'orange',
  ACTIVE: 'green',
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
        err instanceof Error ? err.message : 'Failed to load offer';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

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
        message="Failed to load offer"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchOffer}>Retry</Button>
            <Button onClick={() => navigate('/offers')} icon={<ArrowLeftOutlined />}>
              Back to List
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
          Back to List
        </Button>
      </Space>

      <Title level={3}>Offer Detail</Title>

      {/* Card 1: Offer Summary */}
      <Card title="Offer Summary" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Offer ID">{offer.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[offer.status] || 'default'}>
              {offer.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Title">{offer.title}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(offer.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {formatDate(offer.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 2: Product Info */}
      {offer.product && (
        <Card title="Product Information" style={{ marginBottom: 16 }}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Product Name">
              {offer.product.name}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {offer.product.model || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {offer.product.status || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Card 3: Organization Info */}
      {offer.organization && (
        <Card title="Organization Information" style={{ marginBottom: 16 }}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Organization Name">
              {offer.organization.name}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag>{offer.organization.type || 'N/A'}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {offer.description && (
        <Card title="Description" style={{ marginBottom: 16 }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {offer.description}
          </p>
        </Card>
      )}

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/offers')}>
        Back to List
      </Button>
    </div>
  );
}