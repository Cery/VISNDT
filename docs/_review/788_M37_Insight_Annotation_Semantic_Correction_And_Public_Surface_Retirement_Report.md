# 788_M37_Insight_Annotation_Semantic_Correction_And_Public_Surface_Retirement_Report

- **Task ID**: 788_M37_Insight_Annotation_Semantic_Correction_And_Public_Surface_Retirement
- **Task Name**: M37 Insight Annotation Semantic Correction And Public Surface Retirement
- **Stage**: M37 Knowledge + Insight Asset System（内部受控修正，非新阶段）
- **Task Type**: Targeted Semantic Correction / Frontend Alignment / Existing Model Reuse / Scope Integrity
- **Execution Mode**: CONTROLLED CORRECTION / VERIFY / DOCUMENT / STOP
- **Authorization Source**: 786 (M37 Authorization Gate) + 787 (M37 Implementation) + 本轮人工最终产品语义校准（Insight = Contextual Engineering Annotation）
- **Date**: 2026-09-01

---

## 1. Repository Verification

| Item | Result |
|---|---|
| Repository Root (`git rev-parse --show-toplevel`) | `F:\Desktop\VISNDT` ✅ |
| Code Root | `F:\Desktop\VISNDT\VISNDT` ✅ |
| `apps/web` | 存在 ✅ |
| `apps/api` | 存在 ✅ |
| `database/prisma` | 存在 ✅ |
| `docs` | 存在 ✅ |

预执行验证通过，与 777-787 一致。

## 2. Git Baseline

| Item | Result |
|---|---|
| Branch | `main` ✅ |
| HEAD | `76b08e508325b7c094c7b7f1234fc18e8e37014e` ✅ |
| Working Tree | 存在未提交改动（788 前端修正 + 既有 777-787/M34.7 改动），未执行 `reset / clean / checkout . / restore . / stash / rebase / merge` 等破坏性命令 ✅ |
| 保留 | 777/778/779/780/781/782/783/784/785/786/787 全部未提交工作均保留 ✅ |
| 历史报告 / Frozen Architecture | 未改写（777-787 + M34 Contract）✅ |

## 3. 787 Reconciliation

- 读取并核验 `docs/_review/786_*` 与 `docs/_review/787_*`，以及 `PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md`。
- 前序状态确认：**M36 = CLOSED（785）**；**M35 = CONDITIONAL / NOT CLOSED**；**M37 = IMPLEMENTED / AWAITING FULL CLOSEOUT（787 = CONDITIONAL PASS）**。
- 确认 787 已将 `/insights` 实现为**独立公开 Insight Library / Insight Detail** 表面。该实现经与本轮人工最终产品语义校准比对，判定为 **PRODUCT SEMANTIC DRIFT**（Insight 应为上下文注释层，而非公开内容频道），本任务予以受控修正。

## 4. Insight Semantic Correction Requirement

- 纠正目标：Insight = **Contextual Engineering Annotation Layer = Engineering Semantic Annotation / Contextual Explanation**。
- 用途边界：参数名称、技术术语、专业概念、检测方法术语、工程缩写、必要工程概念，在用户浏览页面时通过 ⓘ（点击/悬停桌面、展开/弹窗移动端）提供上下文解释。
- Insight ≠ Public Content Channel；Insight ≠ Knowledge；Insight ≠ Solution。

## 5. Insight Public Surface Audit

- 787 现状：`/insights`（Insight Library）+ `/insights/[slug]`（Insight Detail）+ 导航一级栏目「行业洞察」+ sitemap INSIGHT 收录 → 构成完整公开内容面，与最终语义不符。
- 处理：均按「最小必要处理」收敛（见 §14）。

## 6. Insight Final Architecture Boundary

- 冻结：**Insight = Contextual Engineering Annotation Layer**（非公开内容频道）。
- Insight 嵌入 Product / Search / Knowledge / Solution 的真实工程上下文；**非一级导航项**。
- 保持 Knowledge = Public Discoverable Engineering Information Asset；Insight ≠ 第二种 Knowledge/Article/Solution。

## 7. Existing Data Source Verification

- 复用既有承载能力：ContentType.INSIGHT + Content + ContentTag + ContentTagRelation + KnowledgeEntry + KnowledgeContentRef + ParameterDefinition + ProductParameterValue。
- 实测知识数据可用：`/knowledge-base` 含 `flaw-detector-parameter-explanation`、`industrial-endoscope-parameter-guide`、`pipeline-internal-inspection-method` 等真实 PUBLISHED KnowledgeEntry（title/summary 可被确定性消费）。
- 未引入任何新 Entity / Relation / API。

