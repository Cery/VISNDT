# Functional Test Foundation

------

# 1. Purpose

定义 VISNDT 平台功能测试规范。

目标：

验证：

- 用户功能符合设计；
- 业务流程完整；
- 页面交互正确；
- 核心场景稳定。

------

# 2. Functional Test Position

功能测试：

```
Requirement

↓

Design

↓

Development

↓

Functional Verification

↓

Release
```

------

# 3. Functional Test Scope

覆盖：

```
Public Pages

Product Center

Demand Center

User Interaction

Content Pages

Business Flow
```

------

# 4. Functional Test Principle

原则：

```
Requirement Driven

User Scenario Driven

Business Flow Driven
```

------

# 5. Test Object

对象：

```
Page

Component

Form

Standard Product

Product Parameter

Demand

RFQ

Offer

Workflow

Notification

Interaction

Data Display
```

------

# 6. Public Page Functional Test

范围：

```
Homepage

News

Technology

Applications

Contact
```

------

# 7. Homepage Test

验证：

```
Page Load

Navigation

Banner

Category Entry

Product Entry

Requirement CTA
```

------

# 8. Navigation Test

检查：

```
Menu Display

Link Correctness

Active State

Mobile Menu
```

------

# 9. Product Center Test

范围：

```
Product List

Filter

Search

Detail

Parameter Display
```

------

# 10. Product Detail Test

验证：

```
Basic Information

Technical Parameters

Related Products

Requirement Button
```

------

# 11. Demand Center Test

范围：

```
Demand Entry

Form Input

Parameter Selection

Preview

Submit

Status
```

------

# 12. Demand Form Test

验证：

```
Required Fields

Input Format

Error Message

Submit Result
```

------

# 13. Demand Workflow Test

流程：

```
Create

↓

Submit

↓

Review

↓

RFQ

↓

Response
```

------

# 14. Content Page Test

验证：

```
Article List

Article Detail

Category

Related Content
```

------

# 15. Contact Function Test

验证：

```
Form Display

Input

Validation

Submit

Feedback
```

------

# 16. Responsive Function Test

设备：

```
Desktop

Tablet

Mobile
```

------

验证：

```
Layout

Menu

Cards

Forms
```

------

# 17. Browser Compatibility Test

支持：

```
Chrome

Edge

Safari

Mobile Browser
```

------

# 18. Functional Test Priority

等级：

| Level | Scope              |
| ----- | ------------------ |
| P0    | Core Business Flow |
| P1    | Main Feature       |
| P2    | General Feature    |
| P3    | UI Optimization    |

------

# 19. Functional Test Case Example

编号：

```
TC-FUNC-001
```

------

场景：

```
User Submit Demand
```

------

步骤：

```
Open Demand Page

↓

Fill Information

↓

Submit

↓

Check Result
```

------

预期：

```
Demand Created Successfully
```

------

# 20. Functional Test Foundation Checklist

| Item             | Status  |
| ---------------- | ------- |
| Scope            | Defined |
| Public Page Test | Defined |
| Product Test     | Defined |
| Requirement Test | Defined |
| Content Test     | Defined |
| Responsive Test  | Defined |
| Browser Test     | Defined |

# Core Business Flow Test

------

# 21. Purpose

验证 VISNDT 核心业务流程完整性。

目标：

确认：

- 用户访问路径正常；
- 产品浏览流程正常；
- 需求提交流程正常；
- 平台撮合流程符合设计。

------

# 22. Core Flow Scope

核心流程：

```
User Entry

↓

Product Discovery

↓

Demand Submission

↓

Demand Processing

↓

Response Display
```

------

# 23. User Entry Flow Test

流程：

```
Open Website

↓

Homepage

↓

Navigation

↓

Target Page
```

------

验证：

```
Page Accessible

Navigation Correct

Content Loaded
```

------

# 24. Product Discovery Flow

流程：

```
Homepage

↓

Category

↓

Product List

↓

Product Detail
```

------

测试：

```
Category Display

Filter Function

Product Information

Parameter Display
```

------

# 25. Product Search Flow

流程：

```
Enter Keyword

↓

Search

↓

Result Display

↓

Open Detail
```

------

验证：

```
Search Accuracy

Empty Result Handling

Result Navigation
```

------

# 26. Product Filter Flow

流程：

```
Select Parameter

↓

Apply Filter

↓

View Result

↓

Reset Filter
```

------

验证：

```
Parameter Match

Multiple Filter

Reset Function
```

