import { Card } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DashboardResponse } from '../../types/analytics.types';

interface Props {
  data: DashboardResponse['trend'];
}

const COLORS: Record<string, string> = {
  pageViews: '#1677ff',
  productViews: '#52c41a',
  contentViews: '#fa8c16',
  searches: '#722ed1',
  inquiries: '#eb2f96',
  ctaClicks: '#13c2c2',
};

const LABELS: Record<string, string> = {
  pageViews: '页面浏览',
  productViews: '产品浏览',
  contentViews: '内容浏览',
  searches: '搜索',
  inquiries: '咨询',
  ctaClicks: 'CTA点击',
};

export default function TrendChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card title="近7日趋势">
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div>
      </Card>
    );
  }

  return (
    <Card title="近7日事件趋势">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend
            formatter={(value: string) => LABELS[value] ?? value}
          />
          {Object.keys(COLORS).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[key]}
              strokeWidth={2}
              dot={false}
              name={key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}