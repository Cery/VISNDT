import { Typography } from 'antd';
import type { ReactNode } from 'react';
import { TONE_TO_HEX, type SemanticTone } from '../design-system/tokens';

const { Title } = Typography;

interface SectionHeaderProps {
  title: ReactNode;
  /** 运营信息层级：章节说明（数据含义 / 判断口径） */
  subtitle?: ReactNode;
  /** 语义强调色（左侧竖条 + 标题强调） */
  tone?: SemanticTone;
  /** 右侧附加操作区 */
  extra?: ReactNode;
}

/**
 * 运营驾驶舱章节标题 —— 统一「信息层级」表达：
 * 强调条 + 章节标题 + 口径说明 + 附加操作。
 */
export default function SectionHeader({
  title,
  subtitle,
  tone = 'primary',
  extra,
}: SectionHeaderProps) {
  const accent = TONE_TO_HEX[tone];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span
          style={{
            width: 4,
            minHeight: 20,
            alignSelf: 'stretch',
            borderRadius: 2,
            background: accent,
            marginTop: 2,
          }}
          aria-hidden="true"
        />
        <div>
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, lineHeight: 1.5 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {extra}
    </div>
  );
}