------

# 27. Product Detail Flow

流程：

```
Open Product

↓

View Information

↓

View Parameters

↓

Submit Demand
```

------

验证：

```
Information Complete

CTA Available

Related Content
```

------

# 28. Demand Submission Flow

流程：

```
Enter Demand

↓

Fill Form

↓

Select Parameters

↓

Preview

↓

Submit
```

------

验证：

```
Validation Correct

Data Created

Success Feedback
```

------

# 29. Demand Status Flow

流程：

```
Submitted

↓

Processing

↓

RFQ

↓

Response
```

------

验证：

```
Status Display

Timeline

Information Accuracy
```

------

# 30. Organization Response Flow

流程：

```
Demand

↓

RFQ

↓

Organization Response

↓

User View
```

------

验证：

```
Response Format

Data Protection

Display Correct
```

------

# 31. Content Discovery Flow

流程：

```
Technology Article

↓

Related Product

↓

Requirement
```

------

验证：

```
Internal Link

Content Relation

Conversion Path
```

------

# 32. Mobile Business Flow Test

设备：

```
Mobile Browser
```

------

验证：

```
Navigation

Forms

Cards

Submission
```

------

# 33. Exception Flow Test

场景：

```
Network Error

Invalid Input

Empty Data

Server Error
```

------

要求：

提供：

```
Clear Error Message

Recovery Action
```

------

# 34. Data Consistency Test

验证：

```
Frontend Display

API Data

Database Record
```

一致。

------

# 35. Core Flow Test Matrix

| Flow               | Status  |
| ------------------ | ------- |
| User Entry         | Defined |
| Product Browse     | Defined |
| Search             | Defined |
| Filter             | Defined |
| Product Detail     | Defined |
| Demand Submit      | Defined |
| Status Tracking    | Defined |
| Response View      | Defined |
| Content Conversion | Defined |
| Mobile Flow        | Defined |

------

# 36. Core Business Flow Checklist

| Item             | Status  |
| ---------------- | ------- |
| Entry Flow       | Defined |
| Product Flow     | Defined |
| Demand Flow      | Defined |
| RFQ Flow         | Defined |
| Content Flow     | Defined |
| Exception Flow   | Defined |
| Data Consistency | Defined |

# Regression Test Design

------

# 37. Purpose

定义 VISNDT 平台回归测试规范。

目标：

确保：

- 新功能不会破坏已有功能；
- 核心业务持续稳定；
- 发布版本质量可靠。

------

# 38. Regression Test Scope

覆盖：

```
Core Business Flow

Frontend Pages

API Interface

Database Operation

User Interaction
```

------

# 39. Regression Test Trigger

触发条件：

```
New Feature Release

Bug Fix

UI Change

API Change

Database Change
```

------

# 40. Regression Priority

等级：

| Priority | Scope               |
| -------- | ------------------- |
| P0       | Critical Business   |
| P1       | Main Function       |
| P2       | Supporting Function |
| P3       | Optimization        |

------

# 41. P0 Regression Cases

核心：

```
Website Access

Product Browse

Product Detail

Demand Submit

Demand Processing
```

------

# 42. P1 Regression Cases

主要：

```
Search

Filter

Content Navigation

Contact Form

Related Product
```

------

# 43. Frontend Regression

检查：

```
Layout

Component

Interaction

Responsive

Browser Compatibility
```

------

# 44. Product Module Regression

验证：

```
Product List

Category

Parameter Filter

Detail Page

Related Content
```

------

# 45. Demand Module Regression

验证：

```
Demand Form

Validation

Submission

Status

Response
```

------

# 46. Content Module Regression

验证：

```
News

Technology Article

Application Case

Internal Link
```

------

# 47. API Regression

验证：

```
Endpoint Available

Response Format

Business Logic

Error Handling
```

------

# 48. Database Regression

验证：

```
Data Structure

CRUD Operation

Relationship

Constraint
```

------

# 49. Regression Test Execution

流程：

```
Select Cases

↓

Execute

↓

Record Result

↓

Analyze Impact

↓

Approve Release
```

------

# 50. Regression Result Criteria

通过：

```
All P0 Passed

Critical Flow Normal

No New Critical Bug
```

------

# 51. Regression Report

包含：

```
Version

Test Scope

Executed Cases

Passed Cases

Failed Cases

Conclusion
```

------

# 52. Regression Maintenance

更新：

```
New Feature

New Bug

New Scenario
```

