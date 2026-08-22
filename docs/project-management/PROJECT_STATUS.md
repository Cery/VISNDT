# VISNDT Project Status

## Snapshot

- Last calibrated: `2026-08-20`

M21.7 AI Agent Integration Architecture Audit（544）AUDIT ONLY——M21.6 CLOSED 确认；6 项 AI 基础能力就绪（Semantic + Embedding + Analytics + Audit + Monitoring + Admin）；AI 边界验证 PASS（无 AI 实现泄漏、Semantic Boundary PROTECTED、No Autonomous AI Decision）；9 核心数据源 + 7 附加数据源 READY；未来 AI Gateway Architecture Proposal 完成；M21.7 Readiness = READY。M21.7.1 AI Agent Gateway Foundation（545）COMPLETED——7 files（4 new：ai.module.ts + ai.controller.ts + ai.service.ts + index.ts + 3 existing：interfaces + dto + guard），3 new API endpoints（GET /ai/status + GET /ai/capabilities + GET /ai/boundaries，JWT protected），AI Gateway Foundation 建立（AI Capability Boundary + AI Request Audit + Capability Guard + AICapability Registry），apps/api build exit 0，零 Schema/Migration 变更，Semantic Boundary PROTECTED，No Autonomous AI Decision。M21.7.2 AI Agent Runtime Foundation（546）COMPLETED——7 new files（runtime/：agent-runtime.module.ts + agent-runtime.service.ts + 3 interfaces + interfaces/index.ts + runtime/index.ts），2 modified files（ai.module.ts + ai/index.ts），Agent Runtime Foundation 建立（AgentExecutionContext + AgentExecutionContract + CapabilityInvocation + AgentRuntimeService + Audit Integration），apps/api build exit 0，零 Schema/Migration 变更，Agent Runtime Boundary PROTECTED，No LLM Execution Leakage，No Autonomous AI Decision。M21.7.3 AI Tool Layer Foundation（547）COMPLETED——5 new files（tools/：tool-layer.module.ts + tool-registry.service.ts + tool-definition.interface.ts + tool-invocation.interface.ts + index.ts），2 modified files（ai.module.ts + ai/index.ts），Tool Layer Foundation 建立（ToolRegistryService + 6 planned tools across 5 categories + ToolDefinitionContract + ToolInvocationContract + Tool Validation），apps/api build exit 0，零 Schema/Migration 变更，Tool Layer Boundary PROTECTED，No Direct Business Mutation，No LLM Execution Leakage。M21.7.4 AI Tool Registry And Semantic Adapter Foundation（548）COMPLETED——5 new files（adapter/：interfaces/adapter-contract.interface.ts + interfaces/semantic-adapter.interface.ts + interfaces/index.ts + semantic-adapter.base.ts + adapter/index.ts），1 modified file（tool-registry.service.ts：adapter registry + adapter mapping + adapter-aware invokeTool），2 updated files（ai.module.ts + ai/index.ts），Adapter Layer Foundation 建立（ToolAdapterInterface + AdapterRegistry + SemanticAdapterContract + AbstractSemanticAdapter + Category-based Adapter Mapping），apps/api build exit 0，零 Schema/Migration 变更，Semantic Boundary PROTECTED，No Direct Semantic Exposure，No LLM Execution Leakage。M21.7.5 AI Assistant Foundation（549）COMPLETED——8 new files（assistant/：assistant.module.ts + assistant.service.ts + 4 interfaces + interfaces/index.ts + assistant/index.ts），2 modified files（ai.module.ts + ai/index.ts），Assistant Foundation 建立（AssistantService + 4 planned capabilities：ASSIST-001/002/003/004 + AssistantContext + AssistantRequest + AssistantResponse + AssistantCapabilityRegistry + Audit Integration），apps/api build exit 0，零 Schema/Migration 变更，所有 capabilities PLANNED + mutationAllowed=false + requiresHumanReview=true，Human Review Boundary PROTECTED，No LLM Execution，No Autonomous AI Decision。M21.7.6 AI RAG Foundation（550）COMPLETED——7 new files（rag/：rag.module.ts + rag.service.ts + 3 interfaces + interfaces/index.ts + rag/index.ts），2 modified files（ai.module.ts + ai/index.ts），RAGService pipeline：receive → validate → retrieve → format → audit + KnowledgeSourceRegistry（4 planned sources：KS-001/002/003/004）+ RetrievalContract + RAGContextContract，apps/api build exit 0，零 Schema/Migration 变更，No LLM/Embedding/Vector DB。M21.7.7 AI Knowledge Context Foundation（551）COMPLETED——6 new files（context/：context.module.ts + context.service.ts + 2 interfaces + interfaces/index.ts + context/index.ts），2 modified files（ai.module.ts + ai/index.ts），ContextService（context lifecycle：create → validate → complete + context registry + trace + audit + KnowledgeContext）+ AIContext Contract + KnowledgeContext Contract + ContextTrace + ContextAuditRecord，apps/api build exit 0，零 Schema/Migration 变更，No LLM/Embedding/Vector DB，Human Review Boundary PROTECTED。M21.8 Platform Readiness — IN_PROGRESS（553 Architecture Audit PASS——M21.7 AI Foundation FROZEN，Web/Admin 198+ routes 全编译通过，31 Models 29 Migrations 稳定，10/10 Business Flows 运营，Readiness Score B+（85%），5 Demo Data Gaps + 5 Risks Identified，M21.8.1~M21.8.4 四阶段拆分）。M21.8.1 Frontend Experience Upgrade（554）COMPLETED——Homepage + Product Center + Solution Center + Workspace + Navigation/Layout/Responsive 全面优化，apps/web build exit 0（Compiled + Type Check + 34/34 Static Pages），零 API/Schema/Migration 变更，AI Foundation FROZEN，Readiness Score B+→A-。M21.8.2 Admin Experience Upgrade（555）COMPLETED——Dashboard + Product Management + Content Management + Navigation/IA + Responsive 全面优化，apps/admin build exit 0（5909 modules，10.26s），零 API/Schema/Migration 变更，AI Foundation FROZEN，Admin Experience Boundary PROTECTED，Readiness Score A-。M21.8.3 Demo Dataset Initialization（556）COMPLETED——database/seed_demo.ts 可重复初始化脚本（demo. email namespace + DEMO_ deterministic IDs + upsert 幂等 + Safety Gates + Demo Scope Cleanup），数据集覆盖 Users（6）、Organizations（5）、Products（12）、Offers（12）、Demands（5）、DemandMatches（14）、RFQs（3）、RFQResponses（4）、Content（7）、Notifications（7）、ConversionEvents（7-day analytics）、WorkflowEvents（16），Seed #1/#2/#3 全部 PASS，零 Schema/Migration 变更，Demo Dataset Boundary PROTECTED，Production Data Isolation PASS，Reproducible Seed Integrity PASS，三端 build 全部 exit 0。M21.8.4 Full Business Flow Validation（557）COMPLETED——28/28 API checks PASS + 10/10 page checks PASS + 6/6 PWA checks PASS，全部核心业务流验证通过（Product Discovery + Buyer Journey + Supplier Journey + Admin + Content + Matching + RFQ/Response），三端 build 全部 PASS，P0=0 / P1=1（Product slug lookup P2023）/ P2=2（API response nesting + content auth），M21.8 Platform Readiness = CONDITIONAL（1 P1 待解决），AgentRuntimeModule DI 修复（forwardRef AIModule），零 Schema/Migration 变更，AI Foundation FROZEN 确认。M21.8.5 Platform Closure Stabilization（558）COMPLETED——P1-01 Product slug lookup 修复（ProductsService.findOne() UUID/slug 双模式查询），三端 build 全部 exit 0，回归验证 UUID+slug 两种方式全部 PASS，零 Schema/Migration/新 Endpoint 变更，AI Foundation FROZEN，M21.8 Platform Readiness = CLOSED（P0=0 / P1=0 / P2=2 deferred）。M22.1.0 Supplier Experience Architecture Audit（559）COMPLETED——Audit Only，Supplier 能力全量盘点（数据模型 9 模型复用 / API 5 模块 20+ endpoints / 前端 15 文件 7 routes），三边界全 PASS（Supplier Experience / Product-Centric / No Marketplace Drift），零 Schema/Migration/API/Frontend 变更，M22.1 Readiness = READY。M22.1.1 Supplier Workspace Experience Enhancement（560）COMPLETED——5 文件修改（RFQ Detail + Response List + Dashboard + Navigation + API Client），Supplier Workspace 体验增强完成（RFQ 详情产品匹配+Response 状态+Response 筛选决策+Dashboard 统计+快捷操作+最近活动+导航完善），三边界全 PASS（Supplier Experience / Product-Centric / No Marketplace Drift），零 Schema/Migration/API Endpoint 变更，AI Foundation FROZEN，三端 build 全部 exit 0。M22.1.2 Supplier Offer Management（561）COMPLETED——7 文件修改（3 新页面 + 2 增强文件 + 2 服务层），Supplier Offer 管理能力完成（Offer 列表+Create+Edit+Submit+Withdraw+Product 关联+Dashboard 统计+导航集成），三边界全 PASS（Supplier Experience / Product-Centric / No Marketplace Drift），零 Schema/Migration/API Endpoint 变更，AI Foundation FROZEN，三端 build 全部 exit 0。M22.1.3 Supplier Business Opportunity Center（562）COMPLETED——4 文件修改（1 新页面 + 3 增强文件），商机中心完成（公开 RFQ + 定向 RFQ + 匹配机会 三标签 + 机会时间线 + Dashboard 统计+快捷入口+导航），三边界全 PASS（Supplier Experience / Product-Centric / No Marketplace Drift），零 Schema/Migration/API Endpoint 变更，AI Foundation FROZEN，三端 build 全部 exit 0。M22.1.4 Supplier Self-Service Profile（563）COMPLETED——7 文件修改（1 新页面 + 2 后端 + 2 服务层 + 2 增强），Profile 管理完成（企业资料查看+编辑+保存+权限控制+数据一致性说明+Dashboard 快捷入口+导航），三边界全 PASS（Supplier Experience / Product-Centric / No Marketplace Drift），零 Schema/Migration/新 Endpoint 变更，AI Foundation FROZEN，三端 build 全部 exit 0。M22.1.5 Supplier Experience Validation（564）COMPLETED——Audit/Review Only，Supplier 全流程验证通过（Login → Dashboard → Profile → Offer → Opportunity → RFQ → Response → Notification），三边界全 PASS，AI Foundation FROZEN 确认，零代码变更，M22.1 Supplier Experience CLOSED。M22.2 Content Center Architecture Initialization——Audit Only，Content Center 架构设计确认（现有 Content 模型 4 类型 ARTICLE/KNOWLEDGE/SOLUTION/INSIGHT + 4 状态 DRAFT/REVIEW/PUBLISHED/ARCHIVED + ContentMedia/ContentRevision/ContentTag/ContentChunk 完整基础设施 + 10 API endpoints ADMIN/Public + Admin 3 页面 + Web 10 内容页面 + 4 类型标签页 + 搜索集成 + SEO 元数据 + AI Embedding 就绪），三边界全 PASS（Supplier Experience / Product-Centric / No Marketplace Drift），AI Foundation FROZEN 确认，零代码变更，Content Center 架构就绪。M22.2.1 Content Center Architecture Audit COMPLETED——Audit Only，6 边界审计全部 PASS（Content Domain / Data Model / API / Admin Operation / Web Presentation / SEO Growth），三边界全 PASS，AI Foundation FROZEN 确认，Content Center Architecture = READY FOR IMPLEMENTATION PHASE。M22.2.2 Content Model Implementation COMPLETED——5 files（1 Schema + 1 Migration + 1 DTO + 1 Service + 1 Report），Migration 012（estimatedReadTime + status/publishedAt index），QueryContentDto 新增 sort/order 参数，ContentService 增强（estimatedReadTime 自动计算 + findAll 含 tags + findAllPublic 默认 publishedAt desc 排序 + sort/order 全支持），三边界全 PASS，AI Foundation FROZEN，三端 build 全部 exit 0。568_M22.2.3 Content Management Enhancement COMPLETED——7 files（1 Types + 1 ContentList + 1 ContentForm + 1 ContentCreate + 1 ContentEdit + 1 Report），ContentList 新增 4 列（SEO 状态/标签/预计阅读/发布时间）+ sort 排序支持，ContentForm 新增封面图上传 + 预计阅读时间实时预览，ContentEdit 新增 coverImageId 传递 + 预计阅读/发布时间展示，三边界全 PASS，AI Foundation FROZEN，三端 build 全部 exit 0。569_M22.2.4 Web Content Experience COMPLETED——10 files（1 new ContentCard + 4 Content List Pages + 2 Content Detail Pages + 1 Tag Page + 1 Types + 1 API Client），ContentCard 统一内容卡片组件（封面图/类型标签/阅读时间/标签/发布时间/作者），4 列表页改造（articles/knowledge/insights/solutions 统一使用 ContentCard + 响应式 3 列网格），2 详情页增强（article/knowledge [slug] 封面图展示 + 阅读时间显示），标签聚合页（/tags/[slug] 支持全部 4 类型），三边界全 PASS，AI Foundation FROZEN，三端 build 全部 exit 0。570_M22.2.5 SEO Validation COMPLETED——Audit Only，SEO 全量验证通过（B+），15/16 路由有 Metadata，4 内容类型 dynamic generateMetadata（title/description/canonical/OpenGraph/JSON-LD），6 类 JSON-LD（Article/TechArticle/Product/Organization/WebSite/BreadcrumbList），Sitemap（静态+Knowledge+Solution）+ robots（index+follow），Admin SEO 运营面板（SeoPanel 质量提示+SeoPreview 搜索结果预览），5 个 P2 非阻断 Gap，零 P0/P1，三边界全 PASS，AI Foundation FROZEN，零代码变更。571_M22.2.6 Content Center Final Validation COMPLETED——Audit Only，M22.2 阶段全量验证通过，6 表（Content/ContentMedia/ContentRevision/ContentTag/ContentTagRelation/ContentChunk）+ 11 API（9 Admin+2 Public）+ 6 Admin Routes + 8 Admin Components + 9 Web Routes + B+ SEO，架构边界全 PASS，三端 build 全部 exit 0，M22.2 Content Center CLOSED。Next Stage: M22.3 Knowledge Base。572_M22.3.0_Knowledge_Base_Architecture_Initialization（572）COMPLETED——Architecture / Audit / Design Validation，Knowledge Base 架构初始化完成：定位 Knowledge = Platform Knowledge Asset（非 Supplier/Marketplace/UGC），架构分层 Content Asset Layer → Knowledge Structured Layer → Industrial Inspection Knowledge Capability，Content Center 全量盘点（6 表 + 11 API + 6 Admin Routes + 8 Admin Components + 9 Web Routes + B+ SEO），四大架构锁全 PASS（Supplier Experience Boundary / Product-Centric Strategy / No Marketplace Drift / AI Foundation FROZEN），Database Impact NONE（FUTURE DESIGN ONLY），API/Frontend/Admin/AI Impact 均 NONE，零代码变更，文档同步完成。573_M22.3.1_Knowledge_Model_Design（573）COMPLETED——Architecture / Data Model Design / Audit，Knowledge Model Design 完成：5 模型（KnowledgeDomain/KnowledgeCategory/KnowledgeEntry/KnowledgeContentRef/KnowledgeRelation）+ 3 枚举（KnowledgeEntryStatus/KnowledgeReferenceType/KnowledgeRelationType），6 大工业检测领域（Inspection Technology/Inspection Scenario/Equipment Application/Industry Application/Detection Method/Parameter Guidance），三层分类体系（Domain → Category → Entry），5 种知识关系（RELATED/CHILD/PARENT/PREREQUISITE/FOLLOWUP），3 种内容引用类型（SOURCE/RELATED/SUPPLEMENT），structuredBody JSON 结构化知识体设计，四大架构锁全 PASS，Database Impact NONE（FUTURE DESIGN ONLY），API/Frontend/Admin/AI Impact 均 NONE，零代码变更，文档同步完成。574_M22.3.2_Knowledge_Classification_Implementation（574）COMPLETED——Development / Database / Admin，2 新表（knowledge_domain + knowledge_category）+ Migration 013 + 10 ADMIN API endpoints + 6 Admin 页面（Domain List/Create/Edit + Category List/Create/Edit），三端 build 全部 exit 0，四大架构锁全 PASS，Content/Web 零修改。575_M22.3.3_Knowledge_Association_Implementation（575）COMPLETED——Development / Database / API / Admin，3 新表（knowledge_entry + knowledge_content_ref + knowledge_relation）+ 3 枚举（KnowledgeEntryStatus/KnowledgeReferenceType/KnowledgeRelationType）+ Migration 014 + 20 ADMIN API endpoints（Entries CRUD + ContentRefs CRUD + Relations CRUD）+ 3 Admin 页面（EntryList + EntryCreate + EntryEdit w/ 内容引用 & 知识关联 Tabs），三端 build 全部 exit 0，四大架构锁全 PASS，Content/Web 零修改。Next Task: M22.3.4 Knowledge Retrieval Foundation。576_M22.3.4_Knowledge_Retrieval_Foundation（576）COMPLETED——Development / API / Web，Public Knowledge Query API 5 endpoints（GET /knowledge/public/domains + /domains/:slug + /categories + /entries + /entries/:slug，PUBLIC access）+ 3 Web 页面（/knowledge-base Home + /knowledge-base/domains/[slug] Domain + /knowledge-base/[slug] Detail），三端 build 全部 exit 0，Database/Admin 零变更，四大架构锁全 PASS。577_M22.3.5_Knowledge_Base_Final_Validation（577）COMPLETED——Audit / Validation / Architecture Verification，M22.3 Knowledge Base 全量验证通过：5 模型 + 3 枚举 + 22 Admin API + 5 Public API + 9 Admin 页面 + 3 Web 页面 + 三端 build 全部 exit 0 + 四大架构锁全 PASS + 完整能力链路（572-577，6/6），M22.3 Knowledge Base CLOSED。Next Stage: M22.4 Search & Matching Enhancement。578_M22.4_Search_Matching_Architecture_Reassessment（578）COMPLETED...580_M22.4_Search_Discovery_Architecture_Finalization_V2（580）COMPLETED...581_M22.4.1_Unified_Search_Foundation_Implementation（581）COMPLETED...582_M22.4.2_Discovery_Experience_Implementation（582）COMPLETED...583_M22.4.3_SEO_Asset_Architecture_Implementation（583）COMPLETED...584_M22.4.4_Matching_Knowledge_Context_Architecture_Design（584）COMPLETED——M22.4 CLOSED。585_M23.0_Capability_Roadmap_Architecture_Review（585）COMPLETED...586_M23.0.1_Knowledge_Context_Adapter_Implementation（586）COMPLETED...587_M23.0.2_Match_Detail_UX_Knowledge_Context（587）COMPLETED...588_M23.0.3_Search_Analytics_Foundation（588）COMPLETED...589_M23.0.4_M23.0_Final_Validation（589）COMPLETED...590_M23.0_Final_Closeout（590）COMPLETED...581_Product_Supplier_Capability_Model_Architecture_Feasibility_Audit（581）COMPLETED...582_Supplier_Capability_Service_Contact_Distribution_Architecture（582）COMPLETED...583_Capability_Discovery_Supplier_Exposure_Governance_Architecture_Audit（583）COMPLETED...584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture（584）COMPLETED...585_Platform_Capability_Governance_Final_Freeze_Audit（585）COMPLETED...586_M23.1_Platform_Stability_and_Boundary_Verification_Audit（586）COMPLETED。587_M24_Product_Experience_Optimization_Architecture_Audit（587）COMPLETED——Architecture Audit / UX Capability Planning，5 ADR 冻结（ADR-M24-001~005），3 阶段路线图（M24.1~M24.3），5 体验域审计（Product/Knowledge/Search/Inquiry/Mobile），体验边界全 PASS，零代码变更，M24 Buyer Experience Enhancement Defined。588_M24_Product_Knowledge_Search_Context_Architecture_Finalization（588）COMPLETED——Architecture Refinement / Decision Finalization，3 架构决策点最终收敛：Product ↔ Knowledge（Option B — ProductCategory→KnowledgeCategory Mapping Table，Deterministic Association，FINALIZED）+ Search Context → Relevant Parameter Filter（Context-Aware + Category Tabs + Coverage Priority，FINALIZED）+ Mobile Filter（Bottom Sheet，Same Semantics as Desktop，FINALIZED），7 ADR（ADR-M24-001~007），7 测试场景覆盖，Parameter Knowledge Boundary FROZEN/DEFERRED to M24.3，M24.1 Entry Gate OPEN，M24 路线图同步完成（M24.1: 7 tasks / M24.2: 8 tasks / M24.3: 4 tasks DEFERRED），零代码变更，Code State = Documentation State = Roadmap State。Next Stage: M24.1.1 ProductCategoryKnowledgeMapping Implementation。589_M24_Product_Knowledge_Mapping_and_Search_Facet_Implementation_Finalization（589）COMPLETED——Architecture Refinement / Final Decision / Implementation Contract Finalization，3 架构契约最终冻结：ProductCategoryKnowledgeMapping Schema（ADR-M24-008，M:N，knowledgeDomainId NOT STORED）+ Search Context Contract（ADR-M24-009，Query-Level，Pagination-Independent）+ Multi-Category Filter Model（ADR-M24-010，All/Common + Category-Specific），3 ADR（ADR-M24-008~010），7 测试场景覆盖，Pagination Invariance 验证，M24.1 Entry Gate OPEN，零代码变更，Code State = Documentation State = Roadmap State。590_M24.1.1_ProductCategoryKnowledgeMapping_Implementation（590）COMPLETED——Development / Database / API / Admin，Migration 016（product_category_knowledge_mapping），1 新表（ProductCategoryKnowledgeMapping：M:N，@@unique，@@index），6 Admin API endpoints（ADMIN-only），3 Admin 页面（MappingList/Create/Edit），10 测试映射 + 6 测试场景全 PASS，三端 build 全部 exit 0，Product/Supplier/Knowledge/Matching/AI 边界全 PASS，Search UNCHANGED，M24.1.2 MERGED into M24.1.1。Next Stage: M24.1.3 Search Context API Implementation。591_M24.1.3_Search_Context_API_Implementation（591）COMPLETED——Development / API / Web，6 files API（dto/search-context.dto.ts + search-context.types.ts + search-context.service.ts + search.controller.ts MODIFIED + search.module.ts MODIFIED + index.ts MODIFIED）+ 1 file Web（lib/api/search.ts MODIFIED——API Contract Only），1 new API endpoint（GET /search/context?q={keyword}，PUBLIC），Query-Level Search Context（pagination-independent，based on full candidate population），10/10 测试场景 PASS，三端 build 全部 exit 0，Database UNCHANGED，Admin UNCHANGED，Supplier/Matching/AI 边界全 PASS，No Facet UI。592_M24.1.4_Relevant_Parameter_Facet_UI_Implementation（592 Recovery）COMPLETED——Development / Recovery / API Contract Completion / Frontend Integration，API 3 files（unified-search.dto.ts + search.service.ts + search.controller.ts：GET /search 最小 Filter Contract 扩展——category + filters）+ Web 4 files（lib/api/search.ts + services/search.service.ts + SearchPageContent.tsx + hooks/useFacetFilterState.ts：筛选请求接入 + activeFacet 触发重查询），服务端参数筛选（Same-Param OR / Cross-Param AND / Filter-before-Pagination）+ Category 过滤 + URL/刷新恢复，End-to-End 14/14 PASS，API MODIFIED（GET /search 最小扩展），Web MODIFIED，Database/Admin/Supplier/Knowledge/Matching UNCHANGED，AI FROZEN，三端 build 全部 exit 0（API tsc/nest build + Web tsc/next build 39 pages），M24.1.4 COMPLETED。Next Stage: 593 Responsive / Mobile Filter Experience。593_M24.1.5_Mobile_Discovery_Experience_Finalization（593）COMPLETED——Development / Mobile Experience Finalization / Validation / Bug Fix，Web 2 files（services/search.service.ts + app/search/SearchPageContent.tsx），验证并收口 592 移动端搜索筛选闭环，修复 2 个真实缺陷（搜索错误吞没 + 筛选状态重复请求），592 Search Filter Contract UNCHANGED，API UNCHANGED，Database/Admin/Supplier/Knowledge/Matching UNCHANGED，AI FROZEN，End-to-End 18/18 PASS，Web tsc exit 0 + next build exit 0（39 pages）。594_M24.1.6_Product_Related_Knowledge_Discovery（594）COMPLETED——Development / Product Experience / Knowledge Discovery / Integration，将 Product Category → Knowledge Mapping 能力接入 Product Detail（Product → ProductCategory → ProductCategoryKnowledgeMapping → KnowledgeCategory → KnowledgeEntry → Related Knowledge），API 2 files（products.service.ts 新增 findRelatedKnowledge + products.controller.ts 新增 GET /products/:id/related-knowledge）+ Web 6 files（types/knowledge-base.ts 新增 RelatedKnowledgeItem + lib/api/products.ts + services/product.service.ts + components/products/RelatedKnowledge.tsx NEW + ProductDetailContent/Tabs/Nav 集成 knowledge tab），PUBLISHED-only 过滤 + 按 KnowledgeEntry.id 去重 + 稳定排序（mapping sortOrder → publishedAt desc → id）+ 空态 + API 错误降级，Product Detail → Knowledge Detail（/knowledge-base/[slug]）复用现有路由，同一数据/API/业务逻辑适配 Desktop/Mobile，End-to-End 14/14 PASS，Database/Admin/Supplier/Matching/Search UNCHANGED，Knowledge Runtime MINIMAL READ-ONLY EXTENSION，AI FROZEN，API tsc/nest build + Web tsc/next build 全部 exit 0（39 pages）。595_M24.1.7_Knowledge_Related_Product_Discovery（595）COMPLETED——Development / Product Experience / Knowledge Discovery / Integration / Validation，将 Knowledge Category → Product Mapping 能力接入 Knowledge Detail（KnowledgeEntry → KnowledgeCategory → ProductCategoryKnowledgeMapping → ProductCategory → Product → Related Products），API 2 files（knowledge.service.ts 新增 findRelatedProducts + knowledge-public.controller.ts 新增 GET /knowledge/public/entries/:slug/related-products）+ Web 5 files（types/knowledge-base.ts 新增 RelatedProductItem + lib/api/knowledge-base.ts + services/knowledge-base.service.ts + components/products/RelatedProducts.tsx NEW + knowledge-base/[slug]/page.tsx 集成相关产品区域），ACTIVE-only 过滤 + 按 Product.id 去重 + 稳定排序（mapping sortOrder → createdAt desc → id）+ 空态 + API 错误降级，Knowledge Detail → Product Detail 复用现有路由，Desktop/Mobile 同一数据/API/业务逻辑，End-to-End 18/18 PASS，Database/Admin/Supplier/Search/Matching UNCHANGED，API MINIMAL READ-ONLY EXTENSION，Knowledge Runtime MINIMAL READ-ONLY EXTENSION，AI FROZEN，API tsc/nest build + Web tsc/next build 全部 exit 0。596_M24.1.8_Related_Products_And_Compare_Entry（596）COMPLETED——Development / Product Experience / Discovery / Compare Integration / Validation，在 Product Detail 建立「相关产品」能力（Product → ProductCategory → 同分类 Other ACTIVE Products，排除当前产品，稳定排序 createdAt desc → id asc）+ Compare Entry（复用现有 ProductCard 比较复选框 + CompareBar + /products/compare?ids=，用户自选，MAX 4），API 2 files（products.service.ts 新增 findRelatedProducts + products.controller.ts 新增 GET /products/:id/related-products）+ Web 6 files（lib/api/products.ts + services/product.service.ts + components/products/RelatedProductsSection.tsx NEW + ProductDetailContent/Tabs/Nav 集成 related tab + [slug]/page.tsx 数据获取与错误降级），ACTIVE-only 过滤 + 当前产品排除 + 稳定排序 + 空态 + API 错误降级（不阻塞详情页），Compare 复用现有能力（EXISTS，无新 Compare Runtime/DB），Database/Admin/Supplier/Knowledge/Search/Matching UNCHANGED，API MINIMAL READ-ONLY EXTENSION，AI FROZEN，End-to-End 18/18 PASS，API tsc/nest build + Web tsc/next build 全部 exit 0。Next Stage: 597 Inquiry Conversion Enhancement。597_M24.1.9_Inquiry_Conversion_Enhancement（597）COMPLETED——Development / Product Experience / Inquiry Flow Integration / Validation，验证并收口产品发现后的询价转化闭环（Product Detail → Supplier Selection → Inquiry → 既有 RFQ Capability），确认 Inquiry 入口（SupplierInquirySection + InquiryForm + SupplierCapabilityList）、Inquiry API（POST /inquiries：productId + offerId + organizationId 三键校验 + 供应商组织成员通知）、既有 Demand/RFQ/RFQResponse 体系复用均已存在且边界正确，Related Product / Compare 经 Product Detail 作为规范询价入口，Inquiry = Demand Expression（非 Order/Payment/Marketplace/Supplier Store），供应商选择为用户驱动（非 AI/随机/排名，复用 Offer 稳定排序，仅 ACTIVE/SUBMITTED 可选），18 项代码路径审计验证全 PASS，零代码变更，Database/API/Web/Admin/Supplier/Knowledge/Search/Matching UNCHANGED，AI FROZEN，Build UNCHANGED（继承 596 exit 0），M24.1.9 COMPLETED。Next Stage: 598_M24.1_Final_Validation_And_Closeout。598_M24.1_Final_Validation_And_Closeout（598）COMPLETED——Architecture Validation / Regression Audit / Documentation Closure / Milestone Freeze，M24.1 六阶段任务链（592-597）全部 COMPLETED，Capability Closure 7/7 PASS（Search Discovery / Mobile Experience / Product Knowledge / Knowledge Product / Related Product / Compare / Inquiry）+ Architecture Freeze 10/10 PASS（Database UNCHANGED / Migration NONE / API STABLE / Web STABLE / Admin UNCHANGED / Supplier UNCHANGED / Knowledge STABLE / Search STABLE / Matching UNCHANGED / AI FROZEN）+ Regression 9/9 PASS（Product Detail / Knowledge Detail / Search Entry / Related Navigation / Compare Flow / Inquiry Flow / Mobile Layout / API Stability / Documentation Consistency），零代码变更，M24.1 FINALIZED / Architecture FROZEN / Ready For M24.2 Preparation，M24.1 CLOSED。Next Stage: M24.2 Preparation Baseline。
- Repository Root: `F:\Desktop\VISNDT`
- Code Root: `F:\Desktop\VISNDT\VISNDT`
- Branch baseline: `main`
- Current product stage: `D. AI & Platform Enhancement（AI 增强与平台化升级）`
- Current M stage: `M24 Product Experience Optimization（M23.0 CLOSED; M23.1 Stable Baseline READY; M24 IN_PROGRESS——587 + 588 + 589 + 590 + 591 COMPLETED; 592 COMPLETED (Recovery); 593 COMPLETED; 594 COMPLETED; 595 COMPLETED; 596 COMPLETED; M24.1.1 COMPLETED; M24.1.2 MERGED; M24.1.3 COMPLETED; M24.1.4 COMPLETED; M24.1.5 COMPLETED; M24.1.6 COMPLETED; M24.1.7 COMPLETED; M24.1.8 COMPLETED; M24.1.9 COMPLETED; 598 COMPLETED; M24.1 CLOSED / FROZEN; 599 COMPLETED; 600 COMPLETED; 601 COMPLETED; 602 COMPLETED; 603 COMPLETED; 604 COMPLETED; 605 COMPLETED; M24.2 第一轮目录体验闭环 VALIDATED（601 Tree UI + 602 Parameter Context Filter + 603 Capability Discovery Card + 604 Experience Validation + 605 Final Closeout COMPLETED，M24.2 CLOSED / FROZEN；606_M24.2_Runtime_E2E_Verification COMPLETED（真运行时 E2E 18/18 PASS + Search/Mobile 边界回归 PASS），Next: M24.3 Preparation / Advanced Experience；609 COMPLETED（M24.3 Multi Role Agent Test Strategy Completed），610 COMPLETED（M24.3 Frontend Optimization And Agent Test Instruction Completed），611 COMPLETED（M24.3 Test Data Lifecycle Finalization Completed），612 COMPLETED（M24.3 Web Platform Experience Upgrade Completed），613 COMPLETED（M24.3 Admin Console Experience Upgrade Completed），614 COMPLETED（M24.3.8 Multi Role Agent Runtime Validation——四角色 Agent 运行时验收全部 PASS + E2E 18/18 + RBAC 403 边界 PASS + 运行时问题 0，M24.3 Advanced Experience ACCEPTED），615 COMPLETED（M24.3.9 Final Closeout——M24.3 Advanced Experience CLOSED，Documentation Synchronized），616 COMPLETED（M24.4.1 Current Frontend Visual Audit——Web 45/60 / Admin 43/60，M24.4 Experience Refinement READY FOR IMPLEMENTATION），617 COMPLETED（M24.4.2 Homepage Premium Experience Upgrade——首页高级体验升级：Hero 工业品牌化 + VISNDT 品牌组件层 + ProductCard CapabilityLabel + 7 Section 统一 SectionHeader，apps/web build exit 0），618 COMPLETED（M24.4.3 Product Capability Catalog Experience Upgrade——产品中心升级为工业检测能力目录：capability 语义层 + 5 个 capability 组件 + ProductCard 能力化表达 + 产品详情能力档案 + 参数能力表达 + MediaImage 统一接入，apps/web build exit 0），619 COMPLETED（M24.4.4 Workspace SaaS Experience Upgrade——Workspace 由导航入口壳升级为 B2B SaaS 业务工作空间体验：Buyer/Supplier 双角色身份识别 + 业务快照 + 待处理事项 + 快捷操作 + 工作台深链，apps/web build exit 0），620 COMPLETED（M24.4.5 Industrial Operation Console Experience Upgrade——Admin 运营仪表盘深度升级为工业运营中心：PlatformHealthBanner + StatCard + SectionHeader + Tabs 三视图（运营概览/数据图表/最近活动）+ 图表增强（AreaChart/BarChart/PieChart/FunnelChart）+ 状态语义统一（resolveStatusTone）+ 设计系统治理（VISNDT_COLORS/CHART_PALETTE），apps/admin build exit 0），621 COMPLETED（M24.4.6 Experience Gap Closure Audit——全站体验差距审计：14 Web + 27 Admin 页面逐页审计，Web 8/10 + Admin 5.75/10，0 Level A + 3 Level B（Admin 工业风格未扩散/空错状态一致性/客户端 error boundary）+ 4 Level C 差距，决策 M24.4 FINAL EXPERIENCE CLOSURE REQUIRED，Code UNCHANGED，Audit Only）。622_M24.4.7_Admin_Industrial_Operation_System_Expansion（622）COMPLETED（M24.4.7 Admin Industrial Operation System Expansion——M24.4 FINAL EXPERIENCE CLOSURE 首环，落地 621 B1 高优先级差距：apps/admin 工业运营系统扩散，17 个 List/Detail 页 resolveStatusTone 误用收敛为 StatusTag 语义化组件（清除 'neutral'/'primary'/'violet' 非法 antd Tag 色 + DemandDetail 未定义 MATCH_STATUS_COLOR/RFQ_STATUS_COLOR 隐患）+ 散落硬编码色收敛到 VISNDT_COLORS.success/warning/error/primary + AuditIntelligence/BusinessAnalytics 遗留字符串字面量修复，Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/admin npm run build exit 0）。623_M24.4.8_Web_State_Consistency_And_Error_Boundary（623）COMPLETED（M24.4.8 Web State Consistency And Error Boundary——M24.4 FINAL EXPERIENCE CLOSURE 次环，落地 621 B2/B3 中优先级差距：apps/web 状态系统一致性收口——EmptyState 收敛（knowledge/solutions 内联空态→统一 EmptyState）+ ErrorState 收敛（search 内联错误块→统一 ErrorState，新增 action 兜底导航，覆盖 Error Context/Retry/Navigation）+ 页面级 Error Boundary 补齐（login/register/workspace/dashboard 新增 loading.tsx + error.tsx，新增共享 PageErrorBoundary 复用组件降重复）+ Loading 收敛（workspace 根内联"加载中"→统一 Loading），Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/web npm run build exit 0））。624_M24.4.9_Final_Experience_Regression_Audit（624）COMPLETED（Audit Only——M24.4 最终体验回归审计：全前端接受度审计（14 Web + 27 Admin 页面回归验证），Web 8/10→8.5/10 + Admin 5.75/10→8.0/10，621 三项 Level B 差距（B1 Admin 工业风格扩散 / B2 空错状态一致性 / B3 客户端 error boundary）全部收敛，0 Level A + 0 Level B + 4 Level C（C1 SectionHeader 使用率 / C2 列表分页 / C3 登录注册表单细节 / C4 dashboard emoji 图标），M24.4 FINAL EXPERIENCE ACCEPTED / Ready For M24.5，Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED，Code UNCHANGED，Audit Only））。627_M24.5.1_Web_Commercial_Experience_Foundation（627）COMPLETED——apps/web 商业详情体验基础（M24.5 Web 收口首环，Frontend First / Existing API Reuse / No Backend Expansion）：Detail Template 演进基础（Product/Solution/Knowledge/Supplier 增量演进，未一次性重构全页面）+ 7 个商业关联/CTA 组件（relation/ RelatedContentSection+RelatedProducts+RelatedSolutions+RelatedKnowledge、conversion/ DemandCTA+InquiryCTA、commercial/ SupplierCapability）+ 转化 CTA 路径接入 ProductDetailContent 与 Product/Solution/Knowledge/Supplier 四详情页，复用既有公开只读 API（GET /products、GET /content/public）+ 前端确定性排序 + 空态 + API 错误降级，5 文件修改 + 3 新增组件目录（apps/web only），Database/API/Matching/Search/AI/RBAC 全部 UNCHANGED，apps/web npm run build exit 0（40 static pages）+ 真运行时 6 路由 HTTP 200（Homepage/Product/Solution/Knowledge/Supplier/Demand）+ 响应式（Desktop/Tablet/Mobile）覆盖，Review Report: docs/_review/627_M24.5.1_Web_Commercial_Experience_Foundation_Implementation_Report.md，Next: M24.5.2 Admin Operation Center Evolution）。628_M24.5.2_Admin_Operation_Center_Evolution（628）COMPLETED——apps/admin 运营中心体验演进（M24.5 Admin 收口，CRUD Management → Admin Operation Center，体验层先行，Operation Center Decision 落地）：新增运营聚合服务 operationService（复用现有 API 组合：dashboard/product/content/organization/demand/rfq/offer/inquiry，实现状态分组统计 + 运营待办队列 + 快捷筛选依据，零运营专用端点，单域失败静默降级）+ 新增运营组件层 components/operation-center/（OperationSectionHeader + StatusGroupPanel + OperationQueueCard + DomainEntryCard，遵循既有 VISNDT_COLORS + StatusTag 设计系统）+ 新增 OperationCenter 页面（Tabs 五视图：运营总览 / 产品运营 / 内容运营 / 供应商运营 / 商业运营，四域运营视图 + 运营待办队列 + 状态分组 + 快捷筛选 + 数据完整度/SEO 提示 + 快捷导航），接入路由 /operation-center + 菜单「运营中心」+ 面包屑映射，修改 5 文件 + 新增 8 文件（apps/admin only，含 4 个运营组件 + operationService + 类型 + 页面），Database/API/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/admin npm run build exit 0 + 真运行时 /operation-center HTTP 200，Review Report: docs/_review/628_M24.5.2_Admin_Operation_Center_Evolution_Implementation_Report.md，Next: M24.5 Next Phase，629_M24.5.3_Media_System_Architecture_Review（629）COMPLETED——Architecture Review / Audit Only（Code UNCHANGED），Media Asset 体系专项架构审查（为是否进入 Media Schema Evolution Proposal 提供正式依据）：审计 FileAsset（entityType/entityId 语义不一致 + 无 organizationId）+ ProductMedia + ContentMedia + 存储关系（S3 Compatible）+ admin/web 使用边界，9 维能力评估（Ownership GAP / Org Isolation GAP / Classification PARTIAL / Lifecycle GAP / Soft Delete GAP / Version GAP / Permission PARTIAL / Operational Search GAP / Content Reuse PARTIAL），Decision B — FUTURE EVOLUTION REQUIRED（Implementation Deferred，需先产出 Media Schema Evolution Proposal），定义 Phase 1（Ownership Isolation / Lifecycle / Soft Delete / Folder+Tag）+ Phase 2（Version / Rollback / Advanced Permission），Database/API/Frontend 全 UNCHANGED，冻结模块全验证 UNCHANGED，Review Report: docs/_review/629_M24.5.3_Media_System_Architecture_Review_Report.md，Next: Media Schema Evolution Proposal（Phase 1 前置），630_M24.5.4_Commercial_Relation_Enhancement_Architecture_Preparation（630）COMPLETED——Architecture Decision / Audit Only（Code UNCHANGED），627 商业关联体系架构预研与决策准备：审查当前关联架构（components/relation/ 四组件 Props 注入 + components/products/RelatedKnowledge），数据源矩阵（Product↔Knowledge backend managed / Product→Product backend managed / Solution+Content-KNOWLEDGE frontend deterministic），**Decision C — HYBRID EVOLUTION**，Business 结论：Product↔Solution = FUTURE REQUIRED / Knowledge↔Product = ALREADY ESTABLISHED（ProductCategoryKnowledgeMapping 已后端管理，无需新模型）/ Parameter driven = FUTURE CAPABILITY / Admin Relation Configuration Center = M24.5 不实施（Future Phase），**Implementation DEFERRED**（M24.5 不新增 Relation Model/端点/前端，保留确定性混合策略，无 AI Semantic Matching），Database/API/Frontend/Admin/Matching/Search/AI 全部 UNCHANGED，Review Report: docs/_review/630_M24.5.4_Commercial_Relation_Enhancement_Architecture_Preparation_Report.md，Next: M24.5 Next Phase（结构化 Commercial Relation Model 推迟），630_M24.5.5_Web_Login_Accessibility_Review_And_Closeout（630-M24.5.5）COMPLETED——Web 登录可访问性审查收口（非代码 Bug）：根因=API(:4000) 未运行（web 登录打 http://localhost:4000/api/v1/auth/login）+ buyer@visndt.com/supplier@visndt.com 账号不存在（真实演示账号 demo.*@visndt.local/demo123456），按用户指定凭据补建数据库演示账号（JSON：2 组织 VISNDT 采购方企业 BUYER + VISNDT 供应商企业 SUPPLIER，status ACTIVE；2 用户 buyer@visndt.com/supplier@visndt.com，bcrypt admin123456，status ACTIVE；2 条 organization_member role MEMBER；单事务幂等 INSERT，Schema/Migration 未变），验证 user.workspaceRole 由 organization.type 解析（auth.service L210-241），buyer@visndt.com→HTTP 201/BUYER、supplier@visndt.com→HTTP 201/SUPPLIER 登录均成功，代码/API/前端/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，Review Report: docs/_review/630_M24.5.5_Web_Login_Accessibility_Review_And_Closeout_Report.md，Next: M24.5 继续演进，630_M24.5.6_UI_Design_Screenshot_Comparison_Review（630-M24.5.6）COMPLETED——UI 设计稿对比审查（Only Read / Visual Audit，Code UNCHANGED），以 docs/_design/前端网页截图/ 33 张设计稿为基准评估本轮 UI 优化：初轮对比时 API(:4000) 误判（IPv6 监听致 Test-NetConnection IPv4 探测失败），列表页（产品/方案/知识）呈空态与设计稿满页无法等价对比，经 A+C 两阶段复核——A 阶段确认数据链路全程在线（产品 6/方案 4/知识 5/内容 15/用户 12/组织 10/分类 12/参数 45/RFQ 11），数据化后产品中心"共 6 项检测能力"（8 分类标签+参数筛选）、解决方案 4 卡片、知识中心 5 卡片全量实体呈现且与设计稿字段一一对应；C 阶段以 admin@visndt.com 登录 Admin 采集 10+ 运营页面（home/products/rfqs/users/organizations/media/content/matching/offers/inquiries/demands），均实现运营中心风格（统计卡+筛选+表格+分页）与设计稿结构对齐且能力范围超出设计稿（数据分析/业务分析/监控/审计智能/embedding 等），最终结论 PASS（原"直观无改进"观感根因为数据链路未就绪而非 UI 缺陷），Database/API/Frontend/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，Review Report: docs/_review/630_M24.5.6_UI_Design_Screenshot_Comparison_Review_Report.md，Next: M24.6 设计系统架构决策，631_M24.5.7_Platformization_Gap_Audit（631-M24.5.7）COMPLETED——平台化差距审计（Audit Only，Code UNCHANGED），以「平台化」为基准诊断 Web(:3000)+Admin(:3001) 双端设计系统，9 项差距：G1 双端设计系统割裂（Web=Next15+Tailwind 手写、无 UI 库无 icon 库 vs Admin=Vite+antd+@ant-design/icons）/ G2 Web 无图标体系（emoji 77 处，workspace 重灾区）/ G3 Web 缺原子 UI 组件层（无 ui/ Button/Input/Card/Badge/Table）/ G4 双端 primary 色值不一致（#3b82f6 vs #2563eb）/ G5 SectionHeader 三套实现且 Web 仅 home 使用 / G6 列表分页仅 3 文件使用 / G7 登录注册表单 / G8 信息架构导航面包屑 / G9 媒体资产（629 Decision B），结论 CONDITIONAL PASS（平台化尚未达标，需跨端统一设计系统地基），输出 M24.6 平台化 Design System 八阶段演进路线（M24.6.0 设计架构决策→M24.6.1 Token 统一→M24.6.2 图标去 emoji→M24.6.3 原子组件层→M24.6.4 SectionHeader 推广→M24.6.5 分页+表单→M24.6.6 媒体资产→M24.6.7 回归），Database/API/Frontend/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，落盘执行指令 docs/VISNDT Trae Execution Instruction V3.2.3.md（V3.2.2 基础上新增开发过程安全章节），Review Report: docs/_review/631_M24.5.7_Platformization_Gap_Audit_Report.md，Next: M24.6 继续演进。632_M24.6.0_Design_System_Architecture_Decision COMPLETED——Architecture Decision（Decide Only，Code UNCHANGED），承接 631 九项差距定稿三项决策：D1 共享 JSON token 单一事实源（packages/design-tokens/tokens.json，Web 生成 CSS 变量 + Admin 薄适配层）/ D2 Web 采用 lucide-react 替换 77 处 emoji（Admin 保留 @ant-design/icons）/ D3 Web 自建 ui/ 原子层（Button/Input/Card/Badge/Tag/Table/Pagination/Empty/Loading/Error），收敛 primary #3b82f6→#2563eb（G4 解决），Database/API/Web/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，零代码变更。Next: M24.6.1 跨端 Design Token 统一。633_M24.7_STEP0_Role_Centric_Functional_Audit COMPLETED——角色视角功能完备性+媒体分步审计（Audit Only，Code UNCHANGED），逐页审计 Web+Admin 三角色 字段/编号/ID/功能/数据，差距清单 P0×2（W1 产品 id/slug 双口径、A2 媒体中心纯导航壳）+P1×5+P2 若干，媒体分步：展示/筛选/供应商派生可零迁移，供应商隔离落列/规格书细分/生命周期/软删/版本需改库，结论 CONDITIONAL PASS。634_M24.7_Database_Status_And_Media_Evolution_Options COMPLETED——数据库现状说明+改库选项（Review Only，零迁移），全量 34 model/16 迁移批次合理性评估为合理，短板集中媒体资产域，三选项：选项1零迁移派生/选项2最小迁移（推荐，扩展 FileType 枚举+organizationId 落列+status+deletedAt）/选项3完整演进(DAM 远期)，待用户授权 B.2。635_M24.7_B1_Media_Center_Frontend_Closure（B.1）COMPLETED——媒体中心前端收口（零迁移）：统一媒体中心从「纯导航壳」升级为文件资产统一视图（GET /files 只读聚合 API + MediaList 页面 + 按文件类型/所属实体/供应商派生过滤 + 搜索 + 分页 + 下载 + 孤立清理入口），供应商隔离经 uploadedBy→User→Organization 只读派生（不落列不加表），FileType 复用现有枚举（IMAGE/DOCUMENT/CERTIFICATE/OTHER），SPEC_SHEET/ILLUSTRATION 归 B.2 改库门禁，Database/Schema/Migration UNCHANGED，apps/api + apps/admin build exit 0，端到端 /media 页面验证 PASS，Review Report: docs/_review/635_M24.7_B1_Media_Center_Frontend_Closure_Report.md。636_M24.7_B2_Media_Schema_Evolution_Gate（B.2 门禁）COMPLETED——媒体 Schema 最小迁移门禁（提案 + 迁移脚本 + 回填 + 回滚，PENDING APPROVAL）：仅扩展 FileAsset 域（FileType +SPEC_SHEET/ILLUSTRATION + 新增 FileAssetStatus + organizationId/status/deletedAt 落列 + 3 索引 + Organization 反向关系 onDelete SetNull），不加表、不动 Product/Matching/Search/AI/RBAC，冻结域合规自检全 PASS，纯增量可无损回滚，Review Report: docs/_review/636_M24.7_B2_Media_Schema_Evolution_Gate_Report.md。637_M24.7_B2_Media_Schema_Migration_Closure（B.2 收口）COMPLETED——媒体 Schema 最小迁移收口（迁移执行 + 回填 + 下游三端同步 + 构建验证）：FileType 六分类（+SPEC_SHEET 规格书/ILLUSTRATION 插图）+ FileAssetStatus 枚举 + organizationId/status/deletedAt 落列并迁移应用（DB 实测 14 列），API findAll 直列 organizationId 过滤 + 默认排除已删 + upload 回填 organizationId，admin file-utils/types/MediaList 分开管理视图（图片/文档/资质/规格书/插图 + 供应商 + 状态标签），web ProductMedia.mediaType 同步，@prisma/client 对齐 5.22.0，三端 build 全部 exit 0，Migration 1 新增（纯增量），Matching/Search/AI/RBAC 全 UNCHANGED，Review Report: docs/_review/637_M24.7_B2_Media_Schema_Migration_Closure_Report.md。Next: C.1 编号/ID/字段规范化（零迁移前端修正）`

