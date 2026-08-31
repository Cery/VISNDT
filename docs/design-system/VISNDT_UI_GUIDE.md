# VISNDT UI Guide（M32 Design Token Freeze — v1.0）

> 状态：**FROZEN**（720_M32.0）
> 性质：Design System 顶层入口规范
> 引用：VISNDT_COLOR_SYSTEM.md / VISNDT_TYPOGRAPHY.md / VISNDT_SPACING.md / VISNDT_COMPONENT_RULE.md

---

## 1. 平台定位（Platform Identity 冻结）

VISNDT 前端必须表现为 **Industrial Inspection Capability Discovery Platform**，而不是企业官网 / 产品目录 / CMS 后台 / 商城。

核心关系（不得混淆）：
`Scenario/Need -> Capability -> Product -> Supplier Model -> Demand -> Match -> RFQ -> Offer/Response`
独立约束：
- Capability 不等于 Product
- Product 不等于 Supplier Model
- Offer 不等于 Product Price
- Demand 不等于 RFQ

---

## 2. 页面认知顺序（首页冻结）

Platform Hero -> Capability Search -> Capability Categories -> Recommended Capabilities -> Products / Supplier Models -> How Matching Works -> Knowledge / Solutions -> Buyer / Supplier Entry。

首屏与主 CTA 必须首先传递「这里可以找工业检测能力」，而非「这是某公司官网」。

---

## 3. 主要页面体验基线（冻结，M32.1 实施）

| 页面 | 目标 |
| --- | --- |
| Home | 平台身份 + 能力搜索 + 供采入口 |
| Products | Product 不等于 Capability；卡片含能力/参数/供应商 |
| Product Detail | Product -> Capability -> Parameters -> Supplier Models -> Related -> Demand |
| Search | Query -> Capability -> Product -> Supplier Model -> Knowledge |
| Content | Article/Solution/Knowledge 成为平台入口 |
| Compare | 移动端可读不遮挡 |
| Workspace | Dashboard 感：状态 + 待办 + 上下文 + 下一步 |
| Admin | 平台治理中心，非 CMS |

---

## 4. 内容页原则

Article/Solution：Hero -> Title -> Metadata -> Summary -> TOC -> Main -> Media -> Related Capability -> Related Product -> Related Supplier Model -> Demand CTA。
Knowledge：Domain -> Category -> Entry -> Section -> Parameter/Table -> Reference -> Related Capability。

---

## 5. 状态驱动（State-Driven UX）

- Demand: DRAFT -> OPEN -> MATCHED -> RFQ -> RESPONDING -> CLOSED
- Capability: DRAFT -> SUBMITTED -> REVIEWING -> ACCEPTED -> PUBLISHED
- RFQ Response: SUBMITTED -> VIEWED -> ACCEPTED/REJECTED

每个状态须同时给出 Badge + Action + Context。

---

## 6. Token 唯一规范源

- 唯一规范源：docs/design-system/。
- 代码仅消费 Token，不自行定义新品牌色 / 字体 / 间距。
- 禁止新增 packages/design-system workspace package；沿用现有 packages/design-tokens。

---

## 7. 技术约束（冻结）

- 后端 API = UNCHANGED；Schema = FROZEN；Migration = NONE；Matching/Search/AI = FROZEN。
- 禁止新增运行时依赖：framer-motion / styled-components / 新 UI 库 / 新 Icon 库 / 新图表库。
- 动效：CSS First + Native React；系统优先字体。
- Admin：Same Token + Different Application Theme。

---

## 8. 移动端 / 无障碍 / 反馈（冻结基线）

- 移动端核心路径 375px / 768px 可用（见 Runtime Gate 验证矩阵）。
- 键盘 Focus 可见、语义化 heading、Reduced Motion 生效。
- 加载 / 成功 / 错误即时反馈。

---

## 9. M32 停止线

达到 6 个 Hard Gate（Platform Identity / Buyer Journey / Supplier Journey / Brand System / Mobile+Interaction / Release Validation）即 M32 CLOSED。剩余（Dark Mode、AI、RAG、Vector、Search V2、Advanced Animation/Recommendation/Analytics/CMS、Marketplace、Transaction）一律进入 Future Candidate，不扩张 M32。