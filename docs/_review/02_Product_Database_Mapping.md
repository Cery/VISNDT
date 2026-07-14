# 02 Product Database Mapping

重点审查范围：

- `200_Product-第二版(RP-)`
- `200_Product-第一版`
- `400_Database-第二版`
- `400_Database`
- `500_Backend`
- `600_Frontend`

目标：

建立 `产品模型 -> 数据库模型 -> API 需求 -> 前端展示需求` 的一致性映射，并重点评估动态参数元数据引擎是否可作为未来 VISNDT 平台的统一基线。

---

## 1. 总体判断

### 结论一

`200_Product-第二版(RP-)` 与 `400_Database-第二版` 已经形成了较强的一致性主干，尤其在以下方面：

1. `Standard Product` 作为平台唯一产品主数据
2. `Offer` 作为供应商商业供给对象
3. `Parameter Definition + Template + Value` 的参数模型
4. `Capability / Feature` 与 Product 的映射关系
5. `File Domain`、`Workflow Domain`、`AI/Search Domain` 的扩展接口

### 结论二

真正缺失的不是数据库结构本身，而是：

1. 后端 API 还没有完整映射到第二版 Product/DB
2. 前端 UI 还没有完整消费动态参数模型
3. 非视觉类 NDT 设备如何落入同一参数元数据引擎，尚未形成工程化示例

### 结论三

**建议采用“PostgreSQL JSONB + Parameter Metadata + 受控 EAV”作为统一参数引擎基线。**

但必须强调：

- 不是全系统泛化 EAV
- 不是任意对象都丢进 JSONB
- 只在“参数值表达层”和“元数据扩展层”使用受控动态模型

---

## 2. 产品模型到数据库模型的主映射

| 产品对象 | 产品文档来源 | 数据库映射 | API 需求 | 前端需求 | 当前状态 |
| --- | --- | --- | --- | --- | --- |
| Domain | `201_ProductTaxonomy.md` | 目前第二版 DB 未单独固化 Domain 表 | 分类树查询、未来扩展接口 | 顶层业务域切换 | 部分缺失 |
| Category | Product v1/v2 | `product_category` | 分类列表、管理接口 | 分类导航、着陆页 | 基本一致 |
| SubCategory | Product v2 | `product_sub_category` | 分类树查询 | 二级分类页、筛选入口 | 基本一致 |
| Family | Product v1/v2 | `product_family` | Family 查询、模板绑定 | 产品族页、能力聚合 | 基本一致 |
| Series | Product v1/v2 | `product_series` | 系列详情、系列列表 | 系列展示、推荐 | 基本一致 |
| Standard Product | Product v2 | `standard_product` | 产品列表、详情、比较、审核 | 产品详情页、参数展示、SEO | 基本一致 |
| Offer | Product v2 / Architecture / DB | `offer` 及其子表 | 供给发布、RFQ 引用、响应接口 | 供应商产品供给、报价入口 | Backend/UI 不完全一致 |
| Parameter Group | `203_ProductParameterSchema.md` | `parameter_group` | 参数分组管理 | 分组展示 | 基本一致 |
| Parameter Definition | 同上 | `parameter_definition` | 参数定义管理、筛选条件接口 | 参数标签、筛选面板 | 基本一致 |
| Parameter Template | 同上 | `parameter_template` | 模板查询、模板绑定接口 | 动态表单、动态参数表 | 基本一致 |
| Parameter Template Item | 同上 | `parameter_template_item` | 模板项明细接口 | 动态字段渲染、必填校验 | 基本一致 |
| Product Parameter Value | 同上 | `product_parameter_value` | 参数值读写、对比、导出 | 参数表、比较页、需求预填充 | API/UI 仍缺桥接 |
| Capability Definition | `204_CapabilityFeatureSystem.md` | `capability_definition` | 能力库接口 | Feature/Capability 标签 | 基本一致 |
| Product Capability | 同上 | `product_capability` | 产品能力映射接口 | 产品能力展示、搜索过滤 | 基本一致 |
| Feature Definition | 同上 | `feature_definition` | 功能库接口 | 功能说明区 | 基本一致 |
| Product Feature | 同上 | `product_feature` | 产品功能映射接口 | 功能列表 | 基本一致 |
| Product Attachment / Image | Product v2 / DB v2 | `file_object` + 引用关系 | 上传、下载、权限控制 | 轮播图、资料下载 | 基本一致 |
| Product -> Knowledge | `205_ProductRelationshipModel.md` | `product_knowledge_mapping` | 关联知识查询 | 关联案例/知识内容 | 基本一致 |
| Product -> Demand Matching | `205_ProductRelationshipModel.md` | `demand_recommendation` 等 | 推荐接口、匹配接口 | 需求推荐结果 | 责任边界需细化 |

---