## Current Phase Judgment

VISNDT 已经完成基础建设、后端主域与 Admin 运营底座，也已完成 Buyer / Supplier 双侧 Workspace 主链。当前项目最准确的状态是：

`M15 技术债治理已全面收口，M16 业务深化前稳定性审计已完成，M17 内容域建设完成，M18 内容运营成熟化完成（M18.5 阶段关闭），M19 产品体验架构演进完成（M19.1~M19.4 CLOSED），M19 COMPLETED，M20 Frontend Platformization 全部闭环（M20.1~M20.4 CLOSED），M20 COMPLETED。M21.0-M21.4 CLOSED（AI 基础设施 + Semantic Layer + Unified Search）。M21.5 Mobile Experience CLOSED（534-537 全部完成）。M21.6 Admin Intelligence CLOSED（538-543 全部完成）。M21.7 AI Agent Integration CLOSED（544-552 全部完成，7 层 AI Foundation 完整闭环，全边界 PROTECTED）。M21.8 Platform Readiness CLOSED（553-558 全部完成，P0=0 / P1=0 / P2=2 deferred，Readiness Score A-）。M22.1 Supplier Experience CLOSED（559 Architecture Audit COMPLETED + 560 Supplier Workspace Enhancement COMPLETED——5 文件修改，三边界全 PASS，零 Schema/Migration/API Endpoint 变更 + 561 Supplier Offer Management COMPLETED——7 文件修改，Offer 列表+Create+Edit+Submit+Withdraw，三边界全 PASS + 562 Supplier Business Opportunity Center COMPLETED——4 文件修改，商机中心三标签+机会时间线，三边界全 PASS + 563 Supplier Self-Service Profile COMPLETED——7 文件修改，Profile 管理+权限控制，三边界全 PASS + 564 Supplier Experience Validation COMPLETED——Audit Only，全流程验证 PASS，三边界全 PASS，M22.1 CLOSED）。M22.2 Content Center CLOSED（Architecture Initialization COMPLETED——Audit Only，Content Center 架构设计确认，现有 Content 基础设施全量盘点，三边界全 PASS，Content Center 架构就绪 + M22.2.1 Architecture Audit COMPLETED——Audit Only，6 边界审计全部 PASS，Content Center Architecture = READY FOR IMPLEMENTATION PHASE + M22.2.2 Content Model Implementation COMPLETED——Migration 012 + estimatedReadTime + sort/order + query enhancement，三边界全 PASS，三端 build 全部 exit 0 + M22.2.3 Content Management Enhancement COMPLETED——7 files，ContentList 4 新列 + sort，ContentForm 封面图上传 + 阅读时间，ContentEdit coverImageId + 阅读/发布时间，三边界全 PASS，三端 build 全部 exit 0 + M22.2.4 Web Content Experience COMPLETED——10 files，ContentCard 统一卡片组件 + 4 列表页改造 + 2 详情页增强 + 标签聚合页全类型支持，三边界全 PASS，三端 build 全部 exit 0 + M22.2.5 SEO Validation COMPLETED——Audit Only，SEO 全量验证 B+（15/16 路由 Metadata + 6 JSON-LD + Sitemap + robots + Admin SEO Panel），5 P2 Gap/0 P0/P1，三边界全 PASS，零代码变更 + M22.2.6 Content Center Final Validation COMPLETED——Audit Only，M22.2 阶段全量验证通过（6 表 + 11 API + 6 Admin Routes + 8 Admin Components + 9 Web Routes + B+ SEO），架构边界全 PASS，三端 build 全部 exit 0）。M22.2 Content Center CLOSED。M22.3 Knowledge Base CLOSED（572_M22.3.0 Architecture Initialization COMPLETED + 573_M22.3.1 Knowledge Model Design COMPLETED + 574_M22.3.2 Knowledge Classification Implementation COMPLETED + 575_M22.3.3 Knowledge Association Implementation COMPLETED + 576_M22.3.4 Knowledge Retrieval Foundation COMPLETED + 577_M22.3.5 Knowledge Base Final Validation COMPLETED——Audit / Validation，M22.3 全量验证通过：5 模型 + 3 枚举 + 22 Admin API + 5 Public API + 9 Admin 页面 + 3 Web 页面 + 三端 build 全部 exit 0 + 四大架构锁全 PASS + 完整能力链路（6/6），M22.3 Knowledge Base CLOSED）。M22.4 Search & Matching Enhancement——ARCHITECTURE REASSESSMENT（578_M22.4_Search_Matching_Architecture_Reassessment COMPLETED——Architecture Audit / Capability Reassessment，Search Architecture Proposal（Unified Industrial Retrieval Layer：Product + Knowledge + Content 统一检索），Matching Evolution（Knowledge Context 辅助匹配——REFERENCE only，不修改评分算法），SEO Growth Architecture（Knowledge Asset 作为 Topic Authority + Long Tail Search + Scenario Landing Page），AI Future Boundary（Knowledge Asset → AI Understanding Layer 预留接口），四大架构锁全 PASS，零代码变更，Database/API/Frontend/Admin/AI Impact 均 NONE）。Next Decision: M22.4 Implementation Roadmap Planning。579_M22.4_Pre_Implementation_Architecture_Compatibility_Audit（579）COMPLETED——Architecture Audit / Compatibility Review，基于本地 Repository 实际代码审查：Product/Parameter/Category 全 PASS（通用模型，无设备硬编码，数据驱动扩展），Search NEED OPTIMIZATION（KnowledgeEntry 未集成搜索 + 无统一 API + Semantic 内部隔离），Knowledge/Content PASS（边界清晰，Content KNOWLEDGE 与 KnowledgeEntry 共存待迁移），Matching PASS（纯参数评分，无 AI/Knowledge），SEO NEED OPTIMIZATION（sitemap 缺失 knowledge-base/products 页面 + 无 JSON-LD + KnowledgeEntry SEO 字段存储未使用），AI FROZEN 确认（全接口/契约，无运行时），总体 CONDITIONAL PASS——Architecture Ready 但有 optimization items。Next Recommended Task: 580_M22.4_Search_Discovery_Architecture_Finalization。580_M22.4_Search_Discovery_Architecture_Finalization_V2（580）COMPLETED——Architecture Audit / Architecture Decision Record / Capability Boundary Freeze / Roadmap Synchronization，M22.4 架构冻结完成：Search = Unified Industrial Discovery Layer（单页面统一发现，KnowledgeEntry 替换 Content KNOWLEDGE），Mobile = First-Class Discovery Experience（移动端优先发现流程），Entity Boundaries 冻结（Product=Equipment Asset / Knowledge=Platform Asset / Content=Publishing System / Solution=Content Article / Supplier=Capability Provider），Existing Asset Optimization Matrix 输出（2 REBUILD + 4 OPTIMIZE + 6 KEEP + 1 KEEP FROZEN），Insight/Parameter Knowledge 冻结（M22.4 不开发），Matching 冻结（参数评分，无 AI/Knowledge），AI 冻结（全接口，无运行时），Industrial Expansion PASS（所有 NDT 设备类型无代码变更支持），M22.4 实施路线确认（M22.4.1 Unified Search IMPLEMENT + M22.4.2 Discovery Experience IMPLEMENT + M22.4.3 SEO Asset IMPLEMENT + M22.4.4 Matching Context DESIGN ONLY），15 ADR 记录，零代码变更。Next Task: 581_M22.4.1_Unified_Search_Foundation_Implementation。581_M22.4.1_Unified_Search_Foundation_Implementation（581）COMPLETED——Development / API / Frontend，统一搜索 API 基础实现：Backend 4 new files（search.module.ts + search.controller.ts + search.service.ts + dto/unified-search.dto.ts）+ 1 modified（app.module.ts），Frontend 1 new file（lib/api/search.ts）+ 1 modified（services/search.service.ts），1 new API endpoint（GET /search，PUBLIC），5 搜索适配器（Product + KnowledgeEntry + Content + Solution + Supplier），KnowledgeEntry 替换 Content(KNOWLEDGE) 作为主知识源（ADR-003），服务端聚合替代前端 Promise.allSettled，统一响应契约 UnifiedDiscoveryResponse，三端 build 全部 exit 0，Database/Schema/Matching/AI 零变更。Next Task: 582_M22.4.2_Discovery_Experience_Implementation。582_M22.4.2_Discovery_Experience_Implementation（582）COMPLETED——Frontend / Discovery Experience，1 new file（SearchFilter.tsx）+ 3 modified（SearchPageContent.tsx + SearchTypeTabs.tsx + SearchResultSection.tsx）+ 1 CSS modified（globals.css），Desktop 统一发现页（5 实体 Tab + 内容类型筛选 + 响应式 3 列网格），Mobile First-Class 发现体验（横向滚动 Tab + 可折叠筛选面板 + 单列卡片 + 触摸友好），三端 build 全部 exit 0，Backend/API/Database/Matching/AI 零变更。Next Task: 583_M22.4.3_SEO_Asset_Architecture_Implementation。583_M22.4.3_SEO_Asset_Architecture_Implementation（583）COMPLETED——Frontend / SEO Asset，7 modified（seo.tsx + products/[slug] + knowledge-base/[slug] + articles/[slug] + insights/[slug] + solutions/[slug] + knowledge/[slug]）+ 1 rewritten（sitemap.ts），Product SEO（canonical + Twitter card），Knowledge SEO（KnowledgeEntry JSON-LD（Article + BreadcrumbList）+ Twitter card + sitemap），Content SEO（Article/Insight/Solution/Knowledge——Twitter card + OG type fix），Sitemap 覆盖 6 类动态路由（Product + KnowledgeBase + Article + Insight + Knowledge + Solution），Backend/API/Database/Search/Matching/AI 零变更，build exit 0（51 routes）。Next Task: 584_M22.4.4_Matching_Knowledge_Context_Architecture_Design。584_M22.4.4_Matching_Knowledge_Context_Architecture_Design（584）COMPLETED——Architecture Design Only，零代码变更，Matching 当前架构审计（weighted_v1 确定性评分 pipeline：Demand Parameter → Product Parameter → Score → DemandMatch），Knowledge Context Layer 设计（KnowledgeContextAdapter 接口 + KnowledgeContext 输出契约 + Read-Side 伴生数据模式），Scenario Understanding 未来接口设计（ScenarioUnderstandingInput → ScenarioContext，不参与评分），M23+ 演进路线定义（M23.0 Knowledge Context Foundation → M23.1 Scenario Understanding → M23.2 Assisted Recommendation → M23.3 AI Decision Support → M23.4+），7 个 ADR（ADR-016~022）冻结，边界矩阵 9 项能力跨越 M22.4-M23.3 状态定义，Database/API/Search/Matching/AI 零变更。M22.4 = CLOSED（7/7 全部完成）。Next: M23 Planning / Future Capability Roadmap Review。585_M23.0_Capability_Roadmap_Architecture_Review（585）COMPLETED——Architecture Review Only，零代码变更，M22.4 完成审计（7/7 CLOSED + 零 P0/P1 债务），平台全量能力评估（6 大模块深度审计：Product/Supplier/Knowledge/Matching/Search/AI），M23 优先级定义（P0: Knowledge Context Foundation / P1: Search Optimization + Discovery UX / P2: Match Explainability + Supplier Maturity），8 个 ADR-M23（ADR-M23-001~008），6 个永久边界重申，M23 路线图 5 阶段（M23.0 Knowledge Context → M23.1 Scenario Understanding → M23.2 Discovery & Match → M23.3 AI Design → M23.4+），M23.0 任务分解（4 tasks: 586-589），Database/API/Search/Matching/AI 零变更。586_M23.0.1_Knowledge_Context_Adapter_Implementation（586）COMPLETED——Backend Implementation / Read-side Capability Foundation，4 files（2 new：knowledge-context.types.ts + knowledge-context-adapter.service.ts + 1 new controller：matching.controller.ts + 1 modified：matching.module.ts），1 new API endpoint（GET /matches/:id/knowledge-context，JWT protected），KnowledgeContextAdapter 实现（DemandMatch → Product Category → KnowledgeDomain → KnowledgeCategory → KnowledgeEntry → KnowledgeRelation → KnowledgeContext，Runtime Computed Object），Knowledge ≠ Score Input（不修改 Matching/Scoring/weighted_v1），AI FROZEN（无 AI 调用），Database/Migration/Matching/Scoring/Search/Product/Knowledge Model 零变更，apps/api build exit 0。587_M23.0.2_Match_Detail_UX_Knowledge_Context（587）COMPLETED——Frontend Experience / Read-side Capability Consumption，11 files（Web：3 new + 1 modified；Admin：1 new + 4 modified），Web Match Detail 页面（/workspace/matches/[matchId]——Match Summary → Score Overview → Knowledge Context → Review Actions）+ Admin Knowledge Context Panel（BookOutlined 知识上下文面板——Domain/Category Tags → Relevant Entries → 知识关系 Tags → 免责声明），Web + Admin 均消费 GET /matches/:id/knowledge-context API（586），三端 build 全部 exit 0，Database/Migration/Matching/Scoring/AI 零变更，Knowledge ≠ Score Input / AI ≠ Matching Engine 边界全 PASS。588_M23.0.3_Search_Analytics_Foundation（588）COMPLETED——Backend / Data Capability Foundation，2 new files（search-analytics.types.ts + search-analytics.service.ts）+ 4 modified（search.controller.ts + search.module.ts + index.ts + schema.prisma）+ 1 migration（015_search_analytics_events：ALTER TYPE ADD VALUE x4），ConversionEventType 枚举扩展 +4（SEARCH_SUBMITTED / RESULT_VIEWED / ENTITY_CLICKED / DETAIL_OPENED），DiscoveryAnalyticsService 非阻塞事件记录（recordSearch / recordResultView / recordEntityClick / recordDetailOpen），SearchController 添加 fire-and-forget 分析钩子，GET /search 响应契约零变更，Matching/Scoring/Knowledge/AI 零变更，apps/api build exit 0。589_M23.0.4_M23.0_Final_Validation（589）COMPLETED——Architecture Validation / Integration Audit / Release Gate Review，M23.0 全量验证通过：10/10 Capability PASS，6 大架构边界全 PASS（Knowledge/Matching/AI/Search/Analytics/Database），三端 build 全部 exit 0，零 P0/P1 债务。590_M23.0_Final_Closeout_And_M23.1_Product_Experience_Roadmap（590）COMPLETED——Architecture Review / Roadmap Alignment，M23.0 正式 CLOSED（5/5 tasks，21 files，3 apps），VISNDT 平台定位重申（Product-Centric，非 AI Consultant），M23.1 路线校准（3 方向：Product Experience Optimization / Supplier Business Loop / Content Asset Construction），永久边界重申（Knowledge ≠ Score / AI ≠ Match / Search ≠ Ranking / Analytics ≠ Optimization），10 项禁止扩展清单。581_Product_Supplier_Capability_Model_Architecture_Feasibility_Audit（581）COMPLETED——Architecture Audit / Feasibility Verification，15 项需求评分（12 PASS / 1 PARTIAL / 2 NEED REFACTOR），Product/Offer/Organization/Parameter 全 PASS，SupplierProductSubmission 表设计 + 动态参数筛选 + 四阶段实施路线，零代码变更。582_Supplier_Capability_Service_Contact_Distribution_Architecture（582）COMPLETED——Architecture Design / Audit / Future Candidate，SupplierCapabilityContact 模型设计 + 6 种路由机制（A-F）+ 5 路由优先级（行业>区域>能力>轮询>人工）+ 同公司多业务员方案 + 7 测试场景 + 5 ADR，零代码变更。583_Capability_Discovery_Supplier_Exposure_Governance_Architecture_Audit（583）COMPLETED——Architecture Audit / Governance Validation，四大架构锁全 PASS（Product-Centric / Supplier Boundary / No Marketplace Drift / AI FROZEN），六大治理边界全 PASS，Search Discovery 扩展性验证通过，参数筛选 CONDITIONAL PASS，4 个 P2 Gap 识别，零代码变更。584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture（584）COMPLETED——Architecture Audit / Design Validation，6 ADR（584-001~584-006），7 级路由优先级设计，同公司多业务员公平分配验证，Capability Quota 三级策略（Basic/Advanced/Certified），8 测试场景覆盖，零代码变更。585_Platform_Capability_Governance_Final_Freeze_Audit（585）COMPLETED——Architecture Final Audit / Governance Freeze，580-584 全量汇总：37 ADR 全部 FROZEN，9/9 治理领域 FROZEN（Product/Supplier/Search/Contact/Routing/Exposure/Marketplace/AI/Offer），10/10 测试场景覆盖，零代码变更，580-585 架构治理链完整闭环。586_M23.1_Platform_Stability_and_Boundary_Verification_Audit（586）COMPLETED——Architecture Stabilization Audit / Runtime Verification，三端 Build 全部 exit 0（API + Web 51 routes + Admin），Prisma Schema 34 migrations 无变化，六大架构边界全 FROZEN，37 ADR 无漂移，文档与代码一致，零代码变更，M23 Architecture Freeze CONFIRMED，M23.1 Stable Baseline READY。Next Stage: M23.1 Product Experience Optimization。M24.1 Product Experience Foundation CLOSED（592-597 六阶段闭环 + 598 Final Validation & Closeout COMPLETED，Architecture FROZEN）。**599_M24.2.0_Product_Center_Experience_Architecture_Audit COMPLETED**——Architecture Audit / Baseline Verification / Read-only Review，Product Center（/products）真实架构审计 + Product/Category/Parameter/Media/Compare 数据能力验证 + Product Center vs Search 边界确认，零代码变更，Database/API/Web/Admin/Supplier/Knowledge/Search/Matching UNCHANGED，AI FROZEN，M24.2 Preparation Started（Baseline Created）。**600_M24.2.1_Product_Center_Catalog_Navigation_Architecture_Design COMPLETED**——Architecture Design / Experience Definition / Implementation Contract，Product Center 定位冻结为 Catalog Discovery（工业检测设备目录中心 / Product Only），四契约冻结：分类树导航（复用 ProductCategory.parentId/children + 子树聚合过滤）+ 分类驱动参数（Category Context → Relevant Parameters → Filter，独立实现不复用 Search）+ Capability Discovery Card（主图 + 关键参数摘要 + 比较入口）+ Product Center vs Search 边界（目录发现 vs 统一发现），零代码/Schema/API 变更（Design Only），Database/API/Web/Admin/Supplier/Knowledge/Search/Matching UNCHANGED，AI FROZEN，M24.2 Architecture Baseline Created，Next Task 601_Product_Category_Tree_UI_Implementation。**601_M24.2.2_Product_Category_Tree_UI_Implementation COMPLETED**——Development / UI Implementation / Controlled Frontend Enhancement，Web 1 file（components/products/ProductFilter.tsx：分类平铺列表 → 目录树导航，buildCategoryTree 扁平→树重组 + collectAncestorIds 路径展开 + renderNode 递归渲染 + expandedIds 展开状态 + 全部产品根节点 + 选中高亮 + URL categoryId 同步），复用 ProductCategory.parentId/children，零 Database/Schema/Migration/API 变更，apps/api + database/prisma + apps/admin UNCHANGED，Search/Matching UNCHANGED，AI FROZEN，Web tsc exit 0 + next build exit 0（39 pages），Category Tree/URL Sync/Mobile/Regression 全 PASS，Next Task 602_M24.2.3_Product_Parameter_Context_Filter。**602_M24.2.3_Product_Parameter_Context_Filter COMPLETED**——Frontend Enhancement / Read Capability Extension / Product Discovery Optimization，实现分类上下文参数筛选（Category Driven Parameter Context），API 新增最小只读端点 GET /product-categories/:id/parameters（findParameters：ProductCategory→ACTIVE Products→ProductParameterValue→ParameterDefinition，去重 + name 稳定排序 + 内联 options），前端 lib/api + service + page + ParameterFilterPanel 依 categoryId 切换数据源并增加空态，切换分类清零旧参数筛选，Database/Schema/Migration UNCHANGED，API MINIMAL READ-ONLY EXTENSION，Search/Matching UNCHANGED，AI FROZEN，Web tsc + next build exit 0（39 pages），API tsc + nest build exit 0，Category Context/Relevant Parameters/Filter Compatibility/Mobile/Regression 全 PASS，Next Task 603_M24.2.4_Capability_Discovery_Card；**603_M24.2.4_Capability_Discovery_Card_Implementation COMPLETED**——Frontend Enhancement / API Read Capability Extension / Product Center Experience Optimization，将 Product Center 产品列表卡片升级为 Capability Discovery Card（Primary Image + Name + Model + Category + Key Parameters + Description + Compare Entry），API 1 file（products.service.ts 新增 enrichWithCardFields：ProductMedia primary → primaryMedia single IMAGE + fileAssetId + ProductParameterValue → ParameterDefinition → keyParameters ≤3，displayOrder→name→id 确定性排序，3 次批量查询无 N+1，GET /products 列表项新增 primaryMedia + keyParameters 向后兼容扩展）+ Web 2 files（types/product.ts 新增 ProductPrimaryMedia/ProductKeyParameter + components/products/ProductCard.tsx 渲染真实主图 /files/:fileAssetId/download + 关键参数 name: value(unit) + 空态降级「暂无图片」/「暂无参数信息」），Database/Schema/Migration UNCHANGED，API BACKWARD COMPATIBLE EXTENSION，Admin/Supplier/Search/Knowledge/Matching UNCHANGED，AI FROZEN，API tsc/nest build + Web tsc/next build 全部 exit 0（39 pages），ProductCard Capability/Regression/Architecture Boundary 全 PASS。 **604_M24.2.5_Product_Center_Experience_Validation COMPLETED**——Experience Validation / Regression Audit，第一轮目录体验闭环全链路（Category Tree → Parameter Context → Capability Card → Compare → Product Detail → Inquiry）PASS，Search Boundary PASS，零代码变更，Database/Migration UNCHANGED，API STABLE，AI FROZEN，M24.2 第一轮体验闭环 VALIDATED。**605_M24.2_Final_Closeout_And_M24.3_Preparation COMPLETED**——Final Audit / Release Closure / Architecture Validation / Roadmap Preparation，M24.2 正式收口（600-604 全部 COMPLETED，体验闭环成立，Product Center = Industrial Inspection Capability Catalog），Database/Migration UNCHANGED，API STABLE，Search UNCHANGED，AI FROZEN，M24.2 CLOSED。**606_M24.2_Runtime_E2E_Verification COMPLETED**——真运行时 E2E（方案 B）18/18 PASS + Search/Mobile 边界回归 PASS，确认 605 静态收口结论。Next: M24.3 Preparation / Advanced Experience；609 COMPLETED（M24.3 Multi Role Agent Test Strategy Completed），610 COMPLETED（M24.3 Frontend Optimization And Agent Test Instruction Completed），611 COMPLETED（M24.3 Test Data Lifecycle Finalization Completed），612 COMPLETED（M24.3 Web Platform Experience Upgrade Completed），613 COMPLETED（M24.3 Admin Console Experience Upgrade Completed），614 COMPLETED（M24.3.8 Multi Role Agent Runtime Validation——四角色 Agent 运行时验收全部 PASS + E2E 18/18 + RBAC 403 边界 PASS + 运行时问题 0，M24.3 Advanced Experience ACCEPTED），615 COMPLETED（M24.3.9 Final Closeout——M24.3 Advanced Experience CLOSED，Documentation Synchronized），616 COMPLETED（M24.4.1 Current Frontend Visual Audit——M24.4 Experience Refinement READY FOR IMPLEMENTATION）。617 COMPLETED（M24.4.2 Homepage Premium Experience Upgrade——首页高级体验升级：Hero 工业品牌化 + VISNDT 品牌组件层 + ProductCard CapabilityLabel + 7 Section 统一 SectionHeader，apps/web build exit 0，M24.4.2 COMPLETED）。618 COMPLETED（M24.4.3 Product Capability Catalog Experience Upgrade——产品中心升级为工业检测能力目录：capability 语义层 + 5 个 capability 组件 + ProductCard 能力化表达 + 产品详情能力档案 + 参数能力表达 + MediaImage 统一接入，apps/web build exit 0）。619 COMPLETED（M24.4.4 Workspace SaaS Experience Upgrade——Workspace 从导航入口壳升级为 B2B Industrial Platform Workspace Experience：Buyer/Supplier 双角色身份识别（Identity & Role Awareness）、业务快照、待处理事项、快捷操作与工作台深链，复用既有 workspace/dashboard/offer/rfq API，apps/web build exit 0，Database/Schema/API/Auth/RBAC/Matching/Search UNCHANGED，AI FROZEN），620 COMPLETED（M24.4.5 Industrial Operation Console Experience Upgrade——Admin 运营仪表盘深度升级为工业运营中心：PlatformHealthBanner + StatCard + SectionHeader + Tabs 三视图（运营概览/数据图表/最近活动）+ 图表增强（AreaChart/BarChart/PieChart/FunnelChart）+ 状态语义统一（resolveStatusTone）+ 设计系统治理（VISNDT_COLORS/CHART_PALETTE），apps/admin build exit 0，Database/Schema/API/Auth/RBAC/Matching/Search UNCHANGED，AI FROZEN），621 COMPLETED（M24.4.6 Experience Gap Closure Audit——全站体验差距审计：14 Web + 27 Admin 页面逐页审计，Web 8/10 + Admin 5.75/10，0 Level A + 3 Level B + 4 Level C 差距，决策 M24.4 FINAL EXPERIENCE CLOSURE REQUIRED，Code UNCHANGED，Audit Only）。622_M24.4.7_Admin_Industrial_Operation_System_Expansion（622）COMPLETED——M24.4 FINAL EXPERIENCE CLOSURE 首环，落地 621 B1 高优先级差距：apps/admin 工业运营系统扩散，17 个 List/Detail 页 resolveStatusTone 误用收敛为 StatusTag 语义化组件（清除 'neutral'/'primary'/'violet' 非法 antd Tag 色 + DemandDetail 未定义 MATCH_STATUS_COLOR/RFQ_STATUS_COLOR 隐患）+ 散落硬编码色收敛到 VISNDT_COLORS.success/warning/error/primary + AuditIntelligence/BusinessAnalytics 遗留字符串字面量修复，Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/admin npm run build exit 0。623_M24.4.8_Web_State_Consistency_And_Error_Boundary（623）COMPLETED——M24.4 FINAL EXPERIENCE CLOSURE 次环，落地 621 B2/B3 中优先级差距：apps/web 状态系统一致性收口——EmptyState 收敛（knowledge/solutions 内联空态→统一 EmptyState）+ ErrorState 收敛（search 内联错误块→统一 ErrorState，新增 action 兜底导航）+ 页面级 Error Boundary 补齐（login/register/workspace/dashboard 新增 loading.tsx + error.tsx，新增共享 PageErrorBoundary 复用组件降重复）+ Loading 收敛（workspace 根内联"加载中"→统一 Loading），Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/web npm run build exit 0。624_M24.4.9_Final_Experience_Regression_Audit（624）COMPLETED——M24.4 FINAL EXPERIENCE ACCEPTED：全前端接受度审计（Audit Only，Code UNCHANGED），14 Web + 27 Admin 页面回归验证，Web 8.5/10（B2/B3 收敛后）> 8.5 门槛 ✓ + Admin 8.0/10 > 8.0 门槛 ✓，0 Level A + 0 Level B + 4 Level C，M24.4 ACCEPTED / Ready For M24.5。`

