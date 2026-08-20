import { useEffect, useState, useCallback } from 'react';
import { Card, Statistic, Row, Col, Spin, Alert, Typography, Button, Space } from 'antd';
import {
  LinkOutlined,
  InfoCircleOutlined,
  PercentageOutlined,
  StopOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { matchService } from '../api';
import { useNavigate } from 'react-router-dom';
import type { MatchingStats } from '../types';

const { Title, Paragraph } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; stats: MatchingStats };

function MatchingMonitor() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchStats = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const stats = await matchService.getMatchingStats();
      setPageState({ status: 'success', stats });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载匹配数据失败';
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
          message="加载匹配数据失败"
          description={pageState.message}
          showIcon
          action={
            <Button size="small" onClick={fetchStats}>
              重试
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
        匹配监控
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总匹配数"
              value={stats.totalMatches}
              prefix={<LinkOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均匹配度"
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
              title="强制失败数"
              value={stats.hardFailCount}
              prefix={<StopOutlined />}
              valueStyle={{ color: stats.hardFailCount > 0 ? '#cf1322' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="重新匹配次数"
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
          <InfoCircleOutlined style={{ marginRight: 8, color: '#2563eb' }} />
          匹配引擎已与需求工作流集成。
        </Paragraph>
        <Paragraph type="secondary" style={{ marginBottom: 12 }}>
          如需查看详细的匹配信息，请检查各个需求详情页面。每个需求页面会展示其匹配的产品、匹配度和匹配状态。
        </Paragraph>
        <Space>
          <Button
            type="primary"
            icon={<UnorderedListOutlined />}
            onClick={() => navigate('/demands')}
          >
            查看需求列表
          </Button>
          <Button
            icon={<LinkOutlined />}
            onClick={() => navigate('/products')}
          >
            查看产品列表
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default MatchingMonitor;