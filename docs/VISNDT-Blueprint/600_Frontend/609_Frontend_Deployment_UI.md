# Frontend Deployment Foundation

------

# 1. Purpose

定义 VISNDT 前端部署规范。

目标：

建立稳定：

- 构建流程；
- 环境管理；
- 发布流程；
- 版本控制。

------

# 2. Deployment Position

前端部署：

连接：

```
Source Code

↓

Build

↓

Static Assets

↓

Hosting

↓

Production Website
```

------

# 3. Deployment Scope

包含：

```
Environment

Build

Config

Asset

Release

Monitoring
```

------

# 4. Deployment Architecture

结构：

```
Developer

↓

Git Repository

↓

CI Build

↓

Frontend Package

↓

CDN / Hosting

↓

User Browser
```

------

# 5. Environment Design

环境：

```
Development

↓

Testing

↓

Production
```

------

# 6. Development Environment

用途：

本地开发。

配置：

```
Local API

Debug Mode

Hot Reload
```

------

# 7. Testing Environment

用途：

发布前验证。

配置：

```
Production Like

Test Data

Error Monitoring
```

------

# 8. Production Environment

用途：

正式访问。

要求：

```
Stable

Fast

Secure
```

------

# 9. Build Process

流程：

```
Install Dependencies

↓

Code Check

↓

Build

↓

Generate Assets

↓

Deploy
```

------

# 10. Build Command Standard

统一：

```
npm install

npm run build
```

------

# 11. Build Output

输出：

```
dist/

├── assets

├── images

├── scripts

└── styles
```

------

# 12. Configuration Management

配置：

```
Environment Variables

API Endpoint

Runtime Config
```

------

# 13. Environment Variable Rule

禁止：

```
Hard Code Secret
```

------

支持：

```
.env

Environment Config
```

------

# 14. Static Resource Management

资源：

```
Images

CSS

JS

Fonts

Documents
```

------

# 15. Image Optimization

要求：

```
WebP

Compression

Lazy Loading
```

------

# 16. Cache Strategy

资源：

```
Static Asset Cache

Version Hash

Browser Cache
```

------

# 17. Release Process

流程：

```
Code Commit

↓

Build Check

↓

Deploy Test

↓

Acceptance

↓

Production Release
```

------

# 18. Version Management

版本：

```
Major.Minor.Patch
```

------

示例：

```
1.0.0
```

------

# 19. Rollback Strategy

支持：

```
Previous Version Restore
```

------

条件：

- 构建失败；
- 页面异常；
- 数据接口错误。

------

# 20. Deployment Security

要求：

```
HTTPS

Access Control

Dependency Check
```

------

# 21. Deployment Foundation Checklist

| Item             | Status  |
| ---------------- | ------- |
| Architecture     | Defined |
| Environment      | Defined |
| Build Process    | Defined |
| Config           | Defined |
| Asset Management | Defined |
| Cache            | Defined |
| Release          | Defined |
| Rollback         | Defined |
| Security         | Defined |

# Frontend Build Pipeline Design

------

# 22. Purpose

定义 VISNDT 前端自动构建流程。

目标：

实现：

- 代码自动检查；
- 标准化构建；
- 自动部署；
- 降低发布风险。

------

# 23. Pipeline Position

流程：

```
Developer Commit

↓

Repository

↓

Build Pipeline

↓

Quality Check

↓

Deploy

↓

Production
```

------

# 24. Pipeline Stages

阶段：

```
Stage 01

Code Checkout


↓

Stage 02

Dependency Install


↓

Stage 03

Code Validation


↓

Stage 04

Build


↓

Stage 05

Deploy
```

------

# 25. Stage 01 Code Checkout

输入：

```
Git Repository
```

------

检查：

```
Branch

Commit

Version
```

------

# 26. Branch Strategy

分支：

```
main

develop

feature/*

hotfix/*
```

------

规则：

```
feature

↓

develop

↓

main
```

------

# 27. Stage 02 Dependency Install

执行：

```
Install Package

Resolve Dependency

Cache Dependency
```

------

要求：

版本锁定：

```
package-lock.json
```

------

# 28. Stage 03 Code Validation

检查：

```
Syntax

Format

Type

Lint
```

------

失败：

禁止进入下一阶段。

------

# 29. Code Quality Rule

要求：

```
No Critical Error

No Build Warning

No Dependency Risk
```

------

# 30. Stage 04 Build

执行：

```
Production Build
```

------

生成：

```
Static Files

Optimized Assets

Manifest
```

------

# 31. Build Optimization

包括：

```
Code Split

Tree Shaking

Compression

Minification
```

------

# 32. Asset Versioning

规则：

文件：

```
main.xxxxx.js

style.xxxxx.css
```

------

目的：

避免缓存冲突。