## Completed Baseline

### M0-M13 已完成

- NestJS + Prisma + PostgreSQL 后端基座
- Auth / User / Organization / Product / Category / Parameter 主数据体系
- Demand / Matching / RFQ / RFQ Response / Offer / Notification / Inquiry 核心模型与接口
- Admin 运营后台与 Dashboard
- Public Website、Product Center、Buyer 侧 MVP、部署与安全加固

### M14 已基本完成

- Buyer Workspace 与 Dashboard
- Supplier Workspace 与 Dashboard
- Buyer Demand 创建、详情、编辑
- Buyer RFQ 创建、详情、响应决策
- Supplier RFQ 列表、详情、响应跟踪
- Workspace 路由归属与业务边界收口

### M15 已完成

- TD-006 访问边界加固已落地
- TD-001 Service Boundary 收口已推进到最终验证阶段
- TD-002 WorkflowEvent 生命周期治理已完成
  - Match 事件主体归一化（entityType=MATCH）
  - Demand / RFQ 生命周期边界已收敛
  - RFQ Response 创建事件已补齐
  - Rematch 事件处理已规范（MATCH+CREATED+trigger=rematch）
  - 所有 WorkflowAction 复用现有枚举，未新增
- TD-005 Generic Mutation Boundary 收口已完成

### M16 审计阶段（429_M16.0）

- M16.0 业务深化前稳定性审计已完成
- 审计结论：M15 治理成果稳定，业务闭环完整，可进入 M16 开发阶段
- 审计范围：WorkflowEvent 基础、业务闭环完整度、前端架构、后端架构、数据库 Schema

### M16.1 开发阶段（430_M16.1）

- 公开询价链路的真实数据绑定已完成
- 产品详情页 InquirySection 已接入完整 `productId + offerId + organizationId` 数据链
- 后端 `GET /products/:id` 返回关联 `offers`（含 organization），供详情页推导可询价报价
- 询价提交链路：产品详情 → Inquiry 提交 → 关联 Product/Organization → 后台 Inquiry 管理形成闭环
- 未新增业务模型、未改 Schema、未改 API Contract、未触碰冻结模块

### M16.2 开发阶段（431_M16.2）

- 前端 API 层规范化已完成
- 统一数据访问模式：`Page → Service → API Wrapper → Backend API`
- 迁移直接调用 `lib/api/*` 的页面：`categories`、`workspace/rfqs/create`
- 补充 `rfq.service.ts` 缺失的 `createRfq` 方法
- 页面层运行时已无直接业务 API 调用；仅保留类型导入与 API Wrapper 错误类引用
- 未改后端、未改 Schema、未改 API Contract、未改业务流程

### M16.3 开发阶段（432_M16.3）

- 公开站 SEO Metadata 基础能力已完成
- 新增 `apps/web/src/lib/seo.ts` 站点元数据常量（站点名/URL/描述/关键词）
- 根布局 `layout.tsx` 完善 metadataBase、title 模板、Open Graph、Twitter Card、robots、keywords
- 首页补充 metadata；静态页（about/business/knowledge/solutions）标题规范化，避免平台名重复
- 产品详情页 `products/[slug]` 新增 `generateMetadata` 动态 SEO（复用 service 层 getProduct）
- 未改后端、未改 Schema、未改 Migration、未改 API Contract，未创建 CMS / SEO 管理系统

### M16.4 评估阶段（433_M16.4）

- 内容管理 MVP 架构评估已完成（只读审计，无代码改动）
- 确认现状：无内容数据模型、无内容 API、无 Admin 内容入口、无内容详情页，仅有静态 `/knowledge`、`/solutions` 展示壳
- 评估结论：**M16 阶段不实施内容管理系统**，内容域推迟至 M17 开发（符合"禁止提前实施"原则）
- 已定义 M17 内容域 MVP 范围与开工前置清单，并明确复用 M16.3 SEO 机制与 M15 WorkflowEvent 基础

### M16.5 组件层 API 规范化（434_M16.5）

- 完成组件层运行时 API 调用规范化：扫描 `apps/web/src/components`，将 3 个组件（`InquiryForm`、`CategorySection`、`FeaturedProductsSection`）直接调用 `@/lib/api/*` 的运行时调用迁移至 Service 层
- 复用已有 Service 方法（`inquiry.service` / `category.service` / `product.service`），无需新增 Service 方法
- 前端数据访问架构统一为 `Component → Service → API Wrapper → Backend API`，组件层**无**运行时直接业务 API 调用、无 `fetch`/`client` 直连
- 仅修改 3 个组件的 import 路径，业务逻辑、页面行为、用户流程完全不变
- 未改后端、未改 Schema、未改 Migration、未改 API Contract；`apps/web` build 通过（exit code 0）
- 剩余项：组件层仍存在 5 处 `import type`（`RfqItem`/`RfqDetailItem`/`RfqResponseItem`/`DemandItem`/`DemandDetailItem`）为编译期类型引用，非运行时数据访问，属低风险可后续清理项

## Real Architecture State

- `apps/api`: 业务主域已经成型，具备 CRUD、workflow transition、workspace aggregate、admin aggregate。
- `apps/web`: 公共站点 + Buyer Workspace + Supplier Workspace + Dashboard 已成型。
- `apps/admin`: 平台运营与主数据管理能力完整，不是占位工程。
- `database/prisma`: Schema 覆盖身份、产品、供需撮合主链、治理审计与文件资产。

## Current Risks

1. `前端分层历史包袱基本清理`
   - 页面层运行时直接调用 `lib/api/*` 已迁移至 service 层（M16.2），组件层运行时直接调用已迁移至 service 层（M16.5）；组件层仍存在 5 处 `import type` 类型引用（`RfqItem`/`RfqDetailItem`/`RfqResponseItem`/`DemandItem`/`DemandDetailItem`），为编译期类型引用、非运行时数据访问，属低风险可后续清理项。
2. `内容体系排版与运营能力待深化`
   - 内容域后端/Admin/Web 已落地（M17），Markdown 编辑与 Web 安全渲染已完成（M18.1），Content Media 管理已实现（M18.2 Implementation：Content→ContentMedia→FileAsset 链路 + 媒体下载发布状态校验），SEO 深化已完成（M18.3：OpenGraph / JSON-LD / Sitemap / Canonical）；工作流增强（M18.4）已完成架构规划（Revision History / Scheduled Publish / Reviewer Record / Approval History），待实施。
3. `SEO 基础依赖站点正式域名`
   - `SITE_URL` 默认占位域名，生产环境需通过 `NEXT_PUBLIC_SITE_URL` 配置正式域名。
4. `存在局部重复建设/兼容遗留`
   - 典型表现为 Dashboard / Workspace 双入口兼容；组件层运行时 API 直连已清理，仅剩 5 处 `import type` 低风险类型引用。

### M16 阶段关闭（435_M16_Closeout_Audit）

- **M16 状态：`IN_PROGRESS` → `COMPLETED`（M16 CLOSED）**
- M16.0-M16.5 全部任务完成并通过关闭审计（报告 429-434 均在 `docs/_review/`）
- 稳定化目标达成：公开询价链路稳定、前端 API 分层统一（页面+组件运行时均走 Service 层）、SEO 基础能力完成、内容管理边界明确（推迟 M17）、组件层 API 治理完成
- 冻结模块状态：Auth / WorkflowEvent / Notification / AuditLog / Database Schema 均无变化，无 Schema 变更、无新增 Migration、无 API Contract 变更
- 架构约束保持：后端 `Controller → Service → Domain Logic → Persistence → WorkflowEvent → Notification/Audit`；前端 `Page → Component → Service → API Wrapper → Backend API`
- 业务闭环可运行：`Product → Demand → Matching → RFQ → RFQ Response → Inquiry → Notification → Admin Operation`
- **M16 关闭条件已满足，允许进入 M17 内容域立项（仅规划，不实施）**

## M17 启动（436_M17.0_Content_Domain_Architecture_Planning）

- **M17 状态：`PLANNED` → `IN_PROGRESS`（启动规划）**
- 完成内容域架构规划（只读设计，无代码改动）：
  - 定位：工业检测行业知识内容平台（非商城/广告/供应商店铺）
  - Content 实体提案：统一单表 + `type` 判别（ARTICLE/KNOWLEDGE/SOLUTION/INSIGHT），含 title/slug/summary/content/status/publishedAt/author/SEO 内联字段
  - 工作流映射：DRAFT(CREATED)→REVIEW(SUBMITTED/REVIEWED)→PUBLISHED(OPENED)→ARCHIVED(CLOSED)，复用现有 WorkflowAction/WorkflowEvent
  - API 提案：Public GET `/content` 列表+详情；Admin POST/PATCH + submit/review/publish/archive 生命周期
  - 前端规划：Web `/knowledge`、`/knowledge/[slug]`、`/solutions`、`/solutions/[slug]`+动态 SEO；Admin Content List/Editor/Publish
- 冻结区域未触碰：Schema/Migration/Auth/WorkflowEvent/Notification/AuditLog/已有 API Contract 均无变化
- 治理提示：WorkflowEntityType 需在 M17.1 评审批准新增 `CONTENT` 值（当前仅设计，未实施）

## M17.1 内容模型设计评审（437_M17.1_Content_Model_Design_Review）

- **M17.1 评审完成（437）**：对 436 内容域设计进行正式评审，**评审通过（Conditional Approved）**，设计冻结
- **Content Model Decision**：统一 `Content` 实体冻结（type/title/slug/summary/content/coverImageId/status/authorId/publishedAt/archivedAt/SEO 内联字段）；能力覆盖 Knowledge/Solution/Article，预留 Insight
- **ContentType Decision**：MVP 仅启用 ARTICLE / KNOWLEDGE / SOLUTION；INSIGHT 延期
- **ContentStatus Workflow Decision**：DRAFT(CREATED)→REVIEW(SUBMITTED/REVIEWED)→PUBLISHED(OPENED)→ARCHIVED(CLOSED)，复用现有 WorkflowAction，状态流转由 Domain Logic 强制校验
- **Workflow EntityType Decision**：M17.2 允许新增 `CONTENT` 值（本任务仅记录决策，未修改枚举）
- **API Contract 冻结**：Public GET `/content` 列表+详情（仅 PUBLISHED）；Admin POST/PATCH + submit/review/publish/archive
- **Frontend/Admin 冻结**：Web `/knowledge`、`/knowledge/[slug]`、`/solutions`、`/solutions/[slug]`（复用 M16.3 SEO）；Admin Content List/Editor/Publish
- 冻结区域未触碰：Schema/Migration/Auth/WorkflowEvent/Notification/AuditLog/已有 API Contract 均无变化

## M17.2 内容域基础实现（438_M17.2_Content_Domain_Foundation_Implementation）

- **M17.2 Started & Completed（438）**：Content Domain 后端基础落地，构建与运行验证通过
- **WorkflowEntityType 扩展**：新增 `CONTENT` 值（仅此一项触碰 Workflow 枚举；WorkflowAction 未改）
- **Content Schema Added**：新增 `ContentType`/`ContentStatus` 枚举 + `Content` 模型（author→User、coverImage→FileAsset、slug unique、[type,status] 索引）
- **Migration Added & Applied**：`20260811154853_m17_2_content_domain`（本地 PostgreSQL 已执行）
- **Content Module 创建**：`apps/api/src/content/`（module/controller/service + create/update/query DTO）
- **API**：新增 `/api/v1/content`（ADMIN 保护：GET/POST/PATCH + submit/review/publish/archive）；Public API 未开放
- **Security**：沿用 JwtAuthGuard + RolesGuard + ADMIN；Auth/Notification/AuditLog/既有模块未改动
- **Build**：`apps/api` build ✅、运行 ✅（Content 路由映射成功）；admin/web 未改动，无需重建

## M17.3 内容管理 Admin 基础（439_M17.3_Content_Admin_Foundation）

- **M17.3 Started & Completed（439）**：Content Domain Admin 管理基础落地，Admin build 通过（exit code 0）
- **Admin Menu**：`AdminLayout` 新增「内容管理」入口（`/content`）
- **Admin Route**：新增 `/content`（列表）、`/content/create`（创建）、`/content/:id`（编辑/生命周期管理）
- **Service Layer**：新增 `apps/admin/src/api/content.service.ts`，封装 getList/getById/getBySlug/create/update/submit/review/publish/archive
- **组件**：新增 `ContentForm` 共享表单组件（基本信息 + SEO）
- **页面**：`ContentList`（type/status 筛选 + 分页）、`ContentCreate`（创建草稿）、`ContentEdit`（编辑 + 生命周期操作）
- **生命周期操作**：DRAFT→提交审核(submit)、REVIEW→审核通过(review)、PUBLISHED→归档(archive)，均带 Modal 确认
- **架构约束保持**：`Page → Service → API Wrapper → Backend API`，页面无直接 `fetch`/`axios`
- **冻结区域未触碰**：Schema / Migration / Auth / WorkflowAction / Notification / AuditLog / Content API Contract 均无变化
- **Build**：`apps/admin` build ✅（exit code 0），验证通过

## M17.4 内容公开 Web 接入（440_M17.4_Content_Public_Web_Integration）

- **M17.4 Started & Completed（440）**：Web 公共内容域接入落地，`apps/web` 编译/类型检查通过
- **后端公开读接口（用户审批新增，增量非破坏）**：`GET /content/public`（仅 PUBLISHED，支持 type 筛选 + 分页）、`GET /content/public/:slug`（按 slug 返回 PUBLISHED 内容）；沿用 `Controller → Service → Prisma`，不改既有 ADMIN 端点路径/参数/返回，不触碰 Schema/Migration
- **Service Layer**：新增 `apps/web/src/services/content.service.ts`（getContentList / getContentBySlug）+ API Wrapper `apps/web/src/lib/api/content.ts` + 类型 `apps/web/src/types/content.ts`
- **Knowledge 动态化**：`/knowledge` 列表页改为动态 Content API（type=KNOWLEDGE），新增 `/knowledge/[slug]` 详情页
- **Solutions 动态化**：`/solutions` 列表页改为动态 Content API（type=SOLUTION），新增 `/solutions/[slug]` 详情页
- **SEO 接入**：详情页 `generateMetadata()` 复用 M16.3 `seo.ts`，来源 `seoTitle / seoDescription / title / summary`
- **架构约束保持**：`Page → Service → API Wrapper → Backend API`，页面无直接 `fetch`
- **冻结区域未触碰**：Schema / Migration / Auth / WorkflowAction / Notification / AuditLog / 既有 Content API Contract / Admin Content 均无变化
- **Build**：`apps/web` `tsc --noEmit` exit 0 ✅；`next build` 全阶段成功（编译 + 类型校验 + 27 静态页），exit -1 为机器 SWC 原生 DLL 环境问题（非代码引入）

## M17.4 Public Content API Security Audit（441_M17.4_Public_Content_API_Security_Audit）

- **M17.4 Audit Completed（441）**：对 Public Content API 完成专项安全与架构审计，核心隔离项全部通过
- **PUBLISHED 隔离** ✅：列表 `findAllPublic` 与详情 `findPublishedBySlug` 均在 **DB 层**强制 `status=PUBLISHED`（`where` 条件），无先全量 `findMany` 再前端过滤
- **slug 隔离** ✅：详情 `findFirst({ where: { slug, status: PUBLISHED } })`，slug 与 PUBLISHED 双条件同处数据库查询
- **响应边界（审计整改，最小修复）**：公开端点原返回原始 Prisma Model，暴露 `status / archivedAt / authorId / author.email`（PII）。已新增 `publicContentSelect` 公开安全投影，仅暴露 `id / type / title / slug / summary / content / publishedAt / seoTitle / seoDescription / seoKeywords / createdAt / updatedAt / author.name / coverImage(Name)`，剔除内部字段与作者邮箱
- **分页（审计整改，最小修复）**：`pageSize` 原仅 Swagger docs 声明 max=100，无运行时校验。已补 `@Min(1)` / `@Max(100)` 运行时校验，限制 `MAX_PAGE_SIZE <= 100`
- **Rate Limit** ✅：公开端点继承全局 `ThrottlerGuard`（APP_GUARD，100 req/60s），无需单独配置
- **SEO 来源** ✅：`seoTitle / seoDescription / title / summary`，与 M16.3 SEO Foundation 一致，未新增 SEO 体系
- **冻结区域未触碰**：本任务仅最小修复 `apps/api/src/content/*`（公开投影 + DTO 校验）；Schema / Migration / Auth / Workflow / Notification / Audit / 既有 ADMIN Content API 均无变化
- **Build**：`apps/api` `tsc --noEmit` exit 0 ✅

## M17.5 Content Domain Enhancement Planning（442_M17.5_Content_Domain_Enhancement_Planning）

- **M17.5 Planning Completed（442，Architecture Planning Only，No Code Change）**：对 Content Domain 完成阶段性增强规划评审，MVP 闭环完整性确认，后续增强方向定稿，作为 M18 实施范围基线
- **MVP 闭环评估** ✅：`Content Model → Admin Management → Lifecycle Workflow → Public API → Web Rendering → SEO Metadata` 已形成完整闭环，满足当前 MVP
- **内容编辑策略（推荐）**：**Option A — Markdown Content + Preview Rendering**（当前 `content` 为纯文本 `prose` + `whitespace-pre-wrap`；推荐演进为 Markdown 存储 + 预览渲染，成本低、易迁移、与 SEO/纯文本兼容）；Rich Text（Option B）与 Headless CMS（Option C）暂不采用
- **媒体管理演进**：当前 `Content.coverImageId → FileAsset` 单封面；规划未来 `ContentMedia → FileAsset` 一对多，支持多图/图文混排/案例图/检测报告附件（M18 规划，不实施）
- **SEO 演进**：当前 `seoTitle/seoDescription/seoKeywords` 满足 MVP；规划未来 OpenGraph / Structured Data / Sitemap / Canonical / SEO Metadata 管理（M18 规划，不拆分 SeoMetadata 模型）
- **工作流演进**：当前 DRAFT→REVIEW→PUBLISHED→ARCHIVED 满足 MVP；规划未来 Draft Version / Revision History / Scheduled Publish / Reviewer / Approval Record（M18 规划，不新增 Role）
- **内容类型演进**：当前 ARTICLE/KNOWLEDGE/SOLUTION，预留 INSIGHT；规划未来 Case Study / Technical Guide / Industry Report / Product Application（M18 规划）
- **架构约束保持**：保持 `WorkflowEntityType.CONTENT` 与既有 `WorkflowAction`（CREATED/SUBMITTED/REVIEWED/OPENED/CLOSED），不新增 ContentWorkflowAction；不新建独立 CMS 子系统
- **冻结区域未触碰**：Schema / Migration / Auth / Workflow / Notification / AuditLog / Content API / Admin / Web 均无修改；Build Not Required

## M18 Content Operation Capability Implementation Planning（443_M18.0_Content_Operation_Capability_Implementation_Planning）

- **M18 Started（443，Architecture Planning Only，No Code Change）**：基于 442 增强规划基线，制定 M18 内容运营能力五优先级实施路线，作为 M18 各子阶段开发范围基线
- **M17 复核** ✅：Content Model → Admin Management → Lifecycle Workflow → Public API → Web Rendering → SEO Metadata 端到端闭环达成，MVP 状态 **Complete**
- **M18 实施优先级**：
  1. **Priority 1 — Markdown Content Rendering Foundation**（M18.1）：Markdown 存储 + Admin 预览 + Web 安全渲染 + XSS 防护 + 既有内容兼容（复用 `Content.content`，零数据迁移）
  2. **Priority 2 — Content Media Management Foundation**（M18.2）：规划 `Content → ContentMedia → FileAsset` 一对多，支持图片/附件/报告文件/排序/描述
  3. **Priority 3 — SEO Enhancement Foundation**（M18.3）：OpenGraph image / JSON-LD / Sitemap / Canonical（不拆分 SeoMetadata 模型）
  4. **Priority 4 — Content Workflow Operation Enhancement**（M18.4）：Revision History / Scheduled Publish / Reviewer Record / Approval History（不新增 WorkflowAction）
  5. **Priority 5 — Extended Content Types**（M18.5）：规划 CASE_STUDY / TECHNICAL_GUIDE / INDUSTRY_REPORT / PRODUCT_APPLICATION（当前阶段不新增枚举）
- **M18 子阶段**：M18.1 Markdown → M18.2 Content Media → M18.3 SEO → M18.4 Workflow → M18.5 Content Type Expansion
- **架构约束保持**：Content 保持统一内容领域模型，不拆分 Article/Knowledge/Solution 独立模型；不引入 Headless CMS / 独立 CMS / 新权限系统；SEO 延续 `Content.seoTitle/seoDescription/seoKeywords`；Workflow 延续 `WorkflowEntityType.CONTENT`，不新增 ContentWorkflowAction
- **冻结区域未触碰**：Schema / Migration / Auth / Workflow / Notification / AuditLog / Content API / Admin / Web 均无修改；Build Not Required

## M18.1 Markdown Content Enhancement Implementation（444_M18.1）

