# Demand Center UI Foundation

------

# 1. Purpose

定义 VISNDT 需求中心前端 UI 设计规范。

目标：

建立：

- 用户需求提交入口；
- 检测方案需求采集；
- 产品匹配入口；
- RFQ 状态反馈。

------

# 2. Demand Center Position

需求中心定位：

```
User Demand

↓

Demand Structured Data

↓

Organization Matching

↓

RFQ Response
```

------

# 3. Business Role

需求中心不是：

```
Online Order

E-commerce

Price Inquiry
```

------

需求中心是：

```
Technical Demand Collection

+

Solution Matching
```

------

# 4. User Flow

流程：

```
Enter Demand Center

↓

Select Inspection Type

↓

Fill Demand

↓

Submit

↓

Platform Review

↓

RFQ Generation

↓

Organization Response
```

------

# 5. Page Structure

目录：

```
Demand Center

├── DemandHome

├── DemandForm

├── DemandPreview

├── DemandResult

└── RFQStatus
```

------

# 6. DemandHome Page

目的：

引导用户提交需求。

------

展示：

```
Demand Introduction

Common Scenarios

Start Button
```

------

按钮：

```
提交检测需求
```

------

# 7. Requirement Entry

入口：

来源：

```
Header

Product Detail

Solution Page

Search Result
```

------

携带：

```
Category

Product

Scenario
```

------

# 8. DemandForm Design

核心页面。

------

结构：

```
Basic Information

↓

Inspection Object

↓

Environment

↓

Technical Requirement

↓

Contact Information

↓

Submit
```

------

# 9. Basic Information Section

字段：

```
Demand Title

Industry

Application
```

------

# 10. Inspection Object Section

字段：

```
Object Type

Material

Size

Structure
```

------

示例：

```
Pipeline

Engine

Casting

Weld
```

------

# 11. Environment Section

字段：

```
Temperature

Space

Access Condition

Lighting
```

------

# 12. Technical Requirement Section

字段：

```
Inspection Purpose

Required Parameters

Expected Result
```

------

# 13. Parameter Selection

复用：

```
ParameterSelector
```

------

来源：

```
Product Schema

Parameter Dictionary
```

------

# 14. Contact Information

字段：

```
Company

Name

Phone

Email
```

------

原则：

仅用于需求匹配。

------

# 15. Requirement Preview

提交前：

展示：

```
Requirement Summary

Selected Parameters

Contact Confirmation
```

------

操作：

```
Edit

Submit
```

------

# 16. Requirement Submit

提交流程：

```
Validate

↓

Create Requirement

↓

Return ID

↓

Status Page
```

------

# 17. Requirement Status

状态：

```
Draft

Submitted

Reviewing

Matching

Completed
```

------

# 18. Product Association

如果来源产品：

自动关联：

```
Product ID

Category

Parameters
```

------

# 19. Mobile Design

移动端：

流程：

```
Step Form

↓

Next

↓

Preview

↓

Submit
```

------

# 20. Requirement Center Component Mapping

| Component         | Function  |
| ----------------- | --------- |
| RequirementEntry  | Entry     |
| RequirementForm   | Input     |
| ParameterSelector | Parameter |
| PreviewCard       | Preview   |
| StatusTimeline    | Tracking  |

------

# 21. Requirement Foundation Checklist

| Item                 | Status  |
| -------------------- | ------- |
| Requirement Position | Defined |
| User Flow            | Defined |
| Page Structure       | Defined |
| Form Structure       | Defined |
| Parameter Selection  | Defined |
| Submit Flow          | Defined |
| Status Flow          | Defined |

# Requirement Form Interaction Design

------

# 22. Purpose

定义 VISNDT 需求填写页面交互规范。

目标：

实现：

- 结构化需求采集；
- 降低填写复杂度；
- 提高需求有效率；
- 支撑后端匹配。

------

# 23. Form Design Principle

