Repository Documentation Edition 2.0



Bridge Document



Document ID：399



Document：Canonical Naming Specification（统一命名规范）



Version：2.0 Final



Status：Frozen



Repository：VISNDT Documentation Edition 2.0





增加的一个很小但价值很高的文档：



docs/300\_Architecture/



399\_ProductDatabaseMapping.md



它只有一卷，作用是把 RP-001 的产品模型逐项映射到数据库实体，例如：



Standard Product → standard\_product

Parameter Template → parameter\_template

Capability → capability\_definition + product\_capability

Feature → feature\_definition + product\_feature



这样后续进入 PostgreSQL DDL 和 Prisma 时，就不会出现“业务名”和“数据库表名”混用的问题，也能作为开发人员和 AI 编码工具（如 Cursor、Codex）的统一映射参考。



我建议将其作为 300\_Architecture 的最终补充文档，然后正式进入 400\_Database。这不会改变任何已冻结的业务设计，只是增加一层工程映射。



升级为整个 Repository 最重要的桥接文档之一。



因为真正开始开发以后，会同时存在四种"语言"：



业务人员使用业务名词

产品文档使用领域模型

数据库使用表名

后端代码使用类名



如果没有统一映射，项目后期一定会出现大量命名混乱。



因此，我建议这份文档不仅做 Product → Database 映射，而是做成整个 Repository 的统一命名规范（Canonical Naming Specification）。



正式命名（冻结）



建议放在：



docs/

300\_Architecture/



399\_CanonicalNamingSpecification.md



Document ID：



399



Version：



2.0 Final



Status：



Frozen



Repository：



VISNDT Documentation Edition 2.0

为什么使用 Canonical（规范名称）



而不是：



Product Mapping



因为以后它不仅包含 Product。



还会包含：



Organization



Supplier



Offer



Knowledge



Demand



RFQ



Workflow



Dictionary



Attachment



User



Role



Permission



AI



Search



Statistics



Notification



以后整个 Repository 都引用它。



它成为：



唯一命名标准（Single Naming Source）。



文档定位（冻结）



建议第一页写清楚：



本规范不是数据库设计。



本规范不是API设计。



本规范不是代码规范。



本规范用于统一：



业务名称



↓



数据库表



↓



Prisma Model



↓



NestJS Module



↓



API



↓



TypeScript Interface



↓



前端命名



↓



AI知识图谱节点



确保整个 Repository 使用统一语言。

建议目录

第一章



Repository Naming Principles



例如：



一个业务对象



只能有一个正式名称。



不得出现：



Product



Products



Goods



Item



Equipment



混用。



统一：



Standard Product。

第二章



Business → Database



例如：



Business	PostgreSQL

Standard Product	standard\_product

Product Series	product\_series

Product Family	product\_family

Capability	capability\_definition

Feature	feature\_definition

第三章



Database → Prisma



例如：



PostgreSQL	Prisma

standard\_product	StandardProduct

product\_series	ProductSeries

parameter\_definition	ParameterDefinition

第四章



Prisma → NestJS



例如：



Prisma	NestJS Module

StandardProduct	ProductModule

ProductSeries	ProductModule

ParameterDefinition	ParameterModule

第五章



NestJS → REST API



例如：



Module	Endpoint

ProductModule	/products

OfferModule	/offers

RFQModule	/rfqs



统一采用：



复数 RESTful 风格。



第六章



REST → Frontend



例如：



/products



↓



ProductListPage



↓



ProductDetailPage



命名保持一致。



第七章



AI Mapping



例如：



StandardProduct



↓



Knowledge Graph Node



↓



Embedding



↓



Vector Index



以后 AI 直接引用。



新增一项我建议冻结的开发纪律（★★★★★）



建议增加：



Canonical Naming Rule



全文：



整个 Repository：



任何对象：



只有一个正式名称。



允许存在：



显示名称。



国际化名称。



数据库名称。



代码名称。



API名称。



但：



均来源于同一个 Canonical Name。



禁止：



多个业务名称指向同一对象。



禁止：



同一对象出现多个数据库表名。



禁止：



Prisma 与数据库命名不一致。



禁止：



API 与业务名称不一致。



Canonical Naming Specification



为整个项目唯一命名标准。

**我建议对 Repository 目录进行一次最终完善**

**300\_Architecture/**



**300\_SystemArchitecture.md**



**310\_DomainDrivenDesign.md**



**320\_BoundedContext.md**



**330\_RepositoryConvention.md**



**340\_CodingConvention.md**



**350\_ModuleConvention.md**



**360\_APIConvention.md**



**370\_EventConvention.md**



**380\_DeploymentConvention.md**



**390\_EngineeringRules.md**



**399\_CanonicalNamingSpecification.md   ⭐⭐⭐⭐⭐**



其中：



399\_CanonicalNamingSpecification.md 将作为进入 400\_Database 前的最后一份架构文档。



我还建议补充一个工程约定（最终冻结）



在 399\_CanonicalNamingSpecification.md 中，每一个核心实体都采用统一的映射模板，例如：



层级	示例（Standard Product）

Canonical Name	Standard Product

中文名称	标准产品

数据库表	standard\_product

Prisma Model	StandardProduct

NestJS Module	ProductModule

Service	ProductService

Controller	ProductController

REST Endpoint	/products

DTO 前缀	Product

前端类型	Product

AI 节点	StandardProduct



以后每个核心实体（Organization、Offer、Knowledge、RFQ、Demand、Dictionary 等）都按照这一模板建立映射。



这样从产品设计到数据库、代码、API、前端、AI，全项目都使用一套统一命名体系，后续开发和维护成本会显著降低。

