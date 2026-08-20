import { Card, Statistic, Row, Col } from 'antd';
import {
  EyeOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  SearchOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { DashboardResponse } from '../../types/analytics.types';
import { VISNDT_COLORS } from '../../components/design-system/tokens';

interface Props {
  data: DashboardResponse['summary'];
}

export default function OverviewCards({ data }: Props) {
  const cards = [
    {
      title: '页面浏览量',
      value: data.totalPageViews,
      icon: <EyeOutlined />,
      color: '#2563eb',
    },
    {
      title: '产品浏览量',
      value: data.totalProductViews,
      icon: <ShoppingOutlined />,
      color: VISNDT_COLORS.success,
    },
    {
      title: '内容浏览量',
      value: data.totalContentViews,
      icon: <FileTextOutlined />,
      color: '#fa8c16',
    },
    {
      title: '搜索量',
      value: data.totalSearches,
      icon: <SearchOutlined />,
      color: '#722ed1',
    },
    {
      title: '咨询量',
      value: data.totalInquiries,
      icon: <MailOutlined />,
      color: '#eb2f96',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => (
        <Col xs={24} sm={12} md={8} lg={4} xl={4} key={card.title}>
          <Card size="small">
            <Statistic
              title={card.title}
              value={card.value}
              prefix={<span style={{ color: card.color }}>{card.icon}</span>}
            />
          </Card>
        </Col>
      ))}
      {/* Spacer column for the 5th card on 4-col layout */}
      <Col xs={0} sm={0} md={0} lg={4} xl={4} />
    </Row>
  );
}