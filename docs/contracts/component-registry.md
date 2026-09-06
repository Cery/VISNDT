# VISNDT Frontend Component Registry

> **来源**：设计系统的组件注册表，形成真实组件清单，确保不只在文档中描述，而是代码中实际存在。
> **版本**：v1.0（WP-2 Frontend Reconstruction Foundation）
> **事实源**：`packages/design-tokens`（Token）、`packages/design-system`（平台无关 Primitive）、`apps/web/src/components/ui`（Web 特定原语）、`apps/admin/src/components/design-system`（Admin AntD 语义视图）
> **契约参考**：`docs/_review/824_POST_M39_FRONTEND_PRODUCTIZATION_CONTRACT_FREEZE_REPORT.md` §7 / §12 / §43

---

## 1. Design Token Registry

**事实源**：`packages/design-tokens/src/index.ts`；说明性镜像见 `packages/design-tokens/tokens.json`。

| Token 域 | 覆盖项 | Web 消费 | Admin 消费 |
| -------- | ------ | -------- | ---------- |
| Color | primary / industrial（blue/cyan/violet/sky/lime/rose） | Tailwind CSS 变量 / 组件 | `VISNDT_COLORS` / ConfigProvider |
| Neutral 阶 | 0–950 | Tailwind | 组件 |
| Status 语义 | success/warning/error/info/neutral/primary/cyan/violet | `toneToCssVar` | `TONE_TO_ANTD_COLOR` |
| Surface | surface-0/1/2 / elevated / overlay | CSS 变量 | ConfigProvider Layout |
| Typography | fontFamily / fontSize(12–48) / lineHeight / fontWeight | Tailwind | ConfigProvider fontSize |
| Spacing | 0/1/2/3/4/6/8/10/12/16（4px 进制） | `gap-*` | AntD Space |
| Radius | sm(6)/md(8)/lg(12)/xl(16)/full | CSS 变量 | ConfigProvider borderRadius |
| Shadow | sm/md/lg | CSS 变量 | AntD 默认 |
| Border | width / color / focus ring(`--vds-border-focus`) | CSS 变量 | 组件 |
| Interaction | hover/active/disabledFg/disabledBg/disabledBorder | CSS 变量 | AntD disabled |
| Motion | duration(fast/base/slow) + easing | 组件 transition | AntD motion |
| Layout | container(content/wide/reading) + responsivePadding | Container | — |
| Chart | CHART_PALETTE（10 色） | 图表 | Admin 图表 |
| **Status Tone 映射** | `STATUS_TONE`（40+ 业务状态 → 语义色调）+ `resolveStatusTone` + `toneToHex` | StatusDisplay | StatusTag |

---

## 2. Primitive Component Registry

**通用（平台无关，`packages/design-system`）**

| Component | States | Responsive | Accessibility | Ready |
| --------- | ------ | ---------- | ------------- | ----- |
| Button | default/hover/focus/active/disabled/loading | 高度 sm/md/lg | native button + 语义 tone | ✅ |
| Input | default/focus/disabled/error(shell)/loading | w-full | Label 关联 + aria 透传 | ✅ |
| Card | default/hover | 马兜 100% | 语义容器 | ✅ |
| Badge | tone 语义 | inline | 文本 | ✅ |
| Tag | tone 语义 | inline | 文本 | ✅ |
| SectionHeader | — | block | 语义文本 | ✅ |
| Pagination | default/disabled | 移动端可换行 | 按钮 + aria-current | ✅ |
| EmptyState | empty | block | 语义容器 | ✅ |
| LoadingState | loading/inline/full | block | `role=status` | ✅ |
| StatusDisplay | status → 语义色调（tag/badge/text） | inline | 语义文本 + dot aria-hidden | ✅ |
| IconWrapper | — | inline | aria-hidden | ✅ |
| LayoutContainer | — | content/wide/reading | 语义容器 | ✅ |
| BusinessIdentityBadge | 业务身份语义 | inline | 文本 | ✅ |
| Workflow/Status 系列 | 业务状态工作流 | — | 语义 | ✅ |
| Media 系列 | 媒体治理/生命周期 | — | 语义 | ✅ |