------

# 53. Regression Checklist

| Item                   | Status  |
| ---------------------- | ------- |
| Trigger Rule           | Defined |
| Priority               | Defined |
| Frontend Regression    | Defined |
| Product Regression     | Defined |
| Demand Regression      | Defined |
| API Regression         | Defined |
| Database Regression    | Defined |
| Report                 | Defined |

# Functional Test Acceptance Specification

------

# 54. Purpose

定义 VISNDT 功能测试最终验收标准。

目标：

确认：

- 核心功能符合需求；
- 业务流程完整；
- 用户操作正常；
- 回归测试通过。

------

# 55. Acceptance Scope

范围：

```
Public Website

Product Center

Demand Center

Content System

Business Workflow

Regression Test
```

------

# 56. Public Page Acceptance

检查：

包含：

```
Homepage

Navigation

News

Technology

Applications

Contact
```

------

状态：

```
PASS
```

------

# 57. Product Function Acceptance

检查：

功能：

```
Product List

Search

Filter

Detail

Parameter Display
```

------

状态：

```
PASS
```

------

# 58. Demand Function Acceptance

检查：

流程：

```
Create Demand

↓

Submit

↓

Process

↓

Response
```

------

状态：

```
PASS
```

------

# 59. Content Function Acceptance

检查：

支持：

```
Article List

Article Detail

Related Content

SEO Link
```

------

状态：

```
PASS
```

------

# 60. Business Flow Acceptance

验证：

完整流程：

```
User Entry

↓

Product Discovery

↓

Demand Submission

↓

RFQ

↓

Response
```

------

状态：

```
PASS
```

------

# 61. Responsive Acceptance

检查：

设备：

```
Desktop

Tablet

Mobile
```

------

状态：

```
PASS
```

------

# 62. Regression Acceptance

检查：

要求：

```
P0 Cases Passed

P1 Cases Passed

No Critical Bug
```

------

状态：

```
PASS
```

------

# 63. Functional Test Checklist

| Item                 | Status |
| -------------------- | ------ |
| Public Pages         | PASS   |
| Product Function     | PASS   |
| Demand Function      | PASS   |
| Content Function     | PASS   |
| Business Flow        | PASS   |
| Responsive           | PASS   |
| Regression           | PASS   |

------

# 64. 702_Functional_Test Final Status

| Module                | Status    |
| --------------------- | --------- |
| Functional Foundation | Completed |
| Core Business Flow    | Completed |
| Regression Test       | Completed |
| Acceptance            | Completed |
| v1.0 Alignment        | Completed |

------

# Blueprint v1.0 Alignment

## Terminology Alignment

| Legacy Term | Canonical Term | Scope |
|-------------|---------------|-------|
| Requirement Center | Demand Center | Business Object |
| Requirement Form | Demand Form | Business Object |
| Requirement Entry | Demand Entry | Business Object |
| Requirement Submission | Demand Submission | Business Object |
| Requirement Workflow | Demand Workflow | Business Object |
| Requirement Processing | Demand Processing | Business Object |
| Requirement Flow | Demand Flow | Business Object |
| Requirement Module | Demand Module | Business Object |
| Supplier Response Flow | Organization Response Flow | Business Object |
| Matching | RFQ | Business Object |
| Requirement Driven | Requirement Driven | QA Process (unchanged) |

## Test Object Alignment

VISNDT Blueprint v1.0 统一测试对象：

| Test Object | Domain |
|-------------|--------|
| Standard Product | Product |
| Product Parameter Metadata | Product / Parameter |
| Parameter Template | Product / Parameter |
| Product Parameter Value | Product / Parameter |
| Offer | Offer |
| Demand | Demand |
| RFQ | Demand / RFQ |
| Workflow | Workflow |
| Notification | Platform |

## Technology Baseline Reference

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + TypeScript |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma |
| API | REST (OpenAPI) |
| Testing | Playwright (E2E) + Jest (Unit) |

## Migration Notes

1. 所有业务对象术语已统一为 Canonical Naming Specification 标准。
2. QA 流程术语（Requirement Driven 等）保持不变。
3. Test Case ID 中 `TC-REQ-*` 已迁移为 `TC-DEMAND-*`。
4. 测试对象覆盖范围已对齐 Blueprint v1.0 的 9 个核心业务对象。

------

# 702_Functional_Test

Version:

```
V1.0
```

Status：

```
FINAL
```

Completion：

```
100%
```