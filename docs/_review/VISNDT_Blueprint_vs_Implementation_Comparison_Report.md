# VISNDT Blueprint vs 实际实现对照分析报告

**分析日期**: 2026-08-15
**Blueprint 版本**: VISNDT Blueprint v1.0 / v2.0（Frozen）
**分析范围**: 100_Business → 600_Frontend 蓝图 vs 001-512 实际开发过程
**实际代码**: apps/api（NestJS）+ apps/web（Next.js）+ apps/admin（Next.js Admin）

---

## 1. Blueprint 概览

### 1.1 蓝图规模

| 目录 | 文档数 | 领域 |
|------|--------|------|
| 100_Business | 9 | 业务架构、角色、流程、MVP 范围 |
| 200_Product | 8（+ 第一版 12 归档） | 产品体系、分类、参数、能力 |
| 300_Architecture | 18 | 领域驱动设计、13 个中心、命名规范 |
| 400_Database | 14（+ 第一版 14 归档） | ER 模型、表结构、Prisma、Seeding |
| 500_Backend | 8 | 后端架构、API、认证、部署 |
| 600_Frontend | 10 | 前端架构、页面结构、组件、状态 |
| 700_Quality | 7 | 测试策略、功能/UAT/安全 |
| 800_Operations | 6 | 部署、监控、备份、事件响应 |
| 900_Project | 5 | 项目管理、风险管理、变更管理 |

**总计**: 85 份蓝图文档（不含归档）

### 1.2 蓝图核心设计原则

```
1. Platform（平台）模式，非 Marketplace（交易市场）
2. DDD（领域驱动设计）架构
3. Product = 平台标准产品（Global Catalog），供应商不可修改
4. Offer = 供应商商业报价（Supplier Capability）
5. Organization = 企业实体（非 Store/Shop）
6. AI = 增强层，非核心业务依赖
7. Phase 1 先实现核心业务闭环，AI 在 Phase 2/3
8. 技术栈冻结：Next.js + NestJS + PostgreSQL + Prisma + S3 Compatible
```

---

## 2. 蓝图 vs 实际：逐域对照

### 2.1 业务架构（100_Business）

| 蓝图内容 | 实际实现 | 匹配度 | 说明 |
|---------|---------|-------|------|
| Platform 模式 | ✅ 严格遵循 | 100% | 从未引入 Marketplace |
| 六大业务域 | ✅ 全部实现 | 100% | Organization/Product/Offer/Knowledge/Demand/RFQ |
| 用户角色（Anonymous/Registered/Org Member/Admin） | ✅ 全部实现 | 100% | RBAC 完整 |
| 采购闭环（搜索→Demand→RFQ→响应） | ✅ 实现 | 100% | M11 完成 RFQ 工作流 |
| 供应闭环（Organization→Offer→RFQ Inbox→Response） | ✅ 实现 | 100% | M14 完成 Workspace |
| Content 域 | ✅ 新增 | 100% | 蓝图未预见的 Content 域，M17-M18 建设 |
| Notification | ✅ 实现 | 100% | M11 完成 |
| Workflow | ✅ 实现 | 100% | M11 完成 |

**业务架构匹配度**: **100%**。蓝图六大域全部实现，并额外增加了 Content 内容资产域。

---

### 2.2 产品体系（200_Product）

#### 2.2.1 蓝图产品层级

```
Blueprint Vision:
  Inspection Domain → Category → SubCategory → Family → Series → Standard Product → Offer

Actual Implementation:
  ProductCategory（2 层：Category + SubCategory）→ Product → Offer
```

**关键差异**:

| 蓝图层级 | 实际实现 | 决策 |
|---------|---------|------|
| Inspection Domain | ❌ 未实现 | 简化，由 Category 承担 |
| Category | ✅ ProductCategory | 实现 |
| SubCategory | ✅ parentId 自引用 | 实现（嵌套 Category） |
| **Family** | ❌ 未实现 | **M19 明确禁止**（ProductFamily 禁止） |
| **Series** | ❌ 未实现 | **M19 明确禁止**（ProductSeries 禁止） |
| Standard Product | ✅ Product | 实现 |
| Offer | ✅ Offer | 实现 |

