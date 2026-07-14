# TECH_STACK_DECISION

本文档是 `VISNDT Blueprint v1.0` 的正式技术栈冻结文件。

如果其他 Blueprint 文档出现技术栈冲突，以本文件为准。

## 1. Technology Baseline

VISNDT Blueprint v1.0 冻结以下技术组合：

- Frontend: `Next.js + TypeScript`
- Backend: `NestJS + TypeScript`
- Database: `PostgreSQL`
- ORM: `Prisma`
- Storage: `S3 Compatible Object Storage`
- Deployment: `Container Based`
- Search: MVP 使用 `PostgreSQL Full Text Search + pg_trgm`
- AI: Phase 2 使用 `pgvector`

## 2. Architecture Principle

VISNDT Blueprint v1.0 不绑定云厂商。

以下平台都可以作为部署实现选择：

- Cloudflare
- AWS
- 阿里云 OSS
- 腾讯 COS
- 其他 S3 Compatible Provider

架构约束如下：

1. 业务代码不得依赖具体 Provider。
2. 数据库存储基线为标准 `PostgreSQL`。
3. 文件存储基线为 `S3 Compatible Object Storage`。
4. 部署基线为容器化部署，而不是绑定单一云平台能力。
5. 环境切换通过配置完成，而不是通过重写业务实现完成。

## 3. Technology Decision Reason

### 3.1 Frontend: Next.js + TypeScript

选择原因：

1. 适合 VISNDT 的公开站点、产品中心、知识内容与需求入口场景。
2. 便于统一响应式 Web 交付，避免 PC 与 Mobile 双项目维护。
3. 对 SEO、内容展示、产品详情页与业务应用入口更友好。
4. 与 TypeScript 配合后，能提升 API 契约与前端状态模型的一致性。

### 3.2 Backend: NestJS + TypeScript

选择原因：

1. 当前 Blueprint 主干文档、命名规范与数据库映射大量围绕 `NestJS` 展开。
2. 更适合模块化单体和清晰的业务域拆分。
3. 与 `Prisma`、DTO、权限、验证、OpenAPI 文档的协作路径更成熟。
4. 对后续 `Identity / Organization / Product / Offer / Demand / RFQ` 等模块边界表达更稳定。

### 3.3 Database: PostgreSQL

选择原因：

1. 当前 Blueprint v1.0 数据库主干已明确以标准 `PostgreSQL` 为唯一业务数据库基线。
2. 能同时支持结构化业务数据、全文检索、JSONB 扩展与后续向量扩展能力。
3. 便于在测试环境与生产环境之间迁移，不依赖专有数据库能力。

### 3.4 ORM: Prisma

选择原因：

1. 当前数据库第二版文档已经为 `Prisma` 建立了较完整的规范、映射与迁移流程。
2. `Prisma` 适合将 `PostgreSQL` 模型稳定映射到 TypeScript 服务层。
3. 有利于 AI 和工程实现遵循统一 Schema、Migration 与 Client 生成流程。

### 3.5 Historical Alternatives

以下历史方案可以保留作为参考，但不是 `VISNDT Blueprint v1.0` 的主技术基线：

- `Vue3`
- `Hono`
- 其他与本文件冲突的历史技术选择

这些方案不应覆盖本文件冻结的正式技术栈。

## 4. AI Development Reading Rule

AI 在读取 Blueprint 时，必须优先遵循以下规则：

1. 先读取 `Readme.md`
2. 再读取 `TECH_STACK_DECISION.md`
3. 如果后续文档出现技术栈冲突，以 `TECH_STACK_DECISION.md` 为准
4. 不得根据历史参考目录自动推翻本文件结论

## 5. Blueprint Priority

技术栈相关决策优先级如下：

1. `TECH_STACK_DECISION.md`
2. `Readme.md`
3. `300_Architecture-第二版（增加文件）`
4. `400_Database-第二版`
5. 其他正式 Blueprint 文档
6. 历史参考目录

本文件自生效起，作为 `VISNDT Blueprint v1.0` 的正式技术栈基线。
