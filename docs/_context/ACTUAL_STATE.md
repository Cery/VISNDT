# ACTUAL_STATE.md — 全量路由普查与核实实际状态（追加式）

> 规则：只追加，不覆盖；每条标注日期与证据（源码路径 / 实测）。

## 2026-09-09 — API 全量路由普查（补阶段四）

遍历 `apps/api/src` 共 **48 个 controller、275 个 HTTP 端点**（方法装饰器计数）。

| 前缀 (@Controller) | 端点数 | 文件 |
|---|---|---|
| `analytics`×2 | 1+3 | analytics.controller / analytics-read.controller |
| `ai` | 3 | ai.controller |
| `auth`×2 | 6+1(邀请) | auth.controller / invitation.controller |
| `admin/dashboard` | 5 | admin.controller |
| `admin/product-category-knowledge-mappings` | 6 | admin-product-category-knowledge-mapping.controller |
| `admin/monitoring` | 1 | admin-monitoring.controller |
| `admin/matching` | 1 | admin-matching.controller |
| `admin/inquiries` | 6 | admin-inquiry.controller |
| `admin/demands` | 1 | admin-demand.controller |
| `admin/audit-logs` | 2 | admin-audit-log.controller |
| `admin/audit-intelligence` | 1 | admin-audit-intelligence.controller |
| `admin/analytics/business` | 4 | admin-analytics.controller |
| `admin/supplier-products` | 11 | supplier-products.controller |
| `content` / `content/:contentId/media` | 12+6+8+2 | content / content-media / content-tag / content-revision |
| `health` | 1 | health.controller |
| `notifications` | 6 | notifications.controller |
| `knowledge` / `knowledge/public` | 22+6 | knowledge / knowledge-public |
| `inquiries` | 3 | inquiries.controller |
| `workspace` | 10 | workspace.controller |
| `files` | 8 | file-asset.controller |
| (空,@Controller()) | 8 | rfq-responses.controller |
| `parameter-groups` / `parameter-definitions` | 6+6 | parameter-groups / parameter-definitions |
| `supplier-products`(自服务) | 10 | supplier-products-self-service.controller |
| `products` / `products/:id/parameters` / `products/:productId/media` | 9+2+7 | products / product-parameters / product-media |
| `matches` | 1 | matching.controller |
| `evaluations` | 6 | evaluations.controller |
| `organizations` / `organizations/:id/members` | 8+3 | organizations / organization-members |
| `workflow-events` | 3 | workflow-events.controller |
| `embedding` | 7 | embedding.controller |
| `product-categories` | 7 | product-categories.controller |
| `users` | 7 | users.controller |
| `capabilities` | 1 | discovery/capabilities.controller |
| `rfqs` | 12 | rfqs.controller |
| `offers` | 11 | offers.controller |
| `search` | 3 | search.controller |
| `semantic`×2 | 2+1 | semantic / semantic-query |
| `demands` | 19 | demands.controller |
| 合计 | **275** | 48 controllers |

> 注：M11.3 记录为"22 controllers / 83 endpoints"，系早期快照；如实测现为 48/275（项目持续推进）。早前核实报告称"demands/rfqs/offers/rfq-responses/notifications 接口均存在"与之吻合。

## 2026-09-09 — 命名对比核实（补阶段五）

`database/prisma/schema.prisma` 实测模型：`ProductCategory`、`Product`、`ProductMedia`、`ParameterGroup`、`ParameterDefinition`、`ParameterOption`、`ProductParameterValue`、`ProductParameterDefinition`、`RFQ`、`RFQResponse`、`WorkflowEvent`、`ProductCategoryKnowledgeMapping`。

**不存在**以下模型：`StandardProduct`、`ParameterTemplate`、`WorkflowInstance`、`RFQItem`。
结论：代码/schema 层命名自洽，均与交接文档所列"正确名"一致；Blueprints 文档中出现的替代命名（ParameterTemplate/WorkflowInstance/RFQItem/StandardProduct）属**文档漂移**，非代码重复。→ 已写入 DECISIONS.md"不回溯改名"。

