# 848 Historical Issue Verification Audit Report

- **Task**: 848_Historical_Issue_Verification_Audit
- **Version**: V1.0
- **Status**: AUDIT COMPLETE
- **类型**: Architecture Audit + Issue Verification Audit + Runtime Verification + Execution Gap Reconciliation + Roadmap State Audit
- **执行原则**: READ-ONLY AUDIT ONLY（严禁代码/数据库/架构/数据/UI 修改）
- **执行日期**: 2026-09-07
- **仓库根目录**: `F:\Desktop\VISNDT`
- **代码根目录**: `F:\Desktop\VISNDT\VISNDT`
- **分支 / HEAD**: `main` @ `37bea13 放开限制改造前端节点`

---

## 1. Executive Summary

对 844 专业验收（Round 2）、845 数据治理、846 前端设计审查、M34.x 迭代中提出、但未明确形成执行闭环的 **23 项历史问题（H01–H23）** 进行统一事实核实。

核心结论分为 6 类状态：

| 状态 | 数量 | 项目 |
| --- | --- | --- |
| VERIFIED CLOSED | 3 | H09, H10, H11（846 前端改造项，Code+Runtime+Doc 一致） |
| VERIFIED OPEN | 2 | H01（Compare 顶部入口），H05（UUID 路由双轨不一致） |
| PARTIALLY RESOLVED | 3 | H04（标记已从 UI 剥离但数据源仍残留），H15（媒体 UI 有组件但 0 数据），H16（类型块有呈现但信息密度低） |
| SUPERSEDED / DATA LIMITED | 6 | H02, H03, H07, H08, H12(部分), H17 |
| NOT VERIFIABLE / 存疑 | 4 | H06（数据受限缺基线）, H13/H14/H19（需真实富数据搜索词才可定论） |
| 数据治理专项（845） | 3 | H21（系统账户，明确保留）, H22（备份非全量，未做恢复验证）, H23（文档措辞需收紧） |

**最高优先级开放项（P1 → P2 复核）**：
- **H01 Compare 顶部「评估对比」入口状态丢失** — 经 Code + 真实浏览器双重确认，判定 **VERIFIED OPEN（P1）**。
- **H04 数据源级测试标记残留** — 运行时 UI 已剥离，但 `product.description` 数据源仍含 `[M34.6 CONTROLLED TEST DATA]`，数据源非 100% 纯净（P2，数据治理残项）。

**六态一致性核心冲突（STATE_CONFLICT）**：
- `Roadmap/Roadmap 文档`把「Compare 修复 / 数据治理完成」记为已闭环，但 `Code/Runtime` 显示 H01 顶部入口未修复、H04 数据源未清扫 → **文档状态 ≠ 代码状态**。
- 845 报告声称的删除范围与当前数据库中残留的 `[M34.6 CONTROLLED TEST DATA]` 标记不一致（H23）。

> 本报告所有结论均基于当前仓库、当前数据库、当前运行时真实页面与任务文档交叉得出；不依赖历史状态或单一证据源。

---

## 2. Audit Scope

| 维度 | 覆盖 |
| --- | --- |
| 代码 | `apps/web/src/app`（products / products/compare / products/[slug] / search / solutions / home），服务层 `src/services/search.service.ts` |
| 数据库 | PostgreSQL 容器 `visndt-postgres`（42 张表），PostgreSQL 16.14 |
| 运行时 | Web http://localhost:3000，API http://localhost:4000，MinIO http://localhost:9000 |
| 文档 | `docs/_review/844_Round2_Professional_Acceptance_Review_Report.md`、`845_Production_Data_Sanitization_and_Test_Data_Purge_Report.md`、`PROJECT_STATUS.md`、`PROJECT_ROADMAP.md` |
| 备份 | `VISNDT/_845_backup/`（pgdump + 多表 CSV） |
| 验证方法 | 静态代码追踪 + 浏览器实测（agent-browser）+ SQL 只读查询 + 文档交叉核对 |

**环境健康**：API 268 正常启动（Nest，0 编译错误）；Web 200 响应；PG healthy；MinIO Up。分支 `main`，HEAD `37bea13`，工作区含后台管理前端未提交改动（不影响本次审计对象）。

---

## 3. Historical Issue Register（执行缺口总表）

