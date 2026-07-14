# 1. Migration Strategy Overview

## 1.1 Purpose

Database Migration Strategy 用于定义：

VISNDT 平台数据库从开发阶段到生产阶段的完整迁移体系。

目标：

```
Schema Evolution

Data Migration

Environment Synchronization

Production Deployment

Rollback Recovery
```

------

# 1.2 Scope

覆盖：

```
PostgreSQL Schema Migration

Prisma Migration

Seed Migration

Data Transformation

Deployment Migration
```

------

不包含：

```
Application Code Deployment

Infrastructure Provisioning

Cloud Resource Migration
```

------

# 1.3 Migration Philosophy

VISNDT 数据库迁移遵循：

## Version Controlled

所有数据库变化：

必须进入：

```
Git Repository
```

禁止：

生产数据库直接修改。

------

## Migration First

流程：

```
Developer Change

        ↓

Migration File

        ↓

Review

        ↓

Test

        ↓

Production Apply
```

------

## Reversible

关键变更：

必须支持：

```
Rollback
```

------

# 2. Database Migration Architecture

整体结构：

```
Database Design

        ↓

Schema Definition

        ↓

Migration File

        ↓

Migration Engine

        ↓

Target Database
```

------

# 2.1 Migration Layers

## Layer 01

# Schema Layer

负责：

```
Table

Column

Index

Constraint

Relation
```

来源：

------

## Layer 02

# Data Layer

负责：

```
Initial Data

Dictionary

Capability

Configuration
```

来源：

------

## Layer 03

# Business Migration Layer

负责：

```
Existing Data Transform

Legacy Mapping

Data Cleanup
```

------

# 3. Migration Environment Model

VISNDT 使用三环境模型：

```
Development

      ↓

Staging

      ↓

Production
```

------

# 3.1 Development Environment

用途：

```
Feature Development

Schema Testing

Local Debug
```

特点：

- 可频繁 Reset
- 可执行 Demo Seed
- 可删除测试数据

------

# 3.2 Staging Environment

用途：

```
Release Validation
```

要求：

- 接近生产结构
- 使用生产级配置
- 执行完整 Migration

------

# 3.3 Production Environment

用途：

```
Official Platform Operation
```

要求：

- 备份
- 审批
- Migration Log
- Rollback Plan

------

# 4. Migration Responsibility

## Database Architect

负责：

```
Schema Design

Migration Review

Performance Impact
```

------

## Backend Developer

负责：

```
Migration Creation

Local Testing

Bug Fix
```

------

## DevOps

负责：

```
Deployment Execution

Backup

Monitoring
```

------

# 5. Migration Repository Structure

目录规范：

```
database/

 ├── schema/

 ├── migrations/

 │

 ├── seeds/

 │

 └── rollback/
```

------

# 5.1 Migration Directory

格式：

```
YYYYMMDDHHMM_description
```

例如：

------

# 5.2 Migration File Structure

标准：

```
migration_name/

 ├── up.sql

 ├── down.sql

 └── README.md
```

------

# 6. Migration Version Control

## Version Number

采用：

```
Migration Sequence Number
```

例如：

```
001_initial_schema

002_product_extension

003_matching_module
```

------

# 6.1 Migration History

系统维护：

```
migration_history
```

记录：

| Field       | Description   |
| ----------- | ------------- |
| version     | Migration版本 |
| name        | Migration名称 |
| executed_at | 执行时间      |
| status      | 状态          |
| operator    | 执行人        |

------

# 7. Migration Status Definition

## Pending

```
待执行
```

------

## Running

```
执行中
```

------

## Completed

```
执行完成
```

------

## Failed

```
执行失败
```

------

## Rolled Back

```
已回滚
```

------

# 8. Migration Safety Rules

## Rule 01

禁止：

```
Direct Production SQL Modification
```

------

## Rule 02

所有结构变化：

必须：

```
Migration File
```

------

## Rule 03

大表修改：

必须评估：

```
Lock Time

Performance Impact

Downtime
```

------

# 9. Migration Overview Status

| Item                 | Status  |
| -------------------- | ------- |
| Migration Philosophy | Defined |
| Environment Model    | Defined |
| Repository Structure | Defined |
| Version Control      | Defined |
| Safety Rules         | Defined |

# 10. PostgreSQL Migration Workflow Overview

## 10.1 Purpose

PostgreSQL Migration Workflow 用于规范：

VISNDT 平台 PostgreSQL 数据库结构变更、数据迁移及版本发布流程。

目标：

```
安全变更

可重复执行

自动验证

生产可控
```

------

# 10.2 PostgreSQL Migration Flow

标准流程：

```
Schema Design

        ↓

Migration Creation

        ↓

Local Apply

        ↓

Validation

        ↓

Code Review

        ↓

Staging Apply

        ↓

Production Apply
```

------

# 11. Schema Change Workflow

## 11.1 Change Request

任何数据库变化：

必须产生：

```
Database Change Request
```

包含：

```
Change Reason

Affected Tables

Risk Assessment

Rollback Plan
```

------

# 11.2 Migration Development

开发人员创建：

```
Migration File
```

例如：

```
003_add_product_capability_relation
```

目录：

```
migrations/

 └──003_add_product_capability_relation/

      ├──up.sql

      ├──down.sql

      └──README.md
```

------

# 12. Table Migration Rules

## 12.1 Create Table

允许：

```
CREATE TABLE
```

要求：

必须包含：

```
Primary Key

Created Time

Updated Time

Required Index
```

------

# 12.2 Add Column

新增字段：

必须评估：

```
Nullable

Default Value

Existing Data Impact
```

------

推荐流程：

```
Step 1

Add Nullable Column


↓

Step 2

Backfill Data


↓

Step 3

Add Constraint
```

------

# 12.3 Remove Column

禁止直接删除。

必须：

```
Phase 01

Stop Usage


↓

Phase 02

Remove Application Reference


↓

Phase 03

Delete Column
```

------

# 13. Index Migration Rules

## 13.1 Index Creation

普通环境：

```
CREATE INDEX
```

------

生产环境大表：