## 2026-09-09 — apps/web 工业蓝图独立核实（补已知结论）

直接读 `apps/web/src/components/home/` 源码，确认存在 15 个组件，其中 HomeHero 等使用 `blueprint-*` 设计令牌并接真实数据：
- `HomeHero.tsx`：#L58 `bg-blueprint-graphite text-blueprint-paper`、#L88 `bg-blueprint-amber text-blueprint-graphite`、#L164 `text-blueprint-amber`；真实数据 `getProducts total`（产品型号数）与 `supplier-discovery suppliers.total`（供应商数，引 854-02）。
- `BlueprintContainer.tsx`：薄封装（className 透传）。
- 蓝图新组件：HomeHero / CategoryRegisterSection / RecentProductsSection / SolutionFlowSection / KnowledgeIndexSection / CTASection。
结论：**工业蓝图 + 真实数据驱动为源码事实**（非依赖 854 报告自证）。

## 2026-09-09 — 全局 Header/Footer 蓝图画皮证据补充

补：`apps/web/src/components/layout/PublicHeader.tsx` 实测 **22 处 `blueprint-*`**（L117-368：sticky 顶栏 `bg-blueprint-paper/95`、`rounded-blueprint`、蓝图 LOGO `VIS-NDT`（`text-blueprint-amber-deep`）、下方导航行 `bg-blueprint-graphite text-blueprint-paper`、`bg-blueprint-amber` 高亮）。`PublicFooter.tsx` 实测 L57 `text-blueprint-amber`。→ 支撑 CLAUDE.md 第 8 节"全局 Header/Footer 已落地"断言。

## 2026-09-09 — 更正记录（早期判读有误，含机制）
1. **tag 判读更正**：`v0.7-release-ready` 为 annotated tag，tag 对象 `368b1aa` 指向 commit `168f353`，**从未重打**。`git rev-parse` 对 annotated tag 返回 tag 对象哈希，早期误判为"曾重打/指向 368b1aa"。
2. **bcrypt 机制更正**：node_modules **已安装**（代码根 + apps/api/admin 均有 node_modules，pnpm-lock.yaml 存在）；`bcrypt@6.0.0` 已在 `.pnpm`（`node_modules/.pnpm/bcrypt@6.0.0/...`），但原生二进制 **`bcrypt_lib.node` 缺失**（允许构建被 `allowBuilds:false` 拦截）。故登录鉴权 `require('bcrypt')` 届时必然失败——是本决策（暂不放开）需待真实鉴权阶段再处理的真实原因。（早期写"依赖未安装"不成立。）
3. **854 报告时序澄清**：`docs/_review/全站语义治理补漏闭环报告.md` 创建于 2026-09-09 **10:14:25**，早于本轮"禁止新建编号报告"治理锁定的决策时间；且其**文件名无数字编号前缀**，不属被禁的 `<编号>_*.md` 模式。未违反治理锁定；此后不再新建编号报告。

## 阶段四遗留项最终核实结论
1. `GET /files/:id`（单文件元数据）→ 仍缺失（files 控制器仅 list/get-download/get-orphans/delete）。
2. `organizations GET :id` → 已修复（public，findOnePublic）。
3. `categories` 重复 → API 层无重复。
4. `Placeholder.tsx` → 已删除（死代码）。
5. ENUM Option 管理 UI → 仍缺失。
6. `ORG_ADMIN` → 仍不在 Role 枚举（ADMIN/MEMBER/SUPPLIER）。
7. `BusinessAnalytics` 颜色字面量 → 9 处已修复。
8. `pnpm allowBuilds` bcrypt/sharp:false → 仍存在（决策：暂不放开）。
9. admin vite proxy → 已修复（→4000）。
附：API e2e spec 现为 19 个（交接文档写 17，有增量）。