- **M18.1 Started & Completed（444）**：内容增强第一阶段（Markdown）落地，三个应用构建全部通过（API / Admin / Web build exit 0）
- **Markdown 存储复用** ✅：`Content.content`（TEXT）保持不变，零数据迁移，直接承载 Markdown；Database State = No Change
- **Admin Markdown 编辑器 + 预览面板** ✅：新增 `apps/admin/src/components/content/MarkdownEditor.tsx`（编辑 / 预览 Segmented 切换，react-markdown + remark-gfm），`ContentForm` 正文由 `TextArea` 升级为 `MarkdownEditor`；支持标题/列表/表格/引用/图片引用/链接
- **Admin INSIGHT 类型支持** ✅：`ContentForm` 类型下拉新增「参数百科（Insight）」，`ContentList` 类型筛选新增 INSIGHT；Admin 类型定义（Create/Update/FormData）扩展 INSIGHT
- **Web Markdown 安全渲染** ✅：新增 `apps/web/src/components/markdown/MarkdownRenderer.tsx`（服务端渲染，react-markdown + remark-gfm + `skipHtml` + 链接/图片协议白名单），`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页已由纯文本升级为安全 Markdown 渲染；SEO metadata 逻辑保留
- **Web 排版依赖** ✅：安装 `@tailwindcss/typography` 并启用 `prose` 插件（原 `prose` 类此前未生效），Markdown 排版正确呈现
- **后端 DTO 校验扩展（最小变更）** ✅：`CreateContentDto` / `UpdateContentDto` 的 `@IsIn` 允许 `INSIGHT`（DB enum 已含 INSIGHT），支持参数百科示例内容创建；未改动端点/路径/返回结构（API Contract 保持）
- **参数百科定位** ✅：`type=INSIGHT` 内容仅作为关联内容基础，不创建独立导航入口、不生成公开链接、不实现独立模块；通过产品详情页参数字段弹窗/关联方式展示（规划，未实施）
- **示例 Content 数据** ✅：新增 `database/seed_content.ts`（幂等 upsert，tsx 执行），已入库 8 条 PUBLISHED 示例：KNOWLEDGE 3 / SOLUTION 2 / INSIGHT（参数百科）3
- **Security** ✅：Web 渲染 `skipHtml` 不执行原始 HTML（含 script/style/iframe），链接/图片仅允许 http/https/mailto/tel 及站内相对路径，拦截 javascript:；无公开安全边界扩大
- **Freeze 兼容** ✅：Schema / Migration / Auth / Role / Permission / WorkflowAction / Notification / Audit / Content API 端点契约 均无变化
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（仅 img/alt 非阻塞 lint 提示）

## M18.2 Content Media Architecture Planning（445_M18.2）

- **M18.2 Planning Completed（445，Architecture Planning Only，No Code Change）**：Content Media Management 架构设计评审完成，为 M18.2 Implementation 提供冻结设计基线
- **推荐模型** ✅：`Content → ContentMedia → FileAsset` 中间表模式（完全复用 `Product → ProductMedia → FileAsset` 成熟链路，含 `createWithUpload` 原子上传-create 与删除级联 S3 清理）
- **候选字段** ✅：`id / contentId / fileAssetId / type(IMAGE|ATTACHMENT) / caption / sortOrder / createdAt / updatedAt`
- **Schema Impact 评估** ✅：未来新增 `ContentMedia` 模型 + `FileEntityType.CONTENT` 枚举扩展 + `Content.media` 反向关系；`Content.coverImageId` 与 `FileAsset` 实体字段保持不变；需 1 个新 Migration（本任务未创建）
- **Public API 策略** ✅：推荐方案 A（详情 `GET /content/public/:slug` include `media`，向后兼容，列表保持轻量，不新增公开端点）；Public 投影永不暴露 storageKey
- **Admin 方向** ✅：内容编辑页新增媒体管理区块（多图/附件/排序/图注/封面/删除替换），复用 FileAssetService 能力
- **Web 方向** ✅：详情页新增 Media Gallery + Attachments 展示（图片经大图、附件经预签名 URL 下载）
- **Security** ✅：识别关键缺口——`GET /files/:id/download` 无「实体→发布状态」归属校验，需在 Implementation 落地「仅 PUBLISHED 内容媒体可公开下载」；storageKey 保护与 Public 字段投影保持
- **Freeze 兼容** ✅：Schema / Migration / Auth / Workflow / Notification / Audit / Content API / Role 均无变化

## M18.2 Content Media Implementation（446_M18.2）

- **M18.2 Implementation Started & Completed（446）**：基于 445 冻结设计基线，Content Media Management 第一阶段能力落地，三端 build 全部通过（API / Admin / Web exit 0）
- **Database** ✅：新增 `ContentMediaType`（IMAGE/ATTACHMENT）枚举 + `ContentMedia` 模型（contentId/fileAssetId/type/caption/altText/sortOrder，contentId 与 fileAssetId 索引，content 级联删除）；扩展 `FileEntityType.CONTENT`；`Content.coverImageId` 继续作为封面保持；新增 Migration `20260812104939_m18_2_content_media`（表 + 2 索引 + 2 外键 + 枚举扩展）
- **Backend** ✅：新增 `apps/api/src/content-media/`（module/controller/service + create/update DTO）；Admin：`POST /content/:contentId/media`、`POST /content/:contentId/media/upload`（原子上传-create，复用 FileAssetService，entityType=CONTENT）、`PATCH /content/:contentId/media/:mediaId`、`DELETE /content/:contentId/media/:mediaId`；Public：`GET /content/:contentId/media`（列表，Public 投影永不暴露 storageKey）；`FileAssetService.upload` 增加 entityType 参数；`publicContentSelect` 扩展 include `media`（含 fileAsset，不含 storageKey）
- **Security（关键修复）** ✅：`GET /files/:id/download` 增加「实体→发布状态」归属校验——`entityType=CONTENT` 的文件仅当其所属 Content 为 `PUBLISHED` 时允许公开下载；DRAFT / REVIEW / ARCHIVED 与未关联内容的文件一律拒绝（ForbiddenException）
- **Admin** ✅：内容编辑页新增「媒体管理」区块（`ContentMediaManager.tsx`）：上传（按 MIME 自动判别图片/附件）、列表（图片经签名 URL 预览）、编辑（类型/说明/Alt/排序）、删除（级联删除 FileAsset + S3）
- **Web** ✅：详情页新增 Media Gallery + Attachments 展示（`components/content/MediaGallery.tsx`），图片经 `/files/:id/download` 大图展示、附件经预签名 URL 下载；`/knowledge/[slug]` 已接入
- **Freeze 兼容** ✅：未创建 Article/Knowledge/Solution 独立模型、未建 CMS、未建 Insight 模块、未建参数百科页面、未新增 Role、未建 Permission System、未改 WorkflowAction / Notification / Audit System
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（仅既有非阻塞 img/alt 提示）

## M18.3 SEO Enhancement Implementation（447_M18.3）

- **M18.3 SEO Enhancement Started & Completed（447）**：基于 443 规划与 446 实施成果，Content SEO 展示层能力落地，`apps/web` build 通过（exit 0）
- **OpenGraph** ✅：`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页 `generateMetadata()` 增强 OpenGraph（title/description/url/images），图片优先取 `coverImage`（`ContentCoverImage`），其次媒体首图（`media` 中首个 IMAGE 的 fileAsset）；Solution 页 OpenGraph type 为 `website`
- **JSON-LD Structured Data** ✅：新增 `apps/web/src/lib/seo.ts` 的 `buildContentJsonLd()`，Knowledge 详情输出 `Article`、Solution 详情输出 `TechArticle`；仅暴露无敏感展示字段（headline/description/url/image/datePublished/dateModified/author.name + publisher），不含内部 ID 与 storageKey
- **Sitemap** ✅：新增 `apps/web/src/app/sitemap.ts`，`/sitemap.xml` 仅收录 PUBLISHED 内容（公开 API DB 层强制），含静态核心路由（/、/knowledge、/solutions、/products、/business、/about）+ 知识/解决方案详情页（带 lastModified）；内容拉取失败时降级仅返回静态路由
- **Canonical** ✅：两个详情页均输出 `alternates.canonical`（基于 `SITE_URL` 的绝对 URL）
- **Content 单模型保持** ✅：未新增 SeoMetadata 模型、未新建 SEO Module、未改 Prisma Schema、未创建 Migration、未改 Content Model、未创建 CMS、未做 AI SEO 自动生成
- **架构约束** ✅：SEO 元数据完全复用 `Content.seoTitle / seoDescription / seoKeywords / coverImage`，无新增数据模型
- **Freeze 兼容** ✅：Schema / Migration / Auth / Workflow / Notification / Audit / Content API / Admin 均无变化
- **Build** ✅：`pnpm --filter @visndt/web build` 通过（exit 0），`/sitemap.xml`、`/knowledge/[slug]`、`/solutions/[slug]` 均成功生成（SWC Native DLL 警告为机器环境问题，非代码引入）

## M18.4 Workflow Operation Enhancement Architecture Planning（448_M18.4）

- **M18.4 Architecture Planning Completed（448，Architecture Planning Only，No Code Change）**：Content Workflow Operation Enhancement 架构规划评审完成，输出 M18.4 Implementation 冻结设计
- **当前 Workflow 复核** ✅：Content 生命周期 `create(DRAFT/CREATED)→submit(REVIEW/SUBMITTED)→review|publish(PUBLISHED/REVIEWED|OPENED)→archive(ARCHIVED/CLOSED)`；`update` 仅 DRAFT/REVIEW 可编辑；复用 `WorkflowEntityType.CONTENT` + 既有 `WorkflowAction`，未新增 ContentWorkflowAction
- **关键发现** ✅：`WorkflowEventsService.create()` 要求 operator 有 organizationId，Content 按 author/user 维度操作导致 `emitEvent()` 用 try/catch 吞掉错误，**Content 工作流事件可能被静默丢弃**；Content 生命周期未接入 AuditLog 系统审计；Notification 无 CONTENT 类型
- **Revision History 评估** ✅：推荐 **方案 A — ContentRevision 独立历史表**（数据完整性/查询效率/审计能力/未来扩展优于 AuditLog 承担或 Content JSON snapshot；避免污染 AuditLog「系统审计」边界）
- **Scheduled Publish 评估** ✅：Content 新增 `scheduledPublishAt DateTime?` + 轻量后台轮询；**不新增 Schedule 模型**、不引入 CMS Scheduler；复用 WorkflowEvent（`OPENED` + metadata 标记 scheduled）；不新增 WorkflowAction
- **Reviewer Record 评估** ✅：复用 `WorkflowEvent.operatorId` + User，**不新增 Reviewer 表**
- **Approval History 边界** ✅：WorkflowEvent（业务时间线 APPROVAL TIMELINE）与 AuditLog（系统审计 old/new）**分离不混用**；纳入 Implementation 整改：修复 Content WorkflowEvent 可靠性 + 补齐 Content AuditLog 审计
- **Freeze 兼容** ✅：未改 Schema / Migration / API / Admin / Web / WorkflowAction / Role / Permission / Notification / AuditLog
- **Build** ✅：Not Required

## M18.4.1 Workflow Reliability Foundation Implementation（449）

- **M18.4.1 Workflow Reliability Foundation Started & Completed（449）**：基于 448 设计基线，实施 Workflow Reliability Foundation 前置整改，API / Admin build 通过（exit 0）
- **WorkflowEvent 可靠性修复** ✅：`apps/api/src/workflow-events/workflow-events.service.ts` 放宽 `create()` 组织约束——仅对组织绑定实体（Demand/RFQ/...）强制校验 `organizationId`，对 `WorkflowEntityType.CONTENT`（author/user 维度）豁免；`apps/api/src/content/content.service.ts` `emitEvent()` 移除 try/catch 吞错，WorkflowEvent 失败不再静默丢失，改为向上抛出（数据完整性 > 静默成功）
- **Content 生命周期 AuditLog 接入** ✅：`content.service.ts` 注入 `AuditLogService`，新增审计记录点——`create`（CREATE，newValue=title/status/SEO/coverImageId）、`update`（UPDATE，old/new 对比）、`transition`（submit/review/publish/archive 均记 STATUS_CHANGE，oldValue=from / newValue=to）；`content.controller.ts` 的 `update` 端点补传 `@CurrentUser` 以提供 operatorId
- **职责边界保持** ✅：WorkflowEvent（业务流程时间线，不承担 old/new 数据审计）与 AuditLog（系统审计 actor/action/entityType/entityId/oldValue/newValue）分离不混用；AuditLog 未公开返回
- **Security** ✅：无新公开 API、无新权限、无新 Role、无新数据泄露
- **Freeze 兼容** ✅：未改 Schema / Migration / ContentRevision / Scheduler / WorkflowAction / Role / Permission / Notification / Web
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0；`apps/web` 无需修改

## M18.4.2 Content Revision Implementation（450）

- **M18.4.2 Content Revision Implementation Started & Completed（450）**：基于 448 设计基线 + 449 前置整改，实施 Content Revision History 能力，为 M18.4.3 Scheduled Publish / M18.4.4 Approval Timeline 提供版本基础
- **ContentRevision 独立版本历史模型** ✅：`database/prisma/schema.prisma` 新增 `ContentRevision`（`content_revision` 表），与 `Content` 1:N（`@@index([contentId, version])`，`onDelete: Cascade`）；快照字段 `title/summary/content/seoTitle/seoDescription/seoKeywords/coverImageId/snapshot/createdBy/createdAt`；生成并应用迁移 `20260812043433_m18_4_2_content_revision`（`pnpm prisma migrate status` 显示 23 迁移、schema 同步、up to date）
- **Content 版本快照保存** ✅：`apps/api/src/content-revision/` 新增模块（`content-revision.module/service/controller`）；`ContentService.create()` 在事务内创建 revision v1，`update()` 在事务内创建 revision v(n+1)（`max(version)+1`）；Revision 写入失败则 Content 写入回滚（数据完整性 > 静默成功）；状态变更（submit/review/publish/archive `transition`）不创建 revision（状态属 WorkflowEvent，操作属 AuditLog）
- **Admin Revision History UI** ✅：`apps/admin/src/components/content/ContentRevisionHistory.tsx` 新增版本历史区块（版本/创建人/创建时间 + 查看版本快照 Modal），集成于 `ContentEdit.tsx`；`content.service.ts` 新增 `listRevisions` / `getRevision`，`content.types.ts` 新增 `ContentRevisionSummary` / `ContentRevisionDetail`；暂不实现 Restore / Diff
- **职责边界保持** ✅：WorkflowEvent（流程时间线）/ AuditLog（系统审计）/ ContentRevision（历史内容快照）三者分离不混用；Revision 仅 Admin 可查，不公开暴露
- **Security** ✅：Revision API 均 `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` + `@ApiBearerAuth()`；无新公开 API、无权限/Role/数据泄露
- **Freeze 兼容** ✅：未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API；未新增 ContentWorkflowAction / ArticleWorkflow / KnowledgeWorkflow / SolutionWorkflow / CMS Scheduler / Revision Permission System
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（Web 未触碰 `apps/web`，仅验证）

## M18.4.3 Content Scheduled Publish Implementation（451）

- **M18.4.3 Content Scheduled Publish Implementation Started & Completed（451）**：基于 448 设计基线 + 449 前置整改 + 450 ContentRevision 基础，实施 Content 定时发布能力，满足「不新增 WorkflowAction / 不新增 Schedule 模型 / 不引入 CMS Scheduler / 保持 Content 单模型」
- **Content.scheduledPublishAt** ✅：`database/prisma/schema.prisma` `Content` 模型新增可空 `scheduledPublishAt DateTime?`（`@map("scheduled_publish_at")`）+ `(status, scheduledPublishAt)` 复合索引；生成并应用迁移 `20260812054723_m18_4_3_scheduled_publish`（`pnpm prisma migrate status` 显示 24 迁移、schema 同步、up to date；`m18_4_2_content_revision → m18_4_3_scheduled_publish` 顺序正确）
- **ContentSchedulerService** ✅：`apps/api/src/content/content.scheduler.ts` 新增轻量调度器——`onModuleInit` 启动 `setInterval`（60s，`unref` 不阻塞退出），`running` 标志防重入；仅扫描 `status=REVIEW AND scheduledPublishAt <= now()`，逐条复用 `ContentService.publish()`（不复制发布逻辑）；`ensureSystemUser()` 幂等创建 `system@visndt.com` 系统身份（无组织关联）作为执行主体保证可追踪
- **幂等与失败恢复** ✅：`ContentService.transition()` 改为原子条件更新（`updateMany where {id, status: from}`，count=0 视为已变更），并发/重复扫描下只产生一次 OPENED 与一次 STATUS_CHANGE；单条发布失败 catch 记录错误日志不阻塞其他内容，下一轮扫描自动重试，不修改 `scheduledPublishAt`
- **生命周期约束** ✅：`UpdateContentDto` 新增可空 `scheduledPublishAt`（`@IsDateString`）；`ContentService.update()` 仅允许 REVIEW 状态设置/清除，DRAFT/PUBLISHED/ARCHIVED 禁止；发布成功自动清除 `scheduledPublishAt`
- **WorkflowEvent 复用** ✅：自动发布产生 `action=OPENED`，metadata `{ scheduled: true, scheduledAt }`；无新增 WorkflowAction
- **AuditLog 复用** ✅：自动发布产生 STATUS_CHANGE，`oldValue:{status:REVIEW}` `newValue:{status:PUBLISHED, scheduled:true}`
- **Admin 定时发布配置 UI** ✅：`apps/admin/src/components/content/ContentScheduledPublish.tsx` 新增（REVIEW 状态选择时间/设置/清除 + 计划状态 Tag 展示），集成 `ContentEdit.tsx`；`content.types.ts` 新增 `scheduledPublishAt`
- **Security** ✅：Scheduler 无公开接口、不绕过审核、不新增 Role/Permission、不泄露 REVIEW/DRAFT 内容；Public Content API 仍强制 `status=PUBLISHED`
- **Freeze 兼容** ✅：未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API / ContentRevision；未新增 Schedule / SchedulerJob / ContentSchedule / PublishTask 模型；`apps/web` 未修改
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0；`apps/web` 无需修改（公开内容仍按 `status=PUBLISHED`）

## M18.4.4 Content Approval Timeline Enhancement（452）

- **M18.4.4 Content Approval Timeline Enhancement Started & Completed（452）**：基于现有 WorkflowEvent 实现 Content 审核历史查询，完成 M18.4 Workflow Operation Enhancement 阶段闭环；仅实现查询 + Admin 展示 + WorkflowEvent 查询增强
- **Backend 查询能力** ✅：`WorkflowEventsService.findContentTimeline(contentId)` 新增按 Content 的业务流程时间线查询——`where { entityType: CONTENT, entityId: contentId }`、`createdAt` 升序、投影 `id/action/operator(id,name)/metadata/createdAt`；Reviewer 复用 `WorkflowEvent.operatorId + User`（无 Reviewer/ApprovalUser/ContentReviewer 模型）
- **Admin 接口** ✅：新增 `GET /content/:id/approval-timeline`（`@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` + `@ApiBearerAuth()`，不公开）；由 `ContentController` 注入 `WorkflowEventsService` 提供
- **Admin Approval Timeline UI** ✅：`apps/admin/src/components/content/ContentApprovalTimeline.tsx` 新增（antd Timeline 展示 Created→Submitted→Reviewed→Published→Archived，每项显示 Action/Operator/Time/Status Transition），集成 `ContentEdit.tsx`「审核时间线」卡片；`content.service.ts` 新增 `getApprovalTimeline`，`content.types.ts` 新增 `ContentApprovalTimelineItem`/`ContentWorkflowAction`
- **职责边界保持** ✅：WorkflowEvent（业务流程时间线）/ AuditLog（系统审计）/ ContentRevision（版本快照）三者分离；Timeline 仅来源于 WorkflowEvent，不读取 AuditLog / Revision；仅展示不落地审批动作
- **Security** ✅：Timeline 接口 ADMIN-only、不公开；不返回 AuditLog / Revision 内容 / storageKey / 用户邮箱等敏感字段（operator 仅 id + name）
- **Freeze 兼容** ✅：无 schema / migration 变化；未改 WorkflowEvent Schema、WorkflowAction、Role、Permission、Notification、Public Content API、ContentRevision、`apps/web`
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0；`apps/web` 未修改（Not Required）

## M18.5 Content Operation Stabilization（453，稳定化基线审计）

- **M18.5.1 Content Operation Stability Audit（453）已完成**：M18.5 Stabilization Phase Started。对 M18.4 Content Operation Enhancement 全量能力执行稳定性审计，结论为达稳定运营状态（无高风险、无代码变更）
- **Database Stability** ✅：`schema.prisma` 中 Content（status/publishedAt/archivedAt/scheduledPublishAt + `(status, scheduledPublishAt)` 复合索引）、ContentRevision（`@@index([contentId, version])` + Content 1:N cascade）、WorkflowEvent（`@@index([entityType, entityId])`）、AuditLog 均一致；`pnpm prisma migrate status` → 24 migrations up to date
- **Workflow Boundary** ✅：WorkflowEvent（业务流程时间线，CREATED/SUBMITTED/REVIEWED/OPENED/CLOSED，metadata 仅含 to/scheduled，不存 old/new/快照）、AuditLog（系统审计，CREATE/UPDATE/STATUS_CHANGE，含 oldValue/newValue）、ContentRevision（版本快照，title/summary/content/SEO/coverImage，不含 workflow/audit）三层职责保持分离
- **Scheduler Reliability** ✅：`ContentSchedulerService` 分钟级扫描（仅 REVIEW + scheduledPublishAt<=now）、`running` 防重入、复用 `publish()`、transition 原子条件更新幂等、单条失败隔离 + 下轮重试、`system@visndt.com` 可追踪身份
- **Admin Operation** ✅：`ContentEdit.tsx` 完整组合「内容信息/生命周期按钮/内容表单/媒体管理/定时发布/审核时间线/版本历史」七个区块；Revision/Schedule/Timeline 组件均含错误处理、空状态、状态门控（仅 REVIEW 可配置定时发布）
- **API Contract** ✅：Content CRUD + submit/review/publish/archive + approval-timeline（ADMIN-only）+ Revision endpoints + public 读接口（仅 PUBLISHED）契约稳定
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（警告均为既有非阻断告警）
- **Code Change** ✅：None（本任务仅审计，未新增功能/Schema/Migration/WorkflowAction/Role/Permission/NotificationType/Public API/`apps/web`）

## M18.5.2 Content Operation Type & Bundle Optimization（454，稳定化优化）

- **M18.5.2 Content Operation Type And Bundle Optimization（454）已完成**：Content Operation Stability Optimization Completed。治理 453 审计中的非业务风险项（TypeScript 类型导入规范 + Admin Bundle 结构）
- **Type Import 优化** ✅：审计确认 453 所列 5 处组件层类型引用（RfqItem/DemandItem 等）已随类型重命名全部使用 `import type`，全局 `apps/admin/src` 无 value-style 类型导入残留，无需改动（已确认）
- **Bundle 优化** ✅：`ContentEdit.tsx` 将 ContentMediaManager / ContentRevisionHistory / ContentScheduledPublish / ContentApprovalTimeline 改为 `React.lazy` + `Suspense` 按需加载（`ContentForm` 保持急切加载为主表单）；`components/content/index.ts` 移除 4 个被 lazy 化的组件静态重导出（仅保留 ContentForm）
- **Bundle Size 对比** ✅：主 chunk `index-*.js` **1854.61 kB → 1844.77 kB**（gzip 562.89 → 559.82 kB）；新增 4 个独立 lazy chunk（ContentApprovalTimeline 1.45 kB / ContentScheduledPublish 1.54 kB / ContentRevisionHistory 3.66 kB / ContentMediaManager 4.41 kB），仅在 ContentEdit 渲染对应面板时按需加载
- **功能完整性** ✅：ContentEdit 七区块（内容信息/生命周期按钮/内容表单/媒体管理/定时发布/审核时间线/版本历史）能力不减少；Revision/Schedule/Timeline/Media 仅改为按需加载，未改业务逻辑/API 调用/权限判断/UI 交互流程
- **职责边界保持** ✅：WorkflowEvent（业务流程时间线）/ AuditLog（系统审计）/ ContentRevision（版本快照）职责不变
- **Freeze 兼容** ✅：无 schema / migration / API / 后端业务逻辑变化；未改 WorkflowAction / Role / Permission / Notification / Public Content API / `apps/web`
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0（vite 警告为既有非阻断告警）、`apps/web` build exit 0（Next 编译通过，警告为既有项）

## M18.5.3 Content SEO Operation Enhancement（455）

- **M18.5.3 Content SEO Operation Enhancement（455）已完成**：Content Operation Stabilization 阶段推进。增强 Admin Content SEO 管理能力（SEO 运营面板 + 质量提示 + 搜索结果预览），验证 Web 前台 SEO Metadata 输出链路。能力增强，不引入独立 SEO 系统。
- **SEO Operation Panel** ✅：`ContentEdit.tsx` 新增「SEO 运营面板」（`ContentSeoPanel`，`React.lazy` 按需加载，独立 chunk 3.71 kB），展示 SEO Title / SEO Description / SEO Keywords / Slug / Cover Image（封面图经 `fileAssetService.getSignedUrl` 渲染），与 Content Form 数据一致，复用现有 update API，不新增保存接口
- **SEO Validation（非阻断）** ✅：`ContentSeoPanel` 内置长度质量提示——SEO 标题建议 30-60 字符、SEO 描述建议 120-160 字符，状态为 符合建议/过短/过长/未设置（Tag 展示 + Alert 非阻断提示）；关键词为可选不强制
- **SEO Preview** ✅：新增 `ContentSeoPreview` 组件，Mock 搜索结果预览（Title / URL / Description），URL 按内容类型映射前台路由（KNOWLEDGE/SOLUTION 等）；仅展示，不生成 SEO
- **Web SEO 验证** ✅：审计确认 `apps/web` 知识/解决方案详情页 `generateMetadata` 已正确输出 `title` / `description` / `keywords` / `canonical`（alternates）/ OpenGraph / JSON-LD（Article/TechArticle），封面+媒体首图回退，Twitter Card 继承根布局；无缺失，无需修复
- **边界保持** ✅：SEO 信息继续属于 Content（seoTitle/seoDescription/seoKeywords）；未新增 SeoConfig/SeoKeyword/SeoHistory/SeoAnalytics 表、未新增 SEO Module/Service；WorkflowEvent/AuditLog/ContentRevision 职责不变；SEO 编辑仍复用 Content UPDATE AuditLog
- **Freeze 兼容** ✅：无 schema / migration / API / 后端业务逻辑变化；未改 WorkflowAction / Role / Permission / Notification / Public Content API
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0（vite 警告为既有非阻断告警）、`apps/web` build exit 0（Next 编译通过，警告为既有项）

## M18.5.4 Content Operation Final Audit（456）

- **M18.5.4 Content Operation Final Audit（456）已完成**：基于 448-455 基线执行 Content Operation 最终稳定性审计，**M18.5 Content Operation Stabilization Closed（阶段关闭）**。Audit First，无代码变更（Code Change None）。
- **Content Architecture** ✅：Content 实体（status/publishedAt/archivedAt/scheduledPublishAt/seoTitle/seoDescription/seoKeywords）完整；WorkflowEvent（业务时间线，仅 action+metadata，无快照/oldValue-newValue，CONTENT 实体豁免组织校验）、AuditLog（系统审计，CREATE/UPDATE/STATUS_CHANGE 含 operator/action/oldValue/newValue，不作为 Timeline 来源）、ContentRevision（内容快照，title/summary/content/SEO/coverImageId，不存 workflow 状态/approval timeline，contentId 1:N + version strategy max+1）三层职责边界无混用
- **Database / Migration** ✅：`pnpm prisma migrate status` → **24 migrations found，Database schema is up to date**；Content 索引（type+status/status/status+scheduledPublishAt）、ContentMedia（contentId+fileAssetId）、ContentRevision（contentId+version）合理
- **Workflow Reliability** ✅：Create（Content→WorkflowEvent CREATED→AuditLog CREATE→Revision v1，原子事务）；Update（DRAFT/REVIEW only→Revision v(n+1)→AuditLog UPDATE，原子事务）；Transition（原子 updateMany 条件更新保证幂等→WorkflowEvent→AuditLog STATUS_CHANGE）；Scheduler（仅 REVIEW + scheduledPublishAt≤now + running 锁 + 原子 transition + 失败隔离重试 + system 身份，无重复发布风险）；Timeline（WorkflowEvent.findContentTimeline，CONTENT 升序）
- **Admin Operation** ✅：ContentEdit 七区块完整——内容信息、生命周期操作（submit/review/publish/archive）、媒体管理、版本历史、定时发布、审核时间线、SEO 运营面板；加载/错误/空状态与权限控制均存在
- **Security** ✅：所有 Admin Content 接口 `@Roles(ADMIN)` + `@ApiBearerAuth()`；Public API（`/public`、`/public/:slug`）数据库层强制 `status=PUBLISHED` + `publicContentSelect` 显式投影（排除 status/archivedAt/authorId/scheduledPublishAt/工作流元数据），ThrottlerGuard 限流；Web SEO（knowledge/solutions generateMetadata 输出 title/description/keywords/canonical/OpenGraph/JSON-LD，无独立 SEO 架构）
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0（vite 大 chunk 警告为既有非阻断项）、`apps/web` build exit 0
- **Risk Assessment** ✅：无 High Risk；无 Medium Risk；Low 建议（非阻断）——Admin 主 chunk >500k 警告为既有项，可后续按需 manualChunks 优化（不属本阶段范围）

## M19 Product Experience Architecture Evolution（457-460，架构冻结）

- **M19 阶段定位**：产品体验架构重构阶段（非普通开发阶段），目标为产品体验重构、供应商能力展示、搜索体验升级、运营体系规划。
- **M19 架构冻结（457 平台能力重评审计）**：产品体系为 **A 平台标准产品库（Global Catalog）**；内容体系完整（High）；前端产品/供应商展示与参数筛选体验不足；确定 M19 前最高优先级为供应商展示断层与搜索能力闲置。
- **M19 架构再评估 Blueprint（458）**：推荐 **Product Global Catalog + Offer Supplier Display**；不默认引入 `Product.organizationId`；不新增 `ProductFamily/Model/SupplierOffering`；梳理 Web/Admin M19-M20 演进路线与 AI Readiness 底座（Embedding/Vector/RAG 为 M20 规划）。
- **M19 实施 Blueprint（459）**：冻结 Product Center 定位（工业检测设备标准产品目录 + 供应商能力展示 + 需求撮合 + 知识内容 + 未来 AI 选型入口）；定义产品列表/详情信息架构、动态参数搜索（ParameterDefinition 驱动）、Admin 产品运营中心、API 消费边界与数据复用原则（Backend Capability First，前端消费现有能力，零 Schema 变更）；拆分 M19.0-M19.4 阶段。
- **M19.1 Product Center V2 实施规划（460）**：细化产品列表（Category Navigation + Search + Dynamic Parameter Filter + Sort + Grid + Pagination）与详情（Overview / Media Center / Technical Specification / Certification / Supplier Capability / Inquiry Entry）信息架构；识别前端改造范围（lib/api/products.ts 需透传 parameterFilters、ProductParameters 需按 ParameterGroup 分组、询价需改选供应商、ManufacturerInfo 需接入 offers）；确认 **Schema Change = None / Migration = None / API Change = None**；拆分 7 项开发任务（P0-P2）。
- **M19 架构冻结结论**：保持 `Product Global Catalog + Offer Supplier Display`；禁止 `Product.organizationId`、`ProductFamily/Model/SupplierOffering`；**零 Schema 变更**；前端应消费后端已有能力（`GET /products` 参数筛选、`GET /products/:id` offers）。

## M19.1.1 Product Search Capability Frontend Integration（462，M19.1 Development 第一阶段）

- **M19.1.1 Started & Completed（462）**：基于 460 实施规划与 461 文档同步冻结结论，完成 Product Center V2 第一阶段能力接入——将后端已有产品搜索能力（`parameterFilters` 动态参数筛选）接入 Web 前端，`apps/web` build 通过（exit 0）。
- **API Client（透传 parameterFilters）** ✅：`apps/web/src/lib/api/products.ts` 新增 `buildProductsQuery()`，将 `parameterFilters` 序列化为后端 qs 括号记法（`parameterFilters[0][parameterDefinitionId]` / `[value]` / `[valueMin]` / `[valueMax]`），经 endpoint 透传 `GET /products`；**API Contract 未改**（复用后端已有参数筛选能力）。
- **Type Definition（扩展）** ✅：`apps/web/src/types/product.ts` 新增 `ParameterOption`、`ProductParameterFilter` 类型，`ProductSearchParams.parameterFilters` 复用 `ProductParameterFilter[]`，`ParameterDefinition` 增加可选 `options`（ENUM 选项）。
- **动态参数数据源** ✅：新增 API Wrapper `apps/web/src/lib/api/parameter-definitions.ts`（`getParameterDefinitions` / `getParameterDefinition`，均 public）+ Service `apps/web/src/services/parameter-definition.service.ts`（`getFilterParameterDefinitions` 前端合并 ENUM options，遵循 `Page → Service → API Wrapper → Backend API`）。
- **New Component（ParameterFilterPanel）** ✅：新增 `apps/web/src/components/products/ParameterFilterPanel.tsx`，由 `ParameterDefinition` 驱动，支持 NUMBER（范围 valueMin/valueMax，非法区间不提交）、ENUM（options 下拉）、STRING（文本精确）、BOOLEAN（是/否）；内联「清除」重置全部筛选；无硬编码业务参数（管径/像素/长度等）。
- **Product Filter / Page State 接入** ✅：`ProductFilter.tsx` 集成动态参数筛选区块；`app/products/page.tsx` 增加 `parameterFilters` state、`handleParameterFilterChange`（变更后重置 page=1）、Defined 数据 query、`parameterFilters` 纳入 react-query queryKey 与 `getProducts` 调用，实现「UI State → 筛选数组 → GET /products → 列表更新」可预测链路。
- **回归验证** ✅：原有关键词搜索、分类筛选、排序、分页均保持正常；`/products` 路由正常生成（5.46 kB）。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；未引入 `Product.organizationId` / `ProductFamily` / `ProductModel` / `SupplierOffering`；未触碰 Product Detail（`products/[slug]`）、Supplier Display、Admin。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`；未引入 Design System / AI Search / Vector Search / ProductFamily / Supplier Product Ownership。
- **Build** ✅：`apps/web` `next build` exit 0（首次告警为既有机身 SWC Native DLL 环境警告 + 过时 `.next` 缓存，清理 `.next` 后全阶段成功；类型校验通过，仅既有非阻断 lint 警告）。

## M19.1.4 Product Center V2 Experience Stabilization（465，M19.1 Development 收尾）

- **M19.1.4 Started & Completed（465）**：基于 459-464 冻结结论，完成 Product Center V2 全链路体验稳定化——产品列表空状态/结果统计/筛选指示、详情页 section 结构一致性/空数据状态、询价错误状态重试，`apps/web` build 通过（exit 0）。
- **产品列表体验优化** ✅：新增结果计数（"共 N 个产品"）；空状态区分「无筛选结果」（搜索图标 + 调整筛选建议）与「无产品」（包裹图标 + 建设中文案）；`ParameterFilterPanel` 清除按钮显示激活筛选数（"清除 (N)"）。
- **产品详情页结构一致性** ✅：添加 `id` 锚点（`#media`/`#overview`/`#specifications`/`#documents`）；技术参数无数据时显示 `EmptyState` 空状态；文档与证书无数据时同样显示空状态。
- **询价错误状态完善** ✅：`InquiryForm` 错误状态新增「重新填写」按钮，提交失败后可直接恢复表单。
- **通用组件增强** ✅：`EmptyState` 组件升级为支持图标（search/package/document/default）+ 描述文案，提升全站空状态一致性。
- **回归验证** ✅：产品列表分类筛选、参数筛选、排序、分页均正常；产品详情 Overview / Media / Specs / Supplier / Inquiry / Documents 全链路正常；`/products` 路由 6.17 kB，`/products/[slug]` 路由 4.38 kB。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；`ProductCard` 仅消费 `Product` 类型可用字段；未触碰 Admin / Backend / Database。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；仅既有非阻断 lint 警告。

## M19.2.0 Supplier Display Capability Architecture Audit（466，M19.2 开发前架构审计）

- **M19.2.0 Audit Started & Completed（466）**：基于 457-465 历史报告冻结结论，对 M19.2 Supplier Display Capability Enhancement 进行开发前架构审计，审计通过，M19.2 进入开发阶段。**Code Change = None / Schema Change = None**。
- **Repository Verification** ✅：`F:\Desktop\VISNDT`（main branch），工作区未提交修改为既有 M18.5 文件，不影响历史任务。
- **M19.1 Completion Verification** ✅：462-465 全部完成，产品列表/详情/供应商/询价全链路体验稳定化。
- **Database Capability Assessment** ✅：Product → Offer → Organization 关系链完整；Organization 当前 name/type/status 可支撑基础 Supplier Display；**Zero Schema Change 可行**。
- **API Capability Assessment** ✅：`GET /products/:id`（含 offers + organization）、`GET /organizations/:id`（public）、`GET /offers`（public）可复用；M19.2 可基于现有 API 完成，无需新增端点。
- **Frontend Capability Assessment** ✅：`SupplierCapabilityList` / `SupplierInquirySection` / `ManufacturerInfo` 基础组件已完成（M19.1.2-3），可作为 M19.2 增量增强基础；未来入口：Public Supplier Page（P0）/ Product Detail Enhancement（P1）/ Workspace Supplier Center（P2）。
- **Architecture Decision** ✅：继续 `Product Global Catalog + Offer Supplier Display`；禁止 Product.organizationId / SupplierStore / Marketplace / Transaction；Supplier = Capability Provider。
- **M19.2 Development Boundary** ✅：P0 — Public Supplier Capability Page（`/suppliers/[id]`）；P1 — Product Detail Supplier Section Enhancement；P2 — Workspace Supplier Display Management。
- **Risk Assessment** ✅：No High Risk；Medium — Organization 字段不足（可通过前端展示优化缓解）、Offer 数据质量依赖；Low — 架构冻结突破、功能蔓延。
- **SEO / Content Relationship** ✅：Supplier Display 不直接依赖 Content Center；Supplier 页面 SEO 可复用 M16.3 模式；Content Center 与 Supplier 关联为 M19.3+ 规划。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.2.1 Supplier Capability Page Development（467，M19.2 Development 第一阶段）