推荐：

```
CREATE INDEX CONCURRENTLY
```

避免：

```
Long Table Lock
```

------

# 13.2 Index Naming Convention

格式：

```
idx_{table}_{column}
```

例如：

```
idx_product_category_id
```

------

# 13.3 Unique Index

命名：

```
uq_{table}_{column}
```

例如：

```
uq_user_email
```

------

# 14. Constraint Migration Rules

## 14.1 Primary Key

规则：

所有业务核心表：

必须拥有：

```
Primary Key
```

------

## 14.2 Foreign Key

要求：

```
明确关联关系

避免孤儿数据
```

------

## 14.3 Foreign Key Migration

新增外键：

建议：

```
NOT VALID
```

先验证数据。

之后：

```
VALIDATE CONSTRAINT
```

------

# 15. Data Migration Workflow

## 15.1 Data Migration Purpose

用于：

```
数据结构调整

字段转换

历史数据修复
```

------

# 15.2 Data Migration Steps

流程：

```
Backup

 ↓

Migration Script

 ↓

Test Dataset

 ↓

Validation

 ↓

Production Execute
```

------

# 15.3 Data Transformation Rules

## Rule 01

禁止：

直接覆盖原始数据。

------

## Rule 02

复杂转换：

必须保留：

```
Before Value

After Value
```

------

## Rule 03

迁移脚本：

必须幂等。

即：

重复执行不会产生错误。

------

# 16. PostgreSQL Migration Transaction Rules

## 16.1 Transaction Required

默认：

```
BEGIN;

Migration SQL;

COMMIT;
```

------

# 16.2 Transaction Exception

以下情况：

允许独立执行：

```
CREATE INDEX CONCURRENTLY
```

原因：

PostgreSQL限制无法放入事务。

------

# 17. Migration Validation

## 17.1 Structural Validation

检查：

```
Table Exists

Column Exists

Index Exists

Constraint Exists
```

------

## 17.2 Data Validation

检查：

```
Record Count

Relationship Integrity

Business Rule
```

------

## 17.3 Performance Validation

检查：

```
Query Performance

Index Usage

Lock Time
```

------

# 18. PostgreSQL Migration Rollback

## 18.1 Rollback Requirement

每个 Migration：

必须提供：

```
down.sql
```

------

# 18.2 Rollback Conditions

触发：

```
Migration Failed

Performance Degradation

Business Error
```

------

# 18.3 Rollback Restrictions

禁止回滚：

```
Irreversible Data Loss
```

除非：

已有备份。

------

# 19. PostgreSQL Migration Checklist

## Before Migration

□ Migration Review

□ Backup Completed

□ Rollback Confirmed

□ Staging Tested

------

## During Migration

□ Monitor Logs

□ Monitor Locks

□ Verify Execution

------

## After Migration

□ Data Validation

□ Application Test

□ Migration Record Saved

------

# 20. PostgreSQL Workflow Status

| Item                 | Status  |
| -------------------- | ------- |
| Schema Workflow      | Defined |
| Table Rules          | Defined |
| Index Rules          | Defined |
| Constraint Rules     | Defined |
| Data Migration Rules | Defined |
| Rollback Rules       | Defined |

# 21. Prisma Migration Workflow Overview

## 21.1 Purpose

Prisma Migration Workflow 用于规范：

VISNDT 平台 Prisma ORM 与 PostgreSQL 数据库之间的结构同步流程。

目标：

```
Schema Consistency

Migration Traceability

Development Efficiency

Production Safety
```

------

# 21.2 Prisma Migration Position

VISNDT 数据库开发体系：

```
Business Model Design

        ↓

PostgreSQL ER Model

        ↓

Database Specification

        ↓

schema.prisma

        ↓

Prisma Migration

        ↓

PostgreSQL Database
```

------

# 21.3 Source of Truth

数据库设计优先级：

```
401 ER Model

        ↓

402 Table Specification

        ↓

403 PostgreSQL DDL

        ↓

405 prisma.schema

        ↓

Migration Files
```

说明：

Migration 文件不是设计来源。

Migration 是设计结果。

------

# 22. Prisma Migration Environment

Prisma 使用三个主要命令环境：

```
Development

        ↓

Testing

        ↓

Production
```

------

# 22.1 Development Workflow

开发阶段：

```
npx prisma migrate dev
```

用途：

- 创建 Migration
- 更新数据库
- 生成 Prisma Client

------

# 22.2 Test Workflow

测试阶段：

```
npx prisma migrate reset
```

流程：

```
Drop Database

        ↓

Recreate

        ↓

Run Migration

        ↓

Run Seed
```

------

# 22.3 Production Workflow

生产环境：

禁止：

```
prisma migrate dev
```

必须：

```
npx prisma migrate deploy
```

------

# 23. Prisma Schema Change Process

## 23.1 Change Flow

标准流程：

```
Modify schema.prisma

        ↓

Generate Migration

        ↓

Review SQL

        ↓

Apply Local Test

        ↓

Commit Migration
```

------

# 23.2 Schema Modification Rules

## Rule 01

修改：

必须先修改：

```
schema.prisma
```

禁止：

直接修改数据库。

------

## Rule 02

Migration SQL：

必须人工检查。

重点：

```
DROP TABLE

DROP COLUMN

ALTER TYPE

Large Update
```

------

## Rule 03

Generated Migration：

必须提交 Git。

包括：

```
migration.sql

migration_lock.toml
```

------

# 24. Prisma Migration Directory Specification

目录：

```
prisma/

 └── migrations/

      ├──202601301200_initial_schema/

      │

      │──migration.sql

      │

      ├──202602010900_add_product_capability/

      │

      │──migration.sql
```

------

# 24.1 Migration Naming Convention

格式：

```
YYYYMMDDHHMM_description
```

例如：

```
202601301200_initial_schema
```

------

# 25. Prisma Migration Review Rules

每次 Migration Review：

必须检查：

------

## 25.1 Table Impact

确认：

```
New Table

Modified Table

Deleted Table
```

------

## 25.2 Data Impact

确认：