## 8. Annotation Resolver Strategy

- 新增 `lib/engineering-insight/annotation.ts`：`resolveEngineeringAnnotations(terms)` 确定性解析器。
- 数据源优先级（与 2.6 一致）：ContentType.INSIGHT 已发布内容 → KnowledgeEntry 已发布条目（title/summary 包含匹配）。
- **无匹配 → 不显示注释；绝不 fabricated / LLM-guessed / hard-coded 虚假工程事实（AC-12 / AC-13）**。
- 消费既有 `content.service` + `knowledge-base.service`，无新 API（AC-05）。

## 9. Annotation UI Implementation

- 新增统一可复用组件 `components/engineering/InsightAnnotation.tsx`（AC-09）。
- 桌面：`hover`（onMouseEnter/Leave）+ `click`；移动/触屏：`tap`（onClick toggle）+ 外部点击 + Esc 收起（**非 hover-only**，AC-10/AC-11）。
- 显式标识：`工程解释 · 语义派生 · 来自既有已发布内容（非独立实体）`。
- Popover 绝对定位 + `max-w-[calc(100vw-2rem)]`，结构性避免横向溢出（AC-21）。

## 10. Product Integration

- `app/products/[slug]/page.tsx`：从 `product.parameterValues` 取参数名 → `resolveEngineeringAnnotations` → 生成 `parameterAnnotations` map 传给 UI。
- `components/products/ProductDetailContent.tsx` / `ProductParameters.tsx`：在参数名后渲染 ⓘ `InsightAnnotation`（AC-14）。
- 运行实测：产品页 `zb_k60` 返回 200 正常渲染；因当前无参数名确定性命中已发布内容，注释不渲染 = **正确 no-fabrication 行为**。

## 11. Search Integration

- resolver 能力具备，可在 Search Result Parameter strip（`RelevantParameters`）稳定出口接入。
- 本任务最小修正仅在产品参数名稳定出口落地；Search 术语出口未逐一接入（AC-15 = CONDITIONAL，符合「只在能稳定定位术语处加触发」）。未新增 `/insights/search` 等。

## 12. Knowledge Integration

- resolver 数据源本身复用 `KnowledgeEntry` 已发布条目；可在 Knowledge 详情技术术语处接入。
- 未逐一接入（AC-16 = CONDITIONAL，能力具备）。

## 13. Solution Integration

- 可在 Solution 技术术语/检测方法术语处接入（AC-17 = CONDITIONAL，能力具备）。
- 未触碰 Solution 公开面本身；`/solutions` 回归 200。

## 14. Public Insight Route Retirement

- `/insights` (`app/insights/page.tsx`)：改为 `redirect('/knowledge-base')`。运行实测 = Next.js App Router `NEXT_REDIRECT;replace;/knowledge-base;307;`，不再服务公开 Insight Library 内容。
- `/insights/[slug]` (`app/insights/[slug]/page.tsx`)：改为 `redirect('/knowledge-base')`。运行实测同上前端收敛（AC-08）。
- 导航：`EngineeringDiscoveryNav.tsx` 移除「行业洞察」一级栏目；Header/Footer 无 Insight 一级项（AC-07 公开 Insight Library 退役）。
- SEO：`app/sitemap.ts` 移除 INSIGHT 收录与 `/insights` 静态路由（无独立 sitemap / structured data / public canonical / 外部可发现；Discoverability 归 M38）。

## 15. Knowledge / Insight Boundary Verification

- Knowledge = 可发现工程信息资产；Insight = 上下文注释层；Solution = 工程方案内容；Product = 能力权威 + 产品目录。边界保持，未改造成第二种 Knowledge。
- 未创建 Insight Entity / InsightCategory / InsightRelation / Insight API / Insight Authority。

## 16. Schema / Migration Verification

- `git diff -- database/prisma/schema.prisma` = **空** ✅ → **Schema = NO CHANGE（AC-18）**
- `git diff -- database/prisma/migrations` = **空** ✅ → **Migration = NONE（AC-19）**

## 17. API Verification

- 未新增任何端点（无 `/insight-annotations`、`/insights/search`、`/insights/parameters`、`/insights/:id`）。
- 仅消费既有 Content public / Knowledge public / Search / 既有 Product-Parameter API → **API = EXISTING ONLY（AC-05）**。
- Backend（apps/api）未改 → **Backend = NO CHANGE（AC-05）**。