- **M19.2.1 Started & Completed（467）**：基于 466 审计结论，完成 Public Supplier Capability Page 开发——新增 `/suppliers/[id]` 路由、`SupplierPublicProfile` 组件、`SupplierOfferList` 组件、API 与服务层封装，`apps/web` build 通过（exit 0）。
- **Supplier Public Page** ✅：新增 `app/suppliers/[id]/page.tsx`（动态路由，server-rendered），包含 Breadcrumb 导航、SupplierPublicProfile 区块、SupplierOfferList 区块；支持 `generateMetadata` 动态 SEO。
- **SupplierPublicProfile** ✅：新增 `components/supplier/SupplierPublicProfile.tsx`，展示 organization.name（首字母头像）、organization.type（中文标签）、organization.status（状态徽章）；使用 API 真实字段，不虚构不存在字段。
- **SupplierOfferList** ✅：新增 `components/supplier/SupplierOfferList.tsx`，展示供应商 Offer 列表（title/description/status），支持点击跳转对应产品详情页；空状态显示 EmptyState（"暂无供应产品"）。
- **API Wrapper** ✅：新增 `lib/api/offers.ts`（`getOffers`，支持 `organizationId` 过滤），遵循现有 `apiClient` 模式。
- **Service Layer** ✅：新增 `services/organization.service.ts`、`services/offer.service.ts`，遵循 `Page → Service → API Wrapper → Backend API` 分层。
- **Backend Adaptation** ✅：`SearchParamsDto` 新增 `organizationId` 可选参数（`IsOptional`/`@IsString`）；`OffersService.findAll` 新增 `organizationId` where 过滤；`OrganizationsService.findOnePublic` 新增 `status`/`createdAt`/`updatedAt` 返回字段。**Schema Change = None / Migration = None**。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；Supplier = Capability Provider；未引入 `Product.organizationId` / SupplierStore / Marketplace / Transaction；未展示 Price / Inventory / 交易状态。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None**；未改 `database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；`/suppliers/[id]` 路由 164 B（ƒ dynamic）；仅既有非阻断 lint 警告。

## M19.2.2 Product Detail Supplier Section Enhancement（468，M19.2 Development 第二阶段）

- **M19.2.2 Started & Completed（468）**：基于 466-467 冻结结论，增强 Product Detail 页面供应商展示能力——ManufacturerInfo 和 SupplierCapabilityList 新增供应商主页链接，建立 Product Detail → Supplier Public Profile 公开浏览链路。**Code Change = Minimal（Frontend only）**。
- **ManufacturerInfo Enhancement** ✅：新增「查看供应商详情 →」链接（`/suppliers/[organizationId]`），位于制造商信息卡片底部，分隔线区隔，点击跳转至 Supplier Public Profile 页。
- **SupplierCapabilityList Enhancement** ✅：每个供应商卡片底部新增「供应商主页」链接（`/suppliers/[organizationId]`），使用 `e.stopPropagation()` 防止触发展开选择，点击跳转至 Supplier Public Profile 页。
- **Supplier Information Source** ✅：所有 Supplier Display 数据保持 `Offer.organization` 为唯一来源，未使用 `Product.createdBy.organization`。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；Product → Offer → Organization → Supplier Public Profile；未引入 `Product.organizationId` / SupplierStore / Marketplace / Transaction。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；`/products/[slug]` 路由 4.51 kB；仅既有非阻断 lint 警告。

## M19.2.3 Pre-Audit Workspace Supplier Display Management Architecture Audit（469，M19.2 开发前架构审计）

- **M19.2.3 Pre-Audit Started & Completed（469）**：基于 466-468 完成状态，对 M19.2.3 Workspace Supplier Display Management 进行开发前架构审计，审计通过。**Code Change = None**。
- **Workspace Capability Audit** ✅：Workspace API 为 RFQ/Response 协作导向（`GET /workspace/supplier/overview` / `rfqs` / `responses`），无 Offer 管理、无 Profile 管理 API；`PATCH /organizations/:id` 仅 ADMIN，Supplier 不可自助更新 Profile；`PATCH /offers/:id` 已支持 org-scoped 更新。
- **Database Capability Audit** ✅：Organization（name/type/status）+ Offer（title/description/status）+ OrganizationMember（role）可支撑基础 Display Management；**Zero Schema Change 可行**。
- **API Capability Audit** ✅：可复用 `GET /organizations/:id`（读取 Profile）+ `GET /offers?organizationId=`（读取自有 Offer）+ `PATCH /offers/:id`（更新 Offer 状态）；无需新增 API 端点。
- **Frontend Capability Audit** ✅：`/dashboard/supplier` Domain Navigation 可扩展「展示管理」入口；`SupplierPublicProfile` / `SupplierOfferList` 组件可复用；`WorkspaceSidebar` / `WorkspaceHeader` 布局可复用。
- **M19.2.3 Development Boundary** ✅：M19.2.3a — Supplier Display Management（Read-Only View）——Profile Preview（只读）+ Offer Management（状态管理）；禁止 Profile 编辑（需 ADMIN）、禁止 Schema 变更、禁止 Supplier Store/Marketplace。
- **Architecture Decision** ✅：继续 `Product Global Catalog + Offer Supplier Display`；Supplier = Capability Provider；M19.2.3 可保持 Zero Schema Change + Zero API Change。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.2.3 Information Architecture Audit（470，M19.2.3 信息架构冻结）

- **M19.2.3 Information Architecture Audit Started & Completed（470）**：基于 466-469 完成状态，完成 Supplier Display Management 信息架构冻结——设计 7 模块页面结构（Display Overview / Company Identity / Capability Overview / Product Capability / Offer Management / Public Preview / Display Completeness），输出现有字段能力矩阵（50+ 字段评估），冻结 M19.2.3 开发边界。**Code Change = None**。
- **Information Architecture Design** ✅：页面结构 7 模块（概览 / 企业身份 / 能力概览 / 产品能力 / 供应管理 / 公开预览 / 展示完整度）；路由 `/workspace/supplier/display`；Dashboard Domain Navigation 新增「展示管理」入口。
- **Supplier Display Data Matrix** ✅：输出 7 模块 × 50+ 字段评估矩阵——Each=Existing 字段可直接支持（Organization 6/Offer 10/Product 3/ProductCategory 2/OrganizationMember 3/Inquiry 3）；Missing（logo/description/website/location）标记为 M19.3+ Future Enhancement。
- **Capability Classification** ✅：Existing Capability（35+ fields 可直接支持）→ Frontend Derived（Display Completeness / Product Coverage / Category Coverage 无需 Schema）→ Future Enhancement（6 fields 需独立 Schema/API 审计，M19.3+）。
- **Semantic Freeze** ✅：所有展示语义使用「Products Supplier Can Provide」，禁止「Supplier Products / Store Products」；Supplier = Capability Provider。
- **Architecture Decision** ✅：继续 `Product Global Catalog + Offer Supplier Display`；Zero Schema Change 可行；Zero API Change 可行；5 个现有 API 可复用。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.2.3 Workspace Supplier Display Management Development（471，M19.2.3a Development）

- **M19.2.3 Development Started & Completed（471）**：基于 466-470 完成状态，完成 Supplier Display Management 工作台开发——Dashboard Domain Navigation 新增「展示管理」入口，`/workspace/supplier/display` 页面实现 5 模块（Display Overview / Company Identity / Product Capability / Offer Management / Public Preview）。**Code Change = Frontend only**。
- **Dashboard Navigation** ✅：`/dashboard/supplier` Domain Navigation 新增「展示管理」入口（图标 📋，跳转 `/workspace/supplier/display`）。
- **Module 1 — Display Overview** ✅：统计卡片（活跃 Offer / 产品覆盖 / RFQ / 展示完整度），前端计算 Display Completeness（5 项检查）。
- **Module 2 — Company Identity** ✅：只读展示 Organization 信息（name/type/status/createdAt/updatedAt），含公开页面链接。
- **Module 3 — Product Capability** ✅："Products Supplier Can Provide" 列表（Offer → Product → ProductCategory），语义合规。
- **Module 4 — Offer Management** ✅：Offer 表格（标题/描述/状态/关联产品/时间），只读展示。
- **Module 5 — Public Preview** ✅：复用 SupplierPublicProfile + SupplierOfferList，预览公开页面效果。
- **Component Reuse** ✅：复用 SupplierPublicProfile / SupplierOfferList / WorkspaceSidebar / WorkspaceHeader / StatCard / EmptyState / ErrorState / Loading；无重复组件。
- **Architecture Freeze** ✅：继续 `Product Global Catalog + Offer Supplier Display`；Supplier = Capability Provider；未引入 Supplier Store / Marketplace / Transaction。
- **Zero Impact** ✅：**Schema Change = None / Migration = None / New API = None**；仅前端新增 1 文件 + 修改 1 文件。
- **Build** ✅：`apps/web` `npx next build` exit 0（编译 + 类型校验通过，33/33 静态页，`/workspace/supplier/display` 5.41 kB）；仅既存非阻断 lint 警告（no-page-custom-font / no-img-element / no-unused-vars）。

## M19.2.4 Supplier Display Capability Closure Audit（472，M19.2 闭环审计）

- **M19.2.4 Closure Audit Started & Completed（472）**：对 M19.2 阶段进行最终闭环审计——验证 466-471 全部完成、Architecture Freeze 保持、Data Flow 链路完整、Frontend 8 项能力全部就绪、Component/API/Permission 边界清晰、Schema/Migration 均 None。**M19.2 CLOSED**。**Code Change = None**。
- **Architecture Freeze** ✅：Product Global Catalog（Product 无 organizationId/supplierId）+ Offer Supplier Display（Offer.organizationId + Offer.productId）+ Supplier = Capability Provider。
- **Data Flow** ✅：Product → Offer → Organization → Supplier Public Profile → Workspace Display Management 完整链路。
- **Frontend Capability Matrix** ✅：8 项能力全部就绪——Product Detail Supplier Display / Product→Supplier Navigation / Public Profile / Dashboard Nav / Display Overview / Company Identity / Product Capability / Offer Management / Public Preview。
- **Component Boundary** ✅：三层边界清晰（components/products / components/supplier / components/workspace），无组件逻辑复制。
- **API Boundary** ✅：5 个现有 API 可复用，100% 无新增端点。
- **Permission Boundary** ✅：Supplier 可查看自身展示 + 管理 Offer；禁止修改 Organization Profile（ADMIN only）；Public 可查看公开页面。
- **M19.2 Closure Decision** ✅：**READY FOR CLOSE**——全部 6 任务完成、架构冻结保持、Zero Schema Change、Zero New API、Supplier 定位正确、无 Supplier Store/Marketplace。
- **Future Enhancement** ✅：M19.3+ 候选（Organization Profile 编辑/Logo/Description/Website/Display Ranking/AI）标记为记录，不进入开发。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.3.0 Search Experience Enhancement Architecture Audit（473，M19.3 开发前架构审计）

- **M19.3.0 Audit Started & Completed（473）**：基于 M19.2 CLOSED 状态，对 M19.3 Search Experience Enhancement 进行开发前架构审计——明确 VISNDT 搜索体系定位为「Industrial Inspection Capability Discovery（工业检测能力发现）」，冻结搜索信息架构，划定四类搜索边界，评估现有能力，确认零 Schema/API 变更。**Code Change = None**。
- **Search Positioning** ✅：VISNDT Search = Industrial Inspection Capability Discovery（工业检测能力发现），不等于普通电商搜索；禁止定位为商品商城搜索 / 店铺搜索 / 卖家搜索。
- **Search Domain Boundary** ✅：四类搜索边界明确——Product Search（检测设备寻找，数据源 Product/ProductCategory/ProductParameter）、Supplier Capability Search（供应能力寻找，数据源 Offer/Organization/Supplier Public Profile，Supplier = Capability Provider）、Knowledge Search（内容资产搜索，数据源 Content，未来规划，当前不开发）、Matching Search（需求匹配，保持 RFQ Matching Domain，禁止合并为普通 Search）。
- **Search Information Architecture** ✅：四层 IA 冻结——Product Discovery（Keyword Search / Category Filter / Parameter Filter / Product Detail）→ Supplier Capability Discovery（Supplier Identity / Capability / Offer Coverage / Public Profile）→ Knowledge Discovery（Articles / Solutions / Technical Knowledge，未来规划）→ Matching Discovery（Demand / RFQ / Match Result，独立域）。
- **Existing Capability Assessment** ✅：
  - Product Search：后端 `GET /products` 支持 keyword（name/model/description）+ categoryId + parameterFilters（AND 逻辑，精确匹配/数值范围）+ sortBy/sortOrder + pagination；前端 `/products` 已集成 SearchBar + ProductFilter（分类+动态参数筛选 NUMBER/ENUM/STRING/BOOLEAN）+ ProductGrid（结果计数+空状态）+ Pagination；**Capability = Existing，M19.3 仅需 UX 增强**。
  - Supplier Capability Search：后端 `GET /organizations/:id`（public）+ `GET /offers?organizationId=`（keyword 搜索 title/description）；前端 `/suppliers/[id]`（SupplierPublicProfile + SupplierOfferList）；**Capability = Partial**——无 Supplier 列表/搜索页，Supplier 发现仅通过 Product Detail → Supplier Public Profile 间接链路；M19.3 可新增 Supplier Discovery Entry。
  - Knowledge Search：后端 `GET /content/public`（仅 PUBLISHED，type 筛选+分页）；前端 `/knowledge`、`/solutions` 列表页（无搜索 UI）；**Capability = Missing**——M19.3 仅规划边界，不开发。
  - Matching Search：后端 Demand/Match API 已存在；前端 Buyer Workspace 内；**Capability = Existing**——保持 RFQ Matching Domain，不纳入通用搜索。
- **Search Engine Decision** ✅：**Database Query First**——当前数据规模不需 Elasticsearch/Algolia/Meilisearch；`GET /products` 已支持 keyword + category + parameterFilters + sort + pagination，满足当前搜索需求；引入搜索引擎为 M20+ 规划。
- **M19.3 Development Boundary** ✅：
  - **Included**：Product Search UX Enhancement（搜索框/建议/高亮/无结果引导）、Filter Experience Enhancement（筛选状态持久化/URL 同步/筛选面包屑/清除全部）、Search Result UX（结果计数/排序优化/Loading Skeleton/空状态区分）、Supplier Discovery Entry（产品搜索页 Supplier 入口/`/suppliers` 列表页）。
  - **Excluded**：Knowledge CMS / AI Search / Semantic Search / Vector Database / Intelligent Recommendation / Elasticsearch / 第三方搜索服务。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**；M19.3 完全基于现有 API 能力，前端消费后端已有能力（Backend Capability First）。
- **Architecture Decision** ✅：**M19.3 Search Experience Enhancement Architecture Ready**——搜索边界冻结、四层 IA 明确、现有能力可支撑、零 Schema/API 变更、Database Query First、Development Allowed。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.3.1 Search Experience Development（474，M19.3 第一阶段搜索体验增强）

- **M19.3.1 Development Started & Completed（474）**：基于 473 已冻结的搜索架构，完成 VISNDT 工业检测能力发现（Industrial Inspection Capability Discovery）的第一阶段搜索体验增强。**Code Change = Frontend Only**。
- **Search Input Enhancement** ✅：`SearchBar.tsx` 新增清除 (X) 按钮 + `initialValue` prop（URL 恢复）+ `onClear` 回调 + 输入框 focus 自动恢复；用户明确知道当前搜索关键词。
- **Search State Management (URL Sync)** ✅：`products/page.tsx` 全面改写——使用 `useSearchParams` + `useRouter` 实现 URL Query State Sync（keyword/categoryId/sortBy/sortOrder/page/pf），支持浏览器前进/后退、页面刷新状态保持、可分享搜索 URL；`router.replace` 避免浏览器历史膨胀。
- **Active Filter Chips** ✅：搜索结果区域上方新增 Active Filter Chips（关键词/分类/参数筛选），每个 Chip 可单独清除，底部「清除全部」一键重置；侧边栏 `ProductFilter` 新增 `hasActiveFilters` + `onClearAll` 双入口清除。
- **Keyword Highlight** ✅：新增 `HighlightText.tsx` 组件——前端仅关键字高亮（case-insensitive），`<mark>` 标签 amber 背景色；`ProductCard` 集成 name/model/description 三字段高亮。**零后端修改**。
- **Supplier Discovery Entry** ✅：`ProductCard` 底部新增「查看供应商能力」入口（图标 + 文字），为 M19.3.2+ Supplier Discovery 建立预留位置；hover 时颜色联动 Product Card 交互。
- **Search Result Experience** ✅：`ProductGrid` 已有 result count + loading skeleton + empty state（区分筛选/无数据），本次增强 `searchKeyword` prop 透传至 ProductCard 以支持关键词高亮。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**；完全基于现有 `GET /products` API 能力，纯前端消费后端已有能力（Backend Capability First）。
- **Architecture Freeze 兼容** ✅：**Product Global Catalog + Offer Supplier Display 保持**；未修改 `apps/api`、`database/prisma`、`apps/admin`；未引入 Elasticsearch/Algolia/第三方搜索服务；未新增 Search API；未修改 SearchProductDto；未修改 Prisma Schema。
- **Build** ✅：`apps/web` `npx next build` exit 0，type check 通过，33 static pages 生成，`/products` 7.68 kB；pre-existing ESLint warnings only（layout fonts, img element, unused var）。

## M19.3.2 Search Experience Enhancement Development（475，Search Result UX） + M19.3.2.1 Boundary Correction（476）

- **M19.3.2 Development Started & Completed（475）**：基于 473-474 已冻结的搜索架构与 Product Search UX 增强，完成 VISNDT 工业检测能力发现（Industrial Inspection Capability Discovery）的搜索体验增强——Search Result UX 增强。**Code Change = Frontend Only**。
- **Search Result UX Enhancement** ✅：
  - **Loading Skeleton** ✅：`ProductGrid.tsx` 新增 `isLoading` 状态——加载中显示头部骨架屏（`animate-pulse`）+ 6 个产品卡片骨架屏。
  - **Empty State Enhancement** ✅：`ProductGrid.tsx` 空状态根据场景动态展示——有筛选条件时区分"未找到匹配产品"（带关键词上下文）vs "暂无产品"（无筛选时"产品目录正在建设中"）。
  - **Result Count Context** ✅：`ProductGrid.tsx` 结果计数增加搜索上下文展示。
  - **Pagination Navigation** ✅：`Pagination.tsx` 新增页码指示器（`currentPage / totalPages`）。
- **Supplier Discovery Entry** ✅：`ProductCard.tsx` 底部「查看供应商能力」Link（`/products/${product.id}#suppliers`），保持 Product-driven Capability Discovery。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**。
- **Architecture Freeze 兼容** ✅：**Product Global Catalog + Offer Supplier Display 保持**。

- **M19.3.2.1 Boundary Correction（476）**：475 中新增的 `/suppliers` 公开供应商列表页违反了 Supplier = Capability Provider 架构原则，形成了 Public Supplier Directory。**Code Change = Frontend Only**。
- **Boundary Correction Actions** ✅：
  - **Deleted** ✅：`apps/web/src/app/suppliers/page.tsx`——公开供应商列表页（`/suppliers`）已删除，消除 Public Supplier Directory 入口。
  - **Removed Entry** ✅：`apps/web/src/app/products/page.tsx` 头部「浏览供应商能力」Link（→ `/suppliers`）已删除。
  - **Kept Product-driven** ✅：`ProductCard.tsx`「查看供应商能力」→ `/products/${product.id}#suppliers`（Product Context 驱动），保持。
  - **Kept Supplier Profile** ✅：`/suppliers/[id]` 保持为 Supplier Public Capability Profile（非 Directory）。
- **Correct Discovery Flow** ✅：`Product Search → Product Detail → Supplier Capability Section → Supplier Public Profile`（Find Product → Discover Capability Provider）。
- **Forbidden Flow Removed** ✅：`/suppliers` (Supplier Directory → Browse Suppliers → Choose Supplier) 已删除。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**。
- **Build** ✅：`apps/web` `npx next build` exit 0，type check 通过，`/suppliers` 静态页已移除；pre-existing ESLint warnings only。

## M19.3.3 Search Experience Enhancement Closure Audit（477，M19.3 Final Closure）

- **M19.3.3 Closure Audit Started & Completed（477）**：基于 473-476 基线，执行 M19.3 Search Experience Enhancement 最终闭环审计。**Code Change = None（Audit Only）**。
- **Architecture Closure Verification** ✅：
  - **Industrial Capability Discovery** ✅：搜索定位保持，非 E-Commerce Search。
  - **Product Search** ✅：Keyword + Category + Parameter Filter + Sort + Pagination，基于 `GET /products`。
  - **Supplier Capability Discovery** ✅：Product → Offer → Organization → Supplier Capability Profile（`/suppliers/[id]`），Product-driven。
  - **No Supplier Directory** ✅：`/suppliers` 已删除，仅保留 `/suppliers/[id]` Capability Profile。
  - **No Marketplace** ✅：无 Supplier Store / Ranking / Seller。
  - **No Search Engine** ✅：Database Query First，未引入 Elasticsearch / Algolia / Meilisearch。
  - **No AI Search** ✅：未引入 Vector / Semantic / AI Search。
  - **Knowledge Search** ✅：Content Search 未进入 M19.3，保持独立域。
  - **Matching Search** ✅：Demand → DemandMatch → RFQ 保持独立域，未合并为 General Search。
- **476 Correction Verified** ✅：`/suppliers` 公开供应商列表页已删除；`/products` 头部供应商入口已移除；ProductCard 保持 `/products/${id}#suppliers`（Product-driven）。
- **Route Verification** ✅：允许的路由 `/products`、`/products/[slug]`、`/suppliers/[id]`、`/knowledge`、`/solutions`；`/suppliers` 不存在。
- **Component Boundary** ✅：`components/products`（Product）、`components/supplier`（Supplier Profile）、`components/workspace`（Workspace）无职责混乱，无 Supplier Directory / Marketplace UI。
- **API/Schema Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（473-476 全部确认）。
- **Documentation Synchronized** ✅：PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md / BUSINESS_CAPABILITY_MAP.md 全部同步。
- **Decision** ✅：**M19.3 Search Experience Enhancement — CLOSED**。Architecture FROZEN。Code State = Documentation State。Next Stage: M19.4 Admin Product Operation Center。

## M19.4.0 Admin Product Operation Center Architecture Audit（478，M19.4 Architecture Audit）

- **M19.4.0 Architecture Audit Started & Completed（478）**：基于 M19.3 CLOSED 状态，对 VISNDT Admin Product Operation Center 进行开发前全面架构审计。**Code Change = None（Audit Only）**。
- **Admin Positioning** ✅：**Admin = Platform Governance Center**（数据治理 + 内容治理 + 产品治理 + 供应商治理 + 运营审计），非 Supplier Store Management / Transaction Management。
- **Admin Frontend Capability Audit** ✅：Admin 前端已有 18 类管理能力——Dashboard（stats/activities/pending/status）、Product CRUD + Media、Category CRUD、ParameterGroup CRUD、ParameterDefinition CRUD、User CRUD、Organization CRUD、Demand List/Detail/Edit、Matching Monitor + Match Detail、RFQ CRUD、RFQ Response Detail、Offer List/Detail、Inquiry List/Detail、Notification List/Detail、FileAsset Orphan Cleanup、AuditLog List、Content CRUD（含 Markdown 编辑 + Media + Revision History + Scheduled Publish + SEO + Approval Timeline）。
- **Database Governance Audit** ✅：Prisma Schema 完整审计——28 个模型全覆盖（Product Domain 8 个、Supplier Capability Domain 3 个、Demand/Matching Domain 5 个、Content Domain 3 个、Governance Domain 4 个、Identity Domain 4 个、Inquiry 1 个）。
- **Entity Ownership** ✅：Product = Platform Global Catalog（无 supplierId/organizationId）；ProductCategory/ParameterDefinition = Platform；Offer = Supplier Capability（organizationId → Organization）；Content = Platform；Organizations = Supplier Identity。
- **Relation Boundary** ✅：Product → Offer → Organization 间接关联保持；Product 无直接 Organization 绑定；Demand → DemandMatch → RFQ 独立匹配域。
- **Lifecycle State** ✅：Offer（OfferStatus enum: DRAFT/ACTIVE/INACTIVE/SUBMITTED/ACCEPTED/REJECTED/WITHDRAWN）；Content（ContentStatus enum: DRAFT/REVIEW/PUBLISHED/ARCHIVED）；Demand（DemandStatus enum）；RFQ（RFQStatus enum）。Product.status 当前为 String 字段（"DRAFT"），非正式 ProductStatus enum——**Future Candidate**。
- **Audit/Workflow Capability** ✅：AuditLog（entityType + action + oldValue/newValue JSONB + operatorId + ipAddress）；WorkflowEvent（entityType + action + operatorId + metadata JSONB）；FileAsset（entityType + fileType + storageKey + uploadedBy）。
- **API Capability Audit** ✅：后端 API 全覆盖——Products（CRUD + batch）、Offers（CRUD + lifecycle submit/accept/reject/withdraw）、Organizations（CRUD + batch）、Content（CRUD + lifecycle submit/review/publish/archive + public + approval-timeline）、Admin Dashboard（stats/activities/pending/status）、Admin Inquiry（CRUD + batch）、Admin Demand（PATCH）、Admin Matching（stats）、Admin AuditLog（list/detail）、ProductCategories/ParameterGroups/ParameterDefinitions（CRUD）、FileAsset（upload + orphan cleanup）、Users（CRUD）、Notifications（CRUD）、Workspace（aggregated APIs）。
- **Permission Boundary** ✅：Admin API 使用 `@Roles(Role.ADMIN)` + `RolesGuard`，Admin 仅允许 Platform Governance，禁止 Supplier Identity Modification / Supplier Operation Impersonation。
- **Schema Impact Assessment** ✅：**Schema Change = None / Migration = None / API Change = None**（M19.4 可基于现有数据模型开发）。
- **M19.4 Development Boundary** ✅：Allowed——Admin Product Management Enhancement、Category Governance、Parameter Governance、Content Governance、Operation Audit Enhancement；Not Included——Supplier Store / Marketplace / Transaction / ERP / Inventory / Order / Payment / SKU。
- **Decision** ✅：**M19.4 Admin Product Operation Center — Architecture Audit PASS**。现有 Admin 基础设施完备（18 类管理能力 + 28 个 Prisma 模型 + 全 CRUD API + RBAC + AuditLog + WorkflowEvent），M19.4 可基于现有数据模型开发，无需 Schema/API 变更。Next Step: M19.4.1 Pre-Development Design Audit。

## M19.4.1 Admin Product Operation Center Pre-Development Design Audit（479，M19.4 Design Freeze）

- **M19.4.1 Pre-Development Design Audit Started & Completed（479）**：基于 478 架构审计，执行开发前设计审查。**Code Change = None（Audit Only）**。
- **Design Freeze** ✅：
  - **Admin Positioning** ✅：Admin = Platform Governance Center（数据治理 + 产品治理 + 内容治理 + 供应商能力审查 + 运营审计），非 Supplier Store / Marketplace / ERP / Transaction。
  - **Product Governance Boundary** ✅：Allowed——Catalog Governance（Product CRUD）、Parameter Governance（ParameterGroup/Definition/Option）、Media Governance（ProductMedia/FileAsset）、Lifecycle Planning（Product.status 评估）；Forbidden——Supplier Store / Marketplace / Transaction / ERP / Inventory / Order / Payment / SKU。
  - **Product Ownership** ✅：Product = Global Platform Catalog（无 organizationId / supplierId / ownerId），Product → Offer → Organization 间接关联。
  - **Supplier Boundary** ✅：Supplier = Capability Provider，Admin 仅允许 Review Supplier Capability（查看 Offer/Organization），禁止 Supplier Store / Product Ownership / Inventory / Pricing。
  - **Lifecycle Governance** ✅：Product.status 当前为 `String @default("DRAFT")`（非正式 ProductStatus enum），WorkflowEntityType 无 PRODUCT 条目。**Future Candidate**：M19.4.x Product Lifecycle Governance Audit（不在此阶段修改 Schema）。
  - **Audit Governance** ✅：AuditLog（entityType + action + oldValue/newValue JSONB + operatorId + ipAddress）统一治理。无 ProductHistory / SupplierHistory / CustomOperationLog 等冗余模型。
  - **File Governance** ✅：FileAsset 统一文件管理。无 ProductImage / SupplierLogoAsset / StoreMedia 等重复模型。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（Design Freeze 阶段，不修改任何数据模型或 API）。
- **M19.4 Development Boundary Freeze** ✅：
  - **Allowed**：Admin Product Management Enhancement（Product CRUD + Media CRUD + Category CRUD + Parameter CRUD）、Category Governance、Parameter Governance、Content Governance（已有完备 CRUD）、Operation Audit Enhancement。
  - **Excluded**：Supplier Store / Marketplace / Transaction / ERP / Inventory / Order / Payment / SKU / Price Management。
- **Decision** ✅：**M19.4.1 Design Freeze — PASS**。Admin Product Operation Center 开发边界明确，现有基础设施满足开发需求，零 Schema/API 变更。Next Step: M19.4.2 Admin Product Operation Center Development。

## M19.4.2 Admin Product Operation Center Development（480，M19.4 Development）

- **M19.4.2 Development Started & Completed（480）**：基于 478 架构审计与 479 设计冻结结论，完成 Admin Product Operation Center 前端治理能力增强。**Code Change = Frontend Only（apps/admin）**。
- **Product Governance Enhancement** ✅：`ProductList.tsx` 新增治理统计卡片（产品总数/已上架/草稿/已下架/分类数）+ 分类筛选下拉框 + 面包屑导航；`ProductDetail.tsx` 新增面包屑导航 + 媒体资源/参数/供应能力统计卡片。
- **Category Governance Enhancement** ✅：`ProductCategoryList.tsx` 新增分类治理统计卡片（分类总数/树深度/叶子分类），树形统计基于客户端递归计算，不依赖后端新增接口。
- **Parameter Governance Enhancement** ✅：`ParameterGroupList.tsx` 新增参数治理统计卡片（参数组数量/参数定义数量），通过已有 API 获取总数。
- **Media Governance Enhancement** ✅：`ProductMediaList.tsx` 新增媒体治理统计卡片（媒体总数/图片/文档/证书数量），按 mediaType 分组统计。
- **Architecture Constraint** ✅：`Product = Global Catalog`，无 `Product.organizationId` / `Product.supplierId`；`Supplier = Capability Provider`，无 Supplier Store / Marketplace；`Admin = Platform Governance Center`，无 Seller Backend / ERP。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（纯前端体验增强，复用已有 API）。
- **Build** ✅：`apps/admin` `npm run build` exit 0（tsc + vite build 通过）。
- **Decision** ✅：**M19.4.2 Admin Product Operation Center Development — COMPLETED**。Admin Product Governance 治理能力增强完成，Product/Category/Parameter/Media 四类治理统计可视化落地。Code State = Documentation State。Next Step: 等待架构审核后进入下一阶段。

## M19.4.3 Product Model and Capability Architecture Audit（481，M19.4 Architecture Audit）

- **M19.4.3 Architecture Audit Started & Completed（481）**：基于 478-480 和 M19.3 CLOSED 状态，执行 VISNDT 产品能力模型长期架构审核。**Code Change = None（Audit Only）**。
- **Product Ownership Boundary** ✅：Product 模型无 `organizationId` / `supplierId` / `ownerId`；`Product = Global Platform Catalog` 确认；`Product → Offer → Organization` 间接关联链完整。
- **Industrial Product Scenario Validation** ✅：6mm 工业视频内窥镜多供应商/多型号场景验证通过——每个型号 = 独立 Product，每个供应商 = 一个 Offer；`@@unique([organizationId, productId])` 防止重复报价；Product 名称去重由 Admin 治理保证。
- **Parameter System Assessment** ✅：4 种数据类型（STRING/NUMBER/BOOLEAN/ENUM）覆盖全部工业参数；`value` + `valueNumber` 双字段支持展示+范围搜索；ParameterFilter API 支持 AND 逻辑 + 精确匹配 + 数值范围；复合索引支持高效参数搜索。
- **Search Compatibility** ✅：Product Search（keyword + categoryId + parameterFilters）完全支持；Supplier Capability Search（offers + organizations）完全支持；Database Query First 满足当前规模。
- **Matching Compatibility** ✅：加权参数匹配 + 分类过滤；DemandParameter vs ProductParameterValue 评分；Match → RFQ → Response 工作流完整；AI 评分增强可通过替换 ScoringService 实现。
- **AI Future Compatibility** ✅（B+）：数据结构足够结构化用于知识图谱；文本字段足够用于 Embedding；JSONB 可扩展性支持未来 AI 数据；无 AI 增强的架构障碍。
- **Future Candidates** ✅：ProductStatus enum（替换 String）、WorkflowEntityType.PRODUCT、Product @@unique([name, model])、ParameterTemplate、Vector embedding（M20+）、Knowledge Graph tables（M20+）、Semantic alias model（M20+）。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**。
- **Decision** ✅：**M19.4.3 Product Model and Capability Architecture Audit — PASS**。VISNDT 产品能力模型架构健全、完整、可持续支撑工业检测设备平台长期发展。`Product (Global Catalog) + Parameter (typed, indexed) + Offer (capability mapping) + Organization (supplier identity) + Search (database query) + Matching (weighted scoring)` 架构正确分离关注点，防止架构漂移，为未来 AI 增强提供坚实基础。Next Step: M19.4.4 Closure Audit。

## M19.4.4 Product Capability Governance Closure Audit（482，M19.4 Closure）

