# Product Center UI Foundation

------

# 1. Purpose

定义 VISNDT 产品中心前端 UI 设计规范。

目标：

建立：

- 产品浏览入口；
- 产品分类展示；
- 参数筛选能力；
- 产品详情展示。

------

# 2. Product Center Position

产品中心定位：

```
SEO Traffic

+

Product Knowledge

+

Technical Selection

+

Demand Conversion
```

------

# 3. Product Center Scope

包含：

```
Product Home

↓

Category

↓

Product List

↓

Product Detail

↓

Demand Entry
```

------

# 4. Page Structure

目录：

```
Product Center

├── ProductIndex

├── ProductCategory

├── ProductList

└── ProductDetail
```

------

# 5. Product Center User Flow

流程：

```
Visit Product Center

↓

Select Category

↓

Filter Parameters

↓

View Product

↓

Submit Demand
```

------

# 6. ProductIndex Page

## Purpose

产品中心入口。

------

展示：

```
Category Navigation

Featured Products

Application Areas

Search Entry
```

------

布局：

```
Header

↓

Category Area

↓

Featured Product

↓

Application

↓

Footer
```

------

# 7. ProductCategory Page

## Purpose

产品分类展示。

------

分类：

```
Electronic Endoscope

Optical Endoscope

Fiber Endoscope

Pipeline Endoscope

Crawler Robot
```

------

展示：

```
Category Description

Product Count

Main Features
```

------

# 8. ProductList Page

## Purpose

产品搜索与筛选。

------

布局：

```
--------------------------------

Filter Panel | Product List

--------------------------------
```

------

# 9. Filter Panel Design

位置：

左侧。

------

内容：

```
Category

Dynamic Parameter Filters
(基于 Parameter Definition)

Application
```

**禁止固定字段：**
- ~~Diameter~~
- ~~Length~~
- ~~Resolution~~

**使用动态参数：**
- Parameter Template
- Parameter Metadata

------

交互：

```
Select

↓

Update Filter

↓

Refresh List
```

------

# 10. Product Card Design

组件：

```
ProductCard
```

------

结构：

```
+----------------+

| Image          |

|----------------|

| Product Name   |

| Parameters     |

| Application    |

| Offer Info     |

+----------------+
```

------

# 11. Product Card Content

显示：

```
Product Name

Core Parameters

Application

Manufacturer
```

------

不显示：

```
Price

Online Order
```

------

# 12. Product Detail Page

## Purpose

展示完整产品信息。

------

结构：

```
Product Header

↓

Technical Parameters

↓

Application

↓

Advantages

↓

Related Products

↓

Requirement Button
```

------

# 13. Product Header

包含：

```
Product Image

Product Name

Category

Short Description
```

------

# 14. Technical Parameter Area

组件：

```
ParameterTable
```

------

展示：

```
Parameter

Value

Unit

Description
```

------

# 15. Application Area

展示：

```
Industry

Scenario

Inspection Object
```

------

# 16. Supplier Display

原则：

展示：

```
Manufacturer Name
```

------

限制：

不提供：

- 外链；
- 店铺入口；
- 在线交易。

------

# 17. Requirement Conversion Entry

位置：

产品详情页。

------

按钮：

```
Submit Requirement
```

------

流程：

```
Product Detail

↓

Requirement Form

↓

Requirement Data
```

------

# 18. Product Search

支持：

关键词：

```
Product Name

Model

Application

Parameter
```

------

# 19. Responsive Design

PC：

```
Sidebar

+

Grid
```

------

Mobile：

```
Filter Button

+

Single Column Card
```

------

# 20. Product Center Component Mapping

| Component         | Usage        |
| ----------------- | ------------ |
| ProductCard       | Product List |
| ParameterTable    | Detail       |
| FilterPanel       | Search       |
| CategoryCard      | Category     |
| RequirementButton | Conversion   |

------

# 21. Product Center UI Checklist

| Item             | Status  |
| ---------------- | ------- |
| Product Entry    | Defined |
| Category Page    | Defined |
| Product List     | Defined |
| Filter UI        | Defined |
| Product Card     | Defined |
| Detail Page      | Defined |
| Requirement Link | Defined |

# Product List Interaction Design

------

# 22. Purpose

定义 VISNDT 产品列表页面交互规范。

目标：

实现：

- 产品快速浏览；
- 参数筛选；
- 条件组合查询；
- 产品比较。

------

# 23. Product List Position

产品列表：

承担：

```
Category

↓

Filter

↓

Selection

↓

Detail

↓

Requirement
```

------

# 24. Page Layout

PC：

```
------------------------------------------------

Header

------------------------------------------------

Category Navigation

------------------------------------------------

Filter Panel | Product Result

             |

             Product Card

             Product Card

             Product Card

------------------------------------------------

Pagination

------------------------------------------------
```

------

# 25. Filter Panel Design

组件：

```
FilterPanel
```

------

位置：

左侧固定区域。

------

宽度：

```
240px - 280px
```

------

# 26. Filter Category

筛选维度：

```
Product Category

Device Type

Application

Parameter
```

