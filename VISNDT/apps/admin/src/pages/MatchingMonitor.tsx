import { useEffect, useState, useCallback } from 'react';
import { Card, Statistic, Row, Col, Spin, Alert, Typography, Button } from 'antd';
import {
  LinkOutlined,
  InfoCircleOutlined,
  PercentageOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { matchService } from '../api';
import type { MatchingStats } from '../types';

const { Title, Paragraph } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; stats: MatchingStats };

function MatchingMonitor() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchStats = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const stats = await matchService.getMatchingStats();
      setPageState({ status: 'success', stats });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load matching data';
      setPageState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          message="Failed to load matching data"
          description={pageState.message}
          showIcon
          action={
            <Button size="small" onClick={fetchStats}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const { stats } = pageState;

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Matching Monitor
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Matches"
              value={stats.totalMatches}
              prefix={<LinkOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Score"
              value={stats.averageScore}
              prefix={<PercentageOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hard Fail Count"
              value={stats.hardFailCount}
              prefix={<StopOutlined />}
              valueStyle={{ color: stats.hardFailCount > 0 ? '#cf1322' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Rematch Count"
              value={stats.rematchCount}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: 16 }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <Paragraph style={{ marginBottom: 8 }}>
          <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Matching engine is integrated with the Demand workflow.
        </Paragraph>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          For detailed match information, please check individual Demand Detail
          pages. Each Demand displays its matched products, scores, and match
          statuses.
        </Paragraph>
      </Card>
    </div>
  );
}

export default MatchingMonitor;