```
Data Loss Risk

Default Value

Backfill Required
```

------

## 25.3 Performance Impact

确认：

```
Index Change

Query Impact

Lock Duration
```

------

# 26. Prisma Migration Commands Standard

## Create Migration

```
npx prisma migrate dev --name migration_name
```

------

## Deploy Migration

```
npx prisma migrate deploy
```

------

## Check Status

```
npx prisma migrate status
```

------

## Generate Client

```
npx prisma generate
```

------

# 27. Prisma Migration and Seed Integration

执行顺序：

```
Prisma Migration

        ↓

Database Structure Ready

        ↓

Prisma Seed

        ↓

Initial Data
```

------

# 27.1 Seed Command

标准：

```
npx prisma db seed
```

------

# 27.2 Seed Dependency

Seed 数据依赖：

必须满足：

```
Table Exists

Foreign Key Exists

Reference Data Exists
```

------

# 28. Prisma Migration Rollback Strategy

## 28.1 Prisma Limitation

Prisma 不提供自动 Down Migration。

因此：

采用：

```
Forward Fix Migration
```

------

# 28.2 Rollback Method

情况 A：

未发布：

删除 Migration。

------

情况 B：

已发布：

创建新的修复 Migration。

例如：

```
005_add_wrong_field

        ↓

006_remove_wrong_field
```

------

# 28.3 Emergency Recovery

紧急情况：

使用：

```
Database Backup Restore
```

------

# 29. Prisma Migration CI/CD Integration

Pipeline:

```
Pull Request

        ↓

Migration Check

        ↓

Build

        ↓

Test Database

        ↓

Deploy
```

------

# 29.1 CI Validation

自动检查：

```
Migration Valid

Schema Valid

Generate Success

Seed Success
```

------

# 29.2 Production Deployment

流程：

```
Backup

        ↓

Deploy Application

        ↓

prisma migrate deploy

        ↓

Health Check
```

------

# 30. Prisma Migration Rules Summary

| Rule                 | Description             |
| -------------------- | ----------------------- |
| Schema First         | schema.prisma为开发入口 |
| Migration Controlled | 所有变化进入Migration   |
| Production Safe      | 使用migrate deploy      |
| Review Required      | SQL必须审核             |
| Roll Forward         | 使用修复Migration       |

------

# 31. Prisma Migration Workflow Status

| Item                 | Status  |
| -------------------- | ------- |
| Development Workflow | Defined |
| Production Workflow  | Defined |
| Schema Change Rules  | Defined |
| Command Standard     | Defined |
| CI/CD Integration    | Defined |
| Rollback Strategy    | Defined |

# 32. Production Database Deployment Overview

## 32.1 Purpose

Production Database Deployment Strategy 用于定义：

VISNDT 平台数据库正式上线、版本发布以及生产环境变更流程。

目标：

```
安全发布

最小影响

可监控

可恢复
```

------

# 32.2 Production Deployment Principles

生产数据库遵循：

------

## Principle 01

# Backup Before Migration

任何生产 Migration：

必须先执行：

```
Database Backup
```

流程：

```
Backup

 ↓

Verify Backup

 ↓

Migration
```

------

## Principle 02

# Migration Controlled

生产环境：

禁止：

```
Manual SQL Modification
```

所有变化：

必须来源：

```
Approved Migration File
```

------

## Principle 03

# Observable Deployment

发布过程中：

必须记录：

```
Execution Log

Duration

Result

Error
```

------

# 33. Production Deployment Flow

标准流程：

```
Release Approval

        ↓

Database Backup

        ↓

Migration Validation

        ↓

Execute Migration

        ↓

Data Verification

        ↓

Application Health Check

        ↓

Deployment Complete
```

------

# 34. Pre-Deployment Checklist

## 34.1 Technical Review

检查：

□ Migration SQL Reviewed

□ Schema Impact Evaluated

□ Index Impact Evaluated

□ Lock Risk Evaluated

□ Rollback Plan Prepared

------

## 34.2 Environment Check

确认：

```
Database Connection

Migration Version

Backup Status

Service Status
```

------

## 34.3 Data Check

执行：

```
Record Count Check

Integrity Check

Critical Data Backup
```

------

# 35. Production Migration Execution

## 35.1 Normal Migration

适用于：

小规模变化。

流程：

```
Start

 ↓

Run Migration

 ↓

Validate

 ↓

Finish
```

------

# 35.2 Large Data Migration

适用于：

大量数据处理。

禁止：

一次性执行。

采用：

```
Batch Processing
```

例如：

```
10000 Records

        ↓

Batch 01

        ↓

Batch 02

        ↓

Complete
```

------

# 36. Zero Downtime Migration Strategy

VISNDT 推荐：

Expand / Migrate / Contract 模式。

------

# Phase 01

## Expand

新增结构：

例如：

```
Add New Column
```

特点：

旧代码仍可运行。

------

# Phase 02

## Migrate

数据迁移：

```
Backfill Data
```

------

# Phase 03

## Contract

删除旧结构：

```
Remove Deprecated Field
```

------

# 37. Database Backup Strategy

## 37.1 Backup Types

### Full Backup

周期：

```
Daily
```

------

### Incremental Backup

周期：

```
Hourly
```

------

### Before Migration Backup

触发：

```
Every Production Migration
```

------

# 37.2 Backup Validation

备份后：

必须验证：

```
File Exists

Restore Available

Integrity Valid
```

------

# 38. Production Migration Monitoring

## Required Metrics

监控：

| Metric            | Purpose  |
| ----------------- | -------- |
| Migration Time    | 执行耗时 |
| Lock Time         | 锁等待   |
| Error Count       | 错误数量 |
| Query Performance | 性能变化 |
| Database CPU      | 资源影响 |

------

# 39. Deployment Failure Handling

## 39.1 Migration Failure

处理流程：

```
Stop Deployment

        ↓

Collect Error

        ↓

Rollback / Fix Migration

        ↓

Retry
```

------

# 39.2 Application Compatibility Failure

如果：

数据库成功升级，

应用异常：

执行：

```
Application Rollback
```

