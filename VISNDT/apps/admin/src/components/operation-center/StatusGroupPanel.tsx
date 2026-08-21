import { Card, Progress, Empty, Row, Col, Statistic } from 'antd';
import type { ReactNode } from 'react';
import { VISNDT_COLORS } from '../design-system/tokens';
import type { StatusGroupItem } from '../../types/operation-center.types';

interface StatusGroupPanelProps {
  title: ReactNode;
  groups: StatusGroupItem[];
  total: number;
  active: number;
  activeLabel?: string;
  emptyHint?: string;
  accentColor?: string;
}

/**
 * 状态分组面板 —— 以「状态 → 数量 → 占比」组织的一级运营状态分组。
 * 数据全部来自现有 API 组合，仅做读侧聚合展示。
 */
export default function StatusGroupPanel({
  title,
  groups,
  total,
  active,
  activeLabel = '有效数量',
  emptyHint = '暂无数据',
  accentColor = VISNDT_COLORS.primary,
}: StatusGroupPanelProps) {
  return (
    <Card title={title} style={{ height: '100%' }}>
      {groups.length === 0 ? (
        <Empty description={emptyHint} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Statistic
                title="总量"
                value={total}
                valueStyle={{ color: accentColor, fontWeight: 700 }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={activeLabel}
                value={active}
                valueStyle={{ color: VISNDT_COLORS.success, fontWeight: 700 }}
              />
            </Col>
          </Row>
          {groups.map((g) => {
            const pct = total > 0 ? Math.round((g.count / total) * 100) : 0;
            return (
              <div key={g.key} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 13 }}>{g.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{g.count}</span>
                </div>
                <Progress
                  percent={pct}
                  showInfo={false}
                  size="small"
                  strokeColor={accentColor}
                />
              </div>
            );
          })}
        </>
      )}
    </Card>
  );
}