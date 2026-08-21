import { Typography } from 'antd';
import { VISNDT_COLORS } from '../design-system/tokens';

const { Text } = Typography;

interface OperationSectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  accentColor?: string;
}

/**
 * 运营中心区块标题 —— 统一工业视觉：左侧强调条 + 图标 + 标题 + 说明。
 */
export default function OperationSectionHeader({
  title,
  icon,
  subtitle,
  accentColor = VISNDT_COLORS.primary,
}: OperationSectionHeaderProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 4,
            height: 18,
            borderRadius: 2,
            background: accentColor,
            flexShrink: 0,
          }}
        />
        {icon && <span style={{ color: accentColor, fontSize: 16 }}>{icon}</span>}
        <Typography.Title level={5} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
      </div>
      {subtitle && (
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            marginLeft: 4 + (icon ? 24 : 0),
            display: 'block',
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      )}
    </div>
  );
}