- **M19.4.4 Closure Audit Started & Completed（482）**：基于 478-481 审计链，执行 M19.4 阶段最终治理闭环审核。**Code Change = None（Audit Only）**。
- **M19.4 Completion Review** ✅：478 Architecture Audit → 479 Design Freeze → 480 Development → 481 Product Model Audit，全部完成。交付物：Admin Product/Category/Parameter/Media 四类治理统计可视化落地，产品能力模型长期架构审核通过。
- **Final Architecture Decision** ✅：Product = Global Catalog（无 organizationId/supplierId/ownerId）；Supplier = Capability Provider（Product → Offer → Organization）；Offer = Capability Mapping Layer（@@unique 防重复）；Parameter = Industrial Search Foundation（4 types + dual-field + range + AND）；Search = Database Query First（4 boundaries frozen）；Matching = Weighted Scoring（AI enhancement path open）。
- **Future Candidate Registry** ✅：9 items registered and frozen——ProductStatus enum, WorkflowEntityType.PRODUCT, Product @@unique([name, model]), ParameterTemplate, Semantic Alias, Vector embedding, Knowledge Graph, AI Matching, Supplier Product Model。全部不进入当前开发。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（M19.4 全阶段零变更）。
- **Decision** ✅：**M19.4 Product Capability Governance Closure Audit — CLOSED**。M19.4 Admin Product Operation Center 阶段关闭条件全部满足。**M19.4 CLOSED。M19 COMPLETED。**Code State = Documentation State。Next Step: M20 Frontend Platformization。

## M20.0.0 M20 Architecture Planning Pre-Audit（483，M20 Architecture Planning）

- **M20.0.0 Pre-Audit Started & Completed（483）**：基于 M19 全阶段完成状态，执行 M20 Architecture Planning 前置架构审核。**Code Change = None（Audit Only）**。
- **M20 Direction Freeze** ✅：Frontend Platformization (P1) — 提升平台使用体验，不引入新业务模型；Content Asset Planning (P2) — Product-Content 关联、Content Discovery、Scenario Framework（规划阶段）；AI Readiness Planning (P3) — 数据质量评估、标签体系设计、文本资产规范（规划阶段，AI 基础设施推迟至 M21+）。
- **Platform Inventory** ✅：`apps/web` 33 pages（Product Discovery, Search, Supplier Capability, Content, Workspace, Dashboard）；`apps/admin` 50 pages（Product/Category/Parameter/Content/Organization/User/Demand/RFQ/Offer/Inquiry/Notification/Matching/Audit/FileAsset 全 CRUD）；12 API services。
- **Scope Freeze** ✅：Allowed — Frontend Experience, Platformization, Content Integration Planning；Excluded — Marketplace, Supplier Store, Transaction, ERP, AI Infrastructure, Schema Change（without dedicated audit）。
- **Future Candidate Registry** ✅：9 items registered and frozen；M20 only evaluates ParameterTemplate, Semantic Alias, Vector/KG (planning only, no implementation)。
- **Decision** ✅：**M20 Architecture Planning — PASS**。M20 Frontend Platformization 方向冻结，三优先级明确，Scope Control 边界清晰，9 Future Candidates 保持冻结。Next Step: M20.1 Frontend Platformization Development Planning。

## M20.1 Frontend Platformization Development Planning Audit（484，M20.1 Planning Audit）

- **M20.1 Planning Audit Started & Completed（484）**：基于 483 M20 方向冻结，完成 M20.1 Frontend Platformization Development Planning。**Code Change = None（Planning Audit Only）**。
- **Frontend Architecture Assessment** ✅：`apps/web`（Next.js 15 + React 18 + Tailwind + TanStack Query，33 pages + 15 services + 12 API wrappers）— `next build` exit 0；`apps/admin`（React 18 + Vite 6 + Ant Design 5 + Zustand，50 pages + 22 API services）— `tsc -b && vite build` exit 0。数据流架构 `Page → Service → API Wrapper → Backend API` 验证通过。
- **M20.1 Development Scope Freeze** ✅：
  - M20.1.1 Product Discovery Enhancement（5 enhancements：产品对比、视觉层级、参数展示、图片画廊、信息架构）
  - M20.1.2 Search Experience Unification（6 enhancements：统一搜索入口、搜索类型 Tab、筛选 UX、搜索建议、空状态增强、结果高亮）
  - M20.1.3 Workspace Optimization（6 enhancements：任务中心、需求工作流、RFQ 状态、快捷入口、导航优化、通知集成）
  - M20.1.4 Supplier Capability Showcase（5 enhancements：Profile 增强、Offer 覆盖可视化、导航优化、信任信息、身份展示）
  - M20.1.5 Admin Operation Efficiency（6 enhancements：批量操作、治理仪表盘、效率指标、快速筛选、数据导出、列表视图增强）
- **Impact Assessment** ✅：**Schema Change = None / Migration = None / API Change = None / Backend Change = None**。全部 28 项增强为前端-only，消费现有 API。
- **Architecture Freeze Maintained** ✅：Product Global Catalog / Supplier Capability Boundary / Database Query First Search / Backend Capability First / Admin Platform Governance — 全部保持。
- **Decision** ✅：**M20.1 Planning Audit — COMPLETED**。M20.1.1~M20.1.5 开发边界冻结，28 项前端体验增强规划完成，Development Authorization: READY。Next Step: M20.1.1 Product Discovery Enhancement Architecture Design。

## M20.1.1 Product Discovery Enhancement Architecture Design Audit（485，M20.1.1 Architecture Design）

- **M20.1.1 Architecture Design Audit Started & Completed（485）**：基于 483/484 冻结方向，完成 M20.1.1 Product Discovery Enhancement 架构设计审计。**Code Change = None（Audit Only）**。
- **Current Architecture Audit** ✅：`/products`（URL sync + filters + skeleton + pagination）、`/products/[slug]`（SEO + breadcrumb + gallery + params + supplier + docs）、`ProductCard`（basic info layout）、`ProductGallery`（thumbnail selection）、`ProductParameters`（grouped table）、`/categories`（grid cards）。数据流 `Page → Service → API Wrapper → Backend` 验证通过。
- **M20.1.1 Experience Architecture Design** ✅：
  - **Product List UX**：Enhanced ProductCard（visual hierarchy）、CompareBar（floating bottom bar）、Sort Controls in Main Area、View Mode Toggle（grid/list）
  - **Product Detail UX**：Tabbed IA（Overview/Specifications/Suppliers/Docs）、Anchor Nav（sticky sidebar）、Info Enhancement（status badge, description toggle, last updated）
  - **Product Comparison**：`/products/compare?ids=`（ComparePage + CompareTable）、Parameter Matrix with difference highlighting、Max 4 products、React state only（no Redux/Zustand）
  - **Parameter Visualization**：Type-Specific Renderers（`ParameterValueRenderer` for NUMBER/BOOLEAN/ENUM）、Group Collapse（accordion）
  - **Gallery Architecture**：Lightbox（fullscreen + keyboard）、Touch/Swipe、Image Counter、Keyboard Navigation
- **Development Scope** ✅：12 component tasks in 3 phases — Phase 1 (P0: 5 tasks: Tabs, Nav, Info, CompareBar, ComparePage)、Phase 2 (P1: 5 tasks: Type Renderer, Collapse, Lightbox, Gallery, Card)、Phase 3 (P2: 2 tasks: Sort Controls, View Mode)。
- **Impact Assessment** ✅：**Schema Change = None / Migration = None / API Change = None / Backend Change = None**。1 new page (`/products/compare`) + 6 new components + 5 modified components。所有数据消费现有 API。
- **Future Candidates (NOT in M20.1.1)**：Product list include media/parameterValues、Category product count、Parameter comparison context、Related Products — 标记为 Future Candidate，需要 API Audit。
- **Decision** ✅：**M20.1.1 Architecture Design — COMPLETED**。12 项组件开发任务设计冻结，3 阶段开发路线明确，Development Authorization: READY。Next Step: 486_M20.1.1 Product Discovery Enhancement Development。

## M20.1.1 Product Discovery Enhancement Development（486，M20.1.1 Phase 1/P0 Development）

- **M20.1.1 Phase 1 (P0) Development Started & Completed（486）**：基于 485 架构设计，完成 M20.1.1 Product Discovery Enhancement Phase 1 前端开发。**Backend/Schema/API Change = None**。
- **New Components** ✅：`ProductDetailTabs`（4-tab navigation with URL hash sync）、`ProductDetailNav`（sticky sidebar, scroll-spy, desktop only）、`ProductDetailContent`（client wrapper with tabs + info enhancement + description toggle）、`CompareBar`（floating bottom bar, max 4 products）、`CompareTable`（parameter matrix with group header, difference highlighting, best-value detection）、`ComparePage`（`/products/compare?ids=`, URL-driven, Suspense boundary）。
- **Modified Files** ✅：`products/[slug]/page.tsx`（two-column layout with tabs + nav）、`products/page.tsx`（compareIds state + CompareBar integration）、`ProductCard.tsx`（compare checkbox, top-right absolute）、`ProductGrid.tsx`（compareIds/onCompareToggle props）。
- **Product Info Enhancement** ✅：Status badge（color-coded: ACTIVE/DRAFT/REVIEW/ARCHIVED）、Last updated date、Description expand/collapse（>200 chars）。
- **Build Verification** ✅：`apps/web` build exit 0。Route `/products/compare` — 4.06 kB, First Load JS 119 kB。
- **Impact** ✅：Frontend 6 new files + 4 modified files。Backend/Schema/Migration/API = None。
- **Decision** ✅：**M20.1.2 Search Experience Unification Development — COMPLETED**。10 new components + 1 new page + 1 new service + 1 modified component。GlobalSearchBar integrated into PublicHeader。Unified /search page with 5-domain tabs, result cards, suggestions, empty states。Parallel API requests via search.service.ts。apps/web build exit 0。Backend/Schema/Migration/API = None。
- **Decision** ✅：**M20.1.3 Search Experience Optimization Architecture Design Audit — COMPLETED (489)**。Architecture Audit Only, Code Change = None。12 files audited (1 service + 10 components + 1 page)。17 gaps identified: 3 P0 (suggestion integration, zero-result sections, pagination) + 6 P1 (retry button, product images, tab caching, code dedup, partial errors, sticky search) + 8 P2 (deferred)。Architecture Decision: PROCEED。Backend/Schema/Migration/API = None。Next Step: 490_M20.1.3_Search_Experience_Optimization_Development。
- **Decision** ✅：**M20.1.3 Search Experience Optimization Development — COMPLETED (490)**。3 P0 + 5 P1 items implemented。P0-1: SearchSuggestionDropdown integrated into GlobalSearchBar。P0-2: Zero-result sections hidden in "全部" mode。P0-3: Pagination / Load More with append logic。P1-1: Retry button on error state。P1-2: Product images skipped (Product API no media)。P1-3: Tab result caching via useRef。P1-4: Shared utilities extracted to search-utils.tsx。P1-5: Promise.allSettled partial error handling。P1-6: Sticky search bar on /search。apps/web build exit 0。Backend/Schema/Migration/API = None。Next Step: M20.1.4 or M20.2 Planning。
- **Decision** ✅：**M20.1.4 Search Experience Final Audit — COMPLETED (491)**。Architecture Audit Only, Code Change = None。M20.1 Search Experience Phase: PASS。14 files verified (13 search + 1 layout)。17 resolved gaps, 9 deferred, 7 future candidates, 3 accepted limitations。Architecture: FROZEN。Backend/Schema/Migration/API/Infrastructure: ALL NONE。M20.1 → M20.2 Transition: AUTHORIZED。Next Step: M20.2 Content Asset Planning。

## M21.0 Platform Next Phase Architecture Audit（511，M21 Architecture Audit）

- **M21.0 Platform Next Phase Architecture Audit Started & Completed（511）**：基于 M20.4 全阶段闭环状态，执行 M21 平台下一阶段架构审计。**Code Change = None（Audit Only）**。
- **Platform Capability Assessment** ✅：
  - **Admin Operation Center**: 72%（用户运营 75%、供应商运营 45%、产品运营 75%、商业运营 75%、内容运营 85%、数据运营 50%、系统运营 70%）
  - **Web Platform**: 80%（Public 18 页 + Buyer Workspace 4 页 + Supplier Workspace 3 页，Content→Product→Inquiry 商业转化路径完整）
  - **Mobile Experience**: 35%（Desktop 75%、Tablet 40%、Mobile 25%，基础响应式，操作体验待优化）
  - **Data Architecture**: 65%（25+ Prisma 模型、15 Enums，结构化数据完整，缺少时间序列/行为追踪/分析模型）
  - **AI Readiness**: 15%（数据基础就绪，向量/Embedding/RAG 基础设施为零）
- **M21 Direction Freeze** ✅：AI & Platform Enhancement。6 阶段路线图：M21.1 AI Readiness Foundation → M21.2 Data & Analytics Infrastructure → M21.3 Mobile Experience Enhancement → M21.4 Admin Intelligence Upgrade → M21.5 AI Agent Integration → M21.6 Supplier Product Model Re-evaluation。**⚠️ 路线已重校准（526.1）：M21.4 已从 Admin Intelligence 调整为 Semantic Intelligence Layer Preparation，Mobile 移至 M21.5，Admin Intelligence 移至 M21.6，AI Agent 移至 M21.7，Supplier 移至 M21.8。**
- **Supplier Product Model** ✅：481 文档重新评估——触发条件未满足（无 Supplier 型号页面需求、无 RFQ 精准匹配需求、无 AI Matching 需求）。**Decision: KEEP FROZEN**。
- **AI Agent Architecture** ✅：数据基础具备（结构化产品参数 + 内容标签体系），但基础设施缺失（向量数据库、Embedding pipeline、LLM 集成）。渐进路线：Infrastructure → Foundation → Intelligence。
- **Risk Assessment** ✅：High Risk 3 项（AI 过度建设、数据质量不足、Schema 膨胀）；Medium Risk 3 项（移动端投入产出比、第三方服务依赖、性能退化）；Low Risk 2 项（路线偏离、文档不同步）。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（Audit Only）。
- **Decision** ✅：**M21.0 Platform Next Phase Architecture Audit — PASS**。VISNDT 平台具备进入 M21+ AI & Platform Enhancement 阶段的基础。M21 路线图冻结，6 阶段渐进路线获批。**M21 AUTHORIZED**。Next Step: 512_M21.1_AI_Readiness_Foundation_Architecture_Audit。

## M21.1 AI Readiness Foundation Architecture Audit（512，M21.1 Architecture Audit）

- **M21.1 AI Readiness Foundation Architecture Audit Started & Completed（512）**：基于 M21.0 平台审计基线，执行 AI/Data Readiness 基础能力审计。**Code Change = None（Audit Only）**。
- **Data Quality Assessment** ✅：
  - **Content Domain**: 85%（Full SEO + Tags + Revisions + Public Projection，最佳 AI 候选）
  - **Business Domain**: 70%（Structured Matching + ScoringService + DemandMatch，可 AI 增强）
  - **Product Domain**: 65%（Excellent Parameter System + Category Tree，但缺少 SEO/Slug 字段）
- **Search Audit** ✅：当前搜索为 Prisma `contains` + `mode: 'insensitive'`（LIKE 风格），无 PostgreSQL full-text search（tsvector），无外部搜索引擎，无语义搜索。M20.1 Search FROZEN 维持。
- **Matching Audit** ✅：ScoringService 为规则驱动加权评分（exact match + range match + enum match），可通过 AI embedding 增强但不需要替换。
- **UserEvent Model Design** ✅：Proposed UserEvent 模型（userId, sessionId, eventType, entityType, entityId, metadata）——为未来推荐/个性化/转化漏斗分析提供基础。**Design Only，不实现**。
- **Vector Architecture Evaluation** ✅：**Recommendation: PostgreSQL + pgvector（Option A）**。零额外基础设施，原生 SQL 集成，适合当前数据规模。**Embedding 模型推荐: bge-large-zh-v1.5**（中文优化，自托管，1024 维）。
- **AI Capability Architecture** ✅：4 层架构确立：L1 Structured Data Layer（当前）→ L2 Semantic Layer（Embedding + Vector Search）→ L3 AI Capability Layer（LLM + RAG + AI Scoring）→ L4 Agent Layer（Admin AI Agent + Content AI Assistant）。
- **Product SEO Gap** ✅：Product 模型缺少 SEO 字段（seoTitle, seoDescription, seoKeywords, slug）——M21.3 需要补充以支持 Product Semantic Search。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None / AI SDK = None / Vector DB = None / LLM = None**（Audit Only）。
- **Decision** ✅：**M21.1 AI Readiness Foundation Architecture Audit — PASS**。Content 85% AI-ready，Business 70% AI-ready，Product 65%（需 SEO 补充）。pgvector + bge-large-zh-v1.5 推荐。M21.2 Data & Analytics Infrastructure 获批（pgvector 启用 + Content Embedding + UserEvent 实现 + Semantic Search MVP）。**M21.2 AUTHORIZED**。Next Step: 513_M21.2_Data_Analytics_Infrastructure_Architecture_Audit。

## M21 Roadmap Recalibration（512.1，M21 Transition Adjustment）

- **M21 Roadmap Recalibration Audit Completed（512.1）**：基于 511 + 512 审计结论，重新校准 M21 路线。**Code Change = None（Audit + Documentation Only）**。
- **Recalibration Reason** ✅：511 审计中 Web 80% 评分未反映 Discovery/SEO/Conversion/UX Architecture 缺口，且 Data Analytics 依赖 Web 平台行为数据，需先完善 Web 再建数据体系。路线校准原则：「用户可见层优先 → 数据层其次 → 智能层最后」。
- **Old Roadmap（511）** ✅：M21.0 Audit → M21.1 AI Readiness → M21.2 Data Analytics → M21.3 Mobile → M21.4 Admin Intelligence → M21.5 AI Agent → M21.6 Supplier Model。
- **New Roadmap（512.1）** ✅：M21.0 Audit (511) → M21.1 AI Readiness (512) → **M21.2 Web Platform Experience (513)** → **M21.3 Data & Analytics (514)** → M21.4 Mobile → M21.5 Admin Intelligence → M21.6 AI Agent → M21.7 Supplier。**⚠️ 路线已二次重校准（526.1）：M21.4 调整为 Semantic Intelligence Layer Preparation，Mobile 移至 M21.5，Admin Intelligence 移至 M21.6，AI Agent 移至 M21.7，Supplier 移至 M21.8。**
- **Key Changes** ✅：
  - **新增 M21.2 Web Platform Experience**（Public Web + Buyer/Supplier Workspace + Navigation + Discovery + SEO + Conversion + UX Architecture，Frontend Only）
  - M21.2 Data → M21.3（依赖 Web 平台行为数据）
  - M21.3 Mobile → M21.4（Web 体验成熟后适配）**⚠️ 已二次重校准：M21.4 = Semantic Intelligence Layer**
  - M21.4 Admin → M21.5（需 Data 层支撑）**⚠️ 已二次重校准：M21.5 = Mobile Experience**
  - M21.5 AI Agent → M21.6（需 Admin 智能化基础）
  - M21.6 Supplier → M21.7（平台能力成熟后评估）
- **Six Capability Tracks** ✅：Web（Exp. Platform）、Data（Analytics）、Mobile（Full Op.）、Admin（Intelligence）、AI（Agent）、Supplier（Cond. Eval.）。
- **Capability Evolution Matrix** ✅：
  | Capability | Current | Target |
  |------------|---------|--------|
  | Admin | Operation Center (72%) | Intelligence |
  | Web | Discovery Platform (80%) | Experience Platform |
  | Data | Structured Data (65%) | Analytics Layer |
  | Mobile | Responsive (35%) | Full Operation |
  | AI | Ready (15%) | Agent |
  | Supplier | Offer Model (FROZEN) | Conditional Evolution |
- **Frozen Modules** ✅：Product Global Catalog、M20.1 Search、Supplier Product Model、Content Schema、Matching Algorithm、RBAC 全部维持冻结。
- **Constraints** ✅：M21.2 Web（Frontend Only, No Schema/API/Search）、M21.3 Data（Schema 需独立审核, No AI）、M21.4 Mobile（Frontend Only）、M21.5 Admin（Based on M21.3, No AI Agent）、M21.6 AI（Based on M21.3+M21.5, No Business Logic Replaced）、M21.7 Supplier（Condition Evaluation Only）。**⚠️ 已二次重校准（526.1）：M21.4 = Semantic Intelligence Layer（Database-Only→Backend→API→Admin），M21.5 = Mobile Experience（Frontend Only），M21.6 = Admin Intelligence，M21.7 = AI Agent，M21.8 = Supplier。**
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None / Search Change = None**（Audit + Documentation Only）。
- **Decision** ✅：**512.1_M21_Roadmap_Recalibration_Audit — PASS**。M21 Revised Roadmap Authorized。六条能力路线冻结。**M21.2 AUTHORIZED**。Next Step: 513_M21.2_Web_Platform_Experience_Architecture_Audit。

## M21.2 Web Platform Experience Architecture Audit（513，M21.2 Architecture Audit）

- **M21.2 Web Platform Experience Architecture Audit Completed（513）**：对 VISNDT Web 平台进行完整体验架构审计。**Code Change = None（Audit Only）**。
- **Route Inventory** ✅：17 条公开路由 100% 存在（/、/products、/products/[slug]、/categories、/search、/knowledge、/knowledge/[slug]、/solutions、/solutions/[slug]、/articles、/articles/[slug]、/insights、/insights/[slug]、/tags/[slug]、/suppliers/[id]、/business、/about）。
- **Public Web Experience Score: 65%** ✅：Route 100%，SEO Metadata 100%，但 Loading States 0%、Error Boundaries 0%、OpenGraph 29%（仅 5/17 详情页）、JSON-LD 23%（仅 4/17 内容详情页）。
- **Buyer Workspace Score: 80%** ✅：Content→Product→Inquiry→Demand→RFQ 完整闭环，Buyer 7 页路由完备。缺口：无引导流程、无首次用户引导、无通知中心、无多 Offer 比较工具。
- **Supplier Workspace Score: 78%** ✅：Supplier = Capability Provider 定位完全合规，无 Store/Marketplace/Catalog。Display + RFQ 响应完整。缺口：Display 完整性指标可操作性弱、无公开预览、无能力分析。
- **Conversion Architecture Score: 85%** ✅：ContentCommercialCTA 统一入口，InquiryForm + SupplierInquirySection 双入口，Demand→RFQ 路径完整。缺口：所有内容 CTA 指向同一 /products（无上下文链接）、无转化追踪、页面缺少 Demand 创建入口。
- **SEO Architecture Score: 55%** ⚠️：Content 详情页 SEO 强（OpenGraph + JSON-LD），但 Product 页缺 JSON-LD（Product schema）、Homepage 缺 Organization/WebSite JSON-LD、列表页缺 OpenGraph、Product 模型缺 SEO 字段（seoTitle/seoDescription/seoKeywords/slug，Schema 层缺口）。
- **Navigation Architecture Score: 71%** ✅：三层导航（Discovery/Business/Workspace）结构清晰，WorkspaceSidebar + Breadcrumb 完整。缺口：移动端导航仅 Hamburger（无 Bottom Nav）、Breadcrumb 不全、无搜索建议。
- **Design System Score: 65%** ✅：40+ 组件按域组织良好，Tailwind 自定义主题。缺口：无 Design Token 系统、无组件文档（Storybook）、无共享 UI 原语库。
- **Mobile Readiness: 35%** ⚠️：基础响应式，Workspace 桌面端设计，Dashboard 移动端差，RFQ 表单未适配。
- **Gap Analysis** ✅：P0 缺口 5 项（Loading States、Error Boundaries、Product JSON-LD、Homepage JSON-LD、CTA 上下文链接）、P1 缺口 9 项（OpenGraph 列表页、Breadcrumb JSON-LD、Empty States、Design Token 等）、P2 缺口 7 项、Future 缺口 4 项（M21.3-M21.4）。
- **Decision** ✅：**513_M21.2_Web_Platform_Experience_Architecture_Audit — PASS**。Web Platform Experience Score 68%/C+。推荐进入 M21.2.x Development Phase（Frontend Only，~20-30 文件，零 Schema/API/Search 变更）。Next: 513.x_M21.2.x_Web_Platform_Experience_Development 或 514_M21.3_Data_Analytics_Infrastructure。



Current Major Stage:

M21.4 Semantic Intelligence Layer


Previous Route:

M21.4 Mobile Experience Platformization


Route Status:

REPLACED


Current Execution:

533_M21.4.7_Unified_Search_Ranking_Foundation — COMPLETED

M21.4 Semantic Intelligence Layer Preparation — CLOSED

Next: M21.5 Mobile Experience

---

## M21.5 Mobile Experience

### 534_M21.5_Pre_Development_Architecture_Audit — COMPLETED

- **Status** ✅：**Audit PASS**。Architecture Audit Only，No Code Change。
- **Audit Report** ✅：`docs/_review/534_M21.5_Pre_Development_Architecture_Audit_Report.md`。
- **Key Findings** ✅：
  - **API Ready**：13+ Public API + 6+ Workspace API 可直接被 Mobile 消费
  - **Auth Ready**：JWT Bearer Token 原生支持 Mobile
  - **Semantic Protected**：Semantic Layer 保持 Internal Capability，Mobile 不直接消费
  - **BFF Deferred**：当前 API 足够 Mobile Phase 1，BFF 延后至 M21.5.x
  - **No Blocking Risks**：无架构风险阻止 Mobile 开发
- **Recommended Path** ✅：Responsive Web (P0) → PWA (P1) → Native App (P2)
- **Impact** ✅：Schema Change = None / Migration = None / API Change = None / Frontend Change = None / Code Change = None（Audit Only）
- **Next** ✅：535_M21.5.1_Responsive_Web_Foundation



## Future Architecture Candidates

### 481_Supplier_Product_Model_Architecture_Future_Design_Candidate（481，Documentation Only）

- **Status** ✅：**Frozen / Not For Development**。Future Architecture Candidate。
- **Design Document** ✅：`docs/_architecture/future/481_Supplier_Product_Model_Architecture_Future_Design_Candidate.md`。
- **Content** ✅：供应商型号能力模型（Supplier Product Model）未来架构设计候选——解决平台标准产品能力与供应商型号分离、同一能力多供应商提供、型号参数继承与覆盖、Admin 审核治理等工业检测行业需求。明确禁止演变为 Supplier Store / Marketplace / Seller Backend / Inventory / SKU / ERP。
- **Constraint** ✅：必须保持 Product Global Catalog 架构，禁止 Product.organizationId / Product.supplierId / Supplier Product Catalog。
- **Trigger** ✅：Supplier Capability 页面需求增强 / RFQ 精准匹配需要型号级 / AI Matching 需要型号参数 / SEO 需要供应商型号页面 / 供应商数据规模增长后，通过正式 M19.4.x / M20 架构审计重新激活。
- **Decision** ✅：**DO NOT DEVELOP**。当前架构 Product Global Catalog + Offer Supplier Capability 保持。不纳入 M19.4 开发范围。

## M19.1.3 Product Supplier Capability & Inquiry Experience Enhancement（464，M19.1 Development 第三阶段）

- **M19.1.3 Started & Completed（464）**：基于 459-463 冻结结论，完成 Product Center V2 供应商能力与询价体验完善——ManufacturerInfo 接入 offers.organization 数据、SupplierCapabilityList 展示增强、Inquiry 交互流程完善，`apps/web` build 通过（exit 0）。
- **ManufacturerInfo 数据统一** ✅：`ManufacturerInfo.tsx` 新增 `offers` prop，优先从 `offers` 中推导制造商信息（取第一个 ACTIVE/SUBMITTED offer 的 organization），统一制造商信息与供应商能力数据源；产品详情页改为传入 `offers={product.offers}` 替代 `organization={null}`。
- **SupplierCapabilityList 展示增强** ✅：空状态增加引导性图标与文案（"如果您是该产品的供应商，请联系我们加入平台"）；供应商卡片增加 organization.type 标签；选中状态增加「已选择供应商」指示器；提示文案根据是否选中动态切换。
- **Inquiry 交互流程完善** ✅：`SupplierInquirySection` 选中供应商后展示选中横幅（"询价对象：XXX"）+「切换供应商」按钮；`InquiryForm` 新增 `organizationName` prop，选中供应商时显示"向 XXX 询价 YYY"。
- **防无供应商提交** ✅：`SupplierInquirySection` 仅在 `selectedOffer` 非 null 时展示 InquiryForm，`InquiryForm` 的 `offerId`/`organizationId` 为必填，无 fallback 逻辑。
- **回归验证** ✅：产品详情页整体布局不变，原有 ProductGallery、ProductParameters、Breadcrumb、Documents 均保持正常；`/products/[slug]` 路由正常生成（4.34 kB，dynamic）。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；未引入 `Product.organizationId` / `ProductFamily` / `ProductModel` / `SupplierOffering`；未触碰 Admin / Backend / Database；未展示 Price / Inventory / Transaction。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；仅既有非阻断 lint 警告。

## M19.1.2 Product Detail Experience Enhancement（463，M19.1 Development 第二阶段）

- **M19.1.2 Started & Completed（463）**：基于 459-462 冻结结论，完成 Product Center V2 详情体验升级——技术参数从平铺展示升级为 ParameterGroup 分组展示、接入 Offer.organization 供应商能力展示、禁止 Inquiry 自动选择第一个 Offer，`apps/web` build 通过（exit 0）。
- **Technical Specification 分组展示** ✅：`ProductParameters.tsx` 升级为 `ParameterGroup` 分组展示，接收 `parameterGroups` 参数（通过 `GET /parameter-groups` public endpoint 加载），按 `parameterDefinition.parameterGroupId` 分组，未分组参数归入「其他参数」；无硬编码参数组名。
- **ParameterGroup 数据源** ✅：新增 `lib/api/parameter-groups.ts`（`getParameterGroups`，public）+ `services/parameter-group.service.ts`，遵循 `Page → Service → API Wrapper → Backend API`；**API Change = None**（复用已有 public endpoint）。
- **Supplier Capability 展示** ✅：新增 `SupplierCapabilityList.tsx`（产品页供应商列表，显示 Offer 的 organization.name / title / status / description，支持选中高亮）+ `SupplierInquirySection.tsx`（client component，管理 Offer 选择状态，选中后展示 InquiryForm）。
- **Inquiry Flow 改造** ✅：产品详情页移除 `inquirateOffer` 自动推导逻辑（原 `product.offers.find(...)`），改为 `SupplierInquirySection` 要求用户明确选择 Offer 后才展示 InquiryForm；`InquiryForm.tsx` 移除 `offerId || productId` / `organizationId || productId` fallback，改为必填 props。
- **Type 扩展** ✅：`types/product.ts` 新增 `ParameterGroup` 接口（id/name/code/description）。
- **回归验证** ✅：产品详情页整体布局不变（Overview / Media Center / Technical Specification / Documents），原有 ManufacturerInfo、ProductGallery、Breadcrumb 均保持正常；`/products/[slug]` 路由正常生成（3.86 kB，dynamic）。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；未引入 `Product.organizationId` / `ProductFamily` / `ProductModel` / `SupplierOffering`；未触碰 Admin / Backend / Database。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`；未引入 Design System / AI Search / Vector Search / ProductFamily / Supplier Product Ownership。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；仅既有非阻断 lint 警告。

## M25 Project Baseline Freeze（639_M25.0）

### 639_M25_Project_Baseline_Freeze — COMPLETED

里程碑 M24.5 Consolidation 阶段（625-638）已完成，进入 **M25 平台化重建与自运转基座**。

- **Status** ✅：M25.0 Batchline Freeze COMPLETED（Code UNCHANGED，纯文档/架构冻结）。
- **Repository Verification** ✅：Repository Root `F:\Desktop\VISNDT` / Code Root `F:\Desktop\VISNDT\VISNDT`；分支 `main`、工作区干净；PostgreSQL / API / Web / Admin 四端 AVAILABLE。
- **638 Audit Accepted** ✅：`638_M25_Project_Audit`（21 项缺口 P0×3 / P1×13 / P2×5）与 `638_M25_AI_Operation_Architecture`（L0 规则引擎）均采纳为 M25 Scope 依据。
- **M25 Scope Frozen** ✅：六阶段路线 639（Baseline Freeze）→ 640（Design System Reconstruction）→ 641（Business Identity Number System）→ 642（Workflow Visualization）→ 643（Media Governance Completion）→ 644（L0 Rule Engine Foundation）。范围冻结，禁止提前实施 M25 任务 / 修改 UI / 模型 / API / DB / AI / Matching / Search。
- **Architecture Freeze** ✅：Database / API / Frontend / Admin / Matching / Search / AI 全部 UNCHANGED；AI Contract Only / Runtime Disabled / Human In Loop Required。
- **Figma Integration Gate** ✅：WAITING / NOT ENABLED（启用条件 = 进入 640_M25_Design_System_Reconstruction）。
- **Impact** ✅：Database / API / Frontend / Admin / Matching / Search / AI = UNCHANGED；Documentation = UPDATED。
- **Review Report** ✅：`docs/_review/639_M25_Project_Baseline_Freeze_Report.md`。

## M25.1 Design System Reconstruction（640_M25.1）

### 640_M25.1 Design System Reconstruction — CONDITIONAL PASS

里程碑目标达成：建立 VISNDT 跨端统一 Design System Foundation v1.0（Design Token / Component Library / Icon System / Web Foundation / Admin Alignment），承接 631（G1-G6）+ 632（D1/D2/D3）。

- **Design Token Foundation（640.1 / D1）** ✅：新建 `@visndt/design-tokens`（`packages/design-tokens`），单一事实源覆盖 8 域：Color（primary 统一 `#2563eb`）+ Typography + Spacing + Radius + Shadow + Border + Motion + Status（`STATUS_TONE` 30+ 确定性映射 + `resolveStatusTone` 大小写不敏感/未知回退 neutral + `TONE_TO_HEX`/`TONE_TO_ANTD_COLOR`/`CHART_PALETTE`/`toCssVariables`），Web（CSS 变量 / 原子组件）与 Admin（AntD 主题 / StatusTag）共消费，**解决 G4（primary 不一致）**。
- **Primitive Component Layer（640.2 / D3）** ✅：新建 `@visndt/design-system`（`packages/design-system`），12 个 Reusable/Typed/Documented/Theme 兼容组件（Button/Input/Card/Badge/Tag/SectionHeader/Pagination/EmptyState/LoadingState/StatusDisplay/IconWrapper/LayoutContainer），仅依赖 design-tokens、不引用宿主 CSS，**解决 G3（缺原子层）+ G5（SectionHeader 三套实现）**。
- **Icon System（640.3 之图标 / D2）** ✅：新增 `apps/web/src/lib/ui-icon.tsx`（lucide-react 16 语义图标统一经 IconWrapper 渲染），替换 Web 目标组件 13 文件（WorkspaceSidebar/StatCard/工作台入口/Dashboard/DemandList/RFQList/MatchList/WorkspaceEmpty/MediaGallery 等）emoji UI → 专业图标；Admin 保留 `@ant-design/icons`（架构决策），**解决 G2（emoji 77 处）**（残余为正文符号 ✓/→ 与注释标注，非装饰性图标）。
- **Web Migration（640.3）** ✅：`next.config.ts` 增加 `transpilePackages` 消费两共享包；页面/组件接 token + SectionHeader/Empty/Loading/Pagination 统一。
- **Admin Alignment（640.4）** ✅：`apps/admin/src/components/design-system/tokens.ts` 委托共享 design-tokens（VISNDT_COLORS/STATUS_TONE/TONE_TO_ANTD_COLOR/TONE_TO_HEX/CHART_PALETTE/resolveStatusTone），消灭 Admin 独立 Token 事实源，状态语义单一入口。
- **Figma Integration** ✅：Figma Skill ENABLED（Design Authority；仅用于 Design System/Component/UI Spec/Validation，未直出代码）；**连接 DEFERRED**——运行环境未接 Figma MCP，官方设计稿逐节点视觉 diff 押后补做。
- **Runtime Verification** ✅：design-tokens build / design-system build / `apps/web` next build（39 static pages）/ `apps/admin` tsc+vite build（5936 modules）全部 exit 0；四端在线。
- **Impact** ✅：Database / API / Matching / Search / AI / Admin Workflow = UNCHANGED；Frontend（Web）Component Architecture = UPDATED、Business Logic = UNCHANGED；Admin Theme = UPDATED。
- **Scope Compliance** ✅：无范围扩张、无架构漂移，未提前执行 641–644。
- **Review Report** ✅：`docs/_review/640_M25.1_VISNDT_Design_System_Reconstruction_Report.md`。
- **Next** ✅：**641_M25.2_Business_Identity_Number_System**。

