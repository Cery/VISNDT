```
# VISNDT 项目独立架构审计报告

**审计日期**：2026-08-05  
**审计范围**：全代码仓库技术审查  
**审计原则**：只读，不修改任何代码  
**项目版本**：v0.1.0（MVP 阶段）
```

## 一、项目总体概览

| 维度           | 详情                                    |
| :------------- | :-------------------------------------- |
| **项目名称**   | VISNDT — 工业无损检测设备平台           |
| **仓库类型**   | pnpm Monorepo                           |
| **包管理器**   | pnpm 9.x                                |
| **Node 要求**  | >= 20.0.0                               |
| **顶层目录**   | `VISNDT/`（代码）、`docs/`（文档）      |
| **工程子应用** | 3 个（`web`、`admin`、`api`）           |
| **共享包**     | 2 个（`config`、`shared-types`）        |
| **数据库**     | 1 个（`database`，Prisma + PostgreSQL） |
| **文档规模**   | ~300+ 份审计/设计/蓝图/实施报告         |

------

## 二、目录结构分析

Plain Text



```
f:\Desktop\VISNDT_Work\
├── VISNDT/                          # 主工程目录（Monorepo）
│   ├── .github/workflows/ci.yml     # CI 流水线
│   ├── apps/
│   │   ├── admin/                   # 管理后台 (Vite + React 19)
│   │   ├── api/                     # 后端 API (NestJS 11)
│   │   └── web/                     # 用户前台 (Next.js 15)
│   ├── database/
│   │   └── prisma/                  # Prisma Schema + 14 个迁移
│   ├── packages/
│   │   ├── config/                  # 共享配置（空壳）
│   │   └── shared-types/            # 共享类型（空壳）
│   ├── docker/                      # Docker 附加配置
│   ├── scripts/deploy.bat           # 部署脚本
│   ├── docker-compose.yml           # 根级 Docker Compose
│   └── pnpm-workspace.yaml          # 工作区配置
└── docs/                            # 项目文档（独立于代码）
    ├── VISNDT-Blueprint/            # 蓝图设计文档（100~900 系列）
    ├── Content Management Guide/    # 内容管理指南
    ├── _review/                     # 300+ 份审计/实施报告
    ├── _design/                     # 设计文档
    ├── _implementation/             # 实施计划
    └── _context/                    # 上下文交接文档
```

------

## 三、前端架构分析

### 3.1 管理后台 (`@visndt/admin`)

| 维度            | 详情                                                   |
| :-------------- | :----------------------------------------------------- |
| **框架**        | React 19 + Vite 6                                      |
| **UI 库**       | Ant Design 5.29                                        |
| **路由**        | react-router-dom 7                                     |
| **状态管理**    | Zustand 5                                              |
| **HTTP 客户端** | Axios 1.18                                             |
| **开发端口**    | 3001（Vite dev server 代理 `/api` → `localhost:4000`） |
| **构建产物**    | 静态 SPA，Nginx 部署                                   |

**组件结构**：按领域划分 pages/，含 `product/`、`category/`、`parameter/`、`product-media/` 子目录。
**路由覆盖**：登录、首页、产品 CRUD、需求、RFQ、报价、询价、匹配监控、用户、组织、通知、参数组/定义、分类、文件孤岛、审计日志 — 共 ~40+ 路由。
**安全机制**：`RequireAuth` + `RequireAuth` 包裹，Axios 拦截器注入 Bearer Token + CSRF Token，401 自动清除状态并跳转登录。
**认证模式**：localStorage 存 accessToken（Bearer），与 web 端的 HttpOnly Cookie 模式不同。

### 3.2 用户前台 (`@visndt/web`)

| 维度            | 详情                               |
| :-------------- | :--------------------------------- |
| **框架**        | Next.js 15 (App Router) + React 19 |
| **样式**        | Tailwind CSS 3（工业风格主题系统） |
| **数据获取**    | TanStack React Query 5             |
| **HTTP 客户端** | 自研 `apiClient`（fetch-based）    |
| **开发端口**    | 3000                               |
| **构建产物**    | Next.js 服务端渲染 / 静态导出      |

**页面结构**：

- 公共页面：首页、产品列表/详情、分类、解决方案、知识库、商业、关于
- 认证页面：登录、注册
- 工作区页面：仪表盘、需求工作区、RFQ 工作区、匹配查看、设置
- 认证方式：`AuthGuard` + `RoleGuard` 组件包裹

**安全机制**：HttpOnly Cookie 认证 + CSRF Double Submit Cookie 模式，支持自动 Refresh Token 刷新，401 自动重试一次。

### 3.3 两前端差异对比

