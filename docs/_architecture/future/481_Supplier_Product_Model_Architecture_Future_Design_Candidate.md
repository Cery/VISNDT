# 481_Supplier_Product_Model_Architecture_Future_Design_Candidate

## Status

Future Architecture Candidate

Status:
**Frozen / Not For Development**

Related Stage:
M19.4+

---

# 1. Background

VISNDT 当前采用：

Product = Platform Global Catalog

Offer = Supplier Capability Provider

Organization = Supplier Identity


当前架构支持：

Product Discovery

↓

Supplier Capability Discovery

↓

Supplier Profile


但是工业检测行业存在进一步业务需求：

同一平台产品能力可能由多个供应商提供。

例如：

Platform Capability:

工业视频内窥镜
+
手持式
+
6mm


Supplier A:

深圳微视

提供型号：

WS-P60
K60
XT60
TJ60
SC60
LA60


Supplier B:

提供类似能力型号。


供应商型号体系属于供应商能力表达，不应污染 Platform Product Catalog。

---

# 2. Architecture Problem

未来需要解决：

1. 平台标准产品能力与供应商型号分离

2. 同一能力多个供应商提供

3. 同一供应商多个业务员共享型号数据

4. 供应商型号不可重复创建

5. 型号参数继承与覆盖机制

6. Admin审核治理

---

# 3. Current Architecture Constraint

必须保持：

## Product

Platform Global Catalog


禁止：

Product.organizationId

Product.supplierId


禁止：

Supplier Product Catalog


---

## Offer

Supplier Capability Mapping


当前关系：

Product

↓

Offer

↓

Organization


保持。


---

# 4. Future Candidate Architecture

未来候选：


Platform Product Capability

    |
    |
   Offer

    |
    |

Supplier Product Model


解释：

Product:

平台标准能力


Offer:

供应商可以提供该能力


Supplier Product Model:

供应商具体型号


---

# 5. Future Model Candidate

候选模型：

SupplierProductModel


可能字段：

- id
- organizationId
- offerId
- modelNumber
- manufacturer
- brand
- technicalParameters
- media
- certificate
- status


唯一约束候选：

organizationId + modelNumber


保证：

同一供应商型号唯一。


---

# 6. Organization Sharing Requirement

供应商内部：

Organization

↓

OrganizationMember


多个业务员共享：

SupplierProductModel


禁止：

User 独立拥有产品。


---

# 7. Parameter Architecture Consideration

未来需要设计：

平台标准参数：

ProductParameterDefinition


供应商型号参数：

SupplierModelParameterValue


支持：

- 继承
- 覆盖
- 扩展


例如：

平台：

管径

像素

视场角


供应商：

具体：

6mm

200万像素

90°


---

# 8. Forbidden Direction

禁止演变为：

- Supplier Store
- Marketplace
- Seller Backend
- Inventory System
- SKU System
- ERP


---

# 9. Trigger Condition

满足以下条件后重新启动设计：

- Supplier Capability 页面需求增强
- RFQ精准匹配需要型号级能力
- AI Matching需要型号参数
- SEO需要供应商型号页面
- 供应商数据规模增长

---

# 10. Current Decision

Current Stage:

M19.4

Decision:

**DO NOT DEVELOP**


Current Architecture:

Product Global Catalog

+

Offer Supplier Capability


is preserved.

Future Review:

M19.4.x / M20 Architecture Audit