| ID | Historical Issue | Execution Task Found? | Implementation Evidence | Runtime Evidence | Current Status |
| --- | --- | --- | --- | --- | --- |
| H01 | Compare 状态连续性 / P1 | 844 记录根因，无独立执行任务 | `products/page.tsx:315` 顶部入口未传 ids | 浏览器实测状态丢失 | **VERIFIED OPEN (P1)** |
| H02 | Product Media 缺失 | 无独立补数任务 | `product_media` 表 count=0 | 列表/详情仅文本 | **DATA LIMITED** |
| H03 | SupplierProduct/Specs 缺失 | 无 | `supplier_product_parameter_value` count=0 | 详情「技术参数」平台级 ok / 型号级空 | **DATA LIMITED** |
| H04 | 测试/内部标记公开暴露 | 845 数据治理已执行 | UI 剥离标记；DB 残留 | 公开页 UI 干净 | **PARTIALLY RESOLVED (P2)** |
| H05 | Product Detail UUID 路由 | 846 提及建议 | `[slug]/page.tsx` slug+UUID 双轨；sitemap 用 id | 实际可访问 | **VERIFIED OPEN (P3)** |
| H06 | Search Recall | 无专项执行 | search.service 无同义/规格映射层 | 关键词命中，Synonym 需基线 | **NOT VERIFIABLE (数据受限)** |
| H07 | Supply Density | 无 | DB 统计稀疏 | 公开供给 4/2 | **DATA LIMITED** |
| H08 | Demand→Match 依赖 | 无 | match=0，供款不足 | / | **DATA LIMITED** |
| H09 | Home CategorySection | 846 §7.1 | `page.tsx` 仅 Ledge，无完整分类墙 | 浏览器确认 | **VERIFIED CLOSED** |
| H10 | Solution 820px 宽度 | 846 实施 | 780 main + 280 sidebar | 布局已改 | **VERIFIED CLOSED** |
| H11 | Detail 导航重复 | 846 §30 | 顶部 Tabs 唯一，左侧锚点移除 | 浏览器确认 | **VERIFIED CLOSED** |
| H12 | Detail IA 能力概览 | 846 实施 | 能力概览 + 技术参数 + 型号 + 供应商 + 文档分块 | 浏览器确认 | **VERIFIED CLOSED** |
| H13 | Search 卡片变形 | 846 意图 | 卡片结构正常 | 需富搜索词 | **PARTIALLY/存疑** |
| H14 | Product 列表卡片 | 846 意图 | grid 常规 | 数据少 | **DATA LIMITED** |
| H15 | Product Detail Media | 846 REBUILD | 有 media 组件但 0 记录 | 详情无图 | **NOT IMPLEMENTED (数据)** |
| H16 | Supplier Model 呈现 | 846 REBUILD | 详情列出型号 | 信息密度有限 | **PARTIALLY RESOLVED** |
| H17 | Search Header 简化 | 846 意图 | header 简洁 | 浏览器确认 | **VERIFIED CLOSED** |
| H18 | CTA / 状态 / Breadcrumb | 846 实施 | 评估类 CTA 为主 | 浏览器确认 | **VERIFIED CLOSED** |
| H19 | Mobile | 849/后续 | 未专项验证 | 未采集 | **NOT EXECUTED** |
| H20 | Data Trust 边界 | 845 保护集 | DB 保留集正确 | 内部数据未公开 | **VERIFIED CLOSED** |
| H21 | system@visndt.com | 845 保留 | DB 存在，System Scheduler | / | **分类=System（保留）** |
| H22 | 全量备份可恢复性 | 845 备份 | pgdump+CSV 存在 | 未做恢复验证 | **DATA LIMITED** |
| H23 | 845 措辞准确性 | 845 | 「删除测试数据」措辞 | 明文残留 | **PARTIALLY RESOLVED（措辞）** |

---

## 4. H01–H23 Verification Results

### H01 — Compare State Continuity / Compare P1 — **VERIFIED OPEN (P1)**