## 3. 产品模型到 API 需求映射

当前数据库与产品模型已经具备较完整的实体划分，但 API 规范层还缺少面向第二版模型的明确接口族。建议把 API 需求拆成四层：

### 3.1 产品主数据 API

1. 分类树查询
2. Family / Series / Standard Product 查询
3. 标准产品详情、版本、审核状态
4. 产品知识关联查询
5. 产品比较接口

### 3.2 参数元数据 API

1. 参数分组列表
2. 参数定义列表
3. 模板列表与模板项明细
4. 按分类/Family/Series 返回动态参数模板
5. 参数筛选配置接口

### 3.3 参数值与搜索 API

1. 标准产品参数值查询
2. 参数过滤搜索
3. 参数比较
4. 需求表单参数预填充
5. 参数导出/规范书导出

### 3.4 平台管理 API

1. 参数定义维护
2. 模板维护与版本控制
3. Capability/Feature 维护
4. 分类变更审核
5. 标准产品版本修订

### 当前问题

`500_Backend/502_API_Design_Specification.md` 与 `503_OpenAPI_Specification.md` 仍是通用接口规范，尚未把以上接口正式落成第二版 Product/Database 的资源清单。

---

## 4. 产品模型到前端展示需求映射

### 4.1 已有前端支撑

`600_Frontend` 已经为以下能力提供了基础：

1. 产品列表
2. 参数筛选
3. 产品详情
4. 需求表单
5. 响应式页面
6. SEO 页面结构

### 4.2 仍需补齐的动态参数消费能力

前端若要真正消费第二版参数模型，至少还需要明确以下展示契约：

1. **动态筛选面板**
   - 不应只写死 `Diameter / Length / Resolution`
   - 应由 Parameter Template + Definition 驱动生成

2. **动态参数表**
   - 由参数分组控制排序
   - 支持单位、描述、默认展示规则

3. **需求预填充**
   - 从产品详情进入需求中心时，应自动带入分类、产品、参数上下文

4. **产品比较页**
   - 以 `parameter_definition` 为列基准，而不是手工拼字段

5. **移动端折叠策略**
   - 大量参数在移动端不能全部直出，需要分组折叠、摘要优先

---

## 5. 参数体系对未来设备扩展能力的评估

用户要求未来支持：

- 工业内窥镜
- 超声检测设备
- X 射线检测设备
- 其它 NDT 设备

### 5.1 当前设计是否支持扩展

**结论：支持，但仍未完全工程化收口。**

支持的原因：

1. Product v2 已引入 `Domain -> Category -> SubCategory -> Family -> Series -> Standard Product` 的多层级结构。
2. 参数体系不是宽表，而是 Definition / Template / Value 分离。
3. Capability / Feature / Knowledge / Demand / RFQ 都围绕 Product ID 引用。
4. Database v2 已为参数定义、模板、模板项、参数值建立了稳定表结构。

### 5.2 当前不足

1. 文档里还没有一份“多设备族参数模板策略”总说明。
2. Frontend/Backend 仍以工业内窥镜示例为主。
3. 超声/X 射线等设备族虽然在分类层面有预留或已有旧版覆盖，但没有形成：
   - 参数模板样板
   - 搜索过滤样板
   - 需求采集样板
   - RFQ 参数透传样板

### 5.3 建议

MVP 阶段不必一次性把所有 NDT 设备都做全量标准库，但必须先把参数引擎设计成跨设备族可扩展。

---

## 6. 动态参数元数据引擎评估

## 6.1 是否建议采用

**建议采用。**

建议形态：

`Parameter Metadata + Template + Controlled EAV + JSONB`

### 推荐结构

1. `parameter_definition`
   - 定义参数语义、类型、单位、筛选/比较/AI 属性
2. `parameter_template`
   - 定义某类设备需要哪些参数
3. `parameter_template_item`
   - 定义模板项顺序、必填、继承、显示规则
4. `product_parameter_value`
   - 保存某个产品对某个参数的值
5. `value_json` / `metadata`
   - 只作为复杂值和扩展元数据的承载层

### 不建议的做法

1. 把所有产品参数做成固定列宽表
2. 把全部业务主字段都塞进 JSONB
3. 用无约束 EAV 取代产品主数据结构

---

## 6.2 当前文档是否已经包含

| 评估项 | 结论 |
| --- | --- |
| 当前文档是否已经包含 | 已包含核心思想 |
| 如果包含，是否完整 | Product v2 与 Database v2 基本完整；API/UI 侧不完整 |
| 如果缺失，应该放在哪个模块 | `200_Product`、`300_Architecture`、`400_Database`、`500_Backend`、`600_Frontend` |
| 是否会影响其它模块 | 会，影响 Search、AI、Demand、RFQ、Compare、Export |
| 是否需要同步修改其它设计文件 | 需要，同步 Product/DB/API/Frontend/Quality 文档 |

