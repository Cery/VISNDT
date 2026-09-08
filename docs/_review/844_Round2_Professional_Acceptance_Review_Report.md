# 844_Round2_Professional_Acceptance_Review_Report

> Was: 844_Post-Productization_Professional_User_Designer_Business_Review — **Round 2 (复评/独立复跑)**
>
> 指令: `f:\Desktop\VISNDT/VISNDT/844指令.md` （FROZEN / REVIEW-ONLY / NO-CODE-CHANGE / INDEPENDENT PROFESSIONAL ACCEPTANCE REVIEW）
>
> 日期: 2026-09-06（Asia/Shanghai）
>
> 基线: repo root=`F:\Desktop\VISNDT` · code root=`F:\Desktop\VISNDT\VISNDT` · branch=`main` · HEAD=`37bea134b67b956325dce6099a1a84afa678c414`
>
> 状态: **REVIEW-ONLY · NO-CODE-CHANGE · Round 2 复评**

---

## 0. 本轮目的与方法

本轮为 844 的一次**独立复评（Round 2）**，用与 Round 1 相同的方法（Headed Browser + 真实点击/输入/登录 + 真实 API/DB 只读取证）重新真实运行 VISNDT，以 **Professional Industrial Inspection User / Senior Product+UI+UX Designer / Platform Business Strategist** 三角色视角排查，验证 Round 1 结论是否可复现，并识别新问题。

**绝对规则（全程遵守）**：`SOURCE/DATABASE/SCHEMA/MIGRATION/API/DOMAIN/ROUTE/LIFECYCLE/PERMISSION/CONTENT/TEST DATA = NO CHANGE`。本轮**未修改任何源码 / Schema / API / 数据 / 测试数据**；仅 OBSERVE → RECORD → CLASSIFY → RECOMMEND。

---

## 1. Runtime 基线（Round 2）

| 服务 | 状态 | 证据 |
|---|---|---|
| PostgreSQL (`visndt-postgres`) | HEALTHY | `docker ps` 状态 healthy，端口 5432 |
| MinIO (`visndt-minio`) | HEALTHY | `docker ps` 状态 healthy，端口 9000-9001 |
| API | UP | `GET http://localhost:4000/api/v1/health` → `{"status":"ok","database":"connected"}` |
| Web | UP | `GET :3000/` → 200 |
| Admin | UP | `GET :3001/` → 200 |

已确认测试账户（仅角色，不泄露凭据，DB 只读）：
- `demo.buyer.01@visndt.local`（张检测 · 有组织）— Buyer
- `demo.supplier.01@visndt.local`（王明视 · 有组织）— Supplier
- `demo.admin@visndt.local`（Demo Admin · 有组织）— Admin
- 角色来源：`organization_member.role`（buyer/supplier/admin）

> 提示：工作树存在一批 **未提交的既有改动**（`apps/api/src/products/products.controller.ts`、`supplier-products-*`、`apps/web/*`、`apps/admin/*` 等十余文件被修改未 commit）。这些为复评前既有状态，本轮**未改未提交**，仅记录于基线。

---

## 2. 三角色 Runtime 复评矩阵

| # | 场景 | Role | 复验结果 | 证据 |
|---|---|---|---|---|
| R2-01 | 首页（Guest 公开） | A/B | PASS · 双区布局/能力分类索引正常，1440 无横向溢出 | `/` · ovf:false · `_844_shots_round2/01_home_1440.png` |
| R2-02 | 统一检索 `超声波探伤` | A | 见 F2/P1-02（仅 1 条知识，0 能力） | `/search?q=超声波探伤` |
| R2-03 | 统一检索 `ZB-K60`（产品型号） | A | PASS · 命中「电子视频内窥镜」能力 + 8 项参数选项可筛 | `/search?q=ZB-K60` |
| R2-04 | 能力注册表 / 产品列表 | A | PASS · 展示「4 项已注册检测能力」 | `/products` · `_844_shots_round2/03_products_1440.png` |
| R2-05 | 产品详情 ZB-K60 | A/B | 见 F3（无图 / 型号 0 规格 / 测试数据标注外露） | `/products/ebb1c034-…` |
| R2-06 | 产品对比 | A/B | **见 F1（P1 严重）→ 对比无法入列** | `/products/compare` |
| R2-07 | 能力分类 | A | PASS · 13 能力分类 / 07 子类 | `/categories` |
| R2-08 | Buyer 登录 + 采购工作台 | A | PASS · 重定向 `/dashboard/buyer`，Demand 7 / Match 4 / RFQ 3 / Decision 0 | 截图 08 |
| R2-09 | Buyer 创建需求表单 | B | PASS · 需求描述/预算/分类/技术参数层级完整，隐私开关（公开联系人）合理 | `/workspace/demands/create` · 截图 09 |
| R2-10 | Supplier 登录 + 供应工作台 | A | PASS · RFQ 3 / 响应 3 / Offer 1 / 未读 3 | `/dashboard/supplier` |
| R2-11 | Supplier 型号自服务写路径 | A | PASS · 「挂靠平台能力 + 新增型号」自管理可用；E2E 测试数据明确标识 | `/workspace/supplier/products` · 截图 10 |
| R2-12 | Admin 登录 + 治理工作台 | A/C | PASS · 需求/RFQ/报价/匹配/产品/组织/用户/内容/监控/审计(NOT-AI) 治理完备，待处理 13 | `:3001/home` · 截图 11 |
| R2-13 | 移动端 375px 复核 | B | PASS · Home/Products/Detail/Search 均 **无横向溢出**；导航折叠为「切换菜单」 | ovf:false ×4 · 截图 12–15 |