## 18. Low-Operation Verification

- 注释自动由既有已发布内容（INSIGHT + KnowledgeEntry）确定性派生。
- 无人工逐参数建一页、逐术语建一文、人工维护大量独立 Insight 页面、人工 SEO、重复关系 → **Low-Operation = PASS（AC-22）**。

## 19. Mobile Verification

- `InsightAnnotation` popover 绝对定位 + `max-w-[calc(100vw-2rem)]`，不参与文档流，**结构性不产生新增横向溢出**（AC-21，375/768/1024/1440）。
- 移动触屏：tap 展开/收起 + 外部点击 + Esc；非 hover-only。
- ⚠️ **EVIDENCE GAP**：真实 375/768/1024/1440 CDP 视口实测 = 证据缺口（本会话以 HTTP 级验证 + 结构分析）；1024 全局 19px = 既有 carry-forward，非本任务引入（BR-788-02）。

## 20. Runtime Verification

- 环境：PostgreSQL :5432（AVAILABLE）/ API :4000（AVAILABLE）/ Web :3000（`next start` READY）。
- `/insights` → 200 + `NEXT_REDIRECT;replace;/knowledge-base`（公开表面退役且重定向）
- `/insights/[slug]` → 200 + `NEXT_REDIRECT;replace;/knowledge-base`（公开详情页退役且重定向）
- 回归：`/` `/search` `/products` `/knowledge-base` `/solutions` → 全部 200。
- 产品页 `zb_k60` → 200 正常渲染；注释 resolver 运行于 SSR、无匹配不渲染（正确）。
- 无 fake production data；Data Mutation = NONE。

## 21. Static Verification

- `@visndt/web` `tsc --noEmit` = **0** ✅
- `@visndt/web` `next lint` = **0 error**（仅存量 warnings）✅
- `@visndt/web` `next build` = **0** ✅
- `@visndt/api` 本任务未改。

## 22. Regression Verification

- 统一 Search Authority / Knowledge Authority / Product 1:N SupplierProduct / Solution / Content 未触碰；无第二套 Search/KB/AI。
- 关键路由 HTTP 200（§20）；无行为回归 → **Regression = PASS**。
- 787 遗留修正：删除 `InsightEngineeringPanel.tsx`（公开 Insight 上下文面组件），`EngineeringDiscoveryNav` 移除「行业洞察」。

## 23. AC Reconciliation

| AC | 结果 | 说明 |
|---|---|---|
| AC-01 Insight ≠ Public Content Channel | PASS | Insight 收敛为上下文注释，无公开频道 |
| AC-02 Insight ≠ Knowledge | PASS | 边界保持 |
| AC-03 Insight ≠ Solution | PASS | 边界保持 |
| AC-04 No Insight Entity | PASS | 无新 Entity |
| AC-05 No Insight API | PASS | API = EXISTING ONLY，Backend 未改 |
| AC-06 No Insight Search | PASS | 无新搜索 |
| AC-07 No Insight Public Library | PASS | /insights 重定向收敛 |
| AC-08 No Insight Public Detail Page | PASS | /insights/[slug] 重定向收敛 |
| AC-09 Annotation component exists | PASS | `InsightAnnotation.tsx` |
| AC-10 Desktop hover/click works | CONDITIONAL | 代码支持；真实鼠标事件 E2E 未复跑 |
| AC-11 Mobile tap/expand works | CONDITIONAL | 代码支持；真实触点 E2E 未复跑 |
| AC-12 Annotation uses existing data only | PASS | 仅消费既有已发布 INSIGHT/Knowledge |
| AC-13 No fabricated engineering fact | PASS | 无匹配不显示，确定性 resolver |
| AC-14 Product parameter annotation works | CONDITIONAL | 接入且页渲染正常；当前数据无命中故无注释显示 |
| AC-15 Search parameter annotation | CONDITIONAL | 能力具备，出口未逐一接入 |
| AC-16 Knowledge term annotation | CONDITIONAL | 能力具备，出口未逐一接入 |
| AC-17 Solution term annotation | CONDITIONAL | 能力具备，出口未逐一接入 |
| AC-18 No Schema change | PASS | schema.prisma diff 空 |
| AC-19 No Migration | PASS | migrations diff 空 |
| AC-20 No M37 route expansion | PASS | 788 为 M37 内部修正，无新路线 |
| AC-21 Mobile no new overflow | EVIDENCE GAP | 结构保证（绝对定位+max-w）；CDP 四视口实测缺口 |
| AC-22 Low-operation preserved | PASS | 确定性自动派生，无人工运营 |
| AC-23 M38 ownership preserved | PASS | Discoverability/External Search/SEO/AI 未触碰 |
| AC-24 M39 ownership preserved | PASS | Workflow/RFQ/Offer/Opportunity 未触碰 |
| AC-25 Fixed route unchanged | PASS | M35→M36→M37→M38→M39→Final 保持 |

