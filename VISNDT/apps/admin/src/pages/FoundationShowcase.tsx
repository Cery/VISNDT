import { Card, Space, Row, Col, Button, Input } from 'antd';
import StatusTag from '../components/design-system/StatusTag';

/* ============================================================
 * VISNDT Admin Foundation Showcase（WP-2 §31/§32）
 * 验证 Admin 侧与 design-tokens 语义对齐：Token / Status / Spacing / Responsive。
 * 不替换 AntD 控件，仅验证语义对齐。
 * ============================================================ */

const COLORS = [
  { name: 'Primary', hex: '#2563eb' },
  { name: 'Success', hex: '#10b981' },
  { name: 'Warning', hex: '#f59e0b' },
  { name: 'Error', hex: '#ef4444' },
  { name: 'Info', hex: '#0ea5e9' },
  { name: 'Neutral', hex: '#64748b' },
];

const DEMO_STATUSES = [
  'DRAFT', 'SUBMITTED', 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED',
  'PUBLISHED', 'OPEN', 'RESPONDING', 'CLOSED', 'ACCEPTED', 'CANCELLED',
];

export default function FoundationShowcase() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">VISNDT Admin Foundation</h1>
      <p className="text-gray-500 mb-6">
        WP-2 语义对齐验证：Brand 色值 / Status 语义 / Responsive 栅格（375/768/1024/1440 适配）
      </p>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">1. 设计 Token 色值</h3>
        <Row gutter={[16, 16]}>
          {COLORS.map((c) => (
            <Col xs={12} sm={6} md={4} lg={2} key={c.name}>
              <Card hoverable size="small">
                <div
                  className="w-full h-10 rounded mb-2"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.hex}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">2. 业务状态 → 语义色调（StatusTag 对齐）</h3>
        <Card>
          <div className="flex flex-wrap gap-2">
            {DEMO_STATUSES.map((s) => (
              <StatusTag key={s} status={s} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">3. Responsive 栅格验证</h3>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col xs={12} sm={6} md={4} lg={3} key={i}>
              <Card size="small" hoverable>
                <div className="text-center py-3 text-sm">Col xs=12 sm=6 md=4 lg=3 #{i}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">4. 表单控件（使用 AntD，语义对齐）</h3>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: 480 }}>
            <div>
              <label className="block text-sm font-medium mb-1.5">设备名称</label>
              <Input placeholder="请输入设备名称" />
            </div>
            <div className="flex gap-2">
              <Button type="primary">确定</Button>
              <Button>取消</Button>
            </div>
          </Space>
        </Card>
      </div>

      <div className="mb-0 text-gray-500 text-xs">
        验证结果：Admin 侧已通过 ConfigProvider 与 @visndt/design-tokens 对齐，
        StatusTag 直接使用 STATUS_TONE / TONE_TO_ANTD_COLOR 保证语义统一。
        不替换 AntD 控件，只对齐 Token 语义 / Status 语义 / 布局响应。
      </div>
    </div>
  );
}