------

# 27. Parameter Filter

核心参数：

```
Probe Diameter

Insertion Length

Resolution

View Direction

Articulation

Light Source
```

------

# 28. Filter Interaction

流程：

```
User Select Parameter

↓

Update Filter State

↓

Request Product Data

↓

Refresh Product List
```

------

# 29. Multiple Filter Rule

支持：

多条件组合。

例如：

```
Diameter = 6mm

+

Length > 3m

+

Resolution = HD
```

------

结果：

返回符合条件产品。

------

# 30. Selected Filter Tags

组件：

```
FilterTag
```

------

展示：

```
Diameter:6mm

HD

Pipeline
```

------

操作：

```
Remove

Clear All
```

------

# 31. Product Result Area

展示：

```
Result Count

Sort

Product Cards
```

------

# 32. Product Card Layout

结构：

```
--------------------------------

Image

--------------------------------

Product Name

--------------------------------

Core Parameters

--------------------------------

Application

--------------------------------

Supplier

--------------------------------

View Detail

--------------------------------
```

------

# 33. Product Card Interaction

支持：

```
Hover

View Detail

Compare

Submit Requirement
```

------

# 34. Product Sorting

支持：

```
Recommended

Latest

Application Match
```

------

禁止：

价格排序。

------

# 35. Pagination Design

规则：

每页：

```
10 Products
```

------

组件：

```
Pagination
```

------

状态：

```
Current Page

Total Page

Total Count
```

------

# 36. Empty Result State

无结果：

展示：

```
No Matching Product

Adjust Filter

Submit Requirement
```

------

引导：

进入需求中心。

------

# 37. Loading State

加载：

展示：

```
Skeleton Card

Loading Indicator
```

------

# 38. Product Comparison

功能：

辅助技术选择。

------

限制：

最多：

```
3 Products
```

------

比较内容：

```
Parameter

Difference

Application
```

------

# 39. Mobile Interaction

移动端：

布局：

```
Filter Button

↓

Drawer Filter

↓

Product List
```

------

# 40. Filter State Storage

状态来源：

```
productStore
```

------

保存：

```
Selected Category

Selected Parameters

Pagination
```

------

# 41. SEO Consideration

产品列表页面：

支持：

```
Category URL

Parameter Landing

Product Index
```

------

目标：

提升：

搜索入口覆盖。

------

# 42. Product List Component Mapping

| Component    | Function            |
| ------------ | ------------------- |
| FilterPanel  | Parameter Selection |
| FilterTag    | Condition Display   |
| ProductCard  | Product Display     |
| Pagination   | Page Control        |
| ComparePanel | Comparison          |

------

# 43. Product List Interaction Checklist

| Item               | Status  |
| ------------------ | ------- |
| Filter Panel       | Defined |
| Parameter Filter   | Defined |
| Multi Filter       | Defined |
| Product Card       | Defined |
| Pagination         | Defined |
| Comparison         | Defined |
| Mobile Interaction | Defined |

# Product Detail Page Design

------

# 44. Purpose

定义 VISNDT 产品详情页面设计规范。

目标：

实现：

- 产品技术展示；
- 参数理解；
- 应用场景说明；
- 需求转化入口。

------

# 45. Product Detail Position

产品详情：

承担：

```
SEO Landing

+

Technical Information

+

Selection Support

+

Requirement Conversion
```

------

# 46. Page Structure

整体结构：

```
Product Header

↓

Technical Parameters

↓

Features

↓

Applications

↓

Inspection Solutions

↓

Related Products

↓

Requirement Entry
```

------

# 47. Product Header Design

组件：

```
ProductHero
```

------

展示：

```
Product Image

Product Name

Model

Category

Short Description
```

------

操作：

```
Submit Requirement

Download Technical Info
```

------

# 48. Product Image Area

要求：

展示：

```
Main Image

Gallery

Application Image
```

------

原则：

突出：

检测场景。

------

# 49. Basic Information Area

组件：

```
ProductSummary
```

------

内容：

```
Product Category

Device Type

Main Application

Supplier
```

------

# 50. Technical Parameter Design

核心组件：

```
ParameterTable
```

------

布局：

```
--------------------------------

Parameter Group

--------------------------------

Name       Value

Diameter   6mm

Length     3m

Resolution HD

--------------------------------
```

------

# 51. Parameter Group

分组：

```
Basic Specification

Optical System

Probe System

Control System

Application
```

------

# 52. Parameter Display Rule

显示：

```
Parameter Name

Value

Unit

Description
```

------

例如：

```
Probe Diameter

6.0 mm

Suitable for narrow space inspection
```

------

# 53. Product Feature Section

组件：

```
FeatureList
```

------

展示：

```
High Resolution

Flexible Operation

Industrial Durability
```

------

# 54. Application Section

组件：

```
ApplicationPanel
```

------

内容：

```
Industry

Inspection Object

Typical Defect

Solution
```

------

# 55. Solution Connection

产品页面关联：

需求中心。

------

流程：

```
Product

↓

Application Scenario

↓

Requirement Form
```

------

