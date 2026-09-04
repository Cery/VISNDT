# 776 M35 Minimal Engineering Information Architecture Decision

- **任务类型**：Minimal Architecture Decision / Boundary Freeze / Domain Boundary / Information Relationship / Minimal-Change Authorization Gate
- **执行模式**：**READ-ONLY**（零生产代码 · 零 Schema · 零 Migration · 零 API · 零 Backend · 零 Frontend · 零数据 · 零路由 · 零功能 · 零重构 · 零重设计）
- **审计日期**：2026-09-01
- **最终决策状态**：**ARCHITECTURE DECISION COMPLETE**（7 项决策均完成且不阻断固定路线）

---

## 1. Task Identity
- Task：`776_M35_Minimal_Engineering_Information_Architecture_Decision`
- 目标：在 775 校准基础上，对 7 个有限事项做最终最小化架构边界决策；确定 reuse/extend/semantic/defer/fundamental candidate；不重新设计 VISNDT；不实施任何变更。

## 2. Repository Verification
| 项 | 值 |
|---|---|
| Repository Root | `F:/Desktop/VISNDT` |
| Code Root | `F:/Desktop/VISNDT/VISNDT` |
| Branch | `main` |
| HEAD | `76b08e508325b7c094c7b7f1234fc18e8e37014e` |
| Working Tree | ACTUAL STATUS（Modified=WorkspaceSidebar.tsx/tsconfig.tsbuildinfo/docs/_architecture/M34...Contract.md/docs/project-management/*；Untracked=apps/web/src/app/workspace/evaluations/、components/evaluations/*、lib/api/evaluations.ts、M34.7 Target State md、770-775 报告） |

## 3. Git Baseline
- 与 775 一致；本任务零生产改动 → **Production Code/Schema/Migration/API/Backend/Frontend/Data/Route = NO**。

## 4. M34 / 770 / 771 / 772 / 773 / 774 / 775 Reconciliation
- M34.6 = **CLOSED**
- 770 = **COMPLETED / READY WITH CONDITIONS**
- 771 = **PASS / AUTHORIZED WITH CONDITIONS**
- 772 = **IMPLEMENTED / VERIFIED**
- 773 = **CONDITIONAL PASS**
- 774 = **ARCHITECTURE AUDIT · CONDITIONAL**
- 775 = **CALIBRATION · CONDITIONAL**
- 776 = **CURRENT / ARCHITECTURE DECISION GATE**
- **M35–M39 = NOT AUTHORIZED（仅 Candidate，等待本任务后单独授权）**
- 无路线漂移（无 M34.8 / M35 已实现 / M36 started / M37 started）。

## 5. Original VISNDT Positioning Verification
- 定位（已核对 schema/代码/冻结契约/775 报告）：**VISNDT = Vertical Industrial NDT / Inspection Equipment Platform（工业无损检测设备能力发现平台）**。
- Search = Industrial Inspection Capability Discovery → 非商品商城/店铺搜索（冻结保持）。
- Supplier = Capability Provider → 非 Store Owner/Seller；禁止 Store/Marketplace/Transaction 化（冻结保持）。
- 保持垂直 NDT 边界，未退化为通用 B2B / 设备 marketplace / 通用目录 / 企业内容门户 / 通用工程搜索。

## 6. Vertical NDT Domain Boundary
- 核心用户问题链（经现有模型可安全承接）：
  ```
  NDT Problem
    ↓
  Detection Object
    ↓
  Application
    ↓
  Capability
    ↓
  Product
    ↓
  Technical Parameters
    ↓
  SupplierProduct
    ↓
  Supplier
    ↓
  Knowledge / Insight / Document / Standard
    ↓
  Evaluation
    ↓
  Demand
    ↓
  Match
    ↓
  RFQ
    ↓
  Quote / Offer
    ↓
  Inquiry
    ↓
  Workspace
  ```
- 边界保持：**NDT 垂直 > Generic B2B**；不引入 General B2B 实体（决策验证通过）。

## 7. Fixed Route Verification
本任务最终锁定固定主阶段路线（禁止无限细分/平行路线）：
- **M35** → Product & Engineering Information Enhancement（仅最小增强·非大型重构）
- **M36** → Engineering Discovery Search（仅一级表面+参数驱动+语义激活·不默认 AI）
- **M37** → Knowledge + Insight Asset System（仅经既有模型·不默认新表）
- **M38** → Unified Discovery + Multi-surface Discoverability（仅全资产可发现·非 SEO 专项）
- **M39** → Platform Loop Consolidation（仅工作流闭环整合）
- **Final** → Platformization Assessment

No new phases created. No route expansion. No M35.1.x / M36.x / parallel streams. 符合指令要求。

---

## 8. Application Decision
### 8.1 Current Authority & Representation
- 现有模型：`ContentTagType.APPLICATION` 枚举 + `ContentTag` + `ProductCategory` + `ParameterDefinition` + `Product` + `KnowledgeEntry` + `ProductCategoryKnowledgeMapping`。
- M35 需求：Product/Capability 表达「该设备应用于什么行业/场景」，可由 ContentTag（APPLICATION type）打标 → Product → ContentTagRelation → Content → KnowledgeEntry 链路承载，或直接 `Product` 文本字段 + Parameter 分类。
- 已存在：`SupplierProduct.applicationInfo` 文本字段已在 schema（行 570）；Product 无专属字段，但可通过 ContentTag 关联。

### 8.2 Decision Criteria
根据优先级：
1. Existing Tag / Taxonomy → ok
2. Derived Semantic Dimension → ok
3. 无需独立 Domain（独立生命周期/独立 Authority/独立管理/独立 canonical identity/独立搜索责任/独立关系网络 → 不满足全部）。

### 8.3 Impact Assessment
| Dimension | Impact |
|---|---|
| Schema | 无新表；仅可能新增 ContentTag（复用模型）→ 无 schema 变更或极小 |
| API | 无新增 API；Content/Product 搜索可复用 → 无 |
| Backend | 复用现有 ContentTag/ContentRelation 服务 → 无变更 |
| Frontend | Product 详情展示应用标签 → 极小 UI 增强 → S |
| Admin | ContentTag 管理已有 → 无新增管理面 |
| Runtime | Product 详情页索引/过滤 → 无影响 |
| Operation | ContentTag 由平台/供应商分类 → 低运营 |
| Change Size | **S** |

### 8.4 Final Decision
**SEMANTIC / DERIVED** → 复用 `ContentTagType.APPLICATION` + `ContentTag` + `ContentTagRelation` + `Product` 关联；无需新建 `Application` 表。属于「派生语义维度」，不升级独立 Domain。

---

## 9. Detection Object Decision
### 9.1 Current Authority & Representation
- Detection Object = "What is being inspected?"（被检测对象：材料、构件、工件、焊缝、管道...）。
- 现有模型：`ProductCategory` + `ContentTag`（TECHNOLOGY/APPLICATION）+ `KnowledgeEntry` + `Parameter` + `Product`。
- 需求：Product/Capability 语义关联「可检测什么对象」，上述派生已可表达：Product ↔ ContentTag(DO type) ↔ KnowledgeEntry（定义描述）。
- 不满足独立 Domain 全部条件（独立生命周期/Authority/管理/canonical identity/search/relations）。

### 9.2 Impact Assessment
| Dimension | Impact |
|---|---|
| Schema | 无新表 → 无变更 |
| API | 复用现有 → 无 |
| Backend | 复用现有服务 → 无变更 |
| Frontend | Product 详情展示检测对象标签 → S |
| Admin | ContentTag 管理已有 → 无 |
| Runtime | 无影响 |
| Operation | 标签分类 → 低 |
| Change Size | **S** |

### 9.3 Final Decision
**SEMANTIC / DERIVED** → 复用 `ContentTag` + 现有关系网络派生表达；无需新建 `DetectionObject` 实体/表。

---

## 10. Insight Decision
### 10.1 Current Authority & Representation
- Insight = Engineering Semantic Annotation / Encyclopedia Unit（工程语义注解/百科单元）。
- 现有模型：`ContentType.INSIGHT`（枚举已存在）+ `Content` + `ContentTagType{TECHNOLOGY,APPLICATION}` + `KnowledgeEntry` + `Parameter` + `ProductCategoryKnowledgeMapping`。
- M35/M37 需求：对 Product/Parameter/Application/Detection Object 做技术注解，上述组合可承载：
  - `Content(type=INSIGHT)` → 正文/结构/slug/SEO/embedding 全齐
  - `ContentTag` 分类（技术/应用）
  - `KnowledgeEntry` 关联 Product/Category
  - `Parameter` 关联技术参数
- 80%+ 使用场景可经现有模型承载 → 满足第一轮复用要求。

### 10.2 Impact Assessment
| Dimension | Impact |
|---|---|
| Schema | 无新表；复用 `ContentType.INSIGHT` + `Content` + `KnowledgeEntry` → 无变更 |
| API | 复用现有 Content/Knowledge API → 无 |
| Backend | 复用现有服务 → 无 |
| Frontend | Insight 内容展示 → 复用 Content 组件 → S |
| Admin | 复用 Content 管理面 → 无新增 |
| Runtime | Content 搜索/索引已有 → 无影响 |
| Operation | 注解创建 → 半自动化（规则辅助 + 有限审核）→ 低运营 |
| Change Size | **S** |

### 10.3 Fundamental Change Candidate 条件
仅当后续实证：「现有模型无法承载 80%+ 核心场景」且「Low-operation model 无法成立」→ 才升级 Fundamental Change Candidate。本任务基于现有证据，无需提前升级。

### 10.4 Final Decision
**REUSE + CONTROLLED EXTENSION** → 复用 `ContentType.INSIGHT` + `Content` + `ContentTag` + `KnowledgeEntry` 承载工程语义注解；不新建 `Insight` 独立实体/表。

---

## 11. Document Decision
### 11.1 Current Authority & Representation
- Document = Technical document/specification sheet/certificate/drawing 等工程文档。
- 现有模型：`Content` + `ContentMedia` + `ContentRevision` + `FileAsset` + `FileType{SPEC_SHEET,CERTIFICATE,DOCUMENT}` + `ContentTag` + `ContentRelation`。
- 需求：文档类型/元数据/分类/关联/索引，上述全部支持；`SupplierProductMedia` 已含 `documentType`（行 604）支持产品关联技术文档。
- 独立 Authority 必要性：文档生命周期（创建/修订/审核/发布/归档）、权限、搜索、关联 → 全部已由 Content/FileAsset 模型覆盖。无需新 Domain。

### 11.2 Impact Assessment
| Dimension | Impact |
|---|---|
| Schema | 无新表；`FileType` 已有 `SPEC_SHEET,CERTIFICATE` → 无变更（或仅新增枚举值，S） |
| API | 复用现有 Content/FileAsset API → 无 |
| Backend | 复用现有服务 → 无 |
| Frontend | 文档列表/预览/下载 → 复用媒体组件 → S |
| Admin | 复用 Content/FileAsset 管理 → 无 |
| Runtime | 文档搜索/索引已有 → 无影响 |
| Operation | 文档上传/分类/发布 → 供应商自助 + 有限审核 → 低运营 |
| Change Size | **S** |

### 11.3 Final Decision
**REUSE** → 复用 `Content` + `ContentMedia` + `FileAsset` + `ContentTag` 表达技术文档；不新建 `Document` 独立 Domain。如需新增文档类型仅需扩展 `FileType` 枚举 → 属于 CONTROLLED EXTENSION（S）。

---

## 12. Standard Decision
### 12.1 Current Authority & Representation
- Standard = Industry/国家标准/技术规范/检测方法标准。
- 现有模型：可由 `Content(type=KNOWLEDGE or INSIGHT)` + `ContentTag` + `FileAsset` + `KnowledgeEntry` + 关联 Product/Category/Parameter 承载。
- 当前 M35–M39 固定路线内，是否必须独立 Domain？
  - 独立检索：Content 搜索已支持；
  - 独立关联：ContentRelation/ProductCategoryKnowledgeMapping 已支持；
  - 独立生命周期：Content 已有完整状态机；
  - 独立 Authority：Content 已有 Authority；
- 当前路线下优先 **DEFER** → 不需要本轮内建设独立 Domain。可作为 Content-backed reference 延续。

### 12.2 Impact Assessment
- 若独立 Domain → Change Size = L（Fundamental）；本轮不涉及。
- 当前路线复用方案 → Change Size = S。

### 12.3 Final Decision
**DEFER** → 当前固定路线 M35–M39 内不建设独立 Standard Domain；复用 Content + FileAsset + KnowledgeEntry 作为标准引用；未来若实证必须独立检索/关联/生命周期，再单独 ADR 评估 Fundamental Change。

---

## 13. ROUND_ROBIN Decision
### 13.1 Current Authority & Representation
- 商机分配：
  - `SUPPLIER_ASSIGNED` → `RFQ.targetOrganizationId` 已存在（行 734）→ 直接 REUSE，OK。
  - `ROUND_ROBIN` → 多业务员（`OrganizationMember`）轮询分配商机。
- 现有模型：`Organization` + `OrganizationMember(organizationId,userId,role)` + `RFQ` + `WorkflowEvent(entityType/entityId/action/metadata)` + `Notification(userId,type,...)`。
- 可行方案：ROUNT_ROBIN 规则（顺序轮询）可配置存储在 `Organization.metadata` Json 字段；分配事件记录在 `WorkflowEvent`；通知到具体业务员 via `Notification`。
- 无需持久化「轮询指针/分配历史/重分配状态」到专用表 → 配置+事件记录已能满足第一轮需求。
- 仅当后续实证必须「持久化轮询状态到具体销售人员」才升级 Fundamental。

### 13.2 Impact Assessment
| Dimension | Impact |
|---|---|
| Schema | 无新表；利用 `Organization.metadata` Json + `WorkflowEvent` + `Notification` → 无变更 |
| API | 新增轮询配置接口（小扩展）→ 极小 |
| Backend | 新增路由逻辑（配置驱动）→ S/M |
| Frontend | 供应商组织设置页增加轮询配置 → S |
| Admin | 无额外管理 → 无 |
| Runtime | RFQ 创建时触发分配 → 极小影响 |
| Operation | 供应商自助配置 → 低运营 |
| Change Size | **S**（配置扩展） |

### 13.3 Fundamental Change Candidate 条件
仅当必须「持久化每个业务员的分配指针/完整分配历史/复杂重分配状态」且现有模型无法表达 → 才列 Fundamental Change Candidate。本决策基于现有证据，不提前升级。

### 13.4 Final Decision
**CONTROLLED EXTENSION** → 复用 `Organization.metadata`（配置轮询规则） + `WorkflowEvent`（记录事件） + `Notification`（通知业务员）；不新建 `Assignment/Opportunity/Lead/SalesRouting` 表。

---

## 14. Search Semantic Layer Decision
### 14.1 Current Authority & Representation
- 现有：统一 `/search` → `unifiedSearch` 跨 Product/SupplierProduct/Supplier/Knowledge/Content(INSIGHT)/Solution；已支持 facet = Category/Parameter/brand/series/hasOffer；`semantic/query` 模块已存在（controller/service/vector retrieval）但未接入统一搜索；`Product/Content` 已有 `embedding` 向量列。
- 演进路径（遵循 775 校准）：
  ```
  Unified Search
    ↓
  Parameter-driven Search
    ↓
  Technical Discovery
    ↓
  Semantic Layer
    ↓
  Intent Layer
    ↓
  AI-assisted Discovery
  ```
- 当前 M36 目标：激活语义层并接入参数主导工程检索，不需要新建 Search Architecture / 新索引系统 / 强制 AI。
- 现有架构已支持：语义查询作为扩展接入统一搜索 → **REUSE / ADAPT**。

### 14.2 Impact Assessment
| Dimension | Impact |
|---|---|
| Schema | `embedding` 列已存在 → 无变更 |
| API | 统一搜索增加语义参数 → M（受控扩展） |
| Backend | 接入现有 `semantic/query` 到 `/search` → M |
| Frontend | 搜索页增加语义选项（可选）→ M |
| Admin | 无 → 无 |
| Runtime | 语义查询可选接入 → 不强制默认 AI → 可控 |
| Operation |  embedding 已存在（自动生成或预处理）→ 低运营（若使用 OPENAI  embedding 成本取决于数据规模） |
| Change Size | **M** |

### 14.3 Final Decision
**REUSE + CONTROLLED EXTENSION (ADAPT)** → 复用现有 `unifiedSearch` + `semantic/query` + `embedding` 列；M36 阶段将语义查询适配接入统一搜索，实现参数主导 + 语义辅助工程检索；不新建 Search Architecture / 强制 AI 平台。

---

## 15. Current Authority Matrix
| Domain | Current Authority | Current Representation | Decision |
|---|---|---|---|
| Application | Semantic Taxonomy | ContentTag(APPLICATION) + Product relation | SEMANTIC / DERIVED |
| Detection Object | Semantic Taxonomy | ContentTag + Knowledge relation | SEMANTIC / DERIVED |
| Insight | Content + Knowledge | ContentType.INSIGHT + Content + KnowledgeEntry + Tag | REUSE + CONTROLLED EXTENSION |
| Document | Content + File | Content + ContentMedia + FileAsset + Tag | REUSE |
| Standard | Content-backed | Content + FileAsset + Knowledge | DEFER |
| ROUND_ROBIN | Configuration + Workflow | Organization.metadata + WorkflowEvent + Notification | CONTROLLED EXTENSION |
| Search Semantic Layer | Existing module | unifiedSearch + semantic/query + embedding column | REUSE + CONTROLLED EXTENSION (ADAPT) |

## 16. Target Semantic Boundary
- **Application** = 语义标签维度 → 标记 Product/Capability 使用场景/行业领域
- **Detection Object** = 语义标签维度 → 标记 Product/Capability 可检测对象
- **Insight** = 工程语义注解单元 → 依托 Content + Knowledge 承载，不独立实体
- **Document** = 工程技术文件 → 依托 Content + FileAsset 承载，不独立实体
- **Standard** = 技术标准参考 → 依托 Content + FileAsset 承载，本轮 defer 独立 Domain
- **ROUND_ROBIN** = 商机分配规则 → 配置+事件+通知，不独立分配实体
- **Search Semantic Layer** = 参数检索之上的语义扩展 → 复用现有模块适配接入，不新搜索架构

---

## 17. Impact Matrix
| Domain | Schema Impact | API Impact | Backend Impact | Frontend Impact | Admin Impact | Runtime Impact | Change Size | Operation Impact |
|---|---|---|---|---|---|---|---|---|
| Application | None | None | None | Minor display | None | None | S | LOW |
| Detection Object | None | None | None | Minor display | None | None | S | LOW |
| Insight | None | None | None | Minor display | None (reuse) | None (existing search) | S | LOW |
| Document | None (or enum extend) | None | None | Minor display | None (reuse) | None (existing) | S | LOW |
| Standard | Deferred | Deferred | Deferred | Deferred | Deferred | Deferred | — | — |
| ROUND_ROBIN | None | Minor | Minor | Minor config UI | None | Minor (RFQ create) | S | LOW |
| Search Semantic Layer | None | Minor extend | Minor adapt | Minor UI extend | None | Minor (optional query) | M | LOW (depends on embedding cost) |

## 18. Reuse / Extend / Defer / Fundamental Change Matrix
| Category | Domains |
|---|---|
| **REUSE** | Insight (base), Document |
| **CONTROLLED EXTENSION** | Insight (extension), ROUND_ROBIN, Search Semantic Layer |
| **SEMANTIC / DERIVED** | Application, Detection Object |
| **DEFER** | Standard |
| **REJECT** | — |
| **FUNDAMENTAL CHANGE CANDIDATE** | — (all 可经现有模型表达，无强制 Fundamental) |

## 19. Fundamental Change Candidates
本任务基于现有仓库证据，**7 项中无必须立即进入 Fundamental Change 的项**。监视候选（仅当未来实证现有模型无法满足才触发独立 ADR）：
1. **Insight 独立 Authority** → 若 80%+ 场景无法经 Content+Knowledge 承载，且 Low-op 失效。
2. **Standard 独立 Domain** → 若必须独立检索/关联/生命周期，现有 Content 模型无法满足。
3. **ROUND_ROBIN 持久化指针** → 若必须持久化轮询状态到具体业务员，配置+事件无法满足。

以上均**不实施**、**不混入** M35–M39 正常路线，需独立 ADR 后才可进入实施。

## 20. Low-Operation Compliance
- 所有决策均遵循：**Platform-managed + Rule-driven + Structured + Self-service + Automatic + Semi-automatic + Minimal Human Review**。
- 高杠杆复用：规则（参数校验/去重）、配置（轮询）、结构化数据（标签/关系）、自动化索引/facet/sitemap/通知、供应商自助。
- 避免：手工录入/链接/索引/SEO/分配/建页。符合低运营原则。

## 21. M35–M39 Scope Freeze
### 21.1 M35 Scope: Product & Engineering Information Enhancement
**Only allowed**:
- Product 模型 → 工程上下文增强（Application/Detection Object 语义标签，现有模型派生）
- 多 SupplierProduct / 多供应商展示补齐
- SupplierProduct 发布规则/字典增强
- Supplier 组织自助多用户管理界面
- 不允许：Full Product Rewrite / New Product System / New Supplier System / New Content System / New Search System

### 21.2 M36 Scope: Engineering Discovery Search
**Only allowed**:
- Search 升级为一级平台表面
- 参数驱动工程发现路径
- 激活现有语义层（非默认强制 AI）
- 不允许：自动扩展为 AI Platform / LLM Platform / RAG Platform / Vector Platform / New Search Engine

### 21.3 M37 Scope: Knowledge + Insight Asset System
**Only allowed**:
- Knowledge 体系化梳理
- Insight 工程语义标注（复用 Content+Knowledge+Tag）
- 内容平台闭环补齐
- 优先复用现有 Knowledge/Content/ContentTag/Product mapping
- 不允许：自动创建新的 Content Domain / Insight 独立表

### 21.4 M38 Scope: Unified Discovery + Multi-surface Discoverability
**Only allowed**:
- 全资产统一发现
- On-site / External Search Engine / AI-LLM 可发现性增强（自动 sitemap / 自动结构化元数据）
- 不允许：变成 SEO-only project / AI-only project / Homepage redesign / Global content rewrite

### 21.5 M39 Scope: Platform Loop Consolidation
**Only allowed**:
- 围绕既有 Evaluation/Demand/Match/RFQ/RFQResponse/Offer/Inquiry/Workspace 做闭环整合
- 商机路由规则整合
- 不允许：首次创建 new commerce / marketplace / transaction domain

## 22. Issue Handling Rule (Batch Problem Resolution)
遵循本轮锁定原则：
- **P0 / Blocking** → 仅 Security breach / Data integrity risk / Destructive migration requirement / Architecture contradiction / Authorization violation / Production corruption risk 可立即中断固定路线 → STOP + BLOCKING ISSUE。
- **P1 / Material but Non-blocking** → 例如搜索边缘案例、移动端问题、UI一致性、内容映射缺陷、轻微工作流缺陷、数据归一化缺陷 → Record → Classify → **Do not create new stage** → Continue fixed route when safe → 进入 BATCH REMEDIATION REGISTER。
- **P2 / Optimization** → 例如视觉优化、文案改进、次要 UX 优化、非关键 SEO 增强 → DEFER → Batch Remediation。
- **No Route Explosion**：严禁「发现问题 → 创建新 M 阶段」。必须「发现问题 → Issue Register → Priority → Batch Remediation」。

## 23. Evidence Gaps
- UNVERIFIED：实时数据规模（Docker 未运行，继承 775）；语义检索 L4 运行时效果（待 M36 验证）；
- 所有 7 项决策基于**现有 Schema / 代码 / 架构契约**证据，符合 Evidence Hierarchy（Runtime > Code > Schema/API > Current Docs > Roadmap > Assumption）；
- 无 Runtime 可证项已标注为 UNVERIFIED，未写成 PASS。

## 24. Documentation Synchronization
本任务同步：
- `docs/project-management/PROJECT_STATUS.md` → 追加 776 状态条目
- `docs/project-management/PROJECT_ROADMAP.md` → 确认并锁定 M35–M39 固定路线，隔离 Fundamental Change Candidates
- `docs/project-management/MODULE_COMPLETION_MATRIX.md` → 追加 776 行
- 不修改 749–775 历史报告；不修改 M34 冻结架构契约正文，仅状态登记。

## 25. Final Architecture Decision
**776 = ARCHITECTURE DECISION COMPLETE**

- 7 项有限事项均已给出明确最终决策
- 所有决策遵循 Reuse-first / Existing Architecture-first / Low-operation / Vertical NDT 约束
- 无 Fundamental Change 必须阻断固定路线
- 固定路线 M35→M36→M37→M38→M39 已锁定，无无限细分，无平行路线
- 所有 Fundamental Change Candidates 已隔离，不混入正常路线
- 文档已同步，评审报告已生成

**Final Status**: **COMPLETE**（无阻断条件，所有决策达成）

## 26. Next Authorized Stage
**M35 Product & Engineering Information Enhancement** → 等待独立实施授权指令。本任务仅做架构决策，不实施。

## 27. STOP Confirmation
- [x] READ-ONLY（零代码/Schema/Migration/API/Backend/Frontend/数据/路由/功能/重构/重设计）
- [x] 不实施 M35/M36/M37/M38/M39
- [x] 不标记 M34 CLOSED
- [x] 不生成 777
- [x] 不进入 M34.8
- [x] Fundamental Change Candidates 已隔离，不混入正常路线
- [x] 不改写 749–775 报告 / Frozen ADR / M34 Contract 正文
- [x] 固定路线已锁定

**STOP: CONFIRMED**

---

## Final Execution Output
```
Task:                   776_M35_Minimal_Engineering_Information_Architecture_Decision
Task Type:              Architecture Decision / Minimal-Change Gate / Boundary Freeze
Repository Root:        F:/Desktop/VISNDT
Code Root:              F:/Desktop/VISNDT/VISNDT
Branch:                 main
HEAD:                   76b08e508325b7c094c7b7f1234fc18e8e37014e
Working Tree:           ACTUAL STATUS（Modified=4 docs + 2 web files；Untracked=770-775 reports + M34.7 evaluation frontend）
Production Code Changed:NO | Schema:NO | Migration:NO | API:NO | Backend:NO | Frontend:NO | Data:NO
Original VISNDT Positioning: Vertical Industrial NDT / Inspection Equipment Platform（保持·复核一致）
Vertical NDT Boundary:   保持垂直；未退化通用 B2B/Marketplace/目录/工程搜索引擎（符合约束）
Fixed Route Locked:      M35→M36→M37→M38→M39→Final Assessment；无细分；无平行路线；符合约束
Application Decision:    SEMANTIC / DERIVED（ContentTag 派生，不新建表）
Detection Object Decision: SEMANTIC / DERIVED（ContentTag 派生，不新建表）
Insight Decision:        REUSE + CONTROLLED EXTENSION（ContentType.INSIGHT+Content+Knowledge，不新建表）
Document Decision:        REUSE（Content+ContentMedia+FileAsset，不新建 Domain）
Standard Decision:        DEFER（本轮不建独立 Domain，Content-backed 延续）
ROUND_ROBIN Decision:    CONTROLLED EXTENSION（配置+WorkflowEvent+Notification，不新建表）
Search Semantic Layer Decision: REUSE + CONTROLLED EXTENSION（适配接入现有 semantic/query，不新建搜索架构）
Current Authority Matrix: §15（见上文）
Target Semantic Boundary: §16（见上文）
Schema Impact:           所有决策无 Schema 变更或极小（S）
API Impact:              所有决策无新增 API 或小扩展（S/M）
Backend Impact:          所有决策复用现有模块，极小变更（S/M）
Frontend Impact:         所有决策为展示/配置增强，S/M
Admin Impact:            复用现有管理面，无新增或极小
Runtime Impact:          极小可选影响，不影响核心
Change Size Matrix:      §17（全部 S/M；无 L 项）
Operation Impact Matrix: 全部 LOW 或 Deferred；符合 Low-Operation
Reuse Candidates:        Insight(base), Document
Controlled Extensions:   Insight(ext), ROUND_ROBIN, Search Semantic Layer
Semantic / Derived:      Application, Detection Object
Deferred:               Standard
Rejected:               —
Fundamental Change Candidates: 监视候选 3 项（Insight 独立 Authority / Standard 独立 Domain / ROUND_ROBIN 持久化指针）→ 隔离，不实施，不混入路线
Batch Remediation Rule:  §22（P0中断/P1记录继续/P2延期）
M35 Scope:               Product & Engineering Information Enhancement（仅最小增强，不大型重构）
M36 Scope:               Engineering Discovery Search（仅一级表面+参数驱动+语义激活，不默认 AI）
M37 Scope:               Knowledge + Insight Asset System（仅经既有模型，不默认新表）
M38 Scope:               Unified Discovery + Multi-surface Discoverability（仅全资产可发现，非 SEO 专项）
M39 Scope:               Platform Loop Consolidation（仅闭环整合，不新建 commerce/transaction domain）
Architecture Readiness:  READY → M35 可授权实施
Evidence Gaps:           实时数据规模 UNVERIFIED；语义检索运行时 UNVERIFIED（均继承）
Documentation Synchronization: PASS（PROJECT_STATUS/PROJECT_ROADMAP/MODULE_COMPLETION_MATRIX 已同步；历史未改写）
Review Report:           docs/_review/776_M35_Minimal_Engineering_Information_Architecture_Decision.md
Final Architecture Decision: COMPLETE（无阻断，所有决策达成，固定路线锁定）
Next Authorized Stage:   M35（等待独立实施授权指令，本任务不实施）
STOP:                    CONFIRMED
```

---

**776 = ARCHITECTURE DECISION COMPLETE**
