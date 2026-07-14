# Product Taxonomy

Document ID

201

Version

2.0 Final

Status

Frozen

---

# 1. Design Goal

Product Taxonomy 是 VISNDT 平台标准产品体系的基础。

目标：

建立统一的检测设备分类标准，使：

- Product
- Offer
- Knowledge
- Demand
- RFQ
- AI Search
- Statistics

全部采用同一套分类体系。

分类属于平台资产。

供应商不得修改分类。

---

# 2. Classification Principles

分类遵循：

按设备能力分类

而不是：

按厂家分类。

也不是：

按品牌分类。

更不是：

按型号分类。

分类必须：

稳定。

可扩展。

国际化。

支持 AI 检索。

支持参数模板复用。

---

# 3. Product Hierarchy（最终冻结）

平台统一采用七级模型：

Domain

↓

Category

↓

SubCategory

↓

Family

↓

Series

↓

Standard Product

↓

Offer

说明：

Domain

业务领域。

Category

一级产品分类。

SubCategory

二级产品分类。

Family

产品族。

Series

产品系列。

Standard Product

平台标准产品。

Offer

供应商商业产品。

---

# 4. Domain（第一阶段）

第一阶段固定一个业务领域：

Inspection Equipment

后续预留：

Inspection Software

Inspection Service

Inspection Consumables

Training

Calibration

Accessory

第二阶段可开放多个 Domain。

---

# 5. 一级分类（Category）

第一阶段冻结如下：

01 工业内窥镜（Industrial Borescope）

02 光纤内窥镜（Fiber Borescope）

03 光学硬杆镜（Rigid Borescope）

04 管道检测设备（Pipeline Inspection）

05 管道机器人（Pipeline Robot）

06 工业视频显微镜（Video Microscope）

07 热成像设备（Thermal Imaging）

08 红外生命探测设备（Life Detection）

09 警用搜查设备（Security Inspection）

10 超声检测设备（UT）

11 涡流检测设备（ECT）

12 磁粉检测设备（MT）

13 渗透检测设备（PT）

14 射线检测设备（RT）

15 三维视觉检测设备（3D Vision）

16 AI视觉检测系统（AI Vision）

17 在线自动检测系统（Inline Inspection）

18 激光测量设备（Laser Measurement）

19 无人机检测平台（Inspection UAV）

20 水下检测设备（Underwater Inspection）

21 检测软件平台（Inspection Software）

22 检测附件（Accessory）

23 检测耗材（Consumables）

24 定制检测设备（Custom Equipment）

25 其它检测设备（Others）

---

# 6. 二级分类（SubCategory）

示例：

工业内窥镜

↓

普通电子内窥镜

双镜头内窥镜

三镜头内窥镜

摆头内窥镜

全向电动摆头内窥镜

超细内窥镜

超长内窥镜

高温内窥镜

防爆内窥镜

测量型内窥镜

无线内窥镜

AI智能内窥镜

机器人内窥镜

其它

每个 Category

均拥有自己的 SubCategory。

---

# 7. Family（产品族）

Family 用于：

能力聚合。

参数模板复用。

AI 推荐。

示例：

工业内窥镜

↓

测量型工业内窥镜

↓

VIS Measurement Family

↓

Series

Family 不直接销售。

Family 不属于供应商。

---

# 8. Series（产品系列）

Series 表示厂家或平台定义的系列。

例如：

VIS-400 Series

VIS-600 Series

VIS-900 Series

一个 Series：

可拥有多个 Standard Product。

Series：

继承 Family 参数模板。

允许局部覆盖。

---

# 9. Standard Product

Standard Product 是平台维护的标准产品。

例如：

VIS-600

6mm

2m

双镜头

电动360°

测量版

标准产品：

唯一。

可复用。

AI 可学习。

供应商统一引用。

---

# 10. Offer

Offer：

属于 Organization。

引用：

Standard Product。

可维护：

价格。

库存。

服务。

交期。

认证。

地区。

平台允许：

多个 Offer

引用：

同一个 Product。

---

# 11. Category Governance

平台维护：

Category

SubCategory

Family

Series

供应商：

不可新增。

可提交：

新增申请。

平台审核。

统一维护。

---

# 12. Category Code

分类统一编码。

示例：

IE

Inspection Equipment

↓

IE-01

Industrial Borescope

↓

IE-01-05

Articulating Borescope

↓

IE-01-05-002

Measurement Family

↓

SP-00001258

Standard Product

编码永久不变。

名称允许国际化。

---

# 13. Internationalization

每个分类包含：

Code

Chinese Name

English Name

Alias

Description

Keywords

SEO Slug

支持：

多语言扩展。

---

# 14. AI Taxonomy

每个分类维护：

AI Keywords

Synonyms

Industry Mapping

Material Mapping

Inspection Method Mapping

Capability Mapping

Defect Mapping

AI 使用 Taxonomy

进行：

语义检索。

推荐。

RAG。

知识关联。

---

# 15. Design Constraints

任何业务：

不得直接引用：

Category。

统一引用：

Standard Product。

Category：

仅作为：

组织结构。

筛选。

参数模板。

统计分析。

AI 分类。

保证：

业务对象始终稳定。