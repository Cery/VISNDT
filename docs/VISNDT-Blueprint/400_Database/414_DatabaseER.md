# Database ER

Version

2.0

Status

Frozen

---

# Overall ER

Identity
│
├── User
├── Role
├── Permission
└── User Session
      │
      ▼
Organization
│
├── Organization
├── Organization Member
├── Organization Contact
├── Organization Address
├── Organization Certification
└── Organization Brand
      │
      ▼
Product
│
├── Category
├── Family
├── Series
├── Standard Product
├── Product Parameter Template
├── Product Capability
├── Product Image
├── Product Attachment
├── Product Industry
├── Product Material
├── Product Inspection Method
├── Product Defect
└── Product Standard
      │
      ├──────────────┐
      ▼              ▼
Offer           Knowledge
│               │
├── Offer       ├── Article
├── Image       ├── FAQ
├── Service     ├── Case
├── Attachment  ├── Solution
└── Audit       └── Attachment
      │              │
      └──────┬───────┘
             ▼
          Demand
             │
             ▼
            RFQ
             │
             ▼
         Workflow
             │
             ▼
      Statistics / Audit