原则：

```
Simple Input

+

Structured Data

+

Technical Parameters
```

------

避免：

```
Only Free Text
```

------

# 24. Form Flow

采用：

分步骤表单。

流程：

```
Step 1

Basic Information

↓

Step 2

Inspection Object

↓

Step 3

Technical Requirement

↓

Step 4

Contact

↓

Preview

↓

Submit
```

------

# 25. Step Navigation

组件：

```
StepIndicator
```

------

显示：

```
1 Basic

2 Object

3 Technical

4 Contact
```

------

状态：

```
Completed

Current

Pending
```

------

# 26. Step 1 Basic Information

字段：

```
Requirement Title

Industry

Application Scenario
```

------

交互：

输入：

↓

实时校验。

------

# 27. Industry Selection

组件：

```
IndustrySelector
```

------

选项：

```
Aerospace

Automotive

Energy

Manufacturing

Research
```

------

支持：

搜索选择。

------

# 28. Application Scenario

组件：

```
ScenarioSelector
```

------

示例：

```
Internal Inspection

Defect Detection

Maintenance

Quality Control
```

------

# 29. Step 2 Inspection Object

目标：

明确检测对象。

------

字段：

```
Object Type

Material

Dimension

Structure
```

------

# 30. Object Type Component

组件：

```
ObjectSelector
```

------

选项：

```
Pipe

Engine

Casting

Weld

Equipment
```

------

# 31. Environment Input

组件：

```
EnvironmentSelector
```

------

参数：

```
Temperature

Space

Accessibility

Lighting
```

------

# 32. Step 3 Technical Requirement

核心：

技术需求采集。

------

包含：

```
Required Parameters

Inspection Goal

Special Conditions
```

------

# 33. ParameterSelector Design

复用：

```
ParameterSelector
```

------

功能：

选择：

```
Diameter

Length

Resolution

Direction

Articulation
```

------

Dynamic Parameter Form

**表单必须基于：**

Parameter Definition
↓
Parameter Template  
↓
Dynamic Form Renderer

------

# 34. Parameter Input Mode

支持：

## Mode A

选择已有参数：

```
Dropdown

Checkbox

Range
```

------

## Mode B

自定义描述：

```
Additional Requirement
```

------

# 35. Requirement Description

组件：

```
RichTextArea
```

------

用途：

补充：

- 特殊环境；
- 检测目的；
- 经验要求。

------

# 36. Step 4 Contact

字段：

```
Company

Contact Person

Phone

Email
```

------

# 37. Contact Privacy

规则：

用户信息：

不公开。

------

用途：

```
Platform Matching

Supplier Response
```

------

# 38. Form Validation

验证：

## Required Field

```
Title

Industry

Object

Contact
```

------

## Format Validation

```
Phone

Email
```

------

# 39. Draft Save

支持：

保存草稿。

------

状态：

```
Draft
```

------

保存：

```
Local Storage

or

User Account
```

------

# 40. Submit Validation

提交前：

执行：

```
Check Required

↓

Check Format

↓

Generate Preview
```

------

# 41. Preview Interaction

组件：

```
RequirementPreview
```

------

展示：

```
Requirement Summary

Parameters

Contact
```

------

操作：

```
Modify

Confirm
```

------

# 42. Submit Success

成功：

展示：

```
Requirement Submitted

Requirement ID

Next Step
```

------

跳转：

```
Requirement Status
```

------

# 43. Error Handling

包括：

```
Network Error

Invalid Data

Submit Failed
```

------

提示：

用户可继续编辑。

------

# 44. Mobile Form Interaction

移动端：

采用：

```
Single Step

Full Screen Form

Bottom Action
```

------

按钮：

```
Previous

Next

Submit
```

------

# 45. Requirement Form Component Mapping