自动带入：

```
Product Category

Product ID

Application
```

------

# 56. Supplier Display Rule

展示：

```
Manufacturer Name
```

------

隐藏：

```
Price

Contact

External Link
```

------

目的：

保持平台中立。

------

# 57. Related Product Section

组件：

```
RelatedProducts
```

------

推荐依据：

```
Same Category

Same Application

Similar Parameters
```

------

# 58. Requirement CTA Design

组件：

```
RequirementButton
```

------

位置：

页面：

- 顶部；
- 参数之后；
- 底部。

------

按钮：

```
获取方案建议
```

------

# 59. Mobile Detail Layout

移动端：

顺序：

```
Image

↓

Summary

↓

Parameters

↓

Application

↓

Requirement
```

------

# 60. Product Detail SEO

页面包含：

```
SEO Title

SEO Description

Keywords

Structured Data
```

------

重点：

技术关键词覆盖。

------

# 61. Product Detail Component Mapping

| Component         | Function       |
| ----------------- | -------------- |
| ProductHero       | Header         |
| ParameterTable    | Technical Data |
| FeatureList       | Advantages     |
| ApplicationPanel  | Scenario       |
| RelatedProducts   | Recommendation |
| RequirementButton | Conversion     |

------

# 62. Product Detail Checklist

| Item            | Status  |
| --------------- | ------- |
| Header          | Defined |
| Image Area      | Defined |
| Parameters      | Defined |
| Features        | Defined |
| Application     | Defined |
| Requirement CTA | Defined |
| SEO             | Defined |
| Mobile Layout   | Defined |

# Product Center UI Acceptance Specification

------

# 63. Purpose

定义 VISNDT 产品中心 UI 验收标准。

目标：

确认：

- 页面结构完整；
- 产品展示符合平台定位；
- 筛选体验有效；
- 技术信息表达清晰；
- 需求转化链路完整。

------

# 64. Acceptance Scope

范围：

```
Product Index

+

Category Page

+

Product List

+

Product Detail

+

Requirement Entry

+

SEO Structure
```

------

# 65. Product Index Acceptance

检查：

入口页面：

包含：

```
Category Navigation

Featured Products

Search Entry

Application Entry
```

------

要求：

用户可快速进入产品分类。

状态：

```
PASS
```

------

# 66. Category Page Acceptance

检查：

分类展示：

包括：

```
Category Description

Main Features

Product List Entry
```

------

要求：

分类逻辑符合工业检测设备体系。

状态：

```
PASS
```

------

# 67. Product List Acceptance

检查：

功能：

```
Product Card

Filter

Search

Pagination
```

------

要求：

用户能够：

- 快速定位产品；
- 根据参数筛选；
- 查看详情。

状态：

```
PASS
```

------

# 68. Filter System Acceptance

检查：

支持：

```
Category Filter

Parameter Filter

Multi Condition Filter

Clear Filter
```

------

要求：

筛选结果准确。

状态：

```
PASS
```

------

# 69. Product Card Acceptance

检查：

展示：

```
Image

Name

Core Parameters

Application

Supplier
```

------

禁止：

```
Price

Online Purchase

Store Link
```

------

状态：

```
PASS
```

------

# 70. Product Detail Acceptance

检查：

页面包含：

```
Product Information

Technical Parameters

Application

Related Product

Requirement CTA
```

------

状态：

```
PASS
```

------

# 71. Parameter Display Acceptance

检查：

参数：

必须：

- 分类展示；
- 单位明确；
- 数据可读。

------

示例：

```
Probe Diameter

6.0 mm

Insertion Length

3 m

Resolution

HD
```

------

状态：

```
PASS
```

------

# 72. Requirement Conversion Acceptance

检查：

产品页：

必须能够进入：

```
Requirement Form
```

------

自动携带：

```
Product ID

Category

Application
```

------

状态：

```
PASS
```

------

# 73. Responsive Acceptance

检查：

设备：

```
Desktop

Tablet

Mobile
```

------

要求：

布局正常。

状态：

```
PASS
```

------

# 74. SEO Acceptance

检查：

产品页面：

包含：

```
Title

Description

Keywords

Structured Data
```

------

状态：

```
PASS
```

------

# 75. Performance Acceptance

检查：

包括：

```
Image Optimization

Lazy Loading

API Loading

Page Speed
```

------

状态：

```
PASS
```

------

# 76. Product Center UI Checklist

| Item              | Status |
| ----------------- | ------ |
| Product Index     | PASS   |
| Category Page     | PASS   |
| Product List      | PASS   |
| Filter System     | PASS   |
| Product Card      | PASS   |
| Product Detail    | PASS   |
| Requirement Entry | PASS   |
| Responsive        | PASS   |
| SEO               | PASS   |
| Performance       | PASS   |

------

# 77. 606_Product_Center_UI Final Status

| Module                    | Status    |
| ------------------------- | --------- |
| Product Center Foundation | Completed |
| Product List Interaction  | Completed |
| Product Detail Design     | Completed |
| Acceptance                | Completed |

------

# 606_Product_Center_UI

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