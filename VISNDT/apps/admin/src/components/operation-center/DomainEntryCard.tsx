import { Card, Badge, Typography } from 'antd';
import { VISNDT_COLORS } from '../design-system/tokens';

const { Title, Text } = Typography;

interface DomainEntryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor?: string;
  metric?: { label: string; value: number; color?: string };
  badgeCount?: number;
  onClick?: () => void;
}

/**
 * 运营域入口卡片 —— 总览页四大运营域（产品 / 内容 / 供应商 / 商业）的统一管理入口。
 * 仅做导航 + 关键指标呈现，不承载新增业务能力。
 */
export default function DomainEntryCard({
  title,
  description,
  icon,
  accentColor = VISNDT_COLORS.primary,
  metric,
  badgeCount,
  onClick,
}: DomainEntryCardProps) {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        borderTop: `3px solid ${accentColor}`,
        height: '100%',
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${accentColor}, ${VISNDT_COLORS.industrialCyan})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontSize: 18 }}>{icon}</span>
        </div>
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>
      </div>
      <Text type="secondary" style={{ fontSize: 13, display: 'block', minHeight: 40 }}>
        {description}
      </Text>
      {(metric || (badgeCount ?? 0) > 0) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          {metric && (
            <div>
              <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>
                {metric.label}
              </Text>
              <Text strong style={{ color: metric.color || accentColor, fontSize: 20 }}>
                {metric.value}
              </Text>
            </div>
          )}
          {(badgeCount ?? 0) > 0 && (
            <Badge count={badgeCount} color={VISNDT_COLORS.warning} overflowCount={999} />
          )}
        </div>
      )}
    </Card>
  );
}