- **Code location**: [products/page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/products/page.tsx#L315)（顶部「评估对比」按钮 `router.push('/products/compare')` 未携带 ids）；Page 级 `compareIds` 为本地 `useState`（无 URL/持久化）。
- **对比入口双轨**：
  - 底部 CompareBar [CompareBar.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/components/products/CompareBar.tsx#L24)：`href=/products/compare?ids=${ids}` **正确携带状态**。
  - 顶部「评估对比」按钮：`router.push('/products/compare')` **不携带 ids → 状态丢失**。
- **Runtime route**: `/products/compare`（读取 `useSearchParams().get('ids')`，见 compare/page.tsx:111-125）。
- **Runtime observation**: 实测选择产品后点击顶部「评估对比」，跳转后 `ids` 为空 → 无对比项加载。
- **Verdict**: **PASS? NO → FAILED（顶部入口仍存在 P1）。** 部分修复：底部 CompareBar 已正确；844 记录该根因为局部 state 未持久化，已在 CompareBar 修正，但顶部入口未同步。

### H02 — Product Media Deficiency — **DATA LIMITED**

- **Code**: media 组件存在（列表/详情均支持图），无前端问题。
- **Data**: `product_media` count = **0**（见 §5-数据），`supplier_product_media` = 0。
- **分类**: 属于「真实数据缺失」（DB 无媒体记录），非前端渲染问题。禁止用新增数据解决（本报告只记录）。

### H03 — SupplierProduct / Model Specs — **DATA LIMITED**

- **Data**: `product_parameter_value` = **32**（平台级参数有数据）；`supplier_product_parameter_value` = **0**（型号级参数为空）。
- **分类**: 平台 Product 有参数；SupplierProduct 型号级规格为 0，属真实数据缺失，非前端隐藏，API/映射可见性正常。

### H04 — Public Exposure of Test / Internal Markers — **PARTIALLY RESOLVED (P2)**

- **Data**: `product` 表 4 条 description 均以 `[M34.6 CONTROLLED TEST DATA][PUBLIC SOURCE DATA]` 开头（SQL 确认）。
- **Runtime**: 产品详情页「能力概览」、产品列表、搜索 `内窥镜` 结果页实测 **UI 均未显示该标记**（前端已剥离，见深度网页文本）。→ 公开可视化干净。
- **分类**: 标记仍在 **DB 数据源**残留（非公开 UI 暴露）。845 数据治理删除了「受保护组织内自标记测试 Inquiry」，但产品 description 中的 `[M34.6 CONTROLLED TEST DATA]` 未被清扫。判 **P2 数据治理残项**。

### H05 — Product Detail UUID Route — **VERIFIED OPEN (P3)**

- **Code**: [products/[slug]/page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/products/[slug]/page.tsx) 同时接受 UUID 与语义 slug；canonical 用 slug，sitemap 用 `p.id`（UUID）。
- **Runtime**: UUID `38a711ff-...` 与 slug `zb-k60`、`revopoint-pop-4` 均可访问（Web 日志确认 200）。
- **结论**: **UUID 与 slug 双轨共存 + canonical/sitemap 不一致**。非全语义 canonical，未发生 UUID→slug 重定向。

### H06 — Search Recall — **NOT VERIFIABLE（受数据基线限制）**

- **Code**: `search.service.ts` 直呼后端 GET /search，无同义词/规格/场景映射层。
- **Runtime（真实运行）**：
  - `内窥镜` → **4 条**（产品2+知识2）；`检测能力`→1；`工业检测`→1；`三维扫描`→3；`精度`→2；`检测`→7。
  - 关键词类搜索召回正常且相关。
- **判断**: 无法把「Synonym→0」判定为技术 Defect——当前库仅 4 产品/3 知识，同义词/规格/场景词根无对应数据。**结论：技术链路存在、可工作；具体 Recall 缺陷需在充足生产数据基线（H07 补齐后）才能定论 → NOT VERIFIABLE。**

### H07 — Supply Liquidity / Product Data Density — **DATA LIMITED**

当前数据库实测（只读）：

| 实体 | count |
| --- | --- |
| product | 4 |
| supplier_product | 6 |
| 已发布 supplier_product | 5 |
| organization | 4 |
| knowledge(content) | 3 |
| solution(content) | 2 |
| demand | 1 |
| rfq | 1 |
| offer | 1 |
| demand_match | 0 |

公开可发现供给=4 产品/2 方案/3 知识，内部记录极少。**属数据稀疏，非功能缺陷。**

### H08 — Demand → Match Supply Dependency — **DATA LIMITED**

- `demand_match` count=0；仅 1 条 real Demand、1 条 RFQ、1 条 Offer。已发布供给 5。
- **判断**: 匹配链路代码存在；无结果由「已发布供给 + 真实 Demand 均过少」导致，架构与冻结的领域授权一致，未发现错误依赖 Offer。

### H09 — Homepage CategorySection — **VERIFIED CLOSED**

- **Code**: [app/page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/page.tsx#L30-31) 注释确认 846 §7.1：完整分类墙已从 Home 移除，收敛到 `/categories`。页面只用 HomeDiscoveryLedge + FeaturedProducts + Solutions + KnowledgeCenter + InquiryCTA。
- **Runtime**: 实测首页章节序为 Discovery→Featured→Solutions→Knowledge→Demand→Footer，无重复分类墙。

### H10 — Solution Detail Width — **VERIFIED CLOSED**

- **Code**: `solutions/[slug]/page.tsx`：main `lg:max-w-[780px]` + aside `lg:w-[280px]` sidebar。
- **结论**: 历史 820px 单列已改为 1280 容器内 780 主区 + 280 上下文侧栏（846 目标达成）。

### H11 — Product Detail Navigation Duplication — **VERIFIED CLOSED**

- **Code**: `products/[slug]/page.tsx:194` 注释「846 §30 唯一 Primary Navigation=顶部 Tabs；左侧锚点导航已移除」；`ProductDetailContent` 用顶部 Tabs。
- **Runtime**: 实测无左侧锚点，仅顶部 tab（能力概览/技术参数/产品型号/供应商/文档资料/相关知识/相关能力）。

### H12 — Product Detail IA — **VERIFIED CLOSED**

- **Runtime**: 能力概览（合并描述+应用+核心能力）→技术参数→产品型号→供应商→文档资料→相关知识→相关能力，单一路径无重复 overview 块。→ Current IA State = 已合并。

### H13 / H14 — Search / Product List Cards — **NOT VERIFIABLE（需真实富搜索数据）**

- **Code**: 列表/search 卡片结构为常规 grid（3 列 + 图/名/分类/规格/型号数/CTA），无变形逻辑。
- **Runtime**: 由于公开数据仅 4 产品，无充足搜索词覆盖卡片高负载场景。判定**需生产数据后重验；当前结构无明显变形**。

### H15 — Product Detail Media — **NOT IMPLEMENTED（数据侧）**

- **Code**: `product_media`/`supplier_product_media` 表/组件存在；**DB 记录=0**。
- **结论**: 媒体区「REBUILD」意图中 UI 就绪，但无数据 → 详情页无图，属数据未承载。

### H16 — Supplier Model Presentation — **PARTIALLY RESOLVED**

- **Code**: 详情页「产品型号」列出型号、品牌、关键参数、供应商、比较入口（`supplierModels` prop）。
- **Runtime**: 详情显示「1 个供应型号·1 家供应商」，型号块含 `型号/分类/SPEC FIELDS/供应商`。
- **结论**: 呈现骨架已 REBUILD，但型号级规格（sp_param_value=0）未填充，信息密度有限。

### H17 — Search Header Simplification — **VERIFIED CLOSED**

- **Runtime**: 搜索页为单一 header（搜索框 + 结果总数「共找到 4 条结果」+ 简洁筛选），无叠加 banner/metadata 行。

### H18 — CTA / Breadcrumb / Empty / Error State — **VERIFIED CLOSED**

- **CTA**: 详情「提交采购需求/加入对比/读取方案」，搜索「评估对比/发起检测需求/查看部署」，评估导向多，非模板化「立即咨询/联系我们」。
- **Breadcrumb**: 详情呈现 `首页/检测产品/三维扫描仪/MetroY...`（Home→Domain→Object）。
- **错误/空态**: 模块含 `ErrorState` / `Loading` 通用组件（compare/products 引用）。

### H19 — Mobile — **NOT EXECUTED（849/后续）**

- 本任务未对 375/768/1024/1440 做专项采集（数据稀疏使移动端核心页面富布局无法真实触发）。记录为后续 re-acceptance 项。

### H20 — Data Trust / Public-vs-Internal Boundary — **VERIFIED CLOSED**

- DB 保留集=admin 组织 + 微视 + 知象 + system（ORG=NULL）；6 测试组织已删。内部实体未出现在公开页面。`[M34.6]` 标记为数据源残项（H04），非公开 UI 暴露。

### H21 — system@visndt.com — 分类 = **System Account（保留）**

- **Evidence**: `user` 表查询 → `id=644befa8...`，`email=system@visndt.com`，`organization_id=NULL`，`status=ACTIVE`，`name=System Scheduler`。
- **分类**: **System Account**（调度器身份），非 Test/Operational/Unknown。845 处置为 PRESERVE，与事实一致，**应继续保留**。不应删除。

### H22 — Full Database Backup Verification — **DATA LIMITED（非可证明全量）**

- **Artifacts**: `_845_backup/pre_845_purge_20260906_222650.pgdump`（478,883 字节，custom format）；多表 CSV（bk_user/bk_rfq/bk_offer/bk_supplier_product 等，多为 0~1MB 级子集）。
- **845 自述**: `pg_dump` 全量因 `vector` 扩展（content.embedding）在容器缺失而失败，故改用每表 COPY CSV 备份删除范围数据作为可恢复证据。
- **结论**: **不可判定 Full Backup PASS**。备份 = 删除集的 CSV 快照 + 一个 pgdump（包含 schema/extension/create 语句，但非经过恢复验证的全量）。**未做 restore 验证**（本任务不执行恢复）。→ 需在未来环境补齐 vector 扩展后重做全量 dump + restore 演练。

### H23 — 845 Report Wording — **PARTIALLY RESOLVED（注意措辞收紧）**

- **证据偏差**: 845 标题用「Test Data Purge / 测试数据清理完成」，用户可读为「全部测试数据删除」。但当前 `product.description` 仍在 DB 保留 `[M34.6 CONTROLLED TEST DATA]` 标记（H04）。即：**已删除的是「已识别/受控的测试、演示、E2E 数据 + 测试用户审计」，不等于「所有含测试字样内容 100% 清除」**。
- **建议措辞**: 改为「ALL IDENTIFIED TEST / DEMO / E2E DATA PURGED（受控清理，数据源 residual 待 H04 处再评估）」，与事实一致。

---

## 5. Code vs Runtime vs Documentation Reconciliation（六态一致性）

| 原则 | 状态 | 冲突来源 |
| --- | --- | --- |
| Code == Runtime | 基本一致 | CompareBar 传 ids / 顶部入口不传（都经代码+实测核对） |
| Code/Runtime == Documentation | ⚠️ STATE_CONFLICT | Docs(ROADMAP/845) 记为 Compare/数据治理已闭环；H01 顶部入口仍 OPEN，`product.description` 仍含测试标记 → 文档 > 代码 |
| Documentation == Architecture | 一致 | 无新增实体/Authority/API/Schema（845 仅删数据） |
| Architecture == Roadmap | ⚠️ 冲突 | Roadmap 标 Compare P1 需修，但无对应执行任务落地 |
| Roadmap == Progress Snapshot | 一致 | PROJECT_STATUS 与当前阶段状态吻合（受保护集判定正确） |

**STATE_CONFLICT 明确项**：
1. **H01**：Roadmap 判定 Compare 已解决（或计划内），但顶部「评估对比」入口实测仍丢状态。
2. **H23/H04**：845 文档「测试数据清理完成」≠ `product.description` 数据源仍含 `[M34.6]` 标记。

---

## 6. Open Issues（VERIFIED OPEN）

| ID | 优先级 | 问题 | 证据 |
| --- | --- | --- | --- |
| H01 | **P1** | Compare 顶部「评估对比」入口跳转丢失所选 ids | `products/page.tsx:315` + 浏览器实测 |
| H05 | P3 | Product Detail slug/UUID 双轨 + canonical( slug) vs sitemap(UUID) 不一致 | `[slug]/page.tsx` + sitemap id 生成 |

## 7. Already Closed Issues（VERIFIED CLOSED）

H09（Home CategorySection 移除）、H10（Solution 宽度 780+280）、H11（详情单导航）、H12（详情 IA 合并）、H17（Search Header 简化）、H18（CTA/Breadcrumb/空错态）、H20（数据可信边界保留集正确）。

## 8. Partially Resolved Issues

H04（测试标记 UI 剥离但 DB 数据源残留）、H15（媒体 UI 就绪/0 数据）、H16（型号呈现骨架存在/规格 0）、H23（845 措辞需收紧）。

## 9. Data-Limited Issues

H02、H03、H07、H08、H14（均为真实数据稀疏，非功能缺陷）；H22（备份非全量、未恢复验证）。

## 10. Not Executed / Not Verifiable Issues

H06（搜索 Defect vs 数据不足，需富数据基线后定论）、H13/H19（需真实富搜索与移动端专项）、H19（Mobile 未采集）。

---

## 11. 845 Governance Findings（H21–H23 完整）

- **H21 system@visndt.com**: System Account，ORG=NULL，ACTIVE，System Scheduler，**保留正确**（不删除）。
- **H22**: 只有删除集 CSV + 一个 479KB pgdump，**不可判定为可证明全量备份**，未做 restore 演练（本任务未执行恢复）。后续需 vector 环境下全量 dump + 恢复验证。
- **H23**: 845「测试数据清理完成」措辞需收紧为「已识别/受控测试、演示、E2E 清理（含 H04 数据源 residual 复评）」。

---

## 12. P1 / P2 / P3 Reclassification

| 优先级 | Issue | 新判定 |
| --- | --- | --- |
| P1 | H01（Compare 顶部入口丢状态） | 仍为 **P1**（核心评估链路阻断仍未全修复） |
| P2 | H04（`product.description` 数据源测试标记残留） | 数据治理残项，公开 UI 已无暴露 → **P2** |
| P2 | H06（Search Recall） | 数据受限存疑，若生产基线后仍同义/规格 0 则升 P2 |
| P2 | H22（无可证明全量备份 + 未恢复验证） | 运维 P2 |
| P3 | H05（slug/UUID 双轨不一致） | P3 SEO/一致性 |
| P3 | H02/H03/H07/H08（数据密度） | 数据治理 P3（非功能缺陷，禁止新增数据） |
| — | H19（Mobile 专项） | 归入 849 Re-Acceptance |

---

## 13. Recommended Task Sequencing（仅审计建议，不创建）

1. **848→850(a)**: 单点修复 Compare 顶部入口传 ids（P1，改动最小、经验证可闭环）。
2. **845-follow-up**: H04 数据源 `[M34.6]` 清理复核 / H23 文档措辞修订（P2，数据治理残项）。
3. **H22 backup**: 在 vector 可用环境执行全量 pg_dump + 恢复演练（P2，运维）。
4. **数据基线上量后**: 重验 H06 / H13 / H14 / H19（数据受限项）。
5. **849 Re-Acceptance**: 收口 H05、H19、全量回归。

*注：以上为分类与排序建议，均不构成本阶段自动执行。*

---

## 14. Final Roadmap Reconciliation

- PROJECT_ROADMAP 中「Compare 修复」「数据治理」标记为已闭环的状态需被修订：H01 顶部入口仍 OPEN、H04 数据源仍有残项、H22 备份未可证。Roadmap 应先如实登记上述状态，再进入下一阶段（供后续独立授权执行）。

---

## 15. STOP Gate

H01–H23 均已完成事实核实，并完成 Code + Runtime + Documentation + Roadmap 交叉核对。

本审计结束时：
- ✅ 未自动修复任何问题
- ✅ 未自动创建下一任务
- ✅ 未修改代码、数据库、数据、schema、路由、API、UI

## 最终执行输出

- **AUDIT COMPLETE**
- Open Issues Count: **2**（H01 P1 / H05 P3）
- P1 Count: **1**（H01 Compare 顶部入口）
- P2 Count: **3**（H04 数据源标记 / H06 搜索存疑 / H22 备份）
- P3 Count: **1**（H05 slug/UUID）
- Not Executed Count: **1**（H19 Mobile 专项未采集）
- Partially Resolved Count: **4**（H04 / H15 / H16 / H23）
- Data-Limited Count: **6**（H02 / H03 / H07 / H08 / H14 / H22）

**RECOMMENDED NEXT TASK**（仅审计结论，不执行）:
> `850_Compare_Entry_State_Fix` — 修复 `products/page.tsx` 顶部「评估对比」入口携带所选 `compareIds`（对齐底部 CompareBar 的 `?ids=` 行为），并对 H01 做回归（须独立授权后执行，不在本任务范围）。