---

## 3. Round 2 发现与分级

> 分级符号沿用：P0（阻断安全/数据/授权）· P1（功能逻辑缺陷，阻断核心业务闭环）· P2（数据/内容完整性）· P3（体验打磨）；R×=运行时证据，F×=功能/逻辑，D×=设计，B×=商业模式。

### F1 — [P1 / 运行时功能缺陷] 产品对比无法入列（Round 2 新发现）

- **现象（真实点击复现）**：
  1. 在 `/products` 点击卡片「对比 ZB-K60 工业检测内窥镜」→ 按钮变「**取消对比**」（选择已在页面态生效）；
  2. 同样选择 ZB-TJ095 → 显示 2 项已选；
  3. 点击「评估对比」→ 跳转 `/products/compare`，（或直接访问 compare）；
  4. compare 页显示 **「当前选择 0 个检测能力产品」「未选择产品」**。
- **根因（只读判断）**：对比选择仅保存在产品列表页的**局部 React state / 页面内存**，跳转 `/products/compare` 时未通过 URL query（`?ids=…`）或持久化（localStorage 为空，实测 `Object.keys(localStorage)=[]`）传递到对比页；对比页并未读取到任何选择项。
- **影响**：产品对比是 844 所述「CAPABILITY EVALUATION / 评估对比」核心工程环节，当前**端到端不可用**，属阻塞性功能缺陷。
- **建议（不在本轮执行）**：compare 入口收敛为带 `ids`/`slugs` 的 query 传递，或 compare 页读取统一的持久化选择（优先级：修复后按 WP-9 Must-fix-before-launch 处理）。

### F2 — [P2 / 内容-PMF] 能力目录稀疏，「检测能力」检索命中率为 0

- **事实（DB 只读 vs DB）**：`product` 仅 **4 条**（三维扫描仪 2 · 光纤内窥镜 1 · 电子视频内窥镜 1）；`supplier_product` 12 条，其中仅 **5 条 PUBLISHED**（6 SUBMITTED / 1 APPROVED）；`knowledge_entry` 6；`content` 8。
- **现象**：统一检索「超声波探伤」→ 仅 1 条知识（`/knowledge/ultrasonic-flaw-detection-basics`），**检测能力 0 / 方案 0**（`main` 链接实测唯一条目即该知识文章）。
- **根因**：目录中不存在超声波探伤类目产品（非检索 bug，属**库存空洞**）。
- **影响（Role C）**：首页展陈 12+ 能力分类卡，但能力注册表仅有 3 类产品；「超声波探伤仪」「射线探伤仪」等分类点击后为空 → 发现旅程断链；平台当前处**供给流动性未形成**的 Pre-PMF 阶段。

### F3 — [P2 / 内容完整性] 产品详情缺媒体 / 型号无参数 / 内部测试标注外露

- 产品详情「暂无图片」（媒体缺位）；
- 供应型号（SupplierProduct）展示「0 项规格」；
- 描述正文向**公开页面**输出内部标注 `[M34.6 CONTROLLED TEST DATA][PUBLIC SOURCE DATA]` —— 虽体现测试数据透明，但对上线/公开展示属数据质量与措辞问题（应仅在治理/后台区分，而非面向终端展示）。

### D1 — [P3 / SEO] 产品详情 URL 使用 UUID 而非语义 slug

- 产品详情路径为 `/products/{uuid}`（而非 slug）。平台以 `product`（Platform Product）为 SEO 权威对象，UUID 型 URL 不利于 SEO/可读性。