## M25.2 Business Identity Number System（641）— PASS

### 641_M25.2_Business_Identity_Number_System — PASS

里程碑目标达成：建立平台级 Business Identity Number System 基础能力，为 8 类业务对象（Product/Demand/RFQ/Offer/Organization/User/FileAsset/Knowledge Content）提供统一业务身份表达，并为 642 Workflow Visualization 提供稳定身份基础。

- **Identity Contract CREATED** ✅：新建 `@visndt/identity-contract`（`packages/identity-contract` v0.1，纯 TS 无依赖）。三层身份模型 `Database ID(UUID) + Business Identity Number + Human Readable Reference`；编码规范 `VIS-{PREFIX}-{YYYYMMDD}-{SEQUENCE}`（8 类前缀 PROD/DEM/RFQ/OFF/ORG/USR/AST/CNT）；`deriveIdentity/parseIdentity/isValidIdentity/deriveSequence/identityMeta/shortIdentity/formatIdentity` + `src/README.md` 文档。
- **派生决策** ✅：DB Schema FROZEN 下，SEQUENCE 段由现有 UUID 确定性派生（前 8 位 hex → 无符号整数 → 补零，宽 8），日期段取 `createdAt`；同记录恒等、跨记录唯一、零迁移、零新列、可逆；同时支持显式 `sequence` 入参预留规范化通道。禁止一次性迁移历史数据（遵守）。
- **Display Layer** ✅：design-system 新增统一 `BusinessIdentityBadge`（tag/plain/compact 形态 + 实体中文名 + 点击复制 + 悬停说明），继承 640 Design System Foundation v1.0（仅依赖 design-tokens + identity-contract，未新增 Button/Badge/Tag/Color Token）；包级 `"use client"` 适配 Next.js Server Component 边界。
- **Web Migration** ✅：`apps/web` 接入 RFQList / RFQDetail（`/workspace/rfqs/[id]`）/ DemandList；`package.json` + `next.config.ts` transpilePackages 增加 `@visndt/identity-contract`。
- **Admin 管理视图** ✅：`apps/admin` 6 个 Detail 页替换原生 UUID 为业务编号 Badge（InquiryDetail=RFQ / RfqDetail=RFQ / DemandDetail=DEMAND / ProductDetail=PRODUCT / OrganizationDetail=ORGANIZATION / OfferDetail=OFFER）。
- **Impact** ✅：Database / API / Matching / Search / AI / Admin Workflow = UNCHANGED；Frontend（Web）Component + Admin Identity Display = UPDATED、Business Logic = UNCHANGED；禁止范围零触碰。
- **Runtime Verification** ✅：identity-contract build / design-system build / `apps/web` next build（含 `/workspace/rfqs/[id]` dynamic）/ `apps/admin` tsc+vite build 全部 exit 0（曾出现一次 Windows libuv teardown assertion，复跑单进程后均 exit 0，判定为环境性）。
- **Figma** ✅：NOT REQUIRED（640 已完成 Design System Foundation；本轮纯 Code 能力）。
- **Review Report** ✅：`docs/_review/641_M25.2_Business_Identity_Number_System_Report.md`。
- **Next** ✅：**642_M25.3_Workflow_Visualization**。

## M25.3 Workflow Visualization（642）— PASS

### 642_M25.3_Workflow_Visualization — PASS

里程碑目标达成：基于现有业务状态模型，为 RFQ / Demand / Match / RFQ Response 增加可理解、可追踪、可解释的 Workflow Visualization 能力（Business Transparency），并为后续提供的稳定身份（641）与设计基础（640）完成集成。

- **StatusPresentationContract CREATED** ✅：`design-system` 新增 `StatusPresentationContract`（`workflow/status-presentation.ts`），统一「业务状态 → UI 表达」确定性映射（label / tone / progress / nextAction），覆盖既有枚举不重新定义：RFQ（DRAFT/OPEN/RESPONDING/CLOSED/CANCELLED）、Demand（DRAFT/PUBLISHED/SUBMITTED/PROCESSING/CLOSED/CANCELLED）、Match（PENDING/MATCHED/REVIEWED/ACCEPTED/REJECTED/EXPIRED）、RFQ Response（SUBMITTED/VIEWED/ACCEPTED/REJECTED）；语义色调复用 640 `SemanticTone`/`STATUS_TONE`，未新增颜色体系。
- **Workflow Visualization Components CREATED** ✅：`design-system` 新增 `WorkflowTimeline`（垂直时间线：历史/当前/下一节点 + 日期）+ `WorkflowStep`（单节点，completed/current/pending）+ `StatusProgress`（水平阶段进度条，分阶段推进百分数）+ `MatchExplanationCard`（匹配 ID + Business Identity + 置信度 + 匹配依据因子，明确不重算评分不加 AI）+ `NextActionHint`（当前状态 + 下一步动作提示，不触发状态变更）；全部继承 640 token、复用 BusinessIdentityBadge/StatusDisplay，未新增 Button/Badge/Tag/Color Token。
- **RFQ Timeline** ✅：`buildRfqTimeline(status, {createdAt,publishedAt,closedAt})` 由既有状态 + 既有时间字段确定性推导；未引入 WorkflowEvent 新事件，符合「禁止新增事件系统」。
- **Web Integration（P0/P1）** ✅：RFQ Detail（`components/rfq/RFQDetail.tsx`）增加 Identity（BusinessIdentityBadge）+ 业务流转 Timeline + NextActionHint；Demand Detail（`components/demand/DemandDetail.tsx`）增加 Identity + 业务流转 Timeline + NextActionHint；Match Result（`workspace/matches/[matchId]`）增加 `MatchExplanationCard`（置信度 + 确定性因子说明）；Workspace 各业务详情即 Process Overview（P2 以详情页业务流转呈现）。
- **Admin 管理视角增强** ✅：`apps/admin` RfqDetail / DemandDetail 增加 Status Timeline Preview（WorkflowTimeline）+ 既有 Identity Reference，未改任何后台业务流程。
- **Identity Integration UPDATED** ✅：复用 641 `@visndt/identity-contract` + `BusinessIdentityBadge`（RFQ/Demand/Match 关联对象身份），未扩展 8 类类型、未触碰契约。
- **Impact** ✅：Database / API / Matching / Search / AI / Admin Workflow = UNCHANGED；Frontend（Web）+ Admin = UPDATED（仅 Visualization Layer，Business Logic UNCHANGED）；禁止范围（apps/api/prisma/migration/matching/search/AI runtime/workflow engine/event bus/状态机）零触碰。
- **Runtime Verification** ✅：identity-contract build / design-system build（含 workflow 组件）/ `apps/web` next build（含 `/workspace/matches/[matchId]` dynamic）/ `apps/admin` tsc+vite build 全部 exit 0。
- **Figma** ✅：NOT REQUIRED。
- **Review Report** ✅：`docs/_review/642_M25.3_Workflow_Visualization_Report.md`。
- **Next** ✅：**643_M25.4_Media_Governance_Completion**。

### 643_M25.4_Media_Governance_Completion — PASS

里程碑目标达成：基于既有 FileAsset 能力，建立媒体资源的治理可视化（Media Governance Foundation v1.0），使平台识别已有媒体资源状态、展示媒体生命周期信息、提升 Admin 媒体运营可见性、并统一 Web / Admin 媒体展示体验；未创建新媒体架构，未触碰任何数据/存储/AI能力。

- **Media Status Presentation Contract CREATED** ✅：`design-system` 新增 `MediaStatusPresentationContract`（`media/media-presentation.ts`），统一「既有 FileAsset → 治理展示」确定性映射（label / tone / description / governanceHint），四类 **UI Governance State**（非 Database Enum）：Active 正常引用 / Unused 未引用 / Incomplete 缺少信息 / Legacy 历史资源；`deriveMediaGovernanceState` 仅由既有字段（status/deletedAt/fileName/mimeType/fileSize/引用计数）确定性派生，不写库；语义色调复用 640 `SemanticTone`，未新增颜色体系。
- **Media Lifecycle Visualization CREATED** ✅：`media/media-presentation.ts` 提供 `MEDIA_LIFECYCLE_STEPS`（Created → Referenced → Displayed → Maintained → Archived Candidate，**Presentation State**，非数据库状态机）+ `buildMediaLifecycle` 确定性推导当前节点；`MediaLifecycleTimeline` 复用 642 `WorkflowTimeline`。
- **Media Governance Components CREATED** ✅：`MediaGovernanceBadge`（复用 StatusDisplay）+ `MediaFileCard`（Card 载体：Asset Business Identity + File Info（名称/MIME/大小）+ Usage Reference（产品/内容引用）+ Lifecycle + Governance Hint，纯展示，不触发删除/迁移）。
- **Admin Media Governance View** ✅：`apps/admin` MediaList 升级为媒体治理视图——治理汇总（当前页 active/unused/incomplete/legacy 计数）+「治理」列（MediaGovernanceBadge）+ 资产编号列（BusinessIdentityBadge type=ASSET）+ 行展开（MediaFileCard：Identity + FileInfo + Usage + Lifecycle + Hint）；仅 Observe/Review/Manage Visibility，不自动清理、不触达存储。
- **Web Media Experience Enhancement** ✅：`apps/web` `components/content/MediaGallery.tsx` 统一媒体元信息展示——图片图注 + Asset Identity（BusinessIdentityBadge compact）+ 附件 MIME 标签 + Asset Identity，覆盖自 Content 映射的 Product/Knowledge/Solution/Public Content 媒体画廊。
- **Identity Integration UPDATED** ✅：复用 641 `@visndt/identity-contract` 既有 **ASSET** 类型（`VIS-AST-…`）+ `BusinessIdentityBadge`，未新增身份类型。
- **Impact** ✅：Database / API / Storage / Matching / Search / AI / Admin Workflow = UNCHANGED；Frontend（Web）+ Admin = UPDATED（仅 Governance/Visualization Layer）；禁止范围（apps/api/prisma/migration/storage/upload pipeline/S3/CDN）零触碰；AI Runtime Disabled、Human In Loop 保持。
- **Runtime Verification** ✅：design-system build / `apps/web` next build / `apps/admin` tsc+vite build 全部 exit 0；API :4000 / Web :3000 / Admin :3001 AVAILABLE。
- **Review Report** ✅：`docs/_review/643_M25.4_VISNDT_Media_Governance_Completion_Report.md`。
- **Next** ✅：**644_M25.5_VISNDT_L0_Rule_Engine_Foundation**。

### 644_M25.5_L0_Rule_Engine_Foundation — PASS

里程碑目标达成：在不改变现有业务架构、不引入 AI Runtime、不修改数据库模型的前提下，建立 VISNDT 平台 L0 确定性规则能力基础（Operational Assistance Foundation）——现有数据 + 确定性规则契约 + 调度边界 + 完整性检查 + 通知契约；未构建 AI System / Workflow Engine / Autonomous Decision / Business Automation Platform。

- **Rule Contract CREATED** ✅：新建 `@visndt/rule-engine-contract`（纯 TypeScript，无 ORM/API/AI 依赖，仅复用 641 `@visndt/identity-contract` 的 `BusinessEntityType`）；`RuleDefinition { id/name/description/severity/targetType/evaluate }` + `RuleResult { ruleId/passed/severity/message/references? }`；架构边界 `IF condition THEN result`（只读），禁止 `IF condition THEN modify business data`，禁止 `Rule + AI + Autonomous Action`。
- **Rule Evaluation Framework CREATED** ✅：`evaluate.ts` 确定性评估框架（`evaluateRule` 单对象 / `runRuleEvaluation` 批处理→`RuleEvaluationReport` / `runRules` 多规则）；纯函数、只读、无副作用，不持久化业务决策。
- **Scheduler Contract CREATED** ✅：`scheduler.ts` 仅定义调度契约（`ScheduleDefinition` / `ExecutionTriggerContract` / `RuleExecutionEntry`），流转 `Schedule → Trigger → Entry → Result`；未实现 Cron Service / Queue / Worker / Event Bus。
- **Completeness Check CREATED** ✅：`completeness.ts` 第一批确定性完整性规则——Product（Name/Category/Core Parameters/Media）、Demand（Description/Required Parameters/Inspection Scenario）、RFQ（Supplier Requirement/Response State/Required Info）、Media（File Metadata/Reference/Status）；输出 `CompletenessResult`，`completenessHint` 仅提示，**禁止自动修复**。
- **Notification Contract CREATED** ✅：`notification.ts` 仅定义 `NotificationIntent { type/target/message/priority/... }` 契约 + `intentFromResult` 确定性映射（INFO 不通知；ERROR→HIGH、WARNING→MEDIUM）；Notification = Contract **不是** Notification System，无 Email/SMS/Push/外部投递。
- **Existing Data Mapping** ✅：只读消费既有 Product/ProductParameterValue/ProductMedia、Demand/DemandParameter、RFQ/RFQResponse/Offer、Organization/OrganizationMember、FileAsset/ProductMedia/Content Reference；**未新增 RuleData / RuleResult 表**。
- **Design System / Admin 接入** ✅：`design-system` 新增 `RuleResultDisplay`（复用 640 `StatusDisplay` + 641 `BusinessIdentityBadge`，未新增颜色/状态/组件体系）；`apps/admin` MediaList 在 643 治理视图基础上新增 L0 媒体完整性运营透视（汇总条 + 首条未通过项 `RuleResultDisplay` 提示），只读评估不自动修复、不触达存储。
- **Impact** ✅：Database / API / Migration / Matching / Search / AI / Storage = UNCHANGED / NONE；Admin = UPDATED（仅运营透视展示）；Web = UNCHANGED；禁止范围（apps/api/prisma/migration/storage/event bus/queue/worker）零触碰；AI Runtime Disabled、Human In Loop Required 保持。
- **Runtime Verification** ✅：rule-engine-contract / design-system / `apps/web` next build / `apps/admin` tsc+vite build 全部 exit 0；API :4000 / Web :3000 / Admin :3001 AVAILABLE。
- **Review Report** ✅：`docs/_review/644_M25.5_VISNDT_L0_Rule_Engine_Foundation_Report.md`。
- **Next** ✅：**645_M25_Final_Closeout**（M25 Productization Foundation Complete：639-644 全部交付闭环）。

### 645_M25_Final_Closeout — PASS

M25 周期正式收口：验证 M25.0~M25.5 六阶段（639-644）全部交付闭环，建立 M25 Final Completion Evidence，完成架构最终核验与文档同步，定义 M26 开发入口边界。本任务为 Documentation Audit + Architecture Final Verification + Release Preparation，非功能开发，零代码变更。

- **M25 Completion Evidence Matrix** ✅：639 Baseline Freeze（COMPLETED）→ 640 Design System（CONDITIONAL PASS，Figma 视觉 diff 待接入后补做）→ 641 Identity System（PASS）→ 642 Workflow Visualization（PASS）→ 643 Media Governance（PASS）→ 644 L0 Rule Engine（PASS）。
- **Capability Closure** ✅：Design Foundation（Tokens+Components+Unified Status Presentation）成立；Identity Foundation（Database UUID+Business Identity Number+Human Readable Reference）成立；Workflow Visibility（Existing State+Visualization Layer，非 Workflow Engine）成立；Media Governance（Existing FileAsset+Governance Presentation，非 Storage Platform Rewrite）成立；Rule Foundation（Existing Data+Deterministic Rule Evaluation+Human Review，非 AI Automation）成立。
- **638 承接** ✅：638_M25_Project_Audit（21 项缺口 P0×3/P1×13/P2×5 作为 Scope 依据）+ 638_M25_AI_Operation_Architecture（L0 规则引擎纳入 M25.5）被 M25 完整承接，No Unresolved M25 Scope。
- **Architecture Final Verification** ✅：Database UNCHANGED（无 Schema/Migration/New Table/New Enum）；API UNCHANGED（无 Endpoint/Contract/Controller Mutation）；Frontend 仅 Presentation/Component/Design System Layer UPDATED（无 Business Logic Rewrite）；Admin 仅 Operational Visibility/Governance View/Rule Display UPDATED（无 Automatic Operation）；Matching/Search UNCHANGED（无 Ranking/Algorithm/Score 变更）；AI Runtime DISABLED（Human In Loop 保持，无 Autonomous Decision/Auto Mutation/AI Workflow）。
- **Documentation Synchronization** ✅：PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md 均含 M25.5 与 M25 CLOSED 记录；639-644 七份 Review Report（六阶段 + 本收口报告）齐备。
- **Git Release Preparation** ✅：M25 全部交付（640-645）统一进入 Release Snapshot `M25_Productization_Foundation_Complete`，作为 M26 起始基线；未混入 Future Candidate / M26 Feature / Experimental Code。
- **M26 Entry Boundary DEFINED** ✅：Allowed（Product Experience Optimization / Content Growth / Operational Intelligence / Search Enhancement / AI Assisted Capability Exploration）；Forbidden（Database uncontrolled expansion / Architecture rewrite / AI autonomous operation / Business workflow mutation / Schema-first expansion）。
- **Impact** ✅：Database / API / Matching / Search / Storage / AI = UNCHANGED；Frontend / Admin = VERIFIED（仅展示/治理层）；Documentation = UPDATED；M25 CLOSED，任何新增进入 M26 Candidate。
- **Review Report** ✅：`docs/_review/645_M25_Final_Closeout_Report.md`。
- **Next** ✅：**M26 Entry**（M25 Productization Foundation = COMPLETED，作为 M26 Development Baseline）。

### 646_Three_Role_Functional_Test — CONDITIONAL PASS

三角色（Buyer / Supplier / Admin）全流程功能测试：服务运行时核验（PostgreSQL/API/Web/Admin 四端 AVAILABLE）+ 演示数据基线核验（产品 6 / 方案 6 / 需求 5 / RFQ 11 / 响应 12 / 内容 7 / 知识 6；Match / FileAsset / ContentTag 为空）+ API 层三角色认证核验（Buyer→BUYER / Supplier→SUPPLIER / Admin→null 设计行为）+ Admin 50+ 路由清单静态核验；API 层全 PASS，UI 层因浏览器自动化会话受限待人工补测。确认缺陷 2 项：D1（`getMe()` 失败静默返回 null → dashboard 误显示“角色未配置”）与 D2（Admin 角色 Web 端无管理控制台引导），由 646.1 修复。

- **Review Report** ✅：`docs/_review/646_Three_Role_Functional_Test_Report.md`。
- **Next** ✅：**646.1_Release_Validation_Patch**（修复 D1/D2，Release Readiness 提升）。

### 646.1_Release_Validation_Patch — COMPLETED

M25 Closeout Validation / M26 Entry Preparation 补丁：修复 646 测试确认的 D1/D2 两项缺陷，纯 Web 展示层改动，保持 M25 架构冻结边界，提升 M25 Release Snapshot 进入 M26 前的验证稳定性。本任务为 Release Validation Patch，非功能开发。

- **D1 Auth Error Handling FIXED** ✅：`apps/web/src/services/auth.service.ts` `getMe()` 区分 401（未登录 → 返回 null，正常态）与网络异常/服务中断/5xx（抛出 → AuthProvider 进入 `authError` 态）；`apps/web/src/auth/AuthProvider.tsx` 新增 `authError` 状态与 `retryAuth()`（重新请求 /auth/me）；`apps/web/src/app/dashboard/page.tsx` 与 `apps/web/src/app/workspace/page.tsx` 增加“认证服务暂不可用 + 重新连接”错误态，不再将认证异常误判为“角色未配置”。
- **D2 Admin Guidance FIXED** ✅：Admin 角色（`organization.type === 'ADMIN'`）访问 Web `/dashboard` 与 `/workspace` 时展示“请使用管理控制台”引导 + “前往 Admin Console”入口（`NEXT_PUBLIC_ADMIN_CONSOLE_URL` ?? `http://localhost:3001`）；非 Admin 保持原“角色未配置 + 前往设置”路径不变。
- **Scope Boundary** ✅：仅修改 4 个 Web 展示层文件（auth.service.ts / AuthProvider.tsx / dashboard/page.tsx / workspace/page.tsx）；Database UNCHANGED（无 Schema/Migration/Enum）；API UNCHANGED（无 Endpoint/Controller/DTO/Auth 变更）；Business Logic（Demand/RFQ/Offer/Matching/Search/Workflow/Rule Engine）UNCHANGED；无新 Package / Token / Identity Type / Storage / AI。
- **Build Verification** ✅：`apps/web` TypeScript 编译 + 类型检查连续 3 次 exit-0 阶段通过（0 errors，仅既有 warnings）；静态生成阶段受 Windows worker/内存环境限制中断（同 644 记录，非代码问题）。
- **Impact** ✅：Database / API / Migration / Storage / Matching / Search / AI = UNCHANGED；Frontend = UPDATED（4 文件）；Documentation = UPDATED。
- **Review Report** ✅：`docs/_review/646.1_Release_Validation_Patch_Report.md`。
- **Next** ✅：**M26 Entry Validation**（M25 Productization Foundation Complete + Release Validation Patch，M26 Development Baseline READY）。

### 647_M26_PreEntry_ThreeRole_E2E_Business_Validation — CONDITIONAL PASS

M26 Entry Validation：真实浏览器操作模拟三核心用户（Buyer / Supplier / Admin）完整业务旅程的 E2E 验证。Admin 旅程 A1-A8（登录/用户/组织/产品/参数/媒体/内容/业务视图）VERIFIED（CONDITIONAL）；Buyer 旅程 B1-B5（公开发现/产品发现/建需求/询价/响应查看）VERIFIED；Supplier 旅程 C1-C5（登录/资料/能力报价/RFQ 响应/反馈）VERIFIED（CONDITIONAL）；业务闭环 VERIFIED（Admin 可见 Buyer 新建需求「闭环验证-需求-20260822000630」已发布；新建需求匹配数为 0 未派发 RFQ 符合冻结语义，RFQ 必须源自 ACCEPTED DemandMatch；既有闭环数据 RFQ 11 / Response 11 佐证链路完整）。

- **Account Verification** ✅：三角色登录成功，/auth/me workspaceRole（BUYER/SUPPLIER）正确，权限隔离正确。
- **Critical Issues（2）** ⚠️：D3（产品媒体页运行时崩溃，前端期待 `{data,total}` vs 后端返回数组）；D4（S3 bucket `visndt-dev` 缺失致媒体上传失败，FileAsset Governance 未恢复）。
- **UX Issues（3）** ⚠️：D1（用户编辑姓名未回填）；D2（产品编辑参数值未回显）；D5（Supplier Profile 保存后 UI 刷新不一致，DB 已持久化）。
- **Architecture Impact** ✅：Database / API / Migration / Storage / Matching / Search / AI = UNCHANGED；本任务 Testing Only，零代码变更。
- **Review Report** ✅：`docs/_review/647_M26_PreEntry_ThreeRole_E2E_Business_Validation_Report.md`。
- **Next** ✅：**M26.0 Fix Window**（修复 D3/D4 Critical + D1/D2 编辑回显，恢复 FileAsset Governance）；建议建立 Playwright E2E 自动化体系。
### 648_M26.0_Fix_Window_Core_Stability — PASS

M26 Entry Stabilization：基于 647 E2E 验证结果的已确认问题最小范围修复（Stability Restoration Before M26）。D1-D5 全部 FIXED，三个应用（Admin / Web / API）`pnpm build` 均 exit 0，三角色浏览器回归通过，D4 上传链路已恢复（Storage RECOVERED）。

- **D1 User Edit（MEDIUM）** ✅ FIXED：`apps/admin/src/pages/UserEdit.tsx` `initialValues` 补充 `name` 字段 → 编辑已有用户时姓名回填。
- **D2 Product Parameter Edit（MEDIUM）** ✅ FIXED：`apps/admin/src/components/product/ProductForm.tsx` 调用 `productParameterService.list(productId)` + `form.setFieldsValue` 回填参数，`name={def.id}` 绑定完成回显。
- **D3 Product Media Runtime Crash（HIGH）** ✅ FIXED：`ProductMediaListResponse` 对齐一维数组，`ProductMediaList.tsx` `result.length` 判空 + `mediaStats` 出分支（空安全），无 `undefined.length` 崩溃。
- **D4 S3 Bucket Missing（HIGH）** ✅ FIXED/RECOVERED：`storage.service.ts` `OnModuleInit` + 幂等 bucket 初始化，上传链路 PASS。
- **D5 Supplier Profile Refresh（LOW）** ✅ FIXED：`profile/page.tsx` `onSuccess` `setQueryData` + `invalidateQueries`，保存后即时刷新。
- **Playwright Boundary** ✅：`tests/e2e/{admin,buyer,supplier}/login.spec.ts` + `business-loop.spec.ts` 脚手架（仅边界准备，不引入测试框架）。
- **Architecture Impact** ✅：Database/Migration = NONE；API 业务契约 UNCHANGED（D4 仅 Storage 幂等初始化）；Matching/Search/AI = UNCHANGED；Storage = RECOVERED。
- **Build & Regression** ✅：Admin / Web / API `pnpm build` exit 0；三角色回归通过。
- **Review Report** ✅：`docs/_review/648_M26.0_Fix_Window_Core_Stability_Report.md`。
- **Next** ✅：**M26 Development Baseline**。

### 649_M26_Operational_Experience_Audit — CONDITIONAL PASS

M26 Development Baseline Validation：基于 648 修复后的稳定基线，通过 Trae Browser Automation 对 VISNDT 平台进行真实浏览器三角色（Admin / Buyer / Supplier）运营体验走查，识别信息架构、页面组织、操作路径、功能可用性、数据展示、运营效率问题与业务流程优化机会，输出 M26 产品优化 Backlog。

- **Runtime Verification** ✅：PostgreSQL（5432）、MinIO（9000-9001）、API（4000）、Web（3000，Next.js 15.5.20）、Admin（3001，Vite 6.4.3）全部 RUNNING。
- **环境修复记录** ⚠️：`.env` 中 `DATABASE_URL` 由 `localhost` 改为 `127.0.0.1`，解决 Windows IPv6 解析导致的 Prisma `P1001` 错误。仅环境配置修复，不影响代码/Schema/API 契约。
- **Admin 旅程** ✅：登录 → 仪表盘（产品7/内容16/用户13/组织11/分类12/参数46/需求5已发布/RFQ 11/未读通知29/待处理45项）→ 产品管理（7条）→ 用户管理（13条）→ 需求管理（8条）→ RFQ管理（11条）。
- **Buyer 旅程** ⚠️：登录后重定向到空白 `/workspace/dashboard`，需手动跳转至 `/dashboard/buyer`；首页加载完整（分类12/推荐4/方案6/知识6/闭环4步）；工作台业务概览 + 待处理事项 + 业务导航闭环；产品中心（分类8 + 参数12维度筛选 + 搜索 + 分页）。
- **Supplier 旅程** ✅：登录 → 工作台（业务概览 + 快捷操作7入口 + RFQ快照 + 响应跟踪 + 最近活动）→ RFQ列表（10条，标注只读）→ 企业资料页编译成功（45s）。
- **IA Audit** ✅：Admin 三级菜单（核心运营/商业运营/系统管理）；Buyer 工作区6入口；Supplier 工作区7入口。
- **Browser Audit Findings** ⚠️：24 项 UX 问题（4 High / 12 Medium / 8 Low）——
  - **High（4）**：U1 全界面中文化（Admin页面标题/Supplier侧边栏/产品页副标题英文）；U2 Buyer 登录重定向空白页；U3 UUID替代可读编号；U4 询价 vs RFQ 术语不统一。
  - **Medium（12）**：A2-A3/A5-A9（Admin统计/分类列/RFQ列/用户角色列）、B2-B5（Buyer工作台/参数单位重复）、S2-S5（Supplier工作台/状态英文/RFQ只读）、C2 Web内存。
  - **Low（8）**：A4/B6-B8/C1 格式与术语一致性。
- **Functional Improvement Backlog（18 项）** ✅：
  - **P0（4）**：FB1 全界面中文化、FB2 Buyer 登录重定向修复、FB3 业务编号体系、FB4 术语统一。
  - **P1（8）**：FB5-FB12 各角色数据展示修复（统计/分类/RFQ列/角色列/参数单位/工作台数据/RFQ响应流程/状态中文化）。
  - **P2（6）**：FB13-FB18 格式统一 / IA 收敛 / Web 内存优化。
- **Business Loop Verification** ✅：产品发现 → 需求创建 → Demand → RFQ → 供应商响应 → 通知触达 全链路闭环。
- **Architecture Impact** ✅：Database / API / Migration / Storage / Matching / Search / AI = UNCHANGED；Frontend = UNCHANGED（审计只读）；.env 配置修复（localhost → 127.0.0.1）除外。
- **Review Report** ✅：`docs/_review/649_M26_Operational_Experience_Audit_Report.md`。
- **Next** ✅：**M26 Optimization Planning**（优先处理 P0：FB1-FB4），建议建立 Playwright E2E 回归自动化。

### 650_M26_Optimization_Roadmap_And_Priority_Planning — PASS

M26 Optimization Planning：基于 649 三角色真实浏览器审计结果，对 M26 Optimization Phase 进行整体规划（Audit / Architecture Planning / Roadmap Refinement，零代码变更）。将 649 的 24 项 Findings（A×10/B×9/S×5/C×3）重新分类为 P0×4（User Blocking）/ P1×8（Operation Efficiency）/ P2×6（Product Experience）/ Future×8（延期）。18 项优化全部为 Frontend Only 或工程配置，零 Database / API / Business Logic 变更。

- **649 Finding Consolidation** ✅：A1-A10（Admin）/ B1-B9（Buyer）/ S1-S5（Supplier）/ C1-C3（Cross Role）全部汇总。
- **Priority Classification** ✅：
  - **P0（4）**：全界面中文化（A1/S1/B6）、Buyer 登录重定向（B1）、UUID 展示治理（A6/B3/S3/C3）、术语统一（C1/A5/B4）。
  - **P1（8）**：Admin 数据展示修复（A2/A3）、Admin RFQ 管理增强（A5/A7/A8）、Admin 用户角色列（A9）、参数单位去重（B5）、Buyer 工作台数据（B2）、Supplier 工作台数据（S2/S4）、Supplier RFQ 响应入口（S5）。
  - **P2（6）**：预算格式统一（A4/B7）、需求数量显示（B8）、Admin IA 收敛（FB16）、Admin 内容中心重组（FB17）、Web 内存优化（C2）、控制台请求优化（A10）。
  - **Future（8）**：AI 智能推荐 / 自动报价 / 高级分析 / 在线交易 / CRM 能力 / Database Business Number Field（方案 B/C）/ Supplier 多轮谈判工作流 / Figma 视觉 Diff 自动化。
- **Architecture Impact Matrix** ✅：18 项优化全部 Frontend Only 或工程配置，零 DB / API / Business Logic / Migration 变更。
- **Identity System 方案决策** ✅：UUID 治理采用**方案 A（Frontend Format Layer）**，复用 `@visndt/identity-contract`（641 已交付）的 `deriveBusinessIdentity`；方案 B（Database Business Number Field）REJECTED（违反 Database Freeze）；方案 C（统一 Identifier Service）DEFERRED。
- **M26.1 Foundation Experience Stabilization** ✅ DEFINED：4 项 P0 任务（中文化 / 登录重定向 / UUID 治理 / 术语统一）。
- **M26.2 Operation Efficiency Improvement** ✅ DEFINED：8 项 P1 任务（Admin 数据/RFQ/角色列、参数单位、Buyer/Supplier 工作台、Supplier RFQ 响应入口）。
- **M26.3 Product Experience Enhancement** ✅ DEFINED：7 项 P2 任务（格式统一 / IA 收敛 / 内存优化 / 请求优化 / Final Regression Audit）。
- **Future Candidate** ✅ DEFINED：8 项延期至 M27+ 或不实施。
- **Risk Assessment** ✅：零 DB 冻结影响 / 业务闭环 UNCHANGED（Demand→DemandMatch→RFQ→RFQResponse→Notification）/ 无高风险项 / 不触发 ADR 评审。
- **Architecture Impact** ✅：Database / API / Migration / Storage / Matching / Search / AI 全部 UNCHANGED；Frontend 展示层与工程配置 Only；零代码变更。
- **Review Report** ✅：`docs/_review/650_M26_Optimization_Roadmap_And_Priority_Planning_Report.md`。
- **Next** ✅：**M26 Optimization Implementation Planning**（进入 M26.1 P0 Optimization 实施：FB1-FB4）。

### 651_M26.1_P0_User_Blocking_Optimization_Implementation — PASS

