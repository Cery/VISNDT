# Module Dependency

Identity
│
├── Organization
│     │
│     ├── Product
│     │      │
│     │      ├── Offer
│     │      ├── Knowledge
│     │      ├── Demand
│     │      └── RFQ
│     │
│     └── Workflow
│
├── Search
├── AI
├── Statistics
├── Audit
└── Platform

依赖规则：

下层模块可以引用上层。

上层模块不得引用下层。

禁止循环依赖。