| Component          | Function  |
| ------------------ | --------- |
| StepIndicator      | Progress  |
| IndustrySelector   | Industry  |
| ScenarioSelector   | Scenario  |
| ObjectSelector     | Object    |
| ParameterSelector  | Technical |
| ContactForm        | Contact   |
| RequirementPreview | Confirm   |

------

# 46. Requirement Form Checklist

| Item                | Status  |
| ------------------- | ------- |
| Step Form           | Defined |
| Field Structure     | Defined |
| Parameter Selection | Defined |
| Validation          | Defined |
| Draft               | Defined |
| Preview             | Defined |
| Submit Flow         | Defined |
| Mobile Interaction  | Defined |

# Requirement Status & Response Design

------

# 47. Purpose

定义 VISNDT 需求提交后的状态展示与反馈交互。

目标：

实现：

- 用户可追踪需求进度；
- 平台状态透明；
- 匹配过程可管理；
- 形成需求闭环。

------

# 48. Requirement Status Position

需求状态：

连接：

```
Requirement Submit

↓

Platform Review

↓

Matching

↓

Solution Response

↓

Completion
```

------

# 49. Status Page Structure

页面：

```
Requirement Header

↓

Status Timeline

↓

Requirement Summary

↓

Matching Information

↓

Response Area
```

------

# 50. Requirement Header

组件：

```
RequirementHeader
```

------

展示：

```
Requirement ID

Title

Create Date

Current Status
```

------

# 51. Status Timeline

组件：

```
StatusTimeline
```

------

展示：

```
Submitted

↓

Reviewing

↓

Matching

↓

Responded

↓

Completed
```

------

# 52. Status Definition

## Draft

含义：

用户未提交。

------

状态：

```
可编辑
```

------

## Submitted

含义：

需求已提交。

------

状态：

```
等待审核
```

------

## Reviewing

含义：

平台审核需求完整性。

------

状态：

```
确认技术需求
```

------

## Matching

含义：

进入匹配流程。

------

状态：

```
寻找适配产品/供应能力
```

------

## Responded

含义：

收到方案反馈。

------

状态：

```
查看方案
```

------

## Completed

含义：

需求闭环完成。

------

状态：

```
结束
```

------

# 53. Requirement Summary

组件：

```
RequirementSummaryCard
```

------

展示：

```
Industry

Scenario

Object

Parameters

Description
```

------

# 54. Matching Information

组件：

```
MatchingPanel
```

------

展示：

```
Matched Category

Recommended Product

Solution Direction
```

------

限制：

不展示：

```
Supplier Private Contact

Internal Matching Logic
```

------

# 55. Response Area

组件：

```
ResponsePanel
```

------

内容：

```
Solution Summary

Technical Recommendation

Next Action
```

------

# 56. Supplier Response Display

供应商反馈：

展示：

```
Company Name

Technical Capability

Response Content
```

------

隐藏：

```
Private Contact

Commercial Terms
```

------

# 57. Requirement History

组件：

```
RequirementHistory
```

------

记录：

```
Create Time

Status Change

Response Time
```

------

# 58. Notification Design

提醒：

包括：

```
Status Updated

New Response

Need More Information
```

------

方式：

```
Email

Account Message
```

------

# 59. User Requirement Center

用户入口：

```
My Requirements
```

------

列表：

展示：

```
Title

Status

Date

Action
```

------

# 60. Requirement List Card

组件：

```
RequirementCard
```

------

结构：

```
----------------------

Title

Status

Date

View

----------------------
```

------

# 61. Requirement Detail Action

操作：

```
Edit Draft

View Response

Close Requirement
```

------

限制：

已提交需求：

不可直接修改核心字段。

------

# 62. Mobile Status Design

移动端：

结构：

```
Header

↓

Timeline

↓

Summary

↓

Response
```

------

# 63. Status Component Mapping

| Component         | Function     |
| ----------------- | ------------ |
| RequirementHeader | Basic Info   |
| StatusTimeline    | Progress     |
| SummaryCard       | Requirement  |
| MatchingPanel     | Match Result |
| ResponsePanel     | Feedback     |
| HistoryList       | Record       |