而不是：

立即回滚数据库。

------

# 40. Emergency Rollback Strategy

## Level 01

Migration Reverse:

```
Down Migration
```

------

## Level 02

Forward Fix:

创建：

```
New Correction Migration
```

------

## Level 03

Backup Restore:

严重情况：

```
Restore Database Snapshot
```

------

# 41. Production Migration Audit

每次生产 Migration：

必须保存：

```
Migration Version

Operator

Execution Time

Database Version

Result

Rollback Status
```

------

# 42. Production Deployment Security Rules

## Rule 01

只有授权人员：

可以执行生产 Migration。

------

## Rule 02

执行账号：

禁止：

```
Shared Account
```

------

## Rule 03

Migration 权限：

最小化。

------

# 43. Production Deployment Checklist

## Before

□ Approval Completed

□ Backup Completed

□ Migration Tested

□ Rollback Ready

------

## During

□ Monitor Logs

□ Monitor Database

□ Record Execution

------

## After

□ Validate Schema

□ Validate Data

□ Test Application

□ Close Deployment

------

# 44. Production Deployment Status

| Item                   | Status  |
| ---------------------- | ------- |
| Deployment Flow        | Defined |
| Backup Strategy        | Defined |
| Zero Downtime Strategy | Defined |
| Monitoring             | Defined |
| Rollback               | Defined |
| Security Rules         | Defined |

# 45. Rollback & Recovery Overview

## 45.1 Purpose

Database Migration Rollback & Recovery Strategy 用于定义：

VISNDT 平台数据库在迁移失败、数据异常、系统故障情况下的恢复机制。

目标：

```
Minimize Data Loss

Restore Service

Maintain Consistency

Ensure Traceability
```

------

# 45.2 Recovery Scope

覆盖：

```
Migration Failure

Data Corruption

Deployment Failure

Database Outage

Human Operation Error
```

------

# 45.3 Recovery Principle

核心原则：

```
Prevention First

        ↓

Rollback Second

        ↓

Restore Last
```

说明：

优先避免问题扩大；

其次使用可逆 Migration；

最后使用备份恢复。

------

# 46. Rollback Strategy Overview

VISNDT 回滚分为三个等级：

```
Level 01

Migration Rollback


        ↓


Level 02

Forward Fix Migration


        ↓


Level 03

Database Restore
```

------

# 47. Level 01 - Migration Rollback

## 47.1 Purpose

适用于：

Migration 已执行，

但发现问题：

```
Schema Error

Configuration Error

Minor Data Issue
```

------

# 47.2 Rollback Method

执行：

```
Down Migration
```

结构：

```
migration/

 ├──up.sql

 └──down.sql
```

------

# 47.3 Rollback Conditions

允许：

```
No Critical Data Change

No Irreversible Operation
```

------

# 47.4 Rollback Example

Migration：

```
ADD COLUMN inspection_level
```

Rollback：

```
DROP COLUMN inspection_level
```

------

# 48. Level 02 - Forward Fix Migration

## 48.1 Purpose

适用于：

已经发布：

且产生业务影响。

例如：

```
Wrong Field Type

Incorrect Default

Missing Index
```

------

# 48.2 Strategy

禁止：

直接修改历史 Migration。

采用：

新增 Migration。

流程：

```
Migration 005

        ↓

Problem Found

        ↓

Migration 006 Fix
```

------

# 48.3 Example

错误：

```
product.status VARCHAR(20)
```

修复：

新增：

```
006_change_product_status_type
```

------

# 49. Level 03 - Database Restore

## 49.1 Purpose

适用于：

严重故障。

例如：

```
Data Loss

Database Corruption

Wrong Mass Update
```

------

# 49.2 Restore Source

恢复来源：

```
Full Backup

Incremental Backup

Snapshot
```

------

# 49.3 Restore Process

流程：

```
Stop Application

        ↓

Freeze Database

        ↓

Select Backup Point

        ↓

Restore Database

        ↓

Validate Data

        ↓

Restart Service
```

------

# 50. Backup Recovery Specification

## 50.1 Backup Types

| Type               | Purpose  |
| ------------------ | -------- |
| Full Backup        | 完整恢复 |
| Incremental Backup | 增量恢复 |
| Snapshot           | 快速恢复 |

------

# 50.2 Backup Retention

默认策略：

```
Daily Backup

Retention 30 Days


Monthly Backup

Retention 12 Months
```

------

# 50.3 Backup Security

要求：

```
Encrypted

Access Controlled

Integrity Verified
```

------

# 51. Recovery Objective Definition

## 51.1 RPO

Recovery Point Objective：

允许最大数据损失时间。

VISNDT目标：

```
RPO <= 1 Hour
```

------

## 51.2 RTO

Recovery Time Objective：

系统恢复时间。

VISNDT目标：

```
RTO <= 4 Hours
```

------

# 52. Disaster Recovery Process

## Phase 01

# Detection

发现：

```
Database Failure
```

↓

记录事件。

------

## Phase 02

# Assessment

判断：

```
Data Loss

Migration Status

Service Impact
```

------

## Phase 03

# Recovery

选择：

```
Rollback

Fix Migration

Restore Backup
```

------

## Phase 04

# Validation

检查：

```
Schema

Data

Application
```

------

# 53. Migration Failure Handling

## Case 01

Migration Before Commit

处理：

```
Transaction Rollback
```

------

## Case 02

Migration Completed but Application Failed

处理：

```
Application Rollback

or

Forward Fix
```

------

## Case 03

Migration Caused Data Damage

处理：

```
Backup Restore
```

------

# 54. Recovery Audit Record

每次恢复：

必须记录：

```
Incident ID

Failure Reason

Recovery Method

Recovery Time

Data Validation Result

Operator
```

------

# 55. Recovery Testing

## Frequency

至少：

```
Quarterly
```

------

## Test Content

包括：

```
Backup Restore Test

Migration Rollback Test

Application Verification
```

------

# 56. Rollback Security Rules

## Rule 01

生产恢复：

必须授权。

------

## Rule 02

恢复操作：

必须记录。

