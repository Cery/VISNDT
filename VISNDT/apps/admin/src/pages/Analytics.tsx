import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spin, Alert, DatePicker, Button, Space, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { analyticsService } from '../api/analytics.service';
import type { DashboardResponse } from '../types/analytics.types';
import OverviewCards from './analytics/OverviewCards';
import TrendChart from './analytics/TrendChart';
import TopProductsTable from './analytics/TopProductsTable';
import TopContentTable from './analytics/TopContentTable';
import { PageHeader } from '../components/common';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const fetchDashboard = useCallback(async (from?: string, to?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getDashboard(
        from && to ? { from, to } : undefined,
      );
      setData(result);
    } catch {
      setError('加载数据分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      fetchDashboard(
        dates[0].startOf('day').toISOString(),
        dates[1].endOf('day').toISOString(),
      );
    }
  };

  const handleRefresh = () => {
    if (dateRange) {
      fetchDashboard(
        dateRange[0].startOf('day').toISOString(),
        dateRange[1].endOf('day').toISOString(),
      );
    } else {
      fetchDashboard();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  if (!data) {
    return <Alert type="info" message="暂无数据" showIcon />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader
        title="数据分析"
        subtitle="平台运营数据统计与趋势分析"
        extra={
          <Space>
            <Text strong>时间范围：</Text>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              allowClear
              placeholder={['开始日期', '结束日期']}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
      />
      <OverviewCards data={data.summary} />
      <TrendChart data={data.trend} />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <TopProductsTable data={data.topProducts} />
        </Col>
        <Col xs={24} lg={12}>
          <TopContentTable data={data.topContent} />
        </Col>
      </Row>
    </div>
  );
}