M26.1 Foundation Experience Stabilization：实施 4 项 P0 用户阻断问题修复（FB1-FB4），使 VISNDT 平台达到基础产品化体验标准。共修改 17 个文件（1 包 + 10 Web + 6 Admin），零 Database / API / Business Logic / Migration 变更。

- **FB1 全平台中文化** ✅：
  - Web：products/page IndustrialBadge 副标题（"Industrial Capability Discovery"→"工业检测能力发现"）；WorkspaceIdentityBar（"VISNDT Workspace"→"VISNDT 工作区"）；HeroBanner（英文标题/副标题/按钮→中文）；Supplier 菜单全英文→中文（RFQs→RFQ 机会 / Responses→我的响应 / Offers→我的报价 / Opportunities→商机 / Profile→企业资料 / Notifications→通知中心 / Display→能力展示）；supplier/rfqs/page Demand 标签→需求。
  - Admin：ProductList 页面标题（"Product Capability Operations"→"产品能力管理"）；OperationCenter 副标题（"Admin Operation Center"→"管理运营中心"）；index.css 注释中文化。
- **FB2 登录重定向修复** ✅：login/page.tsx `router.replace('/workspace/dashboard')` → `router.replace('/dashboard')`，复用 /dashboard/page.tsx 已有角色分流逻辑（BUYER→/dashboard/buyer, SUPPLIER→/dashboard/supplier, ADMIN→管理控制台引导），零硬编码，基于现有 RBAC 体系。
- **FB3 UUID 展示治理** ✅：
  - identity-contract 扩展：新增 `RFQ_RESPONSE` 类型（BusinessEntityType + IDENTITY_PREFIX='RESP' + ENTITY_LABEL='响应'），前端契约扩展，非 Schema/API 变更。
  - 6 处 UUID 泄漏替换为 `<BusinessIdentityBadge>`：Admin RfqResponseDetail（response.id）；Web supplier/rfqs/page（rfq.id）；Web supplier/rfqs/[id]/page（rfq.id）；Web supplier/responses/page（response.id）；Web supplier/opportunities/page（rfq.id×2 + rfq.demand.id）。
  - 方案 A（Frontend Format Layer）确认：复用 641 identity-contract 的 `deriveIdentity`，零 Schema 变更。
- **FB4 RFQ 术语统一** ✅：
  - identity-contract ENTITY_LABEL.RFQ：'询价单'→'询价请求'。
  - Admin 菜单：'询价管理'→'产品询价'（明确区分 产品询价 vs RFQ 管理）；'RFQ管理'→'RFQ 管理'；roles.ts 同步。
  - Web Buyer 菜单：'询价单'→'我的询价请求'；BuyerWorkspaceEntry 同步。
  - Admin RfqResponseDetail 标题：'询价响应详情'→'RFQ 响应详情'。
- **Identity Audit Gate** ✅：identity-contract 审计通过（8→9 类型，deriveIdentity/shortIdentity 稳定，BusinessIdentityBadge 跨 Web/Admin 复用）；RFQ_RESPONSE 类型新增为前端契约扩展（非 Schema/API 变更）。
- **Architecture Impact** ✅：Database / API / Migration / Storage / Matching / Search / AI 全部 UNCHANGED；Frontend 展示层 + 路由 + identity 契约扩展 Only；零 Migration，零 ADR 评审。
- **Build Verification** ✅：identity-contract（exit 0）/ design-system（exit 0）/ Web（exit 0, 需 NODE_OPTIONS=--max-old-space-size=8192）/ Admin（exit 0）全部通过。
- **Regression Verification** ✅：Demand / DemandMatch / RFQ / RFQResponse / Notification 全程 UNCHANGED。
- **Review Report** ✅：`docs/_review/651_M26.1_P0_User_Blocking_Optimization_Implementation_Report.md`。
- **Next** ✅：**652_M26.2_Operation_Efficiency_Improvement_Implementation**（P1 运营效率提升：FB5-FB12）。

### 652_M26.2_Operation_Efficiency_Improvement_Implementation — PASS

- **Stage** ✅：M26.2 Operation Efficiency Improvement（P1 运营效率提升）
- **Baseline** ✅：651 PASS / 650 PASS / 649 CONDITIONAL PASS / 648 PASS
- **Architecture Freeze** ✅：Database / API / Business Logic / Matching / Search / AI Runtime — UNCHANGED
- **Admin Changes** ✅：
  - `UserList.tsx`：标题 `User & Identity Operations`→`用户管理`；新增"角色"列（基于 organization.type 派生：采购方/供应商/未分配），复用 `organizationService.getList` 构建 orgId→type 映射。
  - `UserEdit.tsx`：标题 `Edit User`→`编辑用户`；副标题中文化。
  - `RfqList.tsx`：标题 `RFQ Operations`→`RFQ 管理`；按钮 `创建询价`→`创建 RFQ`；编号列 UUID→BusinessIdentityBadge；新增"目标供应商"列（targetOrganizationId + orgNameMap）；需求列按 Demand 分组（rowSpan UI 聚合）。
  - `rfq.types.ts`：Rfq 接口新增 `targetOrganizationId?: string | null`（后端模型已有此字段，仅前端类型未声明）。
- **Web Changes** ✅：
  - `lib/format.ts`（新建）：统一参数值+单位格式化器（formatParameterValue / formatValueWithUnit），解决 `0.02mm mm`→`0.02 mm` 格式问题，支持尾部单位去重。
  - `dashboard/buyer/page.tsx`：formatStatusCounts 状态名中文化（DRAFT→草稿等）；Decision card UUID→BusinessIdentityBadge + `响应编号`；`decision.status` 中文化；`查看询价`→`查看询价请求`；`询价`卡片→`询价请求`；导航项`询价管理`→`我的询价请求`。
  - `dashboard/supplier/page.tsx`：formatStatusCounts 中文化；`RFQ ID: {rfq.id}`→BusinessIdentityBadge（2 处）；`Response ID: {response.id}`→BusinessIdentityBadge；`可参与报价`→`可参与响应`。
  - `DemandParameters.tsx` + `CompareTable.tsx`：应用 formatValueWithUnit 统一格式化。
- **Already Implemented** ✅（648/651 已交付，本次确认）：Admin 产品统计卡片（governanceStats）、Admin 需求分类显示（demand.category?.name）、Supplier Dashboard 指标（待处理 RFQ/已提交响应/匹配机会/公开 RFQ/我的 Offer/未读通知）、Supplier 状态中文化（RFQStatusBadge/RFQResponseStatusBadge）、Supplier RFQ 机会→提交响应入口（rfqs/[id]/page.tsx）。
- **Architecture Impact** ✅：Database / API / Migration / Matching / Search / AI 全部 UNCHANGED；RFQResponse = Reuse Only（仅调用已有创建接口，无新增状态/流程）。
- **Build Verification** ✅：Admin（exit 0）/ Web（exit 0, 需 NODE_OPTIONS=--max-old-space-size=8192）全部通过。
- **Regression Verification** ✅：Demand / DemandMatch / RFQ / RFQResponse / Notification 全程 UNCHANGED。
- **Review Report** ✅：`docs/_review/652_M26.2_Operation_Efficiency_Improvement_Implementation_Report.md`。
- **Next** ✅：**653_M26.3_Advanced_Experience_Optimization_Implementation**（P2 高级体验优化）。

### 653.1_M26.3_Content_Center_Architecture_Optimization — PASS

- **Stage** ✅：M26.3 Extension — Content Center Architecture Optimization（Admin IA 优化补充，M27 Content Asset System 入口边界冻结）
- **Baseline** ✅：653 PASS / 652 PASS / 651 PASS。
- **Architecture Freeze** ✅：Database / API / Business Logic / Matching / Search / RFQ / RFQResponse / AI Runtime — UNCHANGED，Migration NONE。
- **Objective** ✅：将 Admin 从技术型命名收敛为运营型模块导航；为 M27 Content Asset System 建立稳定入口；精简左侧菜单层级；媒体中心隐藏一级入口、保留扩展能力。仅 Information Architecture 优化，零新增业务能力。
- **Admin IA After** ✅（运营型目标结构）：
  - 首页：`/home` 首页、`/operation-center` 运营中心
  - 产品中心：`/products` 产品管理、`/product-categories` 产品分类、参数体系（`/parameter-groups` 参数组、`/parameter-definitions` 参数定义）
  - 业务中心：`/demands` 需求管理、`/rfqs` RFQ 管理、`/offers` 报价管理、`/inquiries` 产品询价、`/matching` 匹配管理
  - 用户与供应商：`/users` 用户管理、`/organizations` 企业管理
  - 内容中心：`/content` 文章管理、知识库（`/knowledge/entries` 知识条目、`/knowledge/domains` 知识分类、`/product-category-knowledge-mappings` 知识分类映射）、`/content/tags` 标签管理
  - 数据与监控：`/analytics` 数据分析、`/business-analytics` 业务分析、`/monitoring` 运营监控、`/audit-intelligence` 审计智能
  - 系统管理：`/notifications` 通知管理、`/audit-logs` 审计日志、`/embedding` AI 数据准备
- **Media Center Handling** ✅：`/media` 媒体中心从一级菜单隐藏（保留路由，M27 Media Asset 扩展时恢复入口）。
- **AdminLayout.tsx Changes** ✅：`menuGroups` 重组为 7 个运营分组（home/product/business/permission/content/data/system）；`breadcrumbMap` 更新（首页/产品分类/文章管理/企业/知识条目/知识分类映射标签中文化）；`openKeys` 默认展开 `knowledge`。
- **Architecture Impact** ✅（仅 Admin 前端文件）：Database / API / Migration / Matching / Search / AI 全部 UNCHANGED；RFQ / RFQResponse = Reuse Only / Existing Flow；Business Logic UNCHANGED。
- **Build Verification** ✅：`apps/admin pnpm run build` exit 0（仅修改 Admin 文件，Web 无需重构建）。
- **Regression Verification** ✅：Admin Menu Rendering PASS（无重复入口 / 无死链入口，所有菜单项均映射至既有已注册路由）；Business Regression — Demand / RFQ / RFQResponse / Offer / Notification 全 PASS。
- **Review Report** ✅：`docs/_review/653.1_M26.3_Content_Center_Architecture_Optimization_Report.md`。

### 654_M26.4_Commercial_Closure_Enhancement_Implementation — PASS

- **Stage** ✅：M26.4 Commercial Closure Enhancement（商业闭环体验增强，复用既有能力）。
- **Baseline** ✅：653.1 PASS / 653 PASS / 652 PASS / 651 PASS。
- **Architecture Freeze** ✅：Database / API / Business Logic / Matching / Search / RFQ / RFQResponse / AI Runtime — UNCHANGED，Migration NONE，Admin IA FROZEN，M27 边界零渗漏。
- **Objective** ✅：在不改变业务模型前提下增强商业闭环（Demand → DemandMatch → RFQ → RFQResponse → Notification）体验——Shopify 输出聚焦三角色展示一致性与中文化。
- **Supplier Experience** ✅：RFQ 机会 → 查看需求 → 提交响应 → 查看响应状态 全链路已存在且已中文化（653），本次保持。复用 `createRfqResponse`，状态展示复用 `RFQResponseStatusBadge`，Reuse Only。
- **Buyer Experience** ✅：`workspace/rfqs/[id]` 响应审核页中文化补齐——状态文案（SUBMITTED/VIEWED/ACCEPTED/REJECTED → 已提交/已查看/已接受/已拒绝）、决策按钮（Accept/Reject → 接受/拒绝）、面板标题（Response Review → 响应审核）、字段标签（Offer/Message → 报价/响应说明）、决策提示中文化；`workspace/rfqs` 与 `RFQList` 术语统一（询价 → 询价请求）。决策仍复用既有 `view/accept/reject` 现有接口，零状态机变更。
- **Admin Experience** ✅：`RfqList.tsx` 需求列在标题下新增 Demand 编号 `BusinessIdentityBadge`（DEMAND），强化 Demand↔RFQ 商业运营联动展示；`RfqResponseDetail` 状态管理已中文化（653）保持不变。
- **Changed (via 前端展示层)** ▶
  - `apps/web/src/app/workspace/rfqs/[id]/page.tsx`（Buyer 响应审核中文化）
  - `apps/web/src/app/workspace/rfqs/page.tsx`（询价请求术语统一）
  - `apps/web/src/components/rfq/RFQList.tsx`（空状态术语统一）
  - `apps/admin/src/pages/RfqList.tsx`（需求列 Demand Identity）
- **Architecture Impact** ✅：仅 4 个前端展示文件；Database / API / Migration / Matching / Search / AI 全 UNCHANGED；RFQ / RFQResponse = Existing Flow / Reuse Only；Business Logic UNCHANGED。
- **Build Verification** ✅：`apps/web pnpm run build` exit 0；`apps/admin pnpm run build` exit 0。
- **Regression Verification** ✅：Demand / DemandMatch / RFQ / RFQResponse / Notification 全 PASS。
- **Review Report** ✅：`docs/_review/654_M26.4_Commercial_Closure_Enhancement_Implementation_Report.md`。

### 655_M27.0_Content_Architecture_Audit_And_Implementation_Planning — Completed（AUDIT COMPLETE）

- **Stage** ✅：M27.0 Content Architecture Foundation（架构审计 + M27 实施边界定义）。
- **Type** ✅：Architecture Audit / Capability Assessment / Schema Impact / Boundary Definition。**只审计，零代码变更。**
- **Architecture Freeze** ✅：Database AUDIT ONLY；API/Backend/Business Logic/RFQ/RFQResponse/Matching/Search/AI UNCHANGED；Migration NONE；Admin IA FROZEN；Media Center DEFERRED。
- **核心发现（决定性）** ✅：**Content/Knowledge/SEO 体系并非绿地——`012`→`016` 迁移系列已端到端建成 Content Asset System 全栈基线**：
  - Prisma `contents`、`content_tag(+relation)`、`content_media`、`content_revision`、`content_chunk`、`knowledge_domain/category/entry`、`KnowledgeContentRef`、`KnowledgeRelation`、`product_category_knowledge_mapping` 全部存在（schema.prisma L797–1122）。
  - `ContentType`(ARTICLE/KNOWLEDGE/SOLUTION/INSIGHT)、`ContentStatus`(DRAFT/REVIEW/PUBLISHED/ARCHIVED)、`ContentTagType`、`scheduledPublishAt` 齐全。
  - API：ContentController（公开 list/slug + admin CRUD + `submit/review/publish/archive` 发布工作流）、KnowledgeController + knowledge-public、ContentTagController 全部存在。
  - Admin CMS：ContentList（status 治理统计：已发布/审核中/已归档）、ContentTagList、Knowledge* 全部存在。
  - Web 公开渲染：`/knowledge`、`/articles`、`/insights`、`/solutions`、`/about`、`/business`、`/tags`、`/categories`、`/knowledge-base` 均有列表+详情页。
  - SEO：`sitemap.ts`（静态+内容详情动态收录）、`generateMetadata`(canonical/OpenGraph)、JSON-LD + BreadcrumbList 已实现；**缺口：`robots.ts` 缺失。**
- **M27 定位修正** ✅：M27 = **收口与补全**（SEO 基础补全 robots/SEO 常量层 + 知识双轨制边界定义 Content.type=KNOWLEDGE vs KnowledgeEntry + 统一 Content 聚合页 + Admin 编辑器体验），非绿地建设；禁止重建既有 Content/Knowledge。
- **M27 Deferred** ✅：Media Center(保留 /media 路由) / AI Content Generation / Automatic SEO / Recommendation / Commercial Content Matching。
- **零代码改动** ✅：本次未新增 Prisma 模型、零 Migration、零 API/Controller/Service 变更、零业务逻辑变更。
- **Review Report** ✅：`docs/_review/655_M27.0_Content_Architecture_Audit_And_Implementation_Planning_Report.md`。
- **Next** ✅：**656_M27.1_Content_Center_Implementation**（定位：Content/Knowledge/SEO 既有体系收口与补全）。

### 656.1_M27.1_Content_Knowledge_Boundary_Decision_Audit — Completed（Architecture Decision / PASS）

- **Stage** ✅：M27.1 Content Foundation Consolidation（架构决策门禁，零代码变更）。
- **Type** ✅：Architecture Audit / Decision / Boundary Definition。
- **Architecture Freeze** ✅：Database AUDIT ONLY（Decision Only，UNCHANGED）；API/Backend/Business Logic/RFQ/RFQResponse/Matching/Search/AI UNCHANGED；Migration NONE；Admin IA FROZEN；Media Center DEFERRED。
- **核心决策（冻结）** ✅：
  - **Content = 运营传播资产**，类型 `ARTICLE / SOLUTION / INSIGHT`。
  - **KnowledgeEntry = 工业检测专业知识资产**，类型 `Technical Knowledge / Inspection Method / Application Case`（由既有 `KnowledgeCategory` 承载，零新增字段/枚举）。
  - **`Content.type=KNOWLEDGE` 进入废弃路线**：保留枚举值（兼容存量、零 Schema 变更、无删除性迁移），运营侧不再新建 KNOWLEDGE 型内容，新知识统一落 KnowledgeEntry；存量内容由运营逐步迁移至 ARTICLE/INSIGHT 或 KnowledgeEntry；**本期不迁移、不 Redirect**。
- **URL 收敛决策（Decision Only）** ✅：实测 `/knowledge` 走 `Content.type=KNOWLEDGE`，`/knowledge-base` 走 KnowledgeEntry；权威知识入口定为 `/knowledge-base`；`/knowledge` 随 Content 型知识废弃不再作为知识权威入口；**本期禁止执行 Redirect**，收敛动作归 M27.3 门禁。
- **Schema Impact** ✅：**零 Schema 变更（UNCHANGED / Decision Only）**——现有 `Content` 多态 + `KnowledgeEntry` 独立台账本满足目标架构；Content.type=KNOWLEDGE 与 KnowledgeEntry 的职责重复以「语义废弃」收敛，非结构迁移。
- **SEO Impact** ✅：`/knowledge-base` 为知识结构化数据/JSON-LD 权威；消除 /knowledge 与 /knowledge-base 同语义双 URL 的权重稀释（收敛+301 归 M27.3）。
- **后续边界（M27.2/M27.3）** ✅：M27.2 = SEO 基础补全 + Content 统一聚合页 + Admin 编辑器收口；M27.3 = Content 型知识存量迁移/废弃清理 + URL 权威化（迁移后 301 决策）。始终 EXCLUDED：Media Center(保留 /media 路由) / AI Content Generation / SEO 自动生成 / 推荐算法 / 商业内容匹配。
- **零代码改动** ✅：本任务仅架构决策 + 文档，未改 Prisma / Migration / API / Controller / Service / DTO / AdminLayout / Media / AI。
- **Review Report** ✅：`docs/_review/656.1_M27.1_Content_Knowledge_Boundary_Decision_Audit_Report.md`。
- **Next** ✅：**656.2_M27.1_Content_Foundation_Enhancement_Implementation**。

### 656.2_M27.1_Content_Foundation_Enhancement_Implementation — Completed（Frontend Enhancement / PASS）

- **Stage** ✅：M27.1 Content Foundation Consolidation（SEO Foundation + Content Experience + Admin Content 增强，仅前端展示层，零后端变更）。
- **Type** ✅：Frontend Enhancement / SEO Foundation Improvement / Content Experience Optimization。
- **Architecture Freeze** ✅：Database UNCHANGED（0 Schema / 0 Migration）；API UNCHANGED；Knowledge Model FROZEN；RFQ/RFQResponse/Business Logic UNCHANGED；Admin IA FROZEN；Media Center & AI Runtime DEFERRED。Content 架构保持 ARTICLE/SOLUTION/INSIGHT，Content.type=KNOWLEDGE 废弃路线保持（KEEP ENUM / NO NEW DATA）。
- **SEO Foundation Enhancement** ✅：新增 `robots.ts`（/robots.txt：allow `/`，disallow `/api/`、`/search`，指向 sitemap——655 确认缺口）+ 新增统一 SEO 规则层 `lib/seo-config.ts`（`buildPageMetadata`：Title 交根布局模板、Description/Keywords 回退、canonical 统一 `absoluteUrl`）+ `sitemap.ts` 静态/动态路由补 `changeFrequency`+`priority`（首页 1.0 / 产品·知识 0.9 / 内容 0.4–0.7 分级）。AI SEO 生成 / Keyword Mining / Auto Optimization 全程禁止未实施。
- **Public Content Experience** ✅：新增共享 `ContentListLayout`（Hero + 计数 + 卡片网格 + 空态），`/articles` `/solutions` `/insights` 三列表页统一重构 + 统一 `buildPageMetadata`；空态收敛为 `EmptyState` 组件；仅复用既有 `getContentList`（Content API Existing Capability Only），零新增 API/Search/Recommendation。
- **Admin Content Experience** ✅：`ContentList.tsx` SEO 列升级（等级 Tag + Tooltip 展开 SEO 标题/描述/关键词预览与缺失提示），状态/发布信息展示保持，页面内部体验优化，Admin IA 未改。
- **Build Verification** ✅：`apps/web` `tsc --noEmit` exit 0 + `next build` exit 0（41 页含 `/robots.txt` `/sitemap.xml`，无新增警告）；`apps/admin` `tsc -b && vite build` exit 0（5940 modules）。
- **Review Report** ✅：`docs/_review/656.2_M27.1_Content_Foundation_Enhancement_Implementation_Report.md`。
- **Next** ✅：**657_M27.2_Content_Operation_Experience_Optimization**。

### 657_M27.2_Content_Operation_Experience_Optimization — Completed（Admin Operation Experience / Frontend Enhancement / PASS）

- **Stage** ✅：M27.2 Content Asset Operation Enhancement（Admin 内容运营效率 + 内容治理能力，仅前端展示层，零后端变更）。
- **Architecture Freeze** ✅：Database UNCHANGED（0 Schema / 0 Migration）；API UNCHANGED（Endpoint/DTO 无变更）；Knowledge Model / Content Architecture / Admin IA FROZEN；RFQ/RFQResponse/Matching/Business Logic UNCHANGED；Media Center / AI Runtime DEFERRED。Content 架构保持 Article/Solution/Insight，Content.type=KNOWLEDGE 废弃路线保持。
- **Content Quality Visibility** ✅：新增 `ContentHealthIndicator` 组件 + `computeContentHealth`（四信号加权计算：SEO 40% + 封面 30% + 标签 15% + 发布就绪 15%，纯前端派生，不新增数据库字段）；ContentList 新增「健康度」列（星级 0-5 + 健康/待补全/需处理标签 + Tooltip 逐项信号明细）。
- **Publishing Operation Experience** ✅：ContentList「发布时间」列增强——已发布显示时间 / 定时未发显示橙色「定时 HH:mm」Tag（含 scheduledPublishAt 变更至 657 前未披露的展示缺口）/ 未发布占位；状态筛选、更新时间、创建时间列保持。
- **Tag / Category Visibility** ✅：标签列与类型列复用既有 `tags` / `type` 数据，零新增 taxonomy。
- **Product Association Visibility** ✅：审计确认既有 Content 类型与 contentService 均无关联产品字段/端点，按指令**未新增 API**，记为 **Future Candidate**（待后续经 API 提供后接入关联产品数量/名称展示）。
- **Build Verification** ✅：`apps/web` `next build` exit 0（41 页，警告为既有 error.tsx/img 类）；`apps/admin` `tsc -b && vite build` exit 0（5941 modules）。
- **Review Report** ✅：`docs/_review/657_M27.2_Content_Operation_Experience_Optimization_Report.md`。
- **Next** ✅：待定（M27 内容资产运营，建议路线持续延展）。

### 658_M27.3_Knowledge_Consolidation_Audit_And_Implementation_Planning — Completed（Knowledge Consolidation / Frontend Enhancement / PASS）

- **Stage** ✅：M27.3 Knowledge Consolidation（Knowledge 专业知识资产中心收敛 + Knowledge SEO / 公开知识入口体验优化，仅前端展示层，零后端变更）。
- **Type** ✅：Architecture Audit / Schema Impact Assessment / Controlled Frontend Enhancement / SEO Convergence。
- **Architecture Freeze** ✅：Admin IA FROZEN；Content Architecture FROZEN；Knowledge Boundary FROZEN；Database AUDIT FIRST（结论 UNCHANGED，0 Schema / 0 Migration）；API / RFQ / RFQResponse UNCHANGED；Media Center / AI Runtime DEFERRED。
- **Existing Knowledge Capability Audit** ✅：`KnowledgeDomain` / `KnowledgeCategory` / `KnowledgeEntry`（含 `structuredBody` + `seoTitle`）/ `KnowledgeRelation` / `ProductCategoryKnowledgeMapping` 均已存在（schema.prisma）；知识类型由 `Domain + Category + structuredBody + Relation` 表达，**无 `knowledgeType` 字段**，符合冻结架构（Technical Knowledge / Inspection Method / Application Case）。
- **Content.type=KNOWLEDGE Audit** ✅：/knowledge 映射 `Content.type=KNOWLEDGE`；本次仅验证，未自动迁移 / 未删除枚举 / 未改历史数据，保持 `KEEP ENUM / NO NEW DATA / NO MIGRATION`，仅做展示层收敛。
- **Schema Impact Assessment** ✅：`KnowledgeEntry` 已具备 `structuredBody`（Json）与 `seoTitle`，架构承载完整；无需新增 `knowledgeType`；结论 **Database UNCHANGED（0 Schema / Migration NONE）**，无需 Schema Impact Report / 无需停止。
- **API Impact Assessment** ✅：既有 API 全支持（List / Detail / Domain / Category 查询），满足 `Reuse Existing API First`；**API UNCHANGED**。
- **Knowledge Experience Implementation** ✅：`knowledge-base/page.tsx`（metadata 统一 `buildPageMetadata` + Hero 升级「工业检测知识中心」+ `Knowledge Center` 眉标）；`knowledge-base/domains/[slug]/page.tsx`（统一 metadata + 新增 BreadcrumbList JSON-LD + Breadcrumb「知识库」→「知识中心」）；`knowledge-base/[slug]/page.tsx`（Breadcrumb 文案收敛）；`knowledge-base/error.tsx`（文案收敛）——全部展示层 + SEO 收敛，未新增 API / 未改数据库 / 未改业务逻辑。
- **SEO Verification** ✅：metadata / canonical / breadcrumb（BreadcrumbList JSON-LD）/ JSON-LD（KnowledgeEntry LD 保持）/ sitemap（`/knowledge-base` + 条目既有收录）全收敛。
- **Build Verification** ✅：`apps/web` typecheck（tsc --noEmit）exit 0 + `next build` exit 0（41 页，含 `/knowledge-base`、`/knowledge-base/[slug]`、`/knowledge-base/domains/[slug]`、`/robots.txt`、`/sitemap.xml`；警告均为既有 error.tsx/img 类）。
- **Regression Verification** ✅：未改 API 契约 / DTO / 数据库模型 / Migration / AdminIA / Content·Knowledge 模型 / RFQ·Matching；领域导航、分类、条目、相关产品、知识关系全部数据链路复用既有 API，行为无回归；Content.type=KNOWLEDGE 废弃路线全程保持。
- **Review Report** ✅：`docs/_review/658_M27.3_Knowledge_Consolidation_Audit_And_Implementation_Planning_Report.md`。
- **Next** ✅：待定（M27 内容资产运营，建议路线持续延展）。

## Next Step

### M28.0 Product Ownership & Supplier Capability Model Audit — 659（Audit Only / COMPLETED）

> 结论已输出：**Product Ownership = 平台全球目录（Global Catalog，无 organizationId/ownerId）**；**Supplier Capability = Product + Supplier Offer 模型（Model B）**。详见会话内审计结论；按指令**不生成 659 报告文档**。

## Next Step

### M20.1 Frontend Platformization Development Planning（M20 Architecture Planning）

M18.4.1（449）Workflow Reliability Foundation、M18.4.2（450）Content Revision、M18.4.3（451）Scheduled Publish、M18.4.4（452）Approval Timeline 均已实现，**M18.4 Workflow Operation Enhancement 阶段闭环完成**；**M18.5.1 Content Operation Stability Audit（453）已完成（稳定化基线审计，无风险结论）**；**M18.5.2 Content Operation Type & Bundle Optimization（454）已完成（类型导入规范治理 + Admin Bundle 优化，主 chunk 1854.61→1844.77 kB + 4 个 lazy chunk）**；**M18.5.3 Content SEO Operation Enhancement（455）已完成（Admin SEO 运营面板 + 质量提示 + 搜索结果预览，Web SEO 链路验证通过）**；**M18.5.4 Content Operation Final Audit（456）已完成（最终稳定性审计，三层职责边界/数据库/调度/Admin/安全全 PASS，M18.5 Content Operation Stabilization 阶段关闭）**。**M19 阶段已启动（架构冻结完成）**：**M19 架构冻结（457-460 已完成）**——457 平台能力重评审计、458 M19 架构再评估 Blueprint、459 M19 实施 Blueprint、460 M19.1 Product Center V2 实施规划均已生成，**M19 产品体验架构状态冻结**；**M19.1.1 Product Search Frontend Integration（462）已完成**——后端已具备的 `parameterFilters` 动态参数筛选能力已接入 Web 前端（`lib/api/products.ts` 透传 + `ParameterFilterPanel` 动态面板 + 页面 state/query 同步，`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.1.2 Product Detail Experience Enhancement（463）已完成**——技术参数 ParameterGroup 分组展示、Supplier Capability 展示（Offer.organization）、Inquiry 禁止自动选择 Offer（`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.1.3 Supplier Capability & Inquiry Experience Enhancement（464）已完成**——ManufacturerInfo 接入 offers.organization、Supplier 展示增强、Inquiry 交互完善（`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.1.4 Product Center V2 Experience Stabilization（465）已完成**——产品列表/详情/供应商/询价全链路体验稳定化（`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.2.0 Supplier Display Architecture Audit（466）已完成**——架构审计通过（Code Change = None）；**M19.2.1 Supplier Capability Page（467）已完成**——Public Supplier Page（`apps/web` build exit 0）；**M19.2.2 Product Detail Supplier Section（468）已完成**——ManufacturerInfo + SupplierCapabilityList 供应商主页链接（`apps/web` build exit 0）；**M19.2.3 Pre-Audit（469）已完成**——审计通过（Code Change = None）；**M19.2.3 Information Architecture Audit（470）已完成**——信息架构冻结（Code Change = None）；**M19.2.3 Workspace Supplier Display Management（471）已完成**——Dashboard 展示管理入口 + 5 模块 Display Management 页面（`apps/web` build exit 0）；**M19.2.4 Supplier Display Capability Closure Audit（472）已完成**——闭环审计通过，M19.2 CLOSED；**M19.3.0 Search Experience Enhancement Architecture Audit（473）已完成**——搜索架构冻结，搜索边界明确，四层 IA 冻结，零 Schema/API 变更，M19.3 开发边界冻结；**M19.3.2.1 Supplier Discovery Boundary Correction（476）已完成**——删除公开供应商目录/恢复 Product-driven Capability Discovery，Supplier = Capability Provider 边界重新对齐，`apps/web` build exit 0，Schema/Migration/API 均 None；**M19.3.3 Search Experience Enhancement Closure Audit（477）已完成**——M19.3 CLOSED，架构冻结保持，四类搜索边界验证通过，零 Schema/API 变更，Code State = Documentation State；**M20.0.0 M20 Architecture Planning Pre-Audit（483）已完成**——M20 方向冻结：Frontend Platformization (P1) + Content Asset Planning (P2) + AI Readiness Planning (P3)；**M20.1 Frontend Platformization Development Planning Audit（484）已完成**——M20.1.1~M20.1.5 开发边界冻结；**M20.1.1 Product Discovery Enhancement Architecture Design Audit（485）已完成**——12 项组件设计冻结；**M20.1.1 Phase 1 Development（486）已完成**——5 P0 components implemented, build exit 0；**M20.1.2 Search Experience Unification Architecture Design Audit（487）已完成**——架构设计 PASS，开发授权 READY，Code Change = None（Architecture Design Only）；**M20.1.2 Search Experience Unification Development（488）已完成**——10 组件 + 1 页面 + 1 服务 + 1 修改，build exit 0，Backend/Schema/Migration/API = None；**M20.1.3 Search Experience Optimization Architecture Design Audit（489）已完成**——Architecture Audit PASS，17 gaps identified (3 P0 + 6 P1 + 8 P2)，Development Authorization: PROCEED；**M20.1.3 Search Experience Optimization Development（490）已完成**——3 P0 + 5 P1 implemented，build exit 0，Backend/Schema/Migration/API = None；**M20.1.4 Search Experience Final Audit（491）已完成**——M20.1 Search Experience Phase: PASS，Architecture: FROZEN，M20.1 → M20.2 Transition: AUTHORIZED；**Code State = Documentation State**；下一步 M20.2 Content Asset Planning。

M18.5 进入前要求：
- [x] 449 报告生成（M18.4.1 Workflow Reliability Foundation 完成）
- [x] 450 报告生成（M18.4.2 Content Revision Implementation 完成）
- [x] 451 报告生成（M18.4.3 Content Scheduled Publish Implementation 完成）
- [x] 452 报告生成（M18.4.4 Content Approval Timeline Enhancement 完成）
- [x] 453 报告生成（M18.5.1 Content Operation Stability Audit 完成）
- [x] M18.4 阶段闭环（Revision History / Scheduled Publish / Reviewer Record / Approval History 全部落地）
- [x] M18.5 稳定化基线审计通过（无高风险，无代码变更）
- [x] 保持 WorkflowEvent / AuditLog / ContentRevision 三层职责分离、Public Content API 稳定

### Priority 2 — 已记录待办（低优先级）

1. **配置生产正式域名 SEO 参数** — 部署时设置 `NEXT_PUBLIC_SITE_URL`（影响 canonical / OpenGraph url / Sitemap / JSON-LD url）
2. **（可选）清理组件层 5 处 `import type` 类型引用** — 低风险，可后续处理

## Maintenance Rule

以后所有代码开发任务完成后，必须同步校准以下文件，确保“代码状态 = 文档状态”：

- `docs/project-management/PROJECT_STATUS.md`
- `docs/project-management/PROJECT_ROADMAP.md`
- `docs/project-management/MODULE_COMPLETION_MATRIX.md`
- `docs/project-management/BUSINESS_CAPABILITY_MAP.md`
- `docs/project-management/CONTENT_MANAGEMENT_PLAN.md`