------

# 33. Stage 05 Deployment

流程：

```
Upload Build

↓

Update Hosting

↓

Clear Cache

↓

Verify
```

------

# 34. Deployment Verification

检查：

```
Homepage

Product Page

Requirement Flow

API Connection
```

------

# 35. Failed Build Handling

失败：

记录：

```
Build Log

Error Message

Commit ID
```

------

处理：

```
Fix

↓

Rebuild
```

------

# 36. CI Notification

通知：

```
Build Success

Build Failed

Deploy Complete
```

------

# 37. Pipeline Security

要求：

```
Token Protection

Secret Management

Permission Control
```

------

# 38. Deployment Environment Mapping

| Environment | Branch  | Purpose      |
| ----------- | ------- | ------------ |
| Development | feature | Development  |
| Testing     | develop | Verification |
| Production  | main    | Release      |

------

# 39. Build Pipeline Checklist

| Item         | Status  |
| ------------ | ------- |
| Checkout     | Defined |
| Dependency   | Defined |
| Validation   | Defined |
| Build        | Defined |
| Deploy       | Defined |
| Optimization | Defined |
| Verification | Defined |
| Security     | Defined |

# Release Management Design

------

# 40. Purpose

定义 VISNDT 前端版本发布管理规范。

目标：

实现：

- 可控发布；
- 版本追踪；
- 快速回滚；
- 稳定运行。

------

# 41. Release Management Position

发布流程：

```
Development

↓

Testing

↓

Release Candidate

↓

Production

↓

Monitoring
```

------

# 42. Release Types

版本：

```
Major Release

Minor Release

Patch Release

Hotfix
```

------

# 43. Version Rule

格式：

```
MAJOR.MINOR.PATCH
```

------

示例：

```
1.0.0

1.1.0

1.1.1
```

------

# 44. Major Release

定义：

大型功能更新。

包含：

```
Architecture Change

Major Feature

UI Framework Update
```

------

# 45. Minor Release

定义：

功能增强。

包含：

```
New Page

New Component

New Interaction
```

------

# 46. Patch Release

定义：

问题修复。

包含：

```
Bug Fix

Performance Fix

Security Fix
```

------

# 47. Release Candidate

流程：

```
Feature Complete

↓

Build

↓

Test

↓

RC Version
```

------

状态：

```
Ready For Release
```

------

# 48. Production Release

步骤：

```
Confirm Version

↓

Deploy

↓

Smoke Test

↓

Monitor
```

------

# 49. Smoke Test

检查：

```
Homepage

Navigation

Product Center

Requirement Center

Contact
```

------

# 50. Release Approval

确认：

```
Technical Review

Functional Review

Deployment Review
```

------

# 51. Rollback Strategy

目的：

快速恢复稳定版本。

------

流程：

```
Problem Detection

↓

Stop Release

↓

Restore Previous Version

↓

Verify
```

------

# 52. Rollback Trigger

条件：

```
Build Failure

Critical UI Error

API Failure

Performance Degradation
```

------

# 53. Release Record

记录：

```
Version

Date

Changes

Commit

Operator
```

------

# 54. Change Log

格式：

```
Version

+

Feature

+

Fix

+

Breaking Change
```

------

# 55. Production Monitoring

监控：

```
Availability

Performance

Error Rate

User Flow
```

------

# 56. Frontend Error Tracking

记录：

```
JavaScript Error

Network Error

Rendering Error
```

------

# 57. Performance Monitoring

指标：

```
Page Load

First Contentful Paint

Interaction Response

Asset Size
```

------

# 58. Cache Update Strategy

发布后：

```
Update Asset Hash

Refresh CDN

Verify Browser Cache
```

------

# 59. Release Security

要求：

```
Authorized Deployment

Audit Record

Secret Protection
```

------

# 60. Release Management Checklist

| Item               | Status  |
| ------------------ | ------- |
| Version Rule       | Defined |
| Release Type       | Defined |
| RC Process         | Defined |
| Production Release | Defined |
| Smoke Test         | Defined |
| Rollback           | Defined |
| Change Log         | Defined |
| Monitoring         | Defined |
| Security           | Defined |

# Frontend Deployment Acceptance Specification

------

# 61. Purpose

定义 VISNDT 前端部署最终验收标准。

目标：

确认：

- 构建流程稳定；
- 发布流程完整；
- 环境配置正确；
- 生产运行可靠。

------

# 62. Acceptance Scope

范围：

```
Environment

+

Build Pipeline

+

Release Process

+

Deployment Security

+

Monitoring
```

------

# 63. Environment Acceptance

检查：

环境：

```
Development

Testing

Production
```

------

要求：

- 配置隔离；
- 参数正确；
- 可独立运行。

状态：

```
PASS
```

------

