# @visndt/design-system — VISNDT UI Primitive Layer v1.0

跨 Web/Admin 的可复用 UI 原语层。仅依赖 `@visndt/design-tokens`，不引用宿主 CSS，具备主题兼容性。

## 安装（workspace）

```bash
pnpm --filter <app> add @visndt/design-system
```

## 组件清单（Figma Component ↔ Code Component ↔ Usage）

| 组件 | 用途 | 用法示例 |
|------|------|---------|
| `Button` | 主/次/幽灵/柔和/文本按钮 | `<Button tone="primary">提交</Button>` |
| `Input` | 表单输入（label/hint/error/prefix/suffix） | `<Input label="型号" error="必填" />` |
| `Card` | 工业卡片（title/accent/hoverable） | `<Card title="产品" accent="cyan">…</Card>` |
| `Badge` | 计数/状态点角标 | `<Badge count={5}><Bell /></Badge>` |
| `Tag` | 语义标签 | `<Tag tone="success">已发布</Tag>` |
| `SectionHeader` | 统一章节标题（消灭三套实现） | `<SectionHeader title="产品中心" />` |
| `Pagination` | 统一分页 | `<Pagination page total onChange />` |
| `EmptyState` | 统一空态 | `<EmptyState icon={…} title="暂无数据" />` |
| `LoadingState` | spinner/skeleton/inline 加载态 | `<LoadingState variant="skeleton" />` |
| `StatusDisplay` | 语义状态呈现（tag/badge/text） | `<StatusDisplay status="PUBLISHED" />` |
| `IconWrapper` | 图标统一尺寸/颜色/容器背景 | `<IconWrapper container tone="primary"><Icon /></IconWrapper>` |
| `LayoutContainer` | 内容容器 | `<LayoutContainer>…</LayoutContainer>` |

## 主题 Token（单一事实源）

见 `@visndt/design-tokens`（`colors.primary=$#2563eb`、`STATUS_TONE`、`typography/spacing/radius/shadow/motion`）。

## 禁止

- 在业务页面内定义散乱色值 / 状态配色（必须经 StatusDisplay + tokens）。
- 直接 import 宿主 CSS（组件不含宿主依赖）。

## 约束（冻结边界）

本包仅承载设计系统原语，**不得**包含任何业务逻辑、状态管理、路由或数据获取。