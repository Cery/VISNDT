# Capability & Feature System

Document ID

204

Version

2.0 Final

Status

Frozen

---

# 1. Design Goal

Capability 与 Feature 是 Product Center 中两个独立的数据域。

Capability 用于描述设备具备的技术能力。

Feature 用于描述用户可使用的产品功能。

二者独立维护、独立检索、独立扩展。

---

# 2. Core Principles

Parameter

描述：

产品客观技术参数。

Capability

描述：

产品具备的核心能力。

Feature

描述：

用户可使用的功能。

三者相互关联，但职责独立。

---

# 3. Capability Definition

Capability 是产品天然具备的能力。

通常来源于：

机械结构

光学结构

电子设计

硬件平台

算法能力

Capability 不依赖具体用户操作。

---

# 4. Feature Definition

Feature 是用户可以直接使用的功能。

通常来源于：

软件

固件

控制逻辑

交互界面

云服务

一个 Capability 可以支撑多个 Feature。

---

# 5. Capability Classification

第一阶段统一分类：

Optical Capability

Imaging Capability

Measurement Capability

Probe Capability

Articulation Capability

Lighting Capability

Communication Capability

Storage Capability

Mechanical Capability

Environmental Capability

Protection Capability

AI Capability

Software Capability

Expansion Capability

---

# 6. Feature Classification

第一阶段统一分类：

Image Feature

Video Feature

Measurement Feature

Display Feature

Storage Feature

Transfer Feature

Annotation Feature

Report Feature

Calibration Feature

Cloud Feature

AI Feature

System Feature

Maintenance Feature

---

# 7. Capability Metadata

每个 Capability 包含：

Capability ID

Code

Chinese Name

English Name

Description

Category

Keywords

Synonyms

Search Weight

AI Weight

Display Order

Status

Version

---

# 8. Feature Metadata

每个 Feature 包含：

Feature ID

Code

Chinese Name

English Name

Description

Category

Required Capability

Keywords

Search Weight

AI Weight

Display Order

Status

Version

---

# 9. Capability Relationship

Category

↓

Capability Template

↓

Family

↓

Series

↓

Standard Product

支持：

继承

覆盖

新增

平台统一维护。

---

# 10. Feature Relationship

Capability

↓

Feature Template

↓

Standard Product

Feature 可根据：

软件版本

固件版本

授权等级

启用或关闭。

---

# 11. Industrial Borescope Example

Capability：

360° Articulation

↓

Feature：

Joystick Control

Angle Preset

Auto Center

---

Capability：

Stereo Measurement

↓

Feature：

Length Measurement

Depth Measurement

Area Measurement

Report Export

---

Capability：

Wi-Fi

↓

Feature：

Live View

Remote Control

Wireless Download

Cloud Sync

---

Capability：

AI Recognition

↓

Feature：

Auto Defect Detection

Auto Classification

Inspection Suggestion

AI Report

---

# 12. Search Strategy

Capability：

用于：

产品筛选

产品推荐

AI 检索

Demand Matching

Feature：

用于：

产品详情

功能搜索

帮助中心

知识推荐

---

# 13. AI Strategy

Capability：

作为知识图谱节点。

Feature：

作为能力扩展节点。

AI 推荐：

优先依据 Capability。

AI 问答：

同时引用 Capability 与 Feature。

---

# 14. UI Strategy

产品列表：

展示 Capability 标签。

产品详情：

展示 Capability。

同时展示：

Feature 清单。

支持：

展开

分类

搜索

对比。

---

# 15. Compare Strategy

Capability：

支持：

是否具备。

Feature：

支持：

功能数量。

功能差异。

AI 自动生成：

能力比较摘要。

功能比较摘要。

---

# 16. Data Governance

平台维护：

Capability Definition

Feature Definition

Capability Template

Feature Template

企业：

不得修改定义。

仅可补充：

说明。

图片。

演示视频。

---

# 17. Future Extension

Release 2.0

预留：

Capability Package

Feature Package

License Feature

Subscription Feature

Plugin Feature

Remote Feature

Digital Twin Feature

以上扩展不影响当前数据库设计。