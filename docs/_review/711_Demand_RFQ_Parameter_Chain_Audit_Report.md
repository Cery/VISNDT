# 711 Demand/RFQ Parameter Chain Audit Report

## 1. 任务概述

- **触发**：用户反馈 `http://localhost:3000/workspace/supplier/rfqs/{id}` 供应商 RFQ 详情页"Demand 参数"区为空（显示「当前详情接口未返回需求参数」），并指出"挺多页面的表单项都有类似问题"。
- **任务类型**：AUDIT ONLY（审查任务）。
- **范围**：Web / Admin 前端表单与详情页 + API 参数链路。**零代码变更**。
- **结论**：根因是「需求（Demand）技术参数」整条链路三处断裂（录入缺失 → 接口不含参数 → 展示缺失且结构不匹配）。产品（能力）侧参数能力完备，需求侧缺失。

## 2. 仓库与文件

- 仓库根：`F:\Desktop\VISNDT`（Git root）；代码根：`F:\Desktop\VISNDT\VISNDT`。
- 涉及文件：

| 层 | 文件 | 说明 |
|----|------|------|
| API | `apps/api/src/demands/demands.controller.ts` | 参数 CRUD 端点完备（POST/GET/PATCH/DELETE `/demands/:id/parameters`） |
| API | `apps/api/src/demands/dto/create-demand-parameter.dto.ts` | 支持 `parameterDefinitionId/value/valueMin/valueMax/required/priority` |
| API | `apps/api/src/demands/demands.service.ts` | 详情/列表 `parameters: { include: { parameterDefinition: true } }`（嵌套结构） |
| API | `apps/api/src/rfqs/rfqs.service.ts` | `findOne`/列表 `include: { demand: true }`，**不含 parameters** |
| Web | `apps/web/src/lib/api/demands.ts` | `CreateDemandParams` 无 `parameters`；`DemandParameter` 类型为扁平 `{id,name,value,unit}` |
| Web | `apps/web/src/lib/api/rfqs.ts` | `RfqDemandSummary` 无 `parameters` |
| Web | `apps/web/src/app/workspace/demands/create/page.tsx` | 需求创建表单：仅基础字段，无参数录入 |
| Web | `apps/web/src/app/workspace/demands/[id]/edit/page.tsx` | 需求编辑表单：仅基础字段+联系人，无参数录入 |
| Web | `apps/web/src/app/workspace/demands/[id]/page.tsx` | 需求详情页：无参数展示 |
| Web | `apps/web/src/app/workspace/rfqs/create/page.tsx` | RFQ 创建：仅选 Demand，无参数 |
| Web | `apps/web/src/app/workspace/rfqs/[id]/page.tsx` | 买方 RFQ 详情页：无参数展示 |
| Web | `apps/web/src/app/workspace/supplier/rfqs/[id]/page.tsx` | 供应商 RFQ 详情页：有参数区块但接口无数据 |
| Admin | `apps/admin/src/pages/DemandEdit.tsx` | 需求编辑表单：无参数录入 |
| Admin | `apps/admin/src/pages/RfqCreate.tsx` | RFQ 创建：仅选 Demand，无参数 |
| Admin | `apps/admin/src/components/product/ProductForm.tsx` | 能力表单：参数配置完备（对照组，正常） |
| Admin | `apps/admin/src/types/demand.types.ts` | `DemandParameter` 结构已定义（含 parameterDefinitionId/value/valueMin/valueMax/required/priority）但表单未用 |
| Admin | `apps/admin/src/api/demand.service.ts` | 无 parameters API 封装 |

## 3. 问题清单（按严重度）

### D-1 ｜P1 · Defect ｜需求参数录入能力前端完全缺失

- **后端 API 完备**：`POST/GET/PATCH/DELETE /demands/:id/parameters`（`demands.controller.ts` L167-L228），基于 ParameterDefinition 参数定义体系；`CreateDemandParameterDto` 支持 `parameterDefinitionId / value / valueMin / valueMax / required / priority`。
- **前端所有需求表单均无参数录入 UI**：
  - Web 创建：`demands/create/page.tsx`（仅 title/description/budgetRange/quantity/quantityUnit/expectedDeliveryDate）
  - Web 编辑：`demands/[id]/edit/page.tsx`（同上 + 联系人字段）
  - Admin 编辑：`DemandEdit.tsx`（同上 + 状态/可见性）
