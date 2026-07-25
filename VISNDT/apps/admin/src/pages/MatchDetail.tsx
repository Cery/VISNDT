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
  Table,
  Collapse,
  Typography,
  message,
  Empty,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { matchService } from '../api';
import type { MatchDetail } from '../types';

const { Title, Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: MatchDetail };

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'orange',
  MATCHED: 'blue',
  REVIEWED: 'cyan',
  ACCEPTED: 'green',
  REJECTED: 'red',
  EXPIRED: 'default',
};

const SCORE_COLOR = (score: number): string => {
  if (score >= 80) return '#52c41a';
  if (score >= 60) return '#faad14';
  return '#ff4d4f';
};

const REVIEWABLE_STATUSES = ['REVIEWED'];

export default function MatchDetailPage() {
  const { demandId, matchId } = useParams<{
    demandId: string;
    matchId: string;
  }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [reviewing, setReviewing] = useState(false);

  const fetchMatch = useCallback(async () => {
    if (!demandId || !matchId) return;
    setPageState({ status: 'loading' });
    try {
      const data = await matchService.getMatchDetail(demandId, matchId);
      setPageState({ status: 'success', data });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load match detail';
      setPageState({ status: 'error', message: msg });
    }
  }, [demandId, matchId]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  const handleReview = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!demandId || !matchId) return;
    try {
      setReviewing(true);
      await matchService.updateMatchStatus(demandId, matchId, { status });
      message.success(`Match ${status.toLowerCase()}`);
      fetchMatch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update match';
      message.error(msg);
    } finally {
      setReviewing(false);
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
        message="Failed to load match detail"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchMatch}>Retry</Button>
            <Button
              onClick={() =>
                navigate(demandId ? `/demands/${demandId}` : '/demands')
              }
              icon={<ArrowLeftOutlined />}
            >
              Back to Demand
            </Button>
          </Space>
        }
      />
    );
  }

  const match = pageState.data;
  const demandParams = match.demand?.parameters || [];
  const matchDetails = match.matchDetails as Record<string, unknown> | undefined;
  const canReview = REVIEWABLE_STATUSES.includes(match.matchStatus);

  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleString() : '-';

  const paramColumns = [
    {
      title: 'Parameter',
      dataIndex: ['parameterDefinition', 'name'],
      key: 'name',
      width: 150,
    },
    {
      title: 'Demand Value',
      key: 'demandValue',
      width: 150,
      render: (_: unknown, record: { parameterDefinition?: { id: string; name: string; code: string; unit?: string }; value?: string; valueMin?: number; valueMax?: number }) => {
        if (record.value) return record.value;
        if (record.valueMin !== undefined && record.valueMax !== undefined) {
          return `${record.valueMin} - ${record.valueMax}`;
        }
        if (record.valueMin !== undefined) return `≥ ${record.valueMin}`;
        if (record.valueMax !== undefined) return `≤ ${record.valueMax}`;
        return '-';
      },
    },
    {
      title: 'Unit',
      dataIndex: ['parameterDefinition', 'unit'],
      key: 'unit',
      width: 80,
      render: (v: string | undefined) => v || '-',
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate(demandId ? `/demands/${demandId}` : '/demands')
          }
        >
          Back to Demand
        </Button>
      </Space>

      <Title level={3}>Match Detail</Title>

      {/* Card 1: Match Summary */}
      <Card title="Match Summary" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Product">
            {match.product?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={STATUS_COLOR[match.matchStatus] || 'default'}>
              {match.matchStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Match Score">
            <Text
              strong
              style={{ color: SCORE_COLOR(match.matchScore), fontSize: 18 }}
            >
              {match.matchScore}%
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {match.product?.category?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Offer">
            {match.offer
              ? `$${match.offer.price ?? 'N/A'}`
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Matched At">
            {formatDate(match.matchedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Reviewed At">
            {formatDate(match.reviewedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(match.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 2: Demand Parameters */}
      <Card title="Demand Parameters" style={{ marginBottom: 16 }}>
        {demandParams.length > 0 ? (
          <Table
            dataSource={demandParams}
            columns={paramColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="No parameters" />
        )}
      </Card>

      {/* Card 3: Match Details (JSON) */}
      {matchDetails && (
        <Card title="Match Details" style={{ marginBottom: 16 }}>
          <Collapse
            items={[
              {
                key: 'json',
                label: 'Raw Match Details',
                children: (
                  <pre
                    style={{
                      background: '#f5f5f5',
                      padding: 16,
                      borderRadius: 4,
                      overflow: 'auto',
                      maxHeight: 400,
                      margin: 0,
                    }}
                  >
                    {JSON.stringify(matchDetails, null, 2)}
                  </pre>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* Card 4: Review Actions */}
      {canReview && (
        <Card title="Review Actions" style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              loading={reviewing}
              onClick={() => handleReview('ACCEPTED')}
            >
              Accept
            </Button>
            <Button
              danger
              loading={reviewing}
              onClick={() => handleReview('REJECTED')}
            >
              Reject
            </Button>
          </Space>
        </Card>
      )}

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(demandId ? `/demands/${demandId}` : '/demands')
        }
      >
        Back to Demand
      </Button>
    </div>
  );
}