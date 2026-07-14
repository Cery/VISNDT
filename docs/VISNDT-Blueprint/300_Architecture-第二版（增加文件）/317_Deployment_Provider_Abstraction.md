# 317 Deployment Provider Abstraction

本文档用于建立 `VISNDT Blueprint v1.0` 的云迁移基础规则。

目标是确保：

1. 测试环境可以采用低成本云资源
2. 生产环境可以迁移至国内商业云
3. 迁移时不需要重构业务代码
4. Blueprint v1.0 不绑定单一云厂商

---

## 1. Provider Neutral Principle

VISNDT Blueprint v1.0 采用：

**Provider Neutral Principle**

含义如下：

1. 云厂商是部署实现选择，不是业务架构前提
2. 业务代码不得依赖特定 Provider 的专有接口
3. 迁移测试环境与生产环境时，应以配置切换和基础设施替换为主
4. 云迁移不得要求重构核心业务模块

---

## 2. Baseline Rules

### 2.1 Database

数据库基线冻结为：

`Standard PostgreSQL`

要求：

1. 数据模型基于标准 PostgreSQL
2. 不把业务能力绑定到特定托管平台专有特性
3. 测试环境与生产环境均应可运行在标准 PostgreSQL 上

### 2.2 Storage

文件存储基线冻结为：

`S3 Compatible Storage`

允许的实现可以包括：

1. Cloudflare R2
2. AWS S3
3. 阿里云 OSS（兼容接入层）
4. 腾讯云 COS（兼容接入层）
5. 其他 S3 Compatible Provider

要求：

1. 业务层通过统一存储抽象访问对象存储
2. 不得在业务层硬编码某个 Provider SDK 逻辑

### 2.3 Deployment

部署基线冻结为：

`Container Based`

要求：

1. 部署单元应可容器化
2. 环境切换不依赖手工修改业务代码
3. 本地、测试、生产尽量保持一致的部署单元结构

### 2.4 Configuration

配置基线冻结为：

`Environment Driven`

要求：

1. 数据库地址、存储配置、密钥、第三方服务配置全部通过环境变量或等价配置管理
2. 禁止硬编码 Provider 信息
3. 测试与生产的差异通过配置表达，而不是通过分叉实现表达

---

## 3. Environment Baseline

VISNDT Blueprint v1.0 冻结以下环境模型：

- Development
- Testing
- Production
- Staging Optional

### 3.1 Development

用于：

1. 本地开发
2. 联调验证
3. 功能实现

### 3.2 Testing

用于：

1. 集成测试
2. UAT
3. 基础发布验证
4. 低成本云环境验证

### 3.3 Production

用于：

1. 正式业务运行
2. 正式数据承载
3. 正式域名与正式运维

### 3.4 Staging Optional

`Staging` 可以作为增强层存在，但不是 Blueprint v1.0 的强制环境要求。

---

## 4. Deployment Unit

Blueprint v1.0 冻结以下部署单元：

- Frontend
- Backend API
- Worker
- PostgreSQL
- Object Storage

### 4.1 Frontend

职责：

1. 对外公开站点
2. 产品中心
3. 需求入口
4. 组织工作台入口

### 4.2 Backend API

职责：

1. 提供统一业务 API
2. 承载鉴权、业务规则、状态流转
3. 连接数据库、搜索、通知与文件服务

### 4.3 Worker

职责：

1. 承载异步任务
2. 承载通知分发
3. 承载后续搜索增强与 AI 异步处理

### 4.4 PostgreSQL

职责：

1. 承载核心业务数据
2. 承载搜索基础能力
3. 保持标准数据库兼容性

### 4.5 Object Storage

职责：

1. 存放图片
2. 存放附件
3. 存放技术文档与文件资产

---

## 5. Testing to Production Migration Rule

### 5.1 Testing Environment

Testing 环境可以使用低成本云资源。

例如：

1. 低成本容器平台
2. 低成本 PostgreSQL 托管
3. 低成本对象存储

### 5.2 Production Environment

Production 环境允许迁移至国内商业云。

例如：

1. 国内云服务器
2. 国内 PostgreSQL 托管或自建 PostgreSQL
3. OSS / COS / 其他兼容对象存储

### 5.3 Migration Constraint

必须明确：

**代码不允许因为云迁移重构。**

允许变化的是：

1. 配置
2. 基础设施供应商
3. 部署拓扑细节

不允许变化的是：

1. 核心业务模型
2. API 设计
3. 数据模型
4. 前后端核心代码结构

---

## 6. Implementation Rule

部署与云迁移必须遵循：

1. 先定义标准接口，再选择 Provider
2. 先冻结容器化部署结构，再接入不同云平台
3. 先冻结环境配置模型，再选择 Testing / Production 供应商

这意味着：

- Testing 可以先用低成本云
- Production 可以后续迁移到国内商业云
- 业务架构不需要重新设计

---

## 7. Final Decision

`VISNDT Blueprint v1.0` 的部署与云迁移冻结结论如下：

1. Provider Neutral Principle 是正式原则
2. Database 基线为 `Standard PostgreSQL`
3. Storage 基线为 `S3 Compatible Storage`
4. Deployment 基线为 `Container Based`
5. Configuration 基线为 `Environment Driven`
6. 环境模型为 `Development / Testing / Production`，`Staging Optional`
7. 云迁移不得触发业务代码重构

如果其他文档出现更强的云厂商绑定表达，以本文件为准。