| 对比维度   | admin                              | web                      |
| :--------- | :--------------------------------- | :----------------------- |
| 框架       | Vite + React                       | Next.js                  |
| 认证方式   | localStorage Bearer Token          | HttpOnly Cookie          |
| CSRF       | 自定义 in-memory + cookie fallback | 独立 csrf.ts 模块        |
| API 客户端 | Axios（拦截器注入）                | fetch（自研 apiClient）  |
| UI 库      | Ant Design                         | Tailwind CSS（工业主题） |
| 目标用户   | 平台管理员                         | 终端用户（买家/供应商）  |

------

## 四、后端架构分析

### 4.1 整体架构

| 维度         | 详情                             |
| :----------- | :------------------------------- |
| **框架**     | NestJS 11                        |
| **语言**     | TypeScript 5.7                   |
| **数据库**   | PostgreSQL 16（通过 Prisma 7.8） |
| **API 前缀** | `/api/v1`                        |
| **端口**     | 4000                             |
| **文档**     | Swagger（`/api/docs`）           |

### 4.2 模块清单（共 22 个模块）

Plain Text



```
核心基础设施：
├── PrismaModule          # 数据库连接
├── HealthModule          # 健康检查
├── ConfigModule          # 环境配置
├── StorageModule         # S3/MinIO 对象存储
├── SecurityModule        # CSRF 安全
└── ThrottlerModule       # 全局限流 (100 req/min)

认证与授权：
└── AuthModule            # JWT + HttpOnly Cookie + RefreshToken + 邀请注册

业务领域：
├── UsersModule           # 用户管理
├── OrganizationsModule   # 组织管理
├── OrganizationMembersModule  # 组织成员
├── ProductsModule        # 产品管理
├── ProductCategoriesModule    # 产品分类
├── ParameterGroupsModule # 参数组
├── ParameterDefinitionsModule # 参数定义
├── ProductParametersModule    # 产品参数值
├── ProductMediaModule    # 产品媒体
├── OffersModule          # 报价管理
├── DemandsModule         # 需求管理
├── RfqsModule            # RFQ 询价
├── RfqResponsesModule    # RFQ 响应
├── InquiriesModule       # 询价
├── MatchingModule        # 匹配引擎
├── NotificationsModule   # 通知
├── WorkflowEventsModule  # 工作流事件
├── FileAssetModule       # 文件资产管理
├── AdminModule           # 管理后台聚合
```

### 4.3 安全机制

| 安全层       | 实现方式                                            |
| :----------- | :-------------------------------------------------- |
| **认证**     | JWT (access_token) + RefreshToken (HttpOnly Cookie) |
| **鉴权**     | RBAC（RolesGuard + @Roles 装饰器）                  |
| **CSRF**     | Double Submit Cookie Pattern（自定义中间件）        |
| **安全头**   | Helmet                                              |
| **限流**     | ThrottlerGuard（全局 100 req/min）                  |
| **CORS**     | 白名单配置                                          |
| **输入验证** | ValidationPipe (class-validator)                    |
| **密码加密** | bcrypt 6                                            |

### 4.4 匹配引擎

核心匹配服务 (`MatchingService`) 实现全量加权匹配：

- 基于 Demand 参数逐产品评分
- 分类过滤（CategoryHelper）
- 最低分阈值过滤
- 最佳 Offer 自动关联
- 匹配状态机：PENDING → REVIEWED → ACCEPTED/REJECTED
- 匹配结果持久化 + 工作流事件记录

------

## 五、数据库架构分析

### 5.1 数据模型

Prisma Schema 包含 **23 个模型** + **16 个枚举**：

| 迁移批次     | 模型                                                         | 数量 |
| :----------- | :----------------------------------------------------------- | :--- |
| 001 身份域   | User, RefreshToken, Organization, UserInvitation, OrganizationMember | 5    |
| 002 产品域   | ProductCategory, Product, ProductMedia, ParameterGroup, ParameterDefinition, ParameterOption, ProductParameterValue, ProductParameterDefinition | 8    |
| 003 交易域   | Offer, Demand, DemandParameter, DemandMatch, RFQ, RFQResponse | 6    |
| 004 工作流域 | WorkflowEvent, Notification, FileAsset, AuditLog             | 4    |
| 005 询价域   | Inquiry                                                      | 1    |

### 5.2 迁移历史

共 **14 个迁移**（从 `20260716152642_init` 到 `20260804054657_add_refresh_token`），累计迁移脚本按时间顺序演进，与功能迭代一致。

------

## 六、基础设施与 DevOps

### 6.1 Docker Compose（4 个服务）

| 服务     | 镜像                        | 端口                        |
| :------- | :-------------------------- | :-------------------------- |
| postgres | postgres:16-alpine          | 5432                        |
| api      | 自构建（多阶段 Dockerfile） | 4000                        |
| admin    | 自构建（多阶段 → Nginx）    | 80                          |
| minio    | minio/minio:latest          | 9000 (API) / 9001 (Console) |

### 6.2 CI/CD

