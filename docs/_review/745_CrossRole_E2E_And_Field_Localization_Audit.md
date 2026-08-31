# 745_CrossRole_E2E_And_Field_Localization_Audit

> 报告类型：前端架构 + 跨角色 E2E + 字段/文案本地化审计
> 执行日期：2026-08-29
> 审计角色：Guest / Buyer / Supplier / Admin（真实浏览器 E2E + 源码对照）
> 执行方式：Audit Only（本报告阶段零生产代码修改）
> 产物：`VISNDT/database/_744_role_e2e_audit/evidence.jsonl`（约 41 条页面级证据）

---

## 1. 审计范围与方法

### 1.1 环境核实
- 仓库/代码根：`F:\Desktop\VISNDT` / `VISNDT`，branch `main` ✅
- Web `:3000` / Admin `:3001` / API `:4000` / PostgreSQL `:5432` / MinIO `:9000-9001` 均在线
- 测试账号（seed_demo.ts）：Buyer `demo.buyer.01@visndt.local`、Supplier `demo.supplier.01@visndt.local`、Admin `demo.admin@visndt.local`，口令 `demo123456`
- 浏览器：无头 Edge + CDP（真实 Cookie/会话/导航，非 DOM 注入）

### 1.2 覆盖页面
- Web 公共：`/ /products /categories /articles /solutions /business /about /knowledge /insights /search /supplier-models /login /register`
- Web Buyer：`/dashboard/buyer /workspace /workspace/demands(+create) /workspace/rfqs(+create) /workspace/matches /workspace/notifications /workspace/settings`
- Web Supplier：`/dashboard/supplier /workspace/supplier(→dashboard/supplier) /offers(+new) /responses /inquiries /opportunities /rfqs /runtime /profile /display /notifications /settings`
- Admin：`/home /operation-center /products /demands /rfqs /offers …`

> 说明：审计运行中 API/Admin 进程曾异常退出（已重启恢复）。Admin SPA 需要前端自身登录态；本审计对 Admin 的运行时结论以「代码层 status map + /products 捕获 + Media 治理标签」为准，未据此断言 Admin /home 断链。

---

## 2. 结论摘要

**总体评估**：平台整体架构、角色闭环（Buyer/Supplier 工作台）、基础导航链路均健康；`/products`、`/categories` 主目录已具备「能力注册表/能力索引」感知。**主要问题集中在「面向用户的可见文案未统一中文化」与「字段/枚举在展示层直接透出英文或状态键」两类**——即你关心的「前端英文说明文字」「供应商/制造商术语统一」「active 等状态显示为中文」问题，均有真实证据与源码锚点。

| # | 严重级 | 类型 | 问题 | 出现位置 |
|---|--------|------|------|----------|
| 1 | P1 | i18n / Perception | `/categories` 能力目录 rail 用**英文 slug + 时间戳 id** 作为分类名直出 | categories/page.tsx L72/93/100/130/150 |
| 2 | P1 | i18n | 买家工作区状态摘要直出英文状态键（`PUBLISHED 4 / PROCESSING 1`、`MATCHED 11 / REVIEWED 3`、`PENDING ACTIONS`） | BuyerWorkspaceEntry.tsx:22、SupplierWorkspaceEntry.tsx:24 |
| 3 | P1 | i18n | 角色徽标/「当前角色」直出英文角色值（`BUYER`/`SUPPLIER`） | dashboard/buyer:124、dashboard/supplier:195、display:176、workspace:95 |
| 4 | P1 | i18n | 组织/Offer 状态断言式中文化存在**回退直出英文**（非 ACTIVE 显示原始值） | SupplierInfo.tsx:55、SupplierCapability.tsx:109、supplier/profile:207、suppliers/[id]:23 |
| 5 | P2 | i18n | 文档/文章类索引头部英文说明直出（`PUBLISHED LIBRARY`、`INDX/PUBLISHED ITEMS`、`DOC · TYPE · REV`、`INDUSTRIAL TECHNICAL DOCUMENTATION`） | articles/insights/solutions 索引 |
| 6 | P2 | i18n | Home 装饰性英文技术语言（`SYSTEM: ONLINE`、`NDT BASE: UT / RT / PT`、`ROLE ACCESS`）+ 英文 CTA `Get Started` | HeroSection.tsx:38/42/105、InquiryCTA.tsx:18 |
| 7 | P2 | i18n | Admin 能力列表英文装饰头 `CAPABILITY / GOVERNANCE · REGISTRY` | admin /products |
| 8 | P2 | 术语/字段 | 角色与「供应商/制造商」术语不统一：供应商工作台大量中英混排（`Supplier · 供应商`、`供应商运行时（Supplier Runtime）`、`SupplierProduct`、`能力提供侧（Capability Provider）`） | workspace/page:95、runtime:233/235/260/348、InquiryContext:54/80、SupplierWorkspaceEntry:76-77 |
| 9 | P3 | 术语/语义 | 需求/文案直出英文角标（`665 Audit: Need 3D structural light scanner`、`Demand ID: …`）与系统单号（VIS-RFQ/VIS-RESP/VIS-DEM）侵入列表原文 | dashboard/supplier、opportunities、rfqs、responses |
| 10 | P3 | 路由 | `/supplier-models` 直接重定向 `/search`，且原 `Search` 语义与能力发现定位需复核（残留路由） | route 目录存在但无 page，重定向旧入口 |