------

## Rule 03

恢复前：

必须保留当前状态备份。

------

# 57. Rollback & Recovery Checklist

## Migration Failure

□ Stop Deployment

□ Identify Cause

□ Select Recovery Method

□ Execute Recovery

□ Validate System

------

## Database Restore

□ Confirm Backup

□ Restore Database

□ Validate Records

□ Restart Service

------

# 58. Rollback & Recovery Status

| Item              | Status  |
| ----------------- | ------- |
| Rollback Levels   | Defined |
| Backup Restore    | Defined |
| RPO/RTO           | Defined |
| Disaster Recovery | Defined |
| Recovery Audit    | Defined |
| Testing Strategy  | Defined |

# 59. Migration Governance Overview

## 59.1 Purpose

Migration Governance 用于定义：

VISNDT 数据库变更的管理流程、审批机制、责任边界以及全过程追踪规则。

目标：

```
Controlled Change

Risk Reduction

Auditability

Operational Stability
```

------

# 59.2 Governance Scope

覆盖：

```
Schema Change

Data Migration

Index Change

Configuration Change

Production Deployment
```

------

# 59.3 Governance Principle

数据库变更必须满足：

```
提出

 ↓

评估

 ↓

审核

 ↓

测试

 ↓

发布

 ↓

记录
```

------

# 60. Database Change Classification

数据库变化分为四类：

```
Type A

结构变化


Type B

数据变化


Type C

性能变化


Type D

配置变化
```

------

# 61. Type A - Schema Change Governance

## Examples

包括：

```
Create Table

Add Column

Modify Column

Add Constraint

Create Index
```

------

## Required Review

必须评估：

```
Impact Scope

Backward Compatibility

Rollback Method
```

------

# 62. Type B - Data Migration Governance

## Examples

包括：

```
Data Transformation

Data Cleanup

Historical Data Import
```

------

## Required Review

必须提供：

```
Data Volume

Migration Script

Validation SQL

Recovery Plan
```

------

# 63. Type C - Performance Change Governance

## Examples

包括：

```
Index Modification

Query Optimization

Partition Change
```

------

## Required Review

必须包含：

```
Before Performance

After Performance

Resource Impact
```

------

# 64. Type D - Configuration Change Governance

## Examples

包括：

```
Database Parameter

Connection Pool

Extension Setting
```

------

# 65. Change Request Process

## Step 01

# Change Proposal

提交：

```
Database Change Request
```

内容：

```
Change Title

Business Reason

Affected Objects

Risk Level

Rollback Plan
```

------

# Step 02

# Technical Review

审核：

```
Database Architect

Backend Developer

DevOps
```

------

# Step 03

# Testing

执行：

```
Local Test

Staging Test

Performance Test
```

------

# Step 04

# Approval

生产发布前：

必须批准。

状态：

```
Draft

 ↓

Reviewed

 ↓

Approved

 ↓

Released
```

------

# 66. Migration Risk Classification

## Low Risk

特点：

```
Add Non-Critical Column

Add Dictionary Data
```

处理：

普通审核。

------

## Medium Risk

特点：

```
Modify Existing Table

Large Data Update
```

处理：

需要测试环境验证。

------

## High Risk

特点：

```
Drop Column

Change Primary Key

Large Migration
```

处理：

需要：

```
Detailed Plan

Backup

Rollback Test
```

------

# 67. Migration Approval Matrix

| Change Type | Developer | Architect | DevOps   |
| ----------- | --------- | --------- | -------- |
| Low         | Required  | Optional  | Optional |
| Medium      | Required  | Required  | Required |
| High        | Required  | Required  | Required |

------

# 68. Migration Review Checklist

## Database Design

□ Table Design Reviewed

□ Naming Convention Checked

□ Relation Validated

□ Index Evaluated

------

## Data Safety

□ Data Loss Risk Checked

□ Backup Prepared

□ Rollback Prepared

------

## Performance

□ Query Impact Tested

□ Lock Risk Evaluated

□ Resource Impact Evaluated

------

# 69. Migration Audit Trail

每次 Migration：

必须记录：

```
Migration ID

Version

Author

Reviewer

Approval Time

Execution Time

Result
```

------

# 70. Migration Ownership

## Database Architect

负责：

```
Database Architecture

Major Migration Review
```

------

## Backend Developer

负责：

```
Migration Implementation

Testing
```

------

## DevOps Engineer

负责：

```
Deployment

Monitoring

Backup
```

------

# 71. Emergency Change Process

## Purpose

处理：

紧急生产故障。

------

流程：

```
Incident

 ↓

Emergency Approval

 ↓

Quick Fix Migration

 ↓

Validation

 ↓

Post Review
```

------

# 72. Forbidden Operations

禁止：

## Direct Production Modification

```
UPDATE production_table
```

------

## Untracked Migration

禁止：

```
Manual SQL Without File
```

------

## History Modification

禁止：

修改已执行 Migration。

------

# 73. Migration Governance Status

| Item                  | Status  |
| --------------------- | ------- |
| Change Classification | Defined |
| Review Process        | Defined |
| Approval Flow         | Defined |
| Risk Control          | Defined |
| Audit Trail           | Defined |
| Emergency Process     | Defined |

# 74. Migration Automation Overview

## 74.1 Purpose

Migration Automation 用于定义：

VISNDT 数据库迁移与持续集成、持续部署（CI/CD）的自动化执行体系。

目标：

```
Reduce Manual Operation

Improve Deployment Reliability

Ensure Migration Consistency
```

------

# 74.2 Automation Scope

覆盖：

```
Migration Validation

Schema Verification

Database Testing

Deployment Execution

Migration Monitoring
```

------

# 74.3 Automation Principle

原则：

```
Code Change

        ↓

Automatic Check

        ↓

Migration Test

        ↓

Approval

        ↓

Deployment
```

------

# 75. Git Migration Workflow

VISNDT 数据库变化：

通过 Git 管理。

流程：

```
Developer Branch

        ↓

Migration Commit

        ↓

Pull Request

        ↓

CI Validation

        ↓

Merge

        ↓

Deployment Pipeline
```

