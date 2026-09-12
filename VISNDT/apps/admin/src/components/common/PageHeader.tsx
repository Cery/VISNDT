import { ReactNode } from 'react';
import { Typography } from 'antd';
import { VISNDT_COLORS } from '../design-system/tokens';

const { Title, Text } = Typography;

interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 可选：副标题或说明文字 */
  subtitle?: string;
  /** 可选：标题右侧的操作按钮区域 */
  extra?: ReactNode;
  /** 可选：语义色条（默认为琥珀色） */
  accentColor?: string;
}

/**
 * Admin 端统一页头组件
 *
 * 设计规范：
 * - 4px 垂直色块（左侧）+ 标题 + 副标题
 * - 替代此前在 15+ 文件中重复的页头结构
 * - 统一视觉语言：石墨灰底 + 琥珀色强调
 *
 * 使用示例：
 * ```tsx
 * <PageHeader
 *   title="需求列表"
 *   subtitle="买方发布的检测需求"
 *   extra={<Button type="primary">创建需求</Button>}
 * />
 * ```
 */
export default function PageHeader({
  title,
  subtitle,
  extra,
  accentColor = VISNDT_COLORS.warning, // 默认琥珀色
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        padding: '16px 0',
        borderBottom: `1px solid ${VISNDT_COLORS.neutral}20`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* 4px 色块 - 视觉锚点 */}
        <div
          aria-hidden="true"
          style={{
            width: 4,
            height: 32,
            backgroundColor: accentColor,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />

        <div>
          <Title level={3} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
              {subtitle}
            </Text>
          )}
        </div>
      </div>

      {extra && <div>{extra}</div>}
    </div>
  );
}