# 64. Build Pipeline Acceptance

检查：

流程：

```
Checkout

↓

Install

↓

Validate

↓

Build

↓

Deploy
```

------

要求：

自动化执行成功。

状态：

```
PASS
```

------

# 65. Build Output Acceptance

检查：

生成：

```
HTML

CSS

JavaScript

Assets
```

------

要求：

资源完整。

状态：

```
PASS
```

------

# 66. Configuration Acceptance

检查：

包含：

```
API Endpoint

Environment Variable

Runtime Config
```

------

要求：

无敏感信息泄露。

状态：

```
PASS
```

------

# 67. Release Process Acceptance

检查：

流程：

```
Version

↓

Review

↓

Deploy

↓

Verify
```

------

状态：

```
PASS
```

------

# 68. Version Management Acceptance

检查：

支持：

```
Major

Minor

Patch

Hotfix
```

------

状态：

```
PASS
```

------

# 69. Rollback Acceptance

检查：

支持：

```
Previous Version Restore
```

------

验证：

```
Release Failure

↓

Rollback

↓

Recovery
```

------

状态：

```
PASS
```

------

# 70. Performance Acceptance

检查：

包括：

```
Asset Compression

Cache

Loading Speed
```

------

状态：

```
PASS
```

------

# 71. Security Acceptance

检查：

包括：

```
HTTPS

Permission

Secret Management

Dependency Security
```

------

状态：

```
PASS
```

------

# 72. Monitoring Acceptance

检查：

包括：

```
Error Tracking

Performance Monitoring

Availability Monitoring
```

------

状态：

```
PASS
```

------

# 73. Deployment Checklist

| Item               | Status |
| ------------------ | ------ |
| Environment        | PASS   |
| Build Pipeline     | PASS   |
| Build Output       | PASS   |
| Configuration      | PASS   |
| Release Process    | PASS   |
| Version Management | PASS   |
| Rollback           | PASS   |
| Performance        | PASS   |
| Security           | PASS   |
| Monitoring         | PASS   |

------

# 74. 609_Frontend_Deployment_UI Final Status

| Module                | Status    |
| --------------------- | --------- |
| Deployment Foundation | Completed |
| Build Pipeline        | Completed |
| Release Management    | Completed |
| Acceptance            | Completed |
| Next.js Alignment     | Completed |

------

# Next.js Deployment Alignment

## Build Command

正式构建命令：

```bash
next build
```

> 替代通用 `npm run build`。Next.js 内置优化构建流程。

## Build Output

输出目录：

```
.next/
├── static/          # 静态资源（JS, CSS, Images）
├── server/          # Server 端代码
├── cache/           # 构建缓存
└── BUILD_ID         # 部署版本标识
```

> 替代通用 `dist/` 目录。`.next/` 为 Next.js 标准构建输出。

## Environment Variables

环境变量约定：

```bash
# .env.local（本地开发，不提交）
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# .env.production（生产环境）
NEXT_PUBLIC_API_URL=https://api.visndt.com
```

规则：

- `NEXT_PUBLIC_` 前缀的变量可用于浏览器端
- 无前缀的变量仅 Server 端可用
- 禁止在代码中硬编码密钥

## Deployment Target

### Docker Deployment（推荐）

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Node.js Runtime

```bash
next start -p 3000
```

支持任意 Node.js 运行环境，不绑定特定云平台。

### Provider 无关性

部署可运行于：

- Docker / Kubernetes
- Vercel
- AWS / Cloudflare
- 阿里云 / 腾讯云
- 任意 S3 Compatible + Node.js 环境

架构约束与 `TECH_STACK_DECISION.md` 一致：

- 业务代码不依赖具体 Provider
- 环境切换通过配置完成

## Asset Versioning

Next.js 自动处理：

```
/_next/static/chunks/main-xxxxx.js
/_next/static/css/style-xxxxx.css
```

构建时自动生成内容哈希，无需手动配置。

## Cache Strategy

| 资源类型 | 缓存策略 |
|----------|----------|
| 静态资源（JS/CSS） | 永久缓存（内容哈希） |
| 图片 | CDN + Cache-Control |
| HTML 页面 | ISR Revalidation |
| API 响应 | TanStack Query staleTime |

## CI/CD Pipeline

```
Developer Commit
    ↓
Git Repository
    ↓
CI: next build
    ↓
CI: next lint + type check
    ↓
Docker Build
    ↓
Deploy to Target
    ↓
Health Check
```

## Rollback Strategy

- Docker：回滚到上一个 Image Tag
- Static Export：回滚到上一个 CDN 版本
- 支持版本标记和快速回滚

------

# 609_Frontend_Deployment_UI

Version:

```
V1.0
```

Status:

```
FINAL
```

Completion:

```
100%
```