------

# 76. Migration Repository Rules

## 76.1 Migration Must Be Versioned

所有 Migration：

必须提交：

```
Migration Directory

migration.sql

Documentation
```

------

## 76.2 Migration Review

Pull Request 必须包含：

```
Change Description

Affected Tables

Risk Assessment

Rollback Method
```

------

# 77. CI Pipeline Specification

## Pipeline Overview

```
Code Push

 ↓

Install Dependencies

 ↓

Validate Prisma Schema

 ↓

Create Test Database

 ↓

Apply Migration

 ↓

Run Validation

 ↓

Run Automated Tests
```

------

# 78. CI Stage 01 - Schema Validation

## Purpose

检查：

Prisma Schema 是否有效。

------

执行：

```
npx prisma validate
```

------

检查：

```
Schema Syntax

Relation Definition

Datasource Configuration
```

------

# 79. CI Stage 02 - Migration Validation

## Purpose

验证：

Migration 是否可以正常执行。

------

流程：

```
Create Empty Database

        ↓

Run Migration

        ↓

Check Result
```

------

执行：

```
npx prisma migrate deploy
```

------

# 80. CI Stage 03 - Seed Validation

## Purpose

验证：

初始化数据是否正常。

------

执行：

```
npx prisma db seed
```

------

检查：

```
Reference Data

Foreign Key

Required Configuration
```

------

# 81. CI Stage 04 - Database Testing

测试内容：

## Schema Test

检查：

```
Tables

Columns

Indexes

Constraints
```

------

## Data Test

检查：

```
Seed Data

Business Rules

Relationship
```

------

## API Integration Test

检查：

```
Application Database Access
```

------

# 82. CD Migration Pipeline

生产发布流程：

```
Release Trigger

        ↓

Backup Database

        ↓

Migration Approval

        ↓

Run Migration

        ↓

Health Check

        ↓

Release Complete
```

------

# 83. Automated Migration Deployment

## Production Command

执行：

```
npx prisma migrate deploy
```

------

禁止：

```
npx prisma migrate dev
```

生产环境。

------

# 84. Migration Quality Gate

Migration 必须通过：

## Gate 01

Schema Validation

```
PASS
```

------

## Gate 02

Migration Execution

```
PASS
```

------

## Gate 03

Seed Validation

```
PASS
```

------

## Gate 04

Application Test

```
PASS
```

------

# 85. Automated Backup Integration

Migration Pipeline：

执行前：

```
Backup Trigger
```

------

记录：

```
Backup ID

Timestamp

Migration Version
```

------

# 86. Migration Monitoring

自动采集：

| Metric             | Description |
| ------------------ | ----------- |
| Migration Duration | 执行时间    |
| Success Rate       | 成功率      |
| Error Log          | 错误记录    |
| Database Lock      | 锁状态      |
| Resource Usage     | 资源消耗    |

------

# 87. Failed Pipeline Handling

## CI Failure

处理：

```
Stop Pipeline

 ↓

Report Error

 ↓

Developer Fix
```

------

## Production Failure

处理：

```
Stop Deployment

 ↓

Assess Impact

 ↓

Rollback / Fix
```

------

# 88. Migration Automation Security

## Rule 01

CI/CD 使用：

专用数据库账号。

------

## Rule 02

生产 Migration：

禁止：

个人账号执行。

------

## Rule 03

Migration 权限：

遵循：

```
Least Privilege
```

------

# 89. Recommended CI/CD Structure

示例：

```
.github/

 └── workflows/

      ├── database-test.yml

      ├── migration-check.yml

      └── production-deploy.yml
```

------

# 90. Migration Automation Status

| Item               | Status  |
| ------------------ | ------- |
| Git Workflow       | Defined |
| CI Validation      | Defined |
| CD Deployment      | Defined |
| Backup Integration | Defined |
| Quality Gate       | Defined |
| Security Control   | Defined |

# 91. Migration Performance Optimization Overview

## 91.1 Purpose

Database Migration Performance Optimization 用于定义：

VISNDT 平台数据库迁移过程中，对性能、锁、资源消耗进行控制的方法。

目标：

```
Minimize Downtime

Reduce Lock Impact

Protect Database Performance

Ensure Stable Release
```

------

# 91.2 Optimization Scope

覆盖：

```
Large Table Migration

Index Operation

Data Backfill

Constraint Validation

Query Performance
```

------

# 91.3 Performance Principle

迁移过程遵循：

```
Avoid Blocking

        ↓

Reduce Load

        ↓

Batch Processing

        ↓

Monitor Impact
```

------

# 92. Large Table Migration Strategy

## 92.1 Large Table Definition

VISNDT 定义：

超过以下条件：

任一满足：

```
Rows > 1 Million

OR

Size > 1GB
```

视为：

Large Table。

------

# 92.2 Large Table Rules

禁止：

直接执行：

```
ALTER TABLE large_table
```

造成：

```
Long Lock

Service Impact
```

------

# 93. Expand-Migrate-Contract Pattern

大型结构变更：

采用三阶段。

------

# Phase 01

## Expand

新增兼容结构。

例如：

新增字段：

```
ALTER TABLE product
ADD COLUMN new_category_id UUID;
```

特点：

```
Old Application Still Works
```

------

# Phase 02

## Migrate

后台迁移数据。

方式：

```
Batch Update
```

例如：

```
Batch 01

10000 records


Batch 02

10000 records
```

------

# Phase 03

## Contract

删除旧结构。

例如：

```
DROP COLUMN old_category_id;
```

------

# 94. Batch Migration Strategy

## 94.1 Purpose

避免：

一次性大量更新。

------

# 94.2 Batch Rule

默认：

```
Batch Size:

1000 ~ 10000 Records
```

根据：

数据库负载调整。

------

# 94.3 Batch Transaction

每批：

```
BEGIN

 ↓

Update Batch

 ↓

Commit
```

------

# 94.4 Progress Tracking

必须记录：

```
Processed Count

Remaining Count

Execution Time
```

------

# 95. Index Migration Optimization

