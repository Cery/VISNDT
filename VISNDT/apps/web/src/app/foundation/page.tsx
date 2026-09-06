'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Button,
  Input,
  Card,
  StatusDisplay,
  LoadingState,
  EmptyState,
  Pagination,
} from '@visndt/design-system';
import {
  Container,
  Stack,
  Flex,
  Grid,
  FormField,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  SearchInput,
  Table,
  Modal,
  Drawer,
  Tabs,
} from '@/components/ui';

/* ============================================================
 * Web Foundation Showcase（WP-2 §31/§32）—— 非业务展示面。
 * 展示并验证 Web UI 基础原语在真实浏览器中可渲染、可交互。
 * ============================================================ */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="w-full p-5">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </Card>
  );
}

const COLORS = [
  { name: 'Primary', hex: '#2563eb' },
  { name: 'Success', hex: '#10b981' },
  { name: 'Warning', hex: '#f59e0b' },
  { name: 'Error', hex: '#ef4444' },
  { name: 'Info', hex: '#0ea5e9' },
  { name: 'Neutral', hex: '#64748b' },
];

const DEMO_ROWS = [
  { id: '1', name: '超声波检测仪', supplier: '中电检测', status: 'PUBLISHED', updated: '2026-09-01' },
  { id: '2', name: 'X 射线探伤机', supplier: '华仪检测', status: 'SUBMITTED', updated: '2026-09-02' },
  { id: '3', name: '涡流探伤仪', supplier: '锐检科技', status: 'REVIEWING', updated: '2026-09-03' },
  { id: '4', name: '磁粉探伤机', supplier: '安创检测', status: 'PENDING', updated: '2026-09-03' },
  { id: '5', name: '渗透检测套件', supplier: '启源仪器', status: 'REJECTED', updated: '2026-09-04' },
];