### B1 — [P2 / 商业模式观察] 供给稀缺 + 需求侧已有闭环数据 = 流动性错配

- 已有测试数据覆盖完整需求侧闭环（Demand 7 / Match 4 / RFQ 3 / Offer 1）与供应侧工作台，但**平台产品/型号公开供给仅个位数**；「能力发现 → 型号 → 报价」供给薄。
- 说明架构与业务闭环功能已成型，但**内容/供给初始化不足**，商业化/平台化起飞缺燃料。

### PASS 项（复评确认无回归）

- 移动端：Home / Products / Product Detail / Search 在 **375px 无横向溢出**（Mobile first-class 达标），导航折叠正常。
- 权限边界：Buyer→`/dashboard/buyer`、Supplier→`/dashboard/supplier`、Admin→`:3001` 各自隔离，未发现越权。
- 数据治理：E2E 测试型号（`UX品牌E2E … W5A-E2E-…`）明确标注，状态机（SUBMITTED/PUBLISHED/APPROVED）合理。
- 供应商型号**自服务写路径（WP-5A）**存在且可用：能力锚点为平台权威、只可绑定不可修改。

---

## 4. 三角色评分汇总（Round 2）

| 维度 | Round 1 | Round 2 | 说明 |
|---|---|---|---|
| 整体视觉/结构 | 7.5/10 | 8/10 | 明暗分区、专业科技感稳定 |
| IA / 导航 / Wayfinding | 7/10 | 7/10 | 分类导航完整；目录稀疏拖低实用性 |
| 内容/信息完整性 | 4/10 | 4/10 | 供给稀缺；产品无图、型号 0 规格 |
| 搜索体验 | 4/10 | 4/10 | 基础可用；能力命中率低、无空态引导 |
| 移动端适配 | 8.5/10 | 8.5/10 | 375 无溢出，符合一等可用 |
| 业务闭环功能 | 7/10 | **6/10** | **对比缺陷扣分**（核心环节不可用） |
| PMF / 流动性 | 3/10 | 3/10 | 供给初始化为主要瓶颈 |

---

## 5. 结论与上线建议（Round 2）

**Professional Acceptance = 有条件接受（CONDITIONALLY ACCEPTABLE）**；**Launch = WITH CONDITIONS（新增 1 项 Must-fix-before-launch，合并 Round 1 条件）**。

### Must-fix-before-launch（新增）
1. **F1 · 修复产品对比入列后跳转**（`/products` 选择 → `/products/compare` 需携带或读取选择项）。对比是核心评估环节，属阻塞级。
2. （沿用 Round 1）产品详情媒体/测试标注外露清理、公开 API 字段投影复核、移动端无回归维持。

### 可延后（后置治理 / WP-9 建议）
- F2 目捉稀疏：供给初始化策略（供应商型号 Publish 引导、分类→产品的空态设计）。
- D1 UUID→slug 路由优化（SEO）。
- 空状态/过滤面板优化（搜索左栏当无筛选参数时应隐藏或改推荐）。

### 复评结论
Round 2 在**不改任何代码/数据**前提下，验证了 Round 1 主体结构稳定 + 移动端/角色权限/治理台达标，并**新增定位到 1 项 P1 功能缺陷（产品对比不可用）**。该缺陷属「功能逻辑」范畴，不属本轮评审可修复范围，纳入 WP-9 Must-fix-before-launch。

---

## 6. 证据清单

截图（`f:\Desktop\VISNDT\VISNDT\_844_shots_round2\`）：`01_home_1440` `02_search_ultrasonic` `03_products_1440` `04_categories_1440` `05_product_detail_1440` `06_compare` `07_compare_via_btn_1440` `08_buyer_dashboard_1440` `09_demand_create_1440` `10_supplier_products_1440` `11_admin_console_1440` `12_home_375` `13_products_375` `14_product_detail_375` `15_search_375`.

运行时/只读取证：`/api/v1/health`；`/products` `/search?q=…` `/categories` `/products/compare` 各角色工作台；`psql` 只读计数（product=4 / supplier_product=12(PUBLISHED=5) / knowledge=6 / content=8）。

---

## 7. 声明

- 本报告为 **REVIEW-ONLY** 产物：**未改动**任何源码、数据库、Schema、迁移、API、域名、路由、生命周期、权限、内容、测试数据；未创建新的真实账户；未输出任何凭据（password/token/JWT/cookie/secret）。
- 全程遵循 `OBSERVE → RECORD → CLASSIFY → RECOMMEND`，无现场修复。
- **STOP —— 844 Round 2 复评完成。不自动启动任何开发 / 修复（含 WP-9）。**