## 95.1 Index Creation Risk

索引创建可能导致：

```
Table Lock

CPU Increase

IO Increase
```

------

# 95.2 Production Index Creation

推荐：

```
CREATE INDEX CONCURRENTLY
```

优势：

```
Reduce Lock
```

------

# 95.3 Index Review

新增索引必须评估：

```
Query Frequency

Index Size

Write Cost
```

------

# 96. Foreign Key Optimization

## 96.1 Constraint Addition

大表增加外键：

采用：

```
ADD CONSTRAINT

NOT VALID
```

------

之后：

验证：

```
VALIDATE CONSTRAINT
```

------

# 97. Data Backfill Optimization

## 97.1 Backfill Rules

禁止：

```
UPDATE entire_table
```

------

推荐：

```
Primary Key Range

        OR

Timestamp Range
```

------

# 97.2 Example

错误：

```
UPDATE product
SET category='ENDOSCOPE';
```

------

优化：

```
Product ID 1-10000

        ↓

Commit


Product ID 10001-20000

        ↓

Commit
```

------

# 98. Query Performance Protection

## 98.1 Before Migration

记录：

基线：

```
Query Time

CPU Usage

Database Load
```

------

# 98.2 During Migration

监控：

```
Slow Query

Lock Wait

Connection Count
```

------

# 98.3 After Migration

比较：

```
Before vs After
```

------

# 99. Lock Management Strategy

## 99.1 Lock Monitoring

关注：

```
Active Locks

Waiting Locks

Blocking Queries
```

------

# 99.2 Lock Timeout

生产环境：

建议设置：

```
lock_timeout
```

避免：

长期阻塞。

------

# 100. PostgreSQL Performance Tools

推荐工具：

## EXPLAIN

用途：

查询分析。

```
EXPLAIN ANALYZE
```

------

## pg_stat_activity

用途：

查看：

```
Active Connections
```

------

## pg_stat_statements

用途：

分析：

```
Slow Query
```

------

# 101. Migration Load Control

## Rule 01

高峰期：

禁止：

大型 Migration。

------

## Rule 02

生产 Migration：

优先：

```
Low Traffic Window
```

------

## Rule 03

资源不足：

暂停 Migration。

------

# 102. Performance Validation Checklist

## Before Migration

□ Query Baseline Recorded

□ Table Size Checked

□ Lock Risk Evaluated

------

## During Migration

□ CPU Monitoring

□ IO Monitoring

□ Lock Monitoring

------

## After Migration

□ Query Comparison

□ Index Verification

□ Application Testing

------

# 103. Performance Optimization Status

| Item                 | Status  |
| -------------------- | ------- |
| Large Table Strategy | Defined |
| Batch Migration      | Defined |
| Index Optimization   | Defined |
| Lock Control         | Defined |
| Query Monitoring     | Defined |
| Validation Process   | Defined |

# 104. Migration Documentation Overview

## 104.1 Purpose

Migration Documentation & Operational Manual 用于定义：

VISNDT 数据库迁移相关文档标准、运维执行规范以及团队交接要求。

目标：

```
Knowledge Preservation

Operational Consistency

Troubleshooting Efficiency

Team Collaboration
```

------

# 104.2 Documentation Scope

包括：

```
Migration Design Document

Migration Execution Record

Operation Manual

Incident Record

Recovery Record
```

------

# 105. Migration Documentation Structure

统一目录：

```
docs/

 └── database/

      ├── migrations/

      ├── operations/

      ├── incidents/

      └── recovery/
```

------

# 106. Migration Design Document Specification

每个重要 Migration：

必须包含：

```
Migration Purpose

Business Background

Technical Change

Affected Tables

Risk Analysis

Rollback Plan
```

------

# 106.1 Migration Design Template

```
# Migration Name


## Purpose


## Business Reason


## Database Changes


## Affected Tables


## Risk Assessment


## Rollback Plan


## Validation Method
```

------

# 107. Migration Execution Record

生产执行后：

必须生成记录。

------

# 107.1 Required Information

包含：

```
Migration Version

Execution Date

Environment

Operator

Start Time

End Time

Result
```

------

# 107.2 Execution Result

状态：

```
SUCCESS

FAILED

ROLLED_BACK
```

------

# 108. Database Operation Manual

## 108.1 Purpose

用于：

指导数据库日常维护。

------

# 108.2 Operation Scope

包括：

```
Database Startup

Backup

Migration

Monitoring

Recovery
```

------

# 109. Daily Database Operation Checklist

## Daily

检查：

□ Database Available

□ Connection Status

□ Error Log

□ Backup Status

□ Storage Usage

------

# Weekly

检查：

□ Slow Query

□ Index Usage

□ Database Size

□ Performance Trend

------

# Monthly

检查：

□ Backup Restore Test

□ Security Review

□ Permission Review

□ Migration History

------

# 110. Migration Troubleshooting Guide

------

# Case 01

## Migration Failed During Execution

现象：

```
Migration Status = Failed
```

处理：

```
Collect Error

        ↓

Analyze SQL

        ↓

Rollback or Fix

        ↓

Retry
```

------

# Case 02

## Migration Completed But Application Error

可能原因：

```
Schema Incompatible

Missing Data

Application Cache
```

处理：

```
Check Logs

        ↓

Validate Database

        ↓

Deploy Fix
```

------

# Case 03

## Database Performance Degradation

检查：

```
Slow Query

Lock

Index

Connection
```

处理：

```
Identify Cause

        ↓

Optimize

        ↓

Monitor
```

------

# 111. Migration Naming Documentation

所有 Migration：

必须说明：

```
What Changed

Why Changed

Who Changed

When Changed
```

------

# 111.1 Example

Migration:

说明：

```
Purpose:

Add measurement capability support


Affected:

product_capability


Rollback:

Remove relation
```

------

# 112. Knowledge Transfer Specification

## 112.1 New Team Member

必须阅读：

```
401 ER Model

402 Table Specification

403 DDL

405 Prisma Schema

406 Seed

407 Migration Strategy
```

------

# 112.2 Operation Training