export default function FoundationShowcasePage() {
  const [tab, setTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPlacement, setDrawerPlacement] = useState<'right' | 'bottom'>('right');
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [tableResponsive, setTableResponsive] = useState<'horizontal' | 'stacked'>('horizontal');
  const [formRequired, setFormRequired] = useState(false);
  const [formRadio, setFormRadio] = useState('option-a');
  const [formSelect, setFormSelect] = useState('');
  const [formText, setFormText] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const pageSize = 2;
  const pagedRows = useMemo(
    () => DEMO_ROWS.slice((tablePage - 1) * pageSize, tablePage * pageSize),
    [tablePage],
  );

  const doSearch = () => {
    setSearchLoading(true);
    window.setTimeout(() => {
      setSearchLoading(false);
    }, 800);
  };

  return (
    <div className="bg-background py-8">
      <Container size="content">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">VISNDT Web Foundation</h1>
          <p className="mt-1 text-muted-foreground">
            WP-2 前端重构基础展示面 · 用于真实浏览器验证基础原语可渲染、可交互、可响应、可访问。
          </p>
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            {
              key: 'overview',
              label: '设计 Token',
              content: (
                <Grid cols={{ base: 2, sm: 3, lg: 6 }} gap={4}>
                  {COLORS.map((c) => (
                    <Card key={c.name} className="p-3 text-center">
                      <div className="mx-auto mb-2 h-10 w-10 rounded-md" style={{ background: c.hex }} />
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.hex}</div>
                    </Card>
                  ))}
                </Grid>
              ),
            },
            {
              key: 'controls',
              label: '表单控件',
              content: (
                <Stack gap={6}>
                  <FormField
                    label="设备名称"
                    required
                    htmlFor="showcase-name"
                    error={formError}
                    helper="请输入检测设备名称"
                  >
                    <Input id="showcase-name" value={formText} onChange={(e) => { setFormText(e.target.value); setFormError(undefined); }} />
                  </FormField>

                  <Select
                    label="所属分类"
                    required
                    id="showcase-select"
                    placeholder="请选择分类"
                    value={formSelect}
                    onChange={(e) => setFormSelect(e.target.value)}
                    options={[
                      { value: 'ultrasonic', label: '超声波检测' },
                      { value: 'xray', label: '射线检测' },
                      { value: 'eddy', label: '涡流检测' },
                    ]}
                  />

                  <Textarea
                    label="产品描述"
                    id="showcase-desc"
                    rows={3}
                    placeholder="输入简要描述"
                  />

                  <Checkbox label="同意《数据使用协议》" required checked={formRequired} onChange={(e) => setFormRequired(e.target.checked)} />

                  <RadioGroup
                    label="检测方式"
                    name="method"
                    layout="row"
                    value={formRadio}
                    onChange={(e) => setFormRadio(e.target.value)}
                    options={[
                      { value: 'option-a', label: '无损' },
                      { value: 'option-b', label: '破坏性' },
                      { value: 'option-c', label: '在线' },
                    ]}
                  />

                  <Flex gap={3} wrap>
                    <Button onClick={() => (formText.trim() ? setFormError(undefined) : setFormError('设备名称不能为空'))}>
                      提交
                    </Button>
                    <Button variant="ghost" onClick={() => { setFormText(''); setFormSelect(''); setFormError(undefined); }}>重置</Button>
                  </Flex>
                </Stack>
              ),
            },
            {
              key: 'data',
              label: '表格与搜索',
              content: (
                <Stack gap={5}>
                  <SearchInput
                    label="搜索检测设备"
                    value={search}
                    loading={searchLoading}
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={() => setSearch('')}
                    onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
                    placeholder="输入关键词后回车"
                  />
                  {searchLoading && (
                    <p className="text-sm text-muted-foreground">正在搜索 “{search}” …</p>
                  )}

                  <Flex gap={3} align="center">
                    <span className="text-sm text-muted-foreground">响应式策略：</span>
                    <Button size="sm" variant={tableResponsive === 'horizontal' ? 'solid' : 'ghost'} onClick={() => setTableResponsive('horizontal')}>
                      水平滚动
                    </Button>
                    <Button size="sm" variant={tableResponsive === 'stacked' ? 'solid' : 'ghost'} onClick={() => setTableResponsive('stacked')}>
                      移动端堆叠
                    </Button>
                  </Flex>

                  <Table
                    responsive={tableResponsive}
                    columns={[
                      { key: 'name', title: '设备名称', dataIndex: 'name', minWidth: 180 },
                      { key: 'supplier', title: '供应商', dataIndex: 'supplier', minWidth: 140 },
                      {
                        key: 'status',
                        title: '状态',
                        render: (r) => <StatusDisplay status={r.status} />,
                        minWidth: 140,
                      },
                      { key: 'updated', title: '更新日期', dataIndex: 'updated', minWidth: 120 },
                    ]}
                    data={pagedRows}
                    rowKey={(r) => r.id}
                    pagination={{ page: tablePage, pageSize, total: DEMO_ROWS.length, onChange: setTablePage }}
                  />

                  <Pagination page={tablePage} pageSize={pageSize} total={DEMO_ROWS.length} onChange={setTablePage} size="sm" />
                </Stack>
              ),
            },
            {
              key: 'status',
              label: '状态 / 反馈',
              content: (
                <Stack gap={5}>
                  <Stack gap={3}>
                    <h4 className="text-sm font-semibold text-foreground">业务状态 → 语义状态</h4>
                    <Flex gap={2} wrap>
                      {['DRAFT', 'SUBMITTED', 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'OPEN', 'RESPONDING', 'CLOSED', 'ACCEPTED'].map((s) => (
                        <StatusDisplay key={s} status={s} />
                      ))}
                    </Flex>
                  </Stack>
                  <Stack gap={3}>
                    <h4 className="text-sm font-semibold text-foreground">加载 / 空态 / 分页已在上方演示</h4>
                    <LoadingState variant="inline" label="加载中…" />
                  </Stack>
                  <EmptyState title="暂无匹配结果" description="调整筛选或关键词后再试" />
                </Stack>
              ),
            },
            {
              key: 'overlay',
              label: '弹窗 / 抽屉',
              content: (
                <Stack gap={4}>
                  <Flex gap={3} wrap>
                    <Button onClick={() => setModalOpen(true)}>打开 Modal</Button>
                    <Button variant="outline" onClick={() => { setDrawerPlacement('right'); setDrawerOpen(true); }}>打开 Drawer (右侧)</Button>
                    <Button variant="ghost" onClick={() => { setDrawerPlacement('bottom'); setDrawerOpen(true); }}>打开 Drawer (底部)</Button>
                  </Flex>
                  <p className="text-sm text-muted-foreground">
                    Modal / Drawer 支持 Esc 关闭、焦点回收与移动端行为（375 视口下 Modal 底部全宽、Drawer 底部抽屉）。
                  </p>
                </Stack>
              ),
            },
            {
              key: 'button',
              label: '按钮',
              content: (
                <Stack gap={4}>
                  <Flex gap={2} wrap>
                    <Button tone="primary">Primary</Button>
                    <Button tone="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </Flex>
                  <Flex gap={2} wrap>
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button variant="link" onClick={() => void 0}>Link</Button>
                  </Flex>
                </Stack>
              ),
            },
          ]}
        />
      </Container>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="创建检测需求"
        confirmLabel="保存"
        cancelLabel="取消"
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <p className="text-muted-foreground">
          这是 VISNDT 基础 Modal。内容区承载表单或说明文字，支持确定 / 取消 / 关闭 / 加载 / 错误反馈。
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement={drawerPlacement}
        title="检测需求详情"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>取消</Button>
            <Button onClick={() => setDrawerOpen(false)}>确认</Button>
          </>
        }
      >
        <p className="text-muted-foreground">
          这是 VISNDT 基础 Drawer。桌面端从右侧滑出，移动端以底部抽屉呈现。
        </p>
      </Drawer>
    </div>
  );
}