---

## 6.3 影响分析

### 对 Product

需要把“设备族模板化”写成正式策略，而不是只停留在参数实体定义。

### 对 Database

现有数据库设计总体可承接，但需要明确：

1. 哪些字段是强结构字段
2. 哪些值允许 `JSONB`
3. 哪些 JSONB 需要 GIN 索引
4. 哪些字段进入全文索引

### 对 Backend API

需要新增或明确：

1. 参数模板查询接口
2. 动态筛选配置接口
3. 参数比较接口
4. 需求参数透传接口
5. 管理端参数维护接口

### 对 Frontend

需要由“固定页面示例”升级为“元数据驱动 UI”：

1. 动态筛选
2. 动态表单
3. 动态参数表
4. 动态比较页

---

## 7. Search 与 AI 边界在产品参数映射中的问题

### 当前现象

1. Product 参数体系同时服务 Search、Compare、RFQ、Demand、AI。
2. Search 文档把“AI 语义搜索”也纳入了 Search Center。
3. AI 文档又定义 Embedding、RAG、Recommendation 等能力。
4. Database 原始 Search/AI Schema 之间存在重叠。

### 建议的边界

#### Search

负责：

- 产品检索
- 参数过滤
- 分类搜索
- RFQ 搜索
- 关键词提示
- 全文索引

技术建议：

- PostgreSQL Full Text Search
- `pg_trgm`
- 结构化筛选索引

#### AI

负责：

- 语义理解
- 智能推荐
- 知识问答
- 需求匹配
- Embedding / RAG

技术建议：

- `pgvector` 或外置向量服务作为后续增强层
- 不应替代 Search 的基础过滤能力

### 结论

**MVP 不需要 Elasticsearch。**

推荐顺序：

1. 先用 PostgreSQL 原生全文检索 + 结构化筛选完成 Search MVP
2. 保留 `pgvector` 兼容接口用于 Phase 2 语义增强
3. 只有当跨域内容量、召回复杂度、运营搜索需求显著增长时，再评估 Elasticsearch

---

## 8. 当前映射中的主要断点

### 断点 01：Backend 术语仍旧未跟随第二版

`505_Backend_Business_Service.md` 仍大量使用：

- `Supplier`
- `Requirement`
- `Inquiry`
- `News & CMS`

而不是：

- `Organization`
- `Demand`
- `RFQ`
- `Knowledge`

### 断点 02：Search Service 仍按旧表名思维编写

Search Service 中仍出现：

- `product`
- `supplier`
- `parameter_value`

而第二版数据库基线实际应为：

- `standard_product`
- `organization` / `offer`
- `product_parameter_value`

### 断点 03：Frontend 还没有参数元数据总契约

虽然已有筛选、详情、需求表单，但缺少统一说明：

- 参数模板如何下发
- 参数定义如何驱动 UI
- 参数值如何驱动比较与导出

---

## 9. 建议清单

| 建议 | 当前是否已有设计 | 是否需要调整 | 影响模块 | 需要同步的文件 |
| --- | --- | --- | --- | --- |
| 采用参数元数据引擎作为统一基线 | 已有 | 需要正式确认 | Product / Database / Backend / Frontend / Search / AI | 203、202、402、403、404、505、606、607 |
| 明确 `Standard Product` 与 `Offer` 的边界 | 已有 | Backend 必须调整 | Business / Product / DB / Backend / Frontend | 200、205、304、305、402、505 |
| 为多类 NDT 设备定义模板化策略 | 部分已有 | 需要补充 | Product / Database / Frontend | 201、203、402、606、607 |
| 把参数模板、参数定义、参数值映射到正式 API 资源 | 当前不足 | 需要新增 | Backend / Frontend | 502、503、505、605 |
| 明确 Search 与 AI 对参数的使用边界 | 部分已有 | 需要调整 | Architecture / Database / Backend | 310、311、409、410、505 |
| 为移动端定义参数展示与表单折叠策略 | 部分已有 | 需要补充 | Frontend / Quality | 606、607、702、706 |

---

## 10. 结论

从产品与数据库的一致性角度看，VISNDT 文档库里最接近 v1.0 基线的部分，正是：

- `200_Product-第二版(RP-)`
- `400_Database-第二版`

它们已经足以支撑一个面向多 NDT 设备族的统一主数据与参数平台。

真正需要补的是：

1. 把这套模型向 API 正式映射
2. 把这套模型向 Frontend 元数据驱动展示正式映射
3. 把 Search / AI / Demand / RFQ 对参数的使用边界写清楚

因此本轮评估建议：

**动态参数元数据引擎可采用，且应成为 VISNDT Blueprint v1.0 的核心设计决策之一。**