**Web 特定（`apps/web/src/components/ui`）**

| Component | States | Responsive | Accessibility | Ready |
| --------- | ------ | ---------- | ------------- | ----- |
| Textarea | default/focus/disabled/error + helper + required | w-full | Label↔Control + aria-invalid/describedby/required | ✅ |
| Select | default/focus/disabled/error + native option disabled | w-full | native select + Label 关联 + aria | ✅ |
| Checkbox | default/focus/disabled/required | inline | Label 显式关联（htmlFor/id） | ✅ |
| RadioGroup | 原生 radio + disabled | row/column | `role=radiogroup` + name 分组 | ✅ |
| SearchInput | default/focus/loading/clear/empty(宿主) | w-full | role=searchbox + Label + aria 透传 | ✅ |
| Table | default/loading/error/empty + pagination + selection | **horizontal 滚动 / stacked 卡片堆叠** | `role=alert/status` + th scope=col + aria-label | ✅ |
| Modal | default/loading/error(children) | 移动端底部全宽(375) + 桌面居中 | `role=dialog` + aria-modal + Escape + Focus Return | ✅ |
| Drawer | default/loading | right(桌面)/bottom(移动) | `role=dialog` + aria-modal + Escape + Focus Return | ✅ |
| Tabs | default/disabled/active | inline 可换行 | ARIA tablist/tab/tabpanel + roving tabindex + 方向键 | ✅ |
| FormField/FieldLabel/FieldMessage/FormSection | default/required/helper/error | block | `useId` + htmlFor 关联 + aria-describedby（`-desc`） | ✅ |
| Container/Grid/Stack/Flex/Visibility | 断点渐变 | 375/768/1024/1440 | 语义容器 | ✅ |
| fieldStyles | inputBase/labelText/helperText/errorText/focusRing/requiredMark | — | 一致性视觉Token复用 | ✅ |

**Admin 特定（`apps/admin`，AntD）**

| Component | States | Responsive | Accessibility | Ready |
| --------- | ------ | ---------- | ------------- | ----- |
| StatusTag | 业务状态 → AntD 语义色 | inline | dot aria-hidden | ✅ |
| VISNDT_COLORS | Token 委托 | — | — | ✅ |
| ConfigProvider 主题 | Token/Status/Spacing/Interaction/Responsive/A11y | — | — | ✅ |
| FoundationShowcase | 展示面 | AntD 栅格响应 | — | ✅ |

---

## 3. Provider 参考

| 位置 | 说明 |
| ---- | ---- |
| `packages/design-tokens/src/index.ts` | 唯一事实源（色/板/状态映射/表层级/布局/交互） |
| `packages/design-system/src/shared.ts` | Tone 语义 → 具体视觉（TONE_STYLE / SOFTER_TONE_STYLE） |
| `apps/web/src/components/ui/fieldStyles.ts` | Tailwind 表单视觉一致性（复用既有 CSS 变量，零 ad-hoc 颜色） |
| `apps/admin/src/components/design-system/tokens.ts` | Admin 委托设计系统 Token |
| `apps/admin/src/providers/AppProvider.tsx` | AntD ConfigProvider 主题接入 |

---

## 4. Browser Foundation Gate 载体

- Web Showcase：`/foundation`（`apps/web/src/app/foundation/page.tsx`）—— 设计 Token / 表单控件 / 表格与搜索 / 状态反馈 / 弹窗抽屉 / 按钮
- Admin Showcase：`/foundation`（`apps/admin/src/pages/FoundationShowcase.tsx`）—— Token 色值 / StatusTag / Responsive 栅格 / 表单

---
> 本文档为 WP-2 交付物之一；具体页面在后续 Page Batch（WP-3A/B/4/5A/B/C）中按此 Registry 消费，禁止 ad-hoc 变体爆炸（§27）。