包括：

```
Create Migration

Review Migration

Deploy Migration

Recover Database
```

------

# 113. Migration Documentation Quality Rules

## Rule 01

文档必须：

与 Migration 同步。

------

## Rule 02

禁止：

只有 SQL：

没有说明。

------

## Rule 03

复杂 Migration：

必须包含：

流程图。

------

# 114. Migration Documentation Template

标准：

```
# Migration XXXX


## Overview


## Change Details


## Database Impact


## Performance Impact


## Deployment Steps


## Validation


## Rollback
```

------

# 115. Operational Ownership

## Database Owner

负责：

```
Database Health

Migration Governance
```

------

## Developer

负责：

```
Migration Content

Bug Fix
```

------

## DevOps

负责：

```
Deployment Process

Monitoring

Backup
```

------

# 116. Documentation Audit

周期：

```
Quarterly
```

检查：

```
Document Complete

Migration Traceable

Operation Updated
```

------

# 117. Migration Operational Manual Status

| Item                    | Status  |
| ----------------------- | ------- |
| Documentation Structure | Defined |
| Execution Record        | Defined |
| Operation Checklist     | Defined |
| Troubleshooting         | Defined |
| Knowledge Transfer      | Defined |
| Audit Process           | Defined |

# 118. Migration Strategy Final Overview

## 118.1 Purpose

本章节用于定义：

VISNDT 数据库 Migration Strategy 文档最终验收标准、交付要求以及完成状态。

目标：

```
Complete Migration Governance

Ensure Operational Readiness

Prepare Production Deployment
```

------

# 118.2 407_Migration_Strategy Scope Summary

本文件覆盖：

```
01 Migration Architecture


02 PostgreSQL Migration Workflow


03 Prisma Migration Workflow


04 Production Deployment Strategy


05 Rollback & Recovery Strategy


06 Governance & Change Control


07 Automation & CI/CD Integration


08 Performance Optimization


09 Documentation & Operational Manual


10 Final Checklist
```

------

# 119. Migration Architecture Completion Check

## Database Migration Architecture

状态：

```
COMPLETED
```

已定义：

□ Migration Layer Model

□ Environment Strategy

□ Version Management

□ Execution Flow

------

# 120. PostgreSQL Migration Completion Check

## PostgreSQL Workflow

状态：

```
COMPLETED
```

覆盖：

□ Schema Change

□ Table Migration

□ Index Migration

□ Constraint Migration

□ Data Migration

□ Validation

□ Rollback

------

# 121. Prisma Migration Completion Check

## Prisma Workflow

状态：

```
COMPLETED
```

覆盖：

□ schema.prisma Workflow

□ migrate dev

□ migrate deploy

□ Migration Review

□ CI Integration

□ Production Rules

------

# 122. Production Deployment Completion Check

## Production Deployment

状态：

```
COMPLETED
```

覆盖：

□ Backup Before Migration

□ Deployment Process

□ Monitoring

□ Zero Downtime Strategy

□ Failure Handling

------

# 123. Rollback & Recovery Completion Check

## Recovery Strategy

状态：

```
COMPLETED
```

覆盖：

□ Migration Rollback

□ Forward Fix Migration

□ Backup Restore

□ Disaster Recovery

□ RPO / RTO

------

# 124. Governance Completion Check

## Migration Governance

状态：

```
COMPLETED
```

覆盖：

□ Change Request

□ Risk Classification

□ Approval Process

□ Audit Trail

□ Emergency Process

------

# 125. Automation Completion Check

## CI/CD Integration

状态：

```
COMPLETED
```

覆盖：

□ Git Workflow

□ CI Validation

□ Migration Testing

□ Automated Deployment

□ Quality Gate

------

# 126. Performance Optimization Completion Check

## Performance Strategy

状态：

```
COMPLETED
```

覆盖：

□ Large Table Migration

□ Batch Processing

□ Index Optimization

□ Lock Control

□ Query Monitoring

------

# 127. Documentation Completion Check

## Operational Documentation

状态：

```
COMPLETED
```

覆盖：

□ Migration Documentation

□ Execution Record

□ Troubleshooting

□ Operation Manual

□ Knowledge Transfer

------

# 128. Production Readiness Checklist

## Database Design

```
☑ ER Model Completed

☑ Table Specification Completed

☑ PostgreSQL DDL Completed

☑ Prisma Schema Completed
```

------

## Migration System

```
☑ Migration Workflow Defined

☑ Version Control Defined

☑ Deployment Process Defined

☑ Rollback Process Defined
```

------

## Operation System

```
☑ Backup Strategy Defined

☑ Monitoring Defined

☑ Incident Handling Defined

☑ Audit Process Defined
```

------

# 129. Database Migration Deliverables

最终交付包含：

| Document                           | Status    |
| ---------------------------------- | --------- |
| 401 PostgreSQL ER Model            | Completed |
| 402 PostgreSQL Table Specification | Completed |
| 403 PostgreSQL DDL                 | Completed |
| 404 Prisma Schema Specification    | Completed |
| 405 prisma.schema                  | Completed |
| 405A Validation Report             | Completed |
| 406 Seed Specification             | Completed |
| 407 Migration Strategy             | Completed |

------

# 130. Migration Strategy Final Rules

## Rule 01

任何数据库变化：

必须经过 Migration。

------

## Rule 02

任何生产修改：

必须可追踪。

------

## Rule 03

任何高风险变化：

必须具备：

```
Backup

Review

Rollback
```

------

## Rule 04

禁止：

```
Direct Production Database Editing
```

------

# 131. 407 Migration Strategy Final Status

文件：

```
407_Migration_Strategy.md
```

状态：

版本：

------

# 132. Database Documentation Phase Completion

400_Database 阶段完成：

```
399 Naming Specification

        ✅


401 ER Model

        ✅


402 Table Specification

        ✅


403 PostgreSQL DDL

        ✅


404 Prisma Schema Specification

        ✅


405 prisma.schema

        ✅


405A Validation Report

        ✅


406 Seed Specification

        ✅


407 Migration Strategy

        ✅
```