- **Admin 侧类型已具备但未接线**：`demand.types.ts` 定义了 `DemandParameter`（parameterDefinitionId/value/valueMin/valueMax/required/priority），但表单未使用；`demand.service.ts` 无 parameters API 封装。
- **影响**：买方无法为需求录入技术参数 → Demand 参数恒为空 → RFQ 参数恒为空 → Matching 缺参数依据，商业闭环受损。

### D-2 ｜P1 · Defect ｜RFQ 详情接口不返回需求参数

- `rfqs.service.ts` `findOne`（L265-L272）及所有列表查询均为 `include: { demand: true }`（仅 Demand 标量字段）或 `demand: { select: {...} }`（不含 `parameters`）。
- Web `RfqDemandSummary`（`lib/api/rfqs.ts` L4-L9）无 `parameters` 字段。
- **用户所报页面**（`supplier/rfqs/[id]/page.tsx` L52-L54）通过 `getDemandParameters` 读取 `rfq.demand.parameters / parameterValues`，因接口无数据**永远显示空**。
- 买方 RFQ 详情页（`workspace/rfqs/[id]/page.tsx`）完全不展示需求参数。

### D-3 ｜P2 · Defect ｜需求参数展示缺失

- Web 需求详情页 `demands/[id]/page.tsx` 无任何参数展示区块（grep 无 parameter/参数 相关渲染）。
- 即使 Demand 存在参数（列表/详情接口实际返回），用户在前端任何页面都看不到。

### D-4 ｜P2 · UX Issue ｜前后端 DemandParameter 结构不匹配

- 后端返回**嵌套**结构：`{ id, demandId, parameterDefinitionId, value, valueMin, valueMax, required, priority, parameterDefinition: { id, name, unit, ... } }`（`demands.service.ts` `include: { parameterDefinition: true }`）。
- Web 前端类型 `DemandParameter`（`lib/api/demands.ts` L29-L34）期望**扁平** `{ id, name, value, unit }`。
- **即便接口修复，前端映射也会失败**：`valueMin/valueMax` 数值区间无法表达为单个 `value`，`name/unit` 来自嵌套的 `parameterDefinition` 而非顶层字段。

## 4. 正常项（非问题）

| 项 | 结论 |
|----|------|
| Admin 能力表单 `ProductForm.tsx`（L258-L306） | 参数配置完备（BOOLEAN/ENUM/NUMBER/STRING，按参数组分组，编辑回显） |
| Admin 参数体系（ParameterGroup / ParameterDefinition CRUD） | 完备 |
| 能力型号（SupplierProduct）只读审核 | 冻结设计（供应商自助创建 = Future），非缺陷 |
| 询价表单 `InquiryForm.tsx` | 字段合理（姓名/邮箱/电话/留言，针对具体产品/型号） |
| Web/Admin RFQ 创建仅选 Demand | 继承设计合理，但受 D-1 影响（源头参数为空） |

## 5. 根因链

```
买方无法录入需求参数（D-1）
  → Demand.parameters 恒为空
    → RFQ 详情接口不含 demand.parameters（D-2）
      → 供应商 RFQ 详情页参数区恒空（用户所报）
      → 买方 RFQ / 需求详情页无参数展示（D-3）
        + 前后端结构不匹配，即便有数据也无法正确映射（D-4）
```

对照：能力侧链路完整（Admin 录入 → ProductParameter API → 前端展示），需求侧完全缺失。

## 6. 验证标准 / 证据

- **录入**：`POST /demands/:id/parameters` 等端点在后端已注册（控制器可见），前端无任何调用方。
- **接口**：`GET /rfqs/:id` 响应 `demand` 对象不含 `parameters`（Prisma `demand: true`）。
- **类型**：Web `CreateDemandParams` / `RfqDemandSummary` 无 parameters；Admin `demand.service.ts` 无 parameters 方法。
- **展示**：供应商 RFQ 详情页 `getDemandParameters` 恒返回空数组。

## 7. 结论

- **审查 = 通过（发现 4 项问题，未修复）**。按用户指示：**仅输出报告，不改代码**。
- 问题定级：P1 × 2（D-1 录入缺失、D-2 接口不含参数）、P2 × 2（D-3 展示缺失、D-4 结构不匹配）。
- 建议后续（待用户授权）：
  - **前端-only 方案（推荐，零后端变更）**：Web+Admin 需求创建/编辑表单增加参数录入（复用既有 `/demands/:id/parameters` API）；需求/RFQ 详情页补参数展示；前端类型对齐后端嵌套结构并正确映射 `valueMin/valueMax`。
  - **前后端方案**：额外修改 RFQ 详情 `include demand.parameters`（涉及 API 变更，需单独授权）。