------

# 64. Requirement Status Checklist

| Item             | Status  |
| ---------------- | ------- |
| Status Flow      | Defined |
| Timeline         | Defined |
| Summary Display  | Defined |
| Matching Display | Defined |
| Response Display | Defined |
| History          | Defined |
| Mobile Layout    | Defined |

# Requirement Center UI Acceptance Specification

------

# 65. Purpose

定义 VISNDT 需求中心 UI 最终验收标准。

目标：

确认：

- 需求采集完整；
- 提交流程稳定；
- 状态反馈清晰；
- 产品与需求连接有效。

------

# 66. Acceptance Scope

范围：

```
Requirement Home

+

Requirement Form

+

Parameter Selection

+

Preview

+

Submit

+

Status Tracking

+

Response Display
```

------

# 67. Requirement Home Acceptance

检查：

包含：

```
Introduction

Scenario Entry

Submit Button
```

------

要求：

用户能够快速进入需求流程。

状态：

```
PASS
```

------

# 68. Requirement Form Acceptance

检查：

包含：

```
Basic Information

Inspection Object

Environment

Technical Requirement

Contact
```

------

要求：

字段结构符合需求模型。

状态：

```
PASS
```

------

# 69. Step Flow Acceptance

检查：

流程：

```
Step 1

↓

Step 2

↓

Step 3

↓

Step 4

↓

Preview
```

------

要求：

用户可返回修改。

状态：

```
PASS
```

------

# 70. Parameter Selection Acceptance

检查：

支持：

```
Parameter Dictionary

Multi Select

Custom Requirement
```

------

要求：

参数数据可进入后端匹配。

状态：

```
PASS
```

------

# 71. Validation Acceptance

检查：

包括：

```
Required Check

Format Check

Submit Check
```

------

状态：

```
PASS
```

------

# 72. Preview Acceptance

检查：

提交前：

展示：

```
Requirement Summary

Parameters

Contact
```

------

状态：

```
PASS
```

------

# 73. Submit Acceptance

检查：

提交：

```
Create Requirement

Generate ID

Redirect Status
```

------

状态：

```
PASS
```

------

# 74. Status Page Acceptance

检查：

展示：

```
Timeline

Current Status

Requirement Detail
```

------

状态：

```
PASS
```

------

# 75. Matching Response Acceptance

检查：

展示：

```
Solution Summary

Recommended Direction

Response Information
```

------

限制：

不泄露：

```
Private Supplier Data

Internal Algorithm
```

------

状态：

```
PASS
```

------

# 76. Requirement List Acceptance

检查：

我的需求：

展示：

```
Title

Status

Date

Action
```

------

状态：

```
PASS
```

------

# 77. Responsive Acceptance

检查：

设备：

```
Desktop

Tablet

Mobile
```

------

要求：

表单和状态页面正常显示。

状态：

```
PASS
```

------

# 78. Security Acceptance

检查：

用户数据：

```
Private

Protected

Controlled Access
```

------

状态：

```
PASS
```

------

# 79. Requirement Center Checklist

| Item                | Status |
| ------------------- | ------ |
| Requirement Entry   | PASS   |
| Form Flow           | PASS   |
| Parameter Selection | PASS   |
| Validation          | PASS   |
| Preview             | PASS   |
| Submit              | PASS   |
| Status Tracking     | PASS   |
| Response Display    | PASS   |
| Responsive          | PASS   |
| Security            | PASS   |

------

# 80. 607_Requirement_Center_UI Final Status

| Module                 | Status    |
| ---------------------- | --------- |
| Requirement Foundation | Completed |
| Requirement Form       | Completed |
| Status Tracking        | Completed |
| Acceptance             | Completed |

------

# 607_Requirement_Center_UI

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