> 注：`/ /login /register /business /about /knowledge /search` 等页面无英文直出候选（除已登录态头部展示的账号名 `Demo Admin`），中文为主、正常运行。所有被测页面 `runtimeErrors=[]`，链接健康度抽样均为 200（无 404 断链）。

---

## 3. 逐项证据与代码锚点

### 3.1 [P1] `/categories` 英文 slug 名 + 时间戳 id 直出
- 证据（evidence：#3 `/categories`）：`CAPABILITY CLASSIFICATION`、`CAPABILITY REGISTRY INDEX`、`NO · ROUTE · SUB-CAP`、`CRAWLER ROBOT · CAPABILITY`、`PIPE SCOPE · CAPABILITY`、`SUB-CAP 00`、`TC716 CAT 1787742555915 · CAPABILITY`、`CAT TC713 1787695411576 · CAPABILITY`…
- 源码：`categories/page.tsx`
  - L72 `eyebrow="CAPABILITY CLASSIFICATION"`
  - L93 静态 `CAPABILITY`、L100 静态 `NO · ROUTE · SUB-CAP`
  - **L130 `{cat.slug.replace(/-/g, ' ')} · CAPABILITY`** ← 直接拿分类 **slug 转成英文大写** 当展示名；自动生成的测试分类 slug（含时间戳如 `tc713-1787666515293`）随之直出，形成 `TC713 CAT 1787666515293 · CAPABILITY`
  - L150 `SUB-CAP {padStart(2,'0')}`
- 数据源：`getCategories` 返回的 `cat.slug`、`cat.children.length`；时间戳来自测试/自动创建分类的 slug。
- 影响：与「统一中文能力语言、That 识别为能力分类索引」的目标直接冲突，卡片列表与 rail 语义割裂。

### 3.2 [P1] 买家/供应商工作区状态摘要直出英文状态键
- 证据：#14 `/dashboard/buyer`（`PENDING ACTIONS`、`已匹配 11 / REVIEWED 3`）、#15 `/workspace`（`PUBLISHED 4 / PROCESSING 1`、`MATCHED 11 / REVIEWED 3`、`PENDING ACTIONS`、`· BUYER`）
- 源码：`BuyerWorkspaceEntry.tsx:22` 与 `SupplierWorkspaceEntry.tsx:24`
  `entries.slice(0,3).map(([status,count]) => `${status} ${count}`).join(' / ')`
  ← 直接用后端返回的**状态键**（PUBLISHED/MATCHED/REVIEWED…）做展示，无中文映射。`dashboard/buyer:54`、`dashboard/supplier:58` 虽有 `STATUS_LABEL_MAP[status] || status`，但映射表未覆盖 `PUBLISHED/REVIEWED`，故仍回退英文。
- 数据源：`/workspace/buyer/overview`、`/workspace/supplier/overview` 返回的 `{status,count}` 键。

### 3.3 [P1] 角色徽标/「当前角色」英文直出
- 证据：#14/#23/#33（`SUPPLIER`、`· BUYER`、`当前角色:SUPPLIER`）
- 源码：`dashboard/buyer/page.tsx:124` `{user?.workspaceRole ?? 'BUYER'}`；`dashboard/supplier/page.tsx:195` `?? 'SUPPLIER'`；`display/page.tsx:176` `当前角色：{user?.workspaceRole ?? '未配置'}`；`workspace/page.tsx:95` `label="Supplier · 供应商"`
- 数据源：`user.workspaceRole`（`BUYER`/`SUPPLIER`）。

### 3.4 [P1] 组织/Offer 状态「活跃否则英文」回退
- 证据：#25 `/workspace/supplier/offers`（`ACTIVE`）；#33 display；响应列表 `状态:DRAFT`、`状态:ACTIVE`
- 源码（同款三处）：
  - `SupplierInfo.tsx:55` `{derivedOrg.status === 'ACTIVE' ? '活跃' : derivedOrg.status}`
  - `suppliers/[id]/page.tsx:23` `org.status === 'ACTIVE' ? '活跃' : org.status`
  - `supplier/profile/page.tsx:207` 同款
  - `SupplierCapability.tsx:109` `offerStatusLabels[offer.status] ?? offer.status`
  → 当 `status` 为 `INACTIVE / APPROVED / 其他枚举` 时，直接显示英文原始值。
