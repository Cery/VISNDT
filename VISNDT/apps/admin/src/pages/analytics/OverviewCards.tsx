import { Row, Col } from 'antd';
import {
  EyeOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  SearchOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import type { DashboardResponse } from '../../types/analytics.types';
import { KpiCard } from '../../components/dashboard';
import type { SemanticTone } from '../../components/design-system/tokens';

interface Props {
  data: DashboardResponse['summary'];
}

interface CardSpec {
  title: string;
  value: number | string;
  icon: ReactNode;
  tone: SemanticTone;
  hint: string;
}

/**
 * M33.2 — Executive KPI strip（消费已重设计的 KpiCard）
 * Executive KPI → Operational Meaning；统一 icon 运行时（@ant-design/icons），无 emoji；
 * 数据口径与来源完全不变（data.summary）。
 */
export default function OverviewCards({ data }: Props) {
  const cards: CardSpec[] = [
    {
      title: '页面浏览量',
      value: data.totalPageViews,
      icon: <EyeOutlined />,
      tone: 'primary',
      hint: '全站页面访问总量',
    },
    {
      title: '产品浏览量',
      value: data.totalProductViews,
      icon: <ShoppingOutlined />,
      tone: 'success',
      hint: '能力详情页访问量',
    },
    {
      title: '内容浏览量',
      value: data.totalContentViews,
      icon: <FileTextOutlined />,
      tone: 'warning',
      hint: '内容/知识页访问量',
    },
    {
      title: '搜索量',
      value: data.totalSearches,
      icon: <SearchOutlined />,
      tone: 'violet',
      hint: '能力搜索执行次数',
    },
    {
      title: '咨询量',
      value: data.totalInquiries,
      icon: <MailOutlined />,
      tone: 'info',
      hint: '买家发起的咨询数量',
    },
  ];

  return (
    <Row gutter={[16, 16]} className="admin-stat-row">
      {cards.map((card) => (
        <Col xs={24} sm={12} md={8} lg={4} xl={4} key={card.title}>
          <KpiCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            tone={card.tone}
            hint={card.hint}
          />
        </Col>
      ))}
      {/* Spacer column for the 5th card on 4-col layout */}
      <Col xs={0} sm={0} md={0} lg={4} xl={4} />
    </Row>
  );
}