- **CI 流水线**（`.github/workflows/ci.yml`）：触发于 `main`/`develop` 分支 push 和 PR
- 步骤：Checkout → pnpm install → Prisma Generate → Lint → Build Backend → Build Frontend
- **缺少**：自动测试运行、Docker 镜像构建/推送、部署步骤

### 6.3 Dockerfile 分析

- **API Dockerfile**：4 阶段构建（deps → prisma → build → production），Alpine 基础镜像，OpenSSL 兼容处理
- **Admin Dockerfile**：2 阶段构建（build → Nginx），Nginx 静态文件服务

------

## 七、测试覆盖分析

| 测试类型 | 文件数 | 覆盖范围                                                     |
| :------- | :----- | :----------------------------------------------------------- |
| E2E 测试 | 17 个  | auth, admin, demands, matching, offers, products, rfq, security, users, workflow, organizations |
| 单元测试 | 1 个   | category.helper（匹配引擎辅助函数）                          |
| 前端测试 | 0 个   | 无                                                           |

**E2E 测试分类**：

- 管理后台：admin-dashboard, admin-demand, admin-matching
- 认证：auth-invitation
- 需求域：demand-flow, demand-security
- 匹配引擎：category-filter, match-flow, performance-benchmark, rematch
- 报价：offer-core
- 产品：product-core
- RFQ：rfq-core
- 安全：rate-limit
- 用户：users-security
- 组织：organizations-security
- 工作流：workflow-permission

------

## 八、依赖与版本管理

### 8.1 关键依赖版本

| 依赖       | 版本                   |
| :--------- | :--------------------- |
| React      | 19.0.0                 |
| Next.js    | 15.x                   |
| NestJS     | 11.x                   |
| TypeScript | 5.7                    |
| Prisma     | 5.22（根）/ 7.8（API） |
| PostgreSQL | 16                     |
| Node.js    | 20.x                   |

### 8.2 已识别问题

**Prisma 版本不一致**：

| 位置                    | @prisma/client 版本 |
| :---------------------- | :------------------ |
| 根 `package.json`       | `^5.22.0`           |
| `apps/api/package.json` | `^7.8.0`            |
| `database/package.json` | `5.22.0`（精确）    |

`apps/api` 使用 Prisma Client 7.8，但 `database` 包固定 5.22.0。取决于 pnpm 的依赖解析，实际运行时可能使用 5.22.0 的 client 但 schema 要求 7.8 的 generator，存在运行时兼容风险。

**共享包空壳**：

- `packages/config/`：仅导出 `{}`，无实际配置
- `packages/shared-types/`：仅导出 `{}`，无类型定义
- 两个包均未在任何应用中被引用使用

------

## 九、审计发现总结

### 9.1 架构优势

1. **清晰的分层架构**：Monorepo 结构合理，前后端分离，模块边界清晰
2. **完善的安全机制**：JWT + HttpOnly Cookie + CSRF + Helmet + 限流 + RBAC，多层防护
3. **完整的业务闭环**：Product → Demand → Match → RFQ → Offer → Inquiry，覆盖工业检测平台核心流程
4. **生产级基础设施**：Docker 多阶段构建、多服务编排、健康检查、CI 流水线
5. **丰富的测试覆盖**：17 个 E2E 测试覆盖核心业务流
6. **详尽的文档体系**：300+ 份审计报告，记录了完整的开发演进历程

### 9.2 风险与改进建议

| 风险等级 | 问题                             | 建议                                                         |
| :------- | :------------------------------- | :----------------------------------------------------------- |
| 中       | Prisma 版本不一致（5.22 vs 7.8） | 统一版本，建议以 API 实际使用版本为准                        |
| 低       | 共享包空壳                       | 评估是否需要，不需要则清理                                   |
| 低       | 单元测试覆盖率低                 | 仅 1 个单元测试，建议增加 service 层单元测试                 |
| 低       | CI 缺少测试运行                  | 在 CI 中加入 `pnpm test:e2e` 步骤                            |
| 低       | 两前端认证模式不一致             | admin 用 localStorage Bearer，web 用 HttpOnly Cookie，建议统一 |
| 低       | `packages/shared-types` 未使用   | 前后端类型定义各自维护，无共享，存在类型漂移风险             |

### 9.3 项目当前状态

- **开发阶段**：MVP 已冻结（M13.9），处于 M14 规划阶段
- **代码状态**：可构建、可部署，有完整的 Docker 化方案
- **文档状态**：详尽，覆盖从蓝图到实施的完整链路
- **技术债务**：低，主要是版本统一和测试覆盖率问题

------

**审计结论**：VISNDT 项目架构设计合理，代码组织清晰，安全机制完善，已具备生产级 MVP 交付能力。识别出的风险均为低至中级，不阻塞当前交付。建议在下一阶段（M14）中优先解决 Prisma 版本统一和测试覆盖率提升问题。