- 数据源：`organization.status`、`offer.status`（DB 枚举）。

### 3.5 [P2] 文档/文章索引英文头部说明
- 证据：#4 `/articles`（`PUBLISHED LIBRARY`、`INDX/PUBLISHED ITEMS`、`INDUSTRIAL TECHNICAL DOCUMENTATION`、`ART-INDEX`、`DOC · TYPE · REV`）；#5 `/solutions`、#9 `/insights`（`PUBLISHED LIBRARY`、`INDX/PUBLISHED ITEMS`）
- 影响：中文页面头部出现英文「文档类型/索引」装饰文案，降低中文一致性。

### 3.6 [P2] Home 英文装饰语言 + 英文 CTA
- 源码：`HeroSection.tsx:38` `SYSTEM: ONLINE`、`:42` `NDT BASE: UT / RT / PT`、`:105` `ROLE ACCESS`；`InquiryCTA.tsx:18` 按钮 `Get Started`
- 证据：#1 `/`（`SYSTEM: ONLINE`、`NDT BASE: UT / RT / PT`、`VISNDT.SYS / 2026`、`ROLE ACCESS`、`GET STARTED`）
- 注：HeroSection L20 注释将这类视为「技术遥测语言」属设计意图，但与「避免英文说明文字」诉求冲突，需产品决策。

### 3.7 [P2] Admin 能力列表英文装饰头
- 证据：#38 admin `/products`（`CAPABILITY / GOVERNANCE · REGISTRY`）；h1 为中文「能力管理」
- 影响：Admin 运营中心中文主导，但能力管理页仍带英文装饰眉题。

### 3.8 [P2] 角色/供应商术语不统一 —— 「供应商」vs「制造商」vs「Supplier」
- 现状：平台以「供应商 / Supplier / Capability Provider」为统一角色词；「制造商」仅为**企业类型枚举之一**（`manufacturer: '制造商'`，见 SupplierPublicProfile.tsx:9、SupplierCapability.tsx:9、display/page.tsx:25），且 SupplierInfo.tsx:16 明确注释「Supplier Organization 不强制等同于 Manufacturer」。
- 中英混排直出（工作台）：`workspace/page.tsx:95` `Supplier · 供应商`；`runtime/page.tsx:233` `供应商运行时（Supplier Runtime）`、`:260/:348` `SupplierProduct`；`inquiry-context/page.tsx:54` `← 返回 Supplier Runtime`、`:80` `Supplier Model`；`SupplierWorkspaceEntry.tsx:77` `能力提供侧（Capability Provider）`；`ProductDetailContent.tsx:247` `eyebrow="Capability Providers"`
- **重要语义冲突提示**：若将「供应商→制造商」全平台统一，将与现行领域模型冲突（一个能力提供方可能是 供应商/制造商/经销商/生产商 之一，详见 api auth.service.ts:265）。此决策超出纯文案范围：
  - 若要「角色入口统一中文化」：建议把混合词统一为中文（如 `供应商`，并删除 `Supplier ·`/`(Supplier Runtime)`/`SupplierProduct` 等英文夹注），属视觉/文案修复；
  - 若真正要「把角色术语改为制造商」：属产品术语变更，需显式确认后独立实施，不能作为纯前端文案任务。

### 3.9 [P3] 需求角标/系统单号侵入文案
- 证据：#23/#29/#30 供应商工作台与机会列表出现 `665 Audit: Need 3D structural light scanner`、`Demand ID: 1a4c3d3f-…`、`VIS-RFQ-20260829-…` 等；#15 buyer `/workspace` 直出 `demo.buyer.01@visndt.local`
- 影响：演示/测试数据产生的英文需求标题与 UUID Demo ID 暴露在正式界面，需数据治理或展示层裁剪。

### 3.10 [P3] `/supplier-models` 路由语义
- 证据：#11 `/supplier-models -> /search`（finalPath `/search`）
- 说明：该路由无独立 page，直接重定向至 `/search`。作为旧「供应商型号」入口残留，与新能力发现定位需二选一（保留独立能力型导入口或删除旧入口）。

---

## 4. 字段/状态映射统一建议

