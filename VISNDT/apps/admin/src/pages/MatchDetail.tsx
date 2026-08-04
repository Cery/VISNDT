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
  Modal,
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
  PENDING: 'processing',
  MATCHED: 'blue',
  REVIEWED: 'blue',
  ACCEPTED: 'success',
  REJECTED: 'error',
  EXPIRED: 'default',
};

const SCORE_COLOR = (score: number): string => {
  if (score >= 80) return '#52c41a';
  if (score >= 60) return '#faad14';
  return '#ff4d4f';
};

interface ExplanationFactor {
  name?: string;
  code?: string;
  matched?: boolean;
  weight?: number;
  score?: number;
  required?: boolean;
  type?: string;
}

interface ExplanationData {
  score?: number;
  factors?: ExplanationFactor[];
}

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
        err instanceof Error ? err.message : '加载匹配详情失败';
      setPageState({ status: 'error', message: msg });
    }
  }, [demandId, matchId]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  const handleReviewMatch = () => {
    if (!demandId || !matchId) return;
    Modal.confirm({
      title: '审核此匹配？',
      content: '这将标记匹配为已审核。',
      okText: '审核',
      onOk: async () => {
        try {
          setReviewing(true);
          await matchService.review(demandId, matchId);
          message.success('匹配已审核');
          fetchMatch();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '审核匹配失败';
          message.error(msg);
        } finally {
          setReviewing(false);
        }
      },
    });
  };

  const handleAcceptReject = (status: 'ACCEPTED' | 'REJECTED') => {
    if (!demandId || !matchId) return;
    const label = status === 'ACCEPTED' ? '接受' : '拒绝';
    Modal.confirm({
      title: `${label}此匹配？`,
      okText: label,
      okButtonProps: { danger: status === 'REJECTED' },
      onOk: async () => {
        try {
          setReviewing(true);
          await matchService.updateMatchStatus(demandId, matchId, { status });
          message.success(`Match ${status.toLowerCase()}`);
          fetchMatch();
        } catch (err) {
          const msg = err instanceof Error ? err.message : '匹配更新失败';
          message.error(msg);
        } finally {
          setReviewing(false);
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
        message="加载匹配详情失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchMatch}>重试</Button>
            <Button
              onClick={() =>
                navigate(demandId ? `/demands/${demandId}` : '/demands')
              }
              icon={<ArrowLeftOutlined />}
            >
              返回需求
            </Button>
          </Space>
        }
      />
    );
  }

  const match = pageState.data;
  const demandParams = match.demand?.parameters || [];
  const matchDetails = match.matchDetails as Record<string, unknown> | undefined;

  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleString() : '-';

  const paramColumns = [
    {
      title: '参数',
      dataIndex: ['parameterDefinition', 'name'],
      key: 'name',
      width: 150,
    },
    {
      title: '需求值',
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
      title: '单位',
      dataIndex: ['parameterDefinition', 'unit'],
      key: 'unit',
      width: 80,
      render: (v: string | undefined) => v || '-',
    },
  ];

  // Build explanation factors table columns
  const factorColumns = [
    {
      title: '匹配因子',
      dataIndex: 'name',
      key: 'name',
      render: (name: string | undefined, record: ExplanationFactor) =>
        name || record.code || '-',
    },
    {
      title: '已匹配',
      dataIndex: 'matched',
      key: 'matched',
      width: 80,
      render: (v: boolean | undefined) =>
        v === undefined ? '-' : v ? '✅' : '❌',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      width: 80,
      render: (v: number | undefined) => (v !== undefined ? v : '-'),
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (v: number | undefined) => (v !== undefined ? v : '-'),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (v: string | undefined) => v || '-',
    },
  ];

  // Extract explanation from matchDetails
  const explanation = matchDetails?.explanation as ExplanationData | undefined;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate(demandId ? `/demands/${demandId}` : '/demands')
          }
        >
          返回需求
        </Button>
      </Space>

      <Title level={3}>匹配详情</Title>

      {/* Card 1: Match Summary */}
      <Card title="匹配摘要" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="产品">
            {match.product?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLOR[match.matchStatus] || 'default'}>
              {match.matchStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="匹配度">
            <Text
              strong
              style={{ color: SCORE_COLOR(match.matchScore), fontSize: 18 }}
            >
              {match.matchScore}%
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="分类">
            {match.product?.category?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="报价">
            {match.offer
              ? `$${match.offer.price ?? 'N/A'}`
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="匹配时间">
            {formatDate(match.matchedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="审核时间">
            {formatDate(match.reviewedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDate(match.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card 2: Demand Parameters */}
      <Card title="需求参数" style={{ marginBottom: 16 }}>
        {demandParams.length > 0 ? (
          <Table
            dataSource={demandParams}
            columns={paramColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="暂无参数" />
        )}
      </Card>

      {/* Card 3: Match Details — structured explanation or raw JSON */}
      {matchDetails && (
        <Card title="匹配详情" style={{ marginBottom: 16 }}>
          {explanation ? (
            <>
              {/* Match Score */}
              {explanation.score !== undefined && (
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  style={{ marginBottom: 16 }}
                >
                  <Descriptions.Item label="匹配度">
                    <Text
                      strong
                      style={{
                        color: SCORE_COLOR(explanation.score),
                        fontSize: 16,
                      }}
                    >
                      {explanation.score}%
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              )}

              {/* Factors Table */}
              {explanation.factors && explanation.factors.length > 0 && (
                <Table
                  dataSource={explanation.factors}
                  columns={factorColumns}
                  rowKey={(record, index) =>
                    record.code || `factor-${index}`
                  }
                  pagination={false}
                  size="small"
                  style={{ marginBottom: 16 }}
                />
              )}

              {/* Raw JSON Collapse */}
              <Collapse
                items={[
                  {
                    key: 'json',
                    label: '显示原始 JSON',
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
            </>
          ) : (
            <Collapse
              items={[
                {
                  key: 'json',
                  label: '原始匹配数据',
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
          )}
        </Card>
      )}

      {/* Card 4: Lifecycle Actions */}
      {(match.matchStatus === 'PENDING' || match.matchStatus === 'REVIEWED') && (
        <Card title="生命周期操作" style={{ marginBottom: 16 }}>
          {match.matchStatus === 'PENDING' && (
            <Button
              type="primary"
              loading={reviewing}
              onClick={handleReviewMatch}
            >
              审核
            </Button>
          )}

          {match.matchStatus === 'REVIEWED' && (
            <Space>
              <Button
                type="primary"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                loading={reviewing}
                onClick={() => handleAcceptReject('ACCEPTED')}
              >
                接受
              </Button>
              <Button
                danger
                loading={reviewing}
                onClick={() => handleAcceptReject('REJECTED')}
              >
                拒绝
              </Button>
            </Space>
          )}
        </Card>
      )}

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(demandId ? `/demands/${demandId}` : '/demands')
        }
      >
        返回需求
      </Button>
    </div>
  );
}