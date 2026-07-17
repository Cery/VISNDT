# VISNDT Engineering Repository

## About

VISNDT Engineering Repository — 基于 [VISNDT Blueprint v1.0](../docs/VISNDT-Blueprint/Readme.md) 的工程代码仓库。

## Technology

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + TypeScript |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma |
| State | Zustand + TanStack Query |
| Storage | S3 Compatible Object Storage |
| Deployment | Container Based |

## Repository Structure

```
VISNDT/
├── apps/
│   ├── web/          # Next.js Frontend Application
│   └── api/          # NestJS Backend Application
├── packages/
│   ├── shared-types/ # Shared TypeScript Types
│   └── config/       # Shared Configuration
├── database/
│   └── prisma/       # Prisma Schema & Migrations
├── docker/           # Docker Configuration
│   ├── docker-compose.yml
│   ├── postgres/
│   └── minio/
└── docs/             # Blueprint & Implementation Docs
```

## Current Status

```
Repository Skeleton Only
No Business Implementation
```

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Reference

- [VISNDT Blueprint v1.0](../docs/VISNDT-Blueprint/Readme.md)
- [MVP Engineering Implementation Plan](../docs/_implementation/MVP_Engineering_Implementation_Plan_v1.0.md)