### 4.1 建议单一来源（类型化映射，避免逐页复制导致回退不一致）
```ts
// apps/web/src/lib/labels.ts（建议新增，替代散落的 STATUS_LABEL_MAP / offerStatusLabels / org 三元）
export const ROLE_LABEL: Record<string,string> = { BUYER:'需求方', SUPPLIER:'供应商', ADMIN:'管理员' };
export const ORG_STATUS_LABEL: Record<string,string> = { ACTIVE:'活跃', INACTIVE:'未激活', PENDING:'待审核', APPROVED:'已通过', REJECTED:'已拒绝' };
export const OFFER_STATUS_LABEL: Record<string,string> = { DRAFT:'草稿', SUBMITTED:'已提交', ACTIVE:'活跃', ACCEPTED:'已接受', REJECTED:'已拒绝' };
export const RFQ_STATUS_LABEL: Record<string,string> = { DRAFT:'草稿', OPEN:'开放中', PUBLISHED:'已发布', PROCESSING:'处理中', CLOSED:'已关闭', EXPIRED:'已过期' };
export const label = (map,key) => map[key as string] ?? key;   // 兜底守住「未知值也不透英文原始 key」
```
并用 `label(...)` 包裹所有状态/角色渲染点（第 3.2/3.3/3.4 所列全部位置），保证「未知状态也按已知语义映射或保守中文兜底」。

### 4.2 字段名（前后端）统一口径（Preview，本期可先统一前端展示层）
| 后端字段/枚举 | 前端展示现状 | 期望中文 |
|--------------|-------------|---------|
| `workspaceRole=BUYER` | `BUYER` | 需求方 |
| `workspaceRole=SUPPLIER` | `SUPPLIER` / `Supplier · 供应商` | 供应商（或经确认后：制造商） |
| `org.status=ACTIVE` | 活跃 / 英文回退 | 活跃 |
| `org.status=INACTIVE` | 原始 `INACTIVE` | 未激活 |
| `offer.status=DRAFT/ACTIVE/…` | `状态:DRAFT` | 草稿/活跃/… |
| `rfq.status=PUBLISHED/PROCESSING` | 英文直出 | 已发布/处理中 |
| `SupplierProduct`（概念） | 中英混排 | 能力型号 |
| `Capability Provider` | `能力提供侧（Capability Provider）` | 能力提供商（去英文夹注） |

> 说明：若你希望供应商身份统一显示为「制造商」，请见 3.8 的语义冲突提示——需先在角色/企业类型模型上确认口径，再决定是「文案级中文化」还是「术语级改 Model」。

---

## 5. 设计问题（信息发布/服务平台视角）

1. **中文一致性缺失是最大块面问题**：核心目录（`/categories`、文档索引、工作区摘要、角色徽标）存在系统性英文直出，破坏「工业检测能力发现平台」的中文品牌感知。
2. **状态断言语值（'活跃否则原始值'）是隐性缺陷**：一旦出现未覆盖枚举即泄露英文，属“条件式中文化”Anti-pattern，应改为全映射+保守兜底。
3. **术语多轨道并存**：`供应商 / Supplier / Capability Provider / 制造商` 四处流浪，缺乏单一术语表；建议项目级术语表 + 一条规则（正文用中文，代码/URL 用英文，索引/表格键用中文字段）。
4. **测试/演示数据入侵正式界面**：英文需求标题、UUID、时间戳 id 作为展示名（分类、需求角标）暴露，应收敛数据治理或展示层脱敏。
5. **健康项**：角色页面跳转、`/workspace/supplier → /dashboard/supplier`、买家/供应商工作台闭环均正常；被测页面无运行时错误、无 404 断链。

---

## 6. 建议优先级（供立项，不在本审计中实施）
- **P1（文案本地化缺陷，Web 高感知）**：#3.1 / #3.2 / #3.3 / #3.4 —— 建议作为「前端文案/枚举中文化统一」专项，先收敛展示层（不动后端/DB，非 Schema 变更）。
- **P2**：#3.5 / #3.6 / #3.7 首页与文档索引英文装饰；**#3.8 术语表**（含「供应商/制造商」口径决策）。
- **P3**：#3.9 演示数据治理；#3.10 `/supplier-models` 路由处置。
- 明确**不建议**在本任务直接改代码：本审计阶段为 Audit Only；所列修复需立项后按「最小范围、展示层优先、不碰后端/Schema/Matching/AI」推进。

---

## 7. 附带说明（审计过程稳定性）
- 审计期间 API(`:4000`) 与 Admin(`:3001`) 进程曾非正常退出并以新进程恢复（环境稳定性问题，非功能缺陷）；已恢复 Web/Admin/API 服务。
- 生成物：`evidence.jsonl`（41 条），脚本 `VISNDT/database/_744_role_e2e_audit.mjs`。