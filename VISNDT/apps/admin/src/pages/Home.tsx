import { useEffect, useState, useCallback } from 'react';
import { Card, Statistic, Row, Col, Spin, Alert, Typography, Button } from 'antd';
import {
  TeamOutlined,
  BankOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { dashboardService } from '../api';
import type { DashboardStats } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; stats: DashboardStats };

function Home() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchStats = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const stats = await dashboardService.getStats();
      setPageState({ status: 'success', stats });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load dashboard data';
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
          message="Failed to load dashboard"
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
        Dashboard Overview
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Users"
              value={stats.users.total}
              prefix={<TeamOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  {stats.users.active} active
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Organizations"
              value={stats.organizations.total}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Products"
              value={stats.products.total}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Demands"
              value={stats.demands.total}
              prefix={<FileTextOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: '#1890ff' }}>
                  {stats.demands.published} published
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Matches"
              value={stats.matching.totalMatches}
              prefix={<LinkOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;