## 24. Batch Remediation Register

| ID | 级别 | 问题 | 处置 |
|---|---|---|---|
| BR-788-01 | P2 | 产品参数名与既发已发布内容当前无明显确定性命中 → 运行时注释呈现有限（能力具备、数据驱动） | non-blocking / carry-forward |
| BR-788-02 | P2 | 真实 375/768/1024/1440 CDP 视口实测 = 证据缺口（本会话 HTTP+结构验证） | non-blocking / carry-forward |
| BR-788-03 | P2 | 携带 1024 全局 19px overflow（既有全局页头，非 788 引入） | non-blocking / carry-forward |

P0 = 0 / P1 = 0 / P2 = 3。不扩张路线。

## 25. Fundamental Change Register

- **Fundamental Change Candidates = 0 新增**。无 New Entity / New Authority / New API / New Schema / New Migration / New Search Domain / New Public Content Domain / Global UI Rewrite / Global Mobile Rewrite / M38 Scope / M39 Scope。
- 未触发 Architecture / Scope Gap → 无需 STOP 记录候选。

## 26. Documentation Synchronization

- `PROJECT_STATUS.md`：追加 788 条目（Insight 语义冻结 / Public Surface Retirement / Annotation / Change Gate / Static / Runtime / Mobile / Batch / AC）。
- `PROJECT_ROADMAP.md`：追加 788 表行（M37 内部语义校准，Route 保持）。
- `MODULE_COMPLETION_MATRIX.md`：追加 788 表行。
- 明确：787 = historical implementation；788 = semantic correction endpoint，**未改写 777-787 历史报告与 Frozen Architecture**；M36=CLOSED / M35=CONDITIONAL 保持。

## 27. Roadmap Synchronization

- Fixed Route 保持唯一：**M35 → M36(CLOSED) → M37(IMPLEMENTED / AWAITING FULL CLOSEOUT) → M38 → M39 → Final Platformization Assessment**。
- 无 788.1 / M37.1 / 平行 stream；无新 M 阶段。

## 28. Final Status

- **M37 Current State = IMPLEMENTED / AWAITING FULL CLOSEOUT（788 为语义校准，不写 M37=CLOSED）**。
- Schema=NO / Migration=NO / API=NO / Backend=NO / Frontend=YES（最小受控修正）/ Admin=NO / Data=NO。
- Final Task Status = **COMPLETE（CONTROLLED CORRECTION / VERIFY / DOCUMENT / STOP）**。
- Review Report Path：`docs/_review/788_M37_Insight_Annotation_Semantic_Correction_And_Public_Surface_Retirement_Report.md`。

## 29. STOP Confirmation

- **STOP**：本任务按 M37 内部语义校准完成最小受控修正后停止。
- 不自动生成 789；不自动进入 M38；不重新设计 M37；不创建 M37.1/2/3。
- 不实施 M38 Discoverability / External Search / SEO / AI-LLM；不实施 M39 Workflow / RFQ / Offer / Opportunity Routing。
- 不重新设计 Product/Supplier/Content/Search/Workflow 架构；不新增 Insight Entity/API/Authority/Schema/Migration。

---

## Evidence Summary

- **Static**：web tsc / lint / build = 0 ✅
- **Schema/Migration**：diff 空 ✅
- **Runtime**：/insights + /insights/[slug] → /knowledge-base（NEXT_REDIRECT）；核心路由回归 200 ✅
- **Annotation**：resolver + 组件 + 产品参数接入实现；数据驱动、无伪造 ✅
- **API/Backend**：未改 ✅
- **Mobile**：结构保证；CDP 四视口 = EVIDENCE GAP（BR-788-02）

**Execution Principle**: 787 Historical Implementation → Semantic Drift Identified → 788 Minimal Insight Correction → Retire Public Insight Surface → Embed Insight into Engineering Context → Product Annotation → Runtime/Static/Mobile Verification → Documentation Synchronization → **STOP**.