#### 2.2.2 蓝图产品属性 vs 实际

| 蓝图属性 | 实际实现 | 匹配度 |
|---------|---------|-------|
| 参数模板 | ✅ ParameterDefinition + ParameterGroup | 100% |
| 能力模板 | ⚠️ 简化 | 50%（参数体系替代） |
| 检测对象 | ❌ 未实现 | 0%（作为 Tag 或未实现） |
| 材料 | ❌ 未实现 | 0% |
| 缺陷 | ❌ 未实现 | 0% |
| 检测方法 | ❌ 未实现 | 0% |
| 行业 | ❌ 未实现 | 0% |
| 标准 | ❌ 未实现 | 0% |
| AI 标签 | ❌ 未实现 | 0%（M21 计划中） |
| 产品图片 | ✅ ProductMedia + FileAsset | 100% |
| 产品附件 | ✅ ProductMedia + FileAsset | 100% |
| 产品版本 | ❌ 未实现 | 0% |
| 生命周期 | ✅ status 字段 | 80%（无版本机制） |
| SEO 字段 | ❌ 缺失 | 0%（M21.3 计划补充） |
| slug | ❌ 缺失 | 0%（M21.3 计划补充） |

**产品体系匹配度**: **55%**。核心产品+参数+分类体系完整，但 Family/Series/检测对象/材料/缺陷/方法/行业/标准/版本等蓝图属性均未实现。M19 明确禁止了 ProductFamily 和 ProductSeries。

---

### 2.3 架构中心对照（300_Architecture）

| 蓝图中心 | 实际实现 | 匹配度 | 说明 |
|---------|---------|-------|------|
| Identity Center | ✅ 完整实现 | 100% | 认证、RBAC、JWT |
| Organization Center | ✅ 完整实现 | 100% | 企业资料、成员管理 |
| Product Center | ✅ 实现 | 80% | 核心产品+参数，缺 Family/Series/SEO |
| Offer Center | ✅ 完整实现 | 100% | Offer + Organization 关联 |
| Knowledge Center | ✅ 实现 | 90% | Content 域替代，标签体系完善 |
| Demand Center | ✅ 完整实现 | 100% | Demand + DemandParameter |
| RFQ Center | ✅ 完整实现 | 100% | RFQ + RFQResponse |
| Workflow Center | ✅ 实现 | 80% | WorkflowEvent 基础 |
| Search Center | ✅ 实现 | 70% | 简化为 Database Query（M20.1 冻结） |
| **AI Center** | ❌ 未实现 | **0%** | M21 计划中 |
| Platform Center | ✅ 实现 | 80% | Admin + AuditLog + Notification |
| Data Governance | ⚠️ 部分 | 50% | AuditLog 有，但无数据治理工具 |

**架构中心匹配度**: **80%**。13 个中心中 11 个已实现，AI Center 完全未实现，Search Center 简化为 Database Query。

---

### 2.4 数据库设计（400_Database）

| 蓝图设计 | 实际实现 | 匹配度 |
|---------|---------|-------|
| PostgreSQL | ✅ | 100% |
| Prisma ORM | ✅ | 100% |
| 表结构按域分 | ✅ | 100% |
| UUID 主键 | ✅ | 100% |
| DDL 规范 | ✅ 遵循 | 90% |
| Migration 策略 | ✅ | 100% |
| Seed Data | ✅ | 100% |
| S3 Compatible Storage | ✅ FileAsset | 100% |
| pgvector（Phase 2） | ❌ 未启用 | 0%（M21.2 计划） |
| 蓝图 DDL 表数量 | 12 个初始 SQL 文件 | 29 个 Prisma Model（实际） |

**数据库匹配度**: **90%**。基础设施完全遵循蓝图设计，Model 数量从蓝图 12 个初始 SQL 增加到 29 个 Prisma Model（业务扩展）。

---

### 2.5 后端设计（500_Backend）

| 蓝图设计 | 实际实现 | 匹配度 |
|---------|---------|-------|
| NestJS + TypeScript | ✅ | 100% |
| API 设计规范 | ✅ OpenAPI | 100% |
| JWT 认证 | ✅ | 100% |
| RBAC | ✅ | 100% |
| Error Code 规范 | ✅ | 100% |
| Testing | ⚠️ 部分 | 40%（以 Build 验证为主） |
| Deployment | ✅ Container | 100% |

**后端匹配度**: **90%**。测试覆盖率偏低。

---

### 2.6 前端设计（600_Frontend）

| 蓝图设计 | 实际实现 | 匹配度 |
|---------|---------|-------|
| Next.js + TypeScript | ✅ | 100% |
| 页面信息架构 | ✅ 基本遵循 | 85% |
| 组件设计系统 | ✅ 实现 | 80% |
| 状态管理 | ✅ 实现 | 80% |
| API 集成 | ✅ | 100% |
| 产品中心 UI | ✅ | 90% |
| 需求中心 UI | ✅ | 90% |
| 公开页面 UI | ✅ 18 页 | 100% |
| 供应商工作流 UI | ✅ Workspace | 90% |
| SEO 友好 | ⚠️ 部分 | 60%（Content 好，Product 缺 SEO） |
| 响应式（Mobile） | ⚠️ 基础 | 35%（M21.3 计划） |
| 蓝图三类用户（Buyer/Engineer/Org） | ✅ 实现 | 100% |

**前端匹配度**: **85%**。主要缺口在 SEO 完备性和移动端体验。

---

### 2.7 质量/运维/项目管理（700-900）

| 蓝图设计 | 实际实现 | 匹配度 |
|---------|---------|-------|
| 测试策略 | ⚠️ 部分 | 30%（以 Build 验证为主） |
| UAT | ⚠️ 部分 | 30%（以审计报告替代） |
| 部署运维 | ✅ Container + Docker | 90%（M12 完成） |
| 监控 | ⚠️ 基础 | 30%（未建立完整监控） |
| 备份恢复 | ⚠️ 部分 | 50%（S3 + DB 备份策略） |
| 项目管理 | ✅ 审计报告体系 | 90%（512 份报告） |
| 文档管理 | ✅ 严格同步 | 95% |

**质量/运维匹配度**: **60%**。测试和监控是主要短板。

---

## 3. 蓝图 Phase 规划 vs 实际执行

### 3.1 Phase 1 MVP（蓝图）

| 蓝图 Phase 1 | 实际实现 | 状态 |
|-------------|---------|------|
| Organization | ✅ M0-M8 | 完成 |
| Standard Product | ✅ M0-M8 | 完成 |
| Product Parameter | ✅ M0-M8 | 完成 |
| Offer | ✅ M0-M8 | 完成 |
| Demand | ✅ M9-M11 | 完成 |
| RFQ | ✅ M11 | 完成 |
| Search | ✅ M9-M13 | 完成（M20.1 冻结） |
| Notification | ✅ M11 | 完成 |
| Basic Workflow | ✅ M11 | 完成 |

**Phase 1 完成度**: **100%**。蓝图 MVP 全部实现。

### 3.2 Phase 2（蓝图）

| 蓝图 Phase 2 | 实际执行 | 对应 M 阶段 |
|-------------|---------|-----------|
| AI Search | ❌ 未实现 | M21 计划 |
| Recommendation | ❌ 未实现 | M21.5 计划 |
| Knowledge Enhancement | ⚠️ 部分 | M17-M18 Content 域 |
| Advanced Workflow | ✅ M11-M14 | 完成 |

**Phase 2 完成度**: **40%**。AI 能力未实现，Knowledge Enhancement 通过 Content 域部分实现，Advanced Workflow 完成。

### 3.3 Phase 3（蓝图）

| 蓝图 Phase 3 | 实际执行 | 对应 M 阶段 |
|-------------|---------|-----------|
| RAG | ❌ 未实现 | M21.2-M21.5 计划 |
| Knowledge Graph | ❌ 未实现 | M21+ 计划 |
| AI Agent | ❌ 未实现 | M21.5 计划 |
| Ecosystem API | ❌ 未实现 | 未规划 |

**Phase 3 完成度**: **0%**。全部进入 M21 规划。

---

## 4. 蓝图偏离分析

### 4.1 重大架构偏离

| 偏离项 | 蓝图设计 | 实际决策 | 原因 |
|--------|---------|---------|------|
| **ProductFamily 删除** | 产品族（Family） | M19 明确禁止 | 简化产品模型，避免过度分层 |
| **ProductSeries 删除** | 产品系列（Series） | M19 明确禁止 | 同上 |
| **Supplier Product Model 冻结** | 蓝图未明确 | M19 明确禁止 | 保护 Product Global Catalog 纯洁性 |
| **Search 简化** | PostgreSQL Full Text Search + pg_trgm | Prisma `contains` + LIKE | M20.1 决定：Database Query First |
| **Content 域新增** | 蓝图未设计 | M17-M18 新建 | 业务需要，作为 Content Asset Integration |
| **Admin 运营中心** | 蓝图 312_PlatformCenter 简化描述 | M9-M10 + M20.4 实现 | 实际需求远超蓝图规划 |
| **Mobile 缺位** | 蓝图未涉及 | 未实现 | M21.3 计划 |

### 4.2 偏离严重度

| 偏离 | 影响 | 严重度 |
|------|------|-------|
| ProductFamily/Series 删除 | 产品层级从 7 层简化到 3 层 | **低**（简化有益） |
| Search 简化 | 搜索能力从 Full Text Search 降到 LIKE | **中**（M21 修复） |
| AI Center 未实现 | 蓝图核心能力缺失 | **高**（M21 计划） |
| 测试/监控缺失 | 工程质量保障不足 | **中**（持续改进） |
| Content 域新增 | 蓝图未覆盖但业务需要 | **低**（有益扩展） |

---

## 5. 蓝图 vs 实际：技术栈对照

| 蓝图技术栈 | 实际 | 状态 |
|-----------|------|------|
| Next.js + TypeScript | ✅ | 一致 |
| NestJS + TypeScript | ✅ | 一致 |
| PostgreSQL | ✅ | 一致 |
| Prisma | ✅ | 一致 |
| S3 Compatible | ✅ | 一致 |
| Docker Container | ✅ | 一致 |
| PostgreSQL Full Text Search | ❌ 未实现 | LIKE 替代 |
| pg_trgm | ❌ 未实现 | 未启用 |
| pgvector（Phase 2） | ❌ 未实现 | M21.2 计划 |
| Redis | ❌ 未实现 | 未引入 |
| Elasticsearch | ❌ 蓝图明确禁止 | 遵循 |

**技术栈匹配度**: **85%**。核心栈完全一致，但搜索和 AI 基础设施未按蓝图启用。

---

## 6. 蓝图设计质量评估

### 6.1 蓝图正确预测的部分

1. **Platform 模式**: 蓝图明确 Platform ≠ Marketplace，开发全程遵循
2. **DDD 架构**: 领域驱动设计指导了 13 个中心的架构
3. **Product/Offer 分离**: 标准产品与商业报价分离，从未混淆
4. **Phase 规划**: 3 阶段规划合理，Phase 1 全部实现
5. **技术栈冻结**: Next.js + NestJS + PostgreSQL + Prisma 全部验证有效
6. **Search/AI 边界**: 蓝图明确 AI 不替代核心业务，整个 M20 阶段零 AI 依赖
7. **RBAC 模型**: 四类角色（Anonymous/Registered/Org Member/Admin）全部实现

### 6.2 蓝图未预见的部分

1. **Content 内容资产域**: 蓝图 Knowledge Center 设计偏弱，实际发展为完整 Content 域
2. **Admin 运营深度**: 蓝图 312_PlatformCenter 仅 1 页描述，实际发展为完整运营后台
3. **Mobile 体验**: 蓝图完全未涉及移动端
4. **ProductFamily/Series 过度设计**: 蓝图 7 层产品层级在实际中简化为 3 层
5. **审计体系**: 蓝图未预见 512 份审计报告体系
6. **Supplier Display**: 蓝图未明确 Supplier 的能力展示模式

### 6.3 蓝图总体评分

| 维度 | 评分 | 说明 |
|------|------|------|
| 架构原则 | A | Platform/DDD/Product≠Offer 等核心原则完全正确 |
| 技术栈选择 | A | 全部技术栈验证有效，无需更换 |
| 业务域设计 | A- | 六大域准确，但缺 Content 域 |
| Phase 规划 | A | 3 阶段规划合理，执行节奏良好 |
| 产品模型 | B+ | 7 层层级过度设计，实际简化为 3 层 |
| AI 前瞻 | A | 明确 Search/AI 边界，Phase 2/3 规划合理 |
| 运维/测试 | B | 测试和监控设计偏弱 |
| 移动端 | C | 完全未涉及 |

**蓝图总体评分**: **A-**

---

## 7. 关键发现总结

### 7.1 蓝图忠实度矩阵

```
蓝图设计                                 实际实现
─────────                               ─────────
100% 忠实:  Platform 模式、DDD 架构、技术栈、六大业务域
80% 忠实:   产品体系（简化了层级）、搜索（简化了实现）
50% 忠实:   质量体系（测试弱）、运维（监控弱）
0% 忠实:   AI Center（完全未实现）、ProductFamily/Series（删除）
超出蓝图:   Content 域、Admin 运营中心、512 审计体系
```

### 7.2 蓝图与实际的关键差异根因

1. **ProductFamily/Series 删除**: 蓝图 7 层产品层级在工业内窥镜领域过于复杂，M19 合理简化
2. **Search 简化**: 蓝图设计 PostgreSQL Full Text Search，实际因 M20.1 阶段决策使用 Database Query First
3. **AI Center 空白**: 蓝图最大的未实现项，M21 正是要填补这个空白
4. **Content 域新增**: 蓝图 Knowledge Center 设计不足，实际业务需要更完整的内容资产管理
5. **Supplier Product Model 冻结**: 蓝图未明确，M19 为保护架构主动冻结

### 7.3 蓝图文献价值

蓝图作为「初始设计」在以下方面发挥了关键作用：

- **架构一致性**: 平台模式、DDD 架构、Product/Offer 分离从未偏离
- **技术栈约束**: 6 项技术栈全部保留，零更换
- **Phase 节奏**: 3 阶段规划执行良好，Phase 1 100% 完成
- **边界约束**: Search/AI 边界、Platform≠Marketplace 等原则贯穿始终

---

## 8. 最终结论

### 8.1 蓝图与实现总匹配度

```
综合匹配度: 75%

完全匹配:  Platform 模式、DDD 架构、技术栈、业务域、Phase 1 MVP
部分匹配:  产品体系（简化）、搜索（简化）、质量
未匹配:    AI Center、ProductFamily/Series、测试/监控
超出蓝图:  Content 域、Admin 运营中心、审计体系
```

### 8.2 评价

**蓝图设计与实际开发之间保持了高度的一致性**。核心架构原则、技术栈、业务域划分、Phase 规划全部经受住了开发实践的检验。

**最大的偏离是 AI Center 的完全未实现**——这正是 M21 阶段要解决的问题。蓝图在 2024 年就规划了 AI Center（Embedding/RAG/OCR/推荐），而实际开发遵循了「Phase 1 先完成业务闭环，AI 在 Phase 2/3」的正确节奏。

**ProductFamily/Series 的删除是合理的架构简化**，不是蓝图缺陷。7 层产品层级在工业内窥镜这个垂直领域确实是过度设计。

**Content 域和 Admin 运营中心的「超出蓝图」是业务驱动的自然增长**，体现了蓝图「保留扩展能力」的设计原则。

---

**Code State = Documentation State = Blueprint Alignment**