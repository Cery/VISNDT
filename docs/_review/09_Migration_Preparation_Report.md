# Document Identity

| Item          | Value                                          |
| ------------- | ---------------------------------------------- |
| Document ID   | 09                                             |
| Document Name | Migration Preparation Report                   |
| Version       | 1.0                                            |
| Status        | Final                                          |
| Purpose       | 对 Prisma Migration 执行前进行环境准备审查      |
| Dependency    | schema.prisma, docker-compose.yml, .env.example |
| Date          | 2026-07-16                                     |

---

# 1. Environment Validation

## 1.1 Required Files

| File | Path | Status |
|------|------|--------|
| Prisma Schema | database/prisma/schema.prisma | EXISTS |
| Docker Compose | docker/docker-compose.yml | EXISTS |
| Environment Template | .env.example | EXISTS |
| Environment File | .env | **MISSING** |
| Migration Directory | database/prisma/migrations/ | NOT YET CREATED |
| Database Package | database/package.json | **MISSING** |

## 1.2 Docker Compose Configuration

**File**: `docker/docker-compose.yml`

| Check Item | Value | Status |
|------------|-------|--------|
| PostgreSQL Image | postgres:16-alpine | PASS |
| Database Name | visndt | PASS |
| Database User | visndt | PASS |
| Database Password | visndt_dev | PASS |
| Port Mapping | 5432:5432 | PASS |
| Volume Persistence | postgres_data:/var/lib/postgresql/data | PASS |
| Healthcheck | pg_isready -U visndt (5s interval) | PASS |
| Container Name | visndt-postgres | PASS |

**Compatibility Note**: `version: "3.8"` is deprecated in Docker Compose v2.x but remains functional. No action required for MVP.

## 1.3 Environment Variable Consistency

| Variable | .env.example | docker-compose.yml | Match |
|----------|-------------|-------------------|-------|
| User | visndt | visndt | PASS |
| Password | visndt_dev | visndt_dev | PASS |
| Host | localhost | (container: visndt-postgres) | PASS |
| Port | 5432 | 5432 | PASS |
| Database | visndt | visndt | PASS |

**DATABASE_URL Format**:
```
postgresql://visndt:visndt_dev@localhost:5432/visndt
```
- Protocol: `postgresql://` — correct
- Credentials: `visndt:visndt_dev` — matches docker-compose
- Host: `localhost:5432` — matches port mapping
- Database: `visndt` — matches POSTGRES_DB

# 2. Prisma Configuration Validation

## 2.1 Generator Configuration

```prisma
generator client {
  provider = "prisma-client-js"
}
```

| Check Item | Status |
|------------|--------|
| Provider | prisma-client-js |
| Output | default (node_modules/.prisma/client) |

## 2.2 Datasource Configuration

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

| Check Item | Status |
|------------|--------|
| Provider | postgresql |
| URL Source | Environment Variable |
| Prisma Version | ^5.22.0 (devDependency) |

## 2.3 Prisma CLI Commands

**Root package.json**:

| Script | Command | Context |
|--------|---------|---------|
| `db:migrate` | `pnpm --filter @visndt/database exec prisma migrate dev` | Migration |
| `db:generate` | `pnpm --filter @visndt/database exec prisma generate` | Client Generation |
| `db:studio` | `pnpm --filter @visndt/database exec prisma studio` | GUI |

## 2.4 Workspace Configuration

**File**: `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**ISSUE**: `database/` is NOT listed in the workspace. The `db:migrate` script references `@visndt/database` but no such workspace package exists.

**Impact**: Running `pnpm db:migrate` will fail with "No projects matched the filters".

**Resolution Required**: Before migration, either:
- (Option A) Add `database/` to `pnpm-workspace.yaml` and create `database/package.json` with a `@visndt/database` name
- (Option B) Run Prisma CLI directly from the project root: `npx prisma migrate dev --schema=./database/prisma/schema.prisma`

# 3. Database Connection Requirement

## 3.1 Pre-Migration Checklist

| Step | Action | Required |
|------|--------|----------|
| 1 | Create `.env` from `.env.example` | YES |
| 2 | Start PostgreSQL container: `docker compose -f docker/docker-compose.yml up -d postgres` | YES |
| 3 | Wait for healthcheck: `docker ps` (status: healthy) | YES |
| 4 | Verify connection: `psql postgresql://visndt:visndt_dev@localhost:5432/visndt -c "SELECT 1"` | Recommended |
| 5 | Resolve workspace issue (see §2.4) | YES |

## 3.2 Docker Commands

```bash
# Start PostgreSQL only (not MinIO)
docker compose -f docker/docker-compose.yml up -d postgres

# Check status
docker ps --filter name=visndt-postgres

# View logs
docker compose -f docker/docker-compose.yml logs postgres

# Stop
docker compose -f docker/docker-compose.yml down
```

# 4. Migration Execution Command

## 4.1 Recommended Approach

Given the workspace configuration issue, use direct Prisma CLI invocation:

```bash
# From project root (VISNDT/)
npx prisma migrate dev --schema=./database/prisma/schema.prisma --name init
```

## 4.2 Recommended Migration Strategy

Per the Migration Plan documented in schema.prisma:

| Sequence | Migration Name | Models |
|----------|---------------|--------|
| 001 | `identity` | User, Organization, OrganizationMember |
| 002 | `product` | ProductCategory, Product, ParameterGroup, ParameterDefinition, ParameterOption, ProductParameterDefinition, ProductParameterValue |
| 003 | `offer_demand_rfq` | Offer, Demand, RFQ, RFQResponse |
| 004 | `workflow_audit` | WorkflowEvent, Notification, FileAsset, AuditLog |

**Option A — Single Migration (Recommended for MVP)**:
```bash
npx prisma migrate dev --schema=./database/prisma/schema.prisma --name init
```

**Option B — Sequential Migrations**:
Omit specific models via `--create-only` and manual edits, then apply in sequence.

## 4.3 Post-Migration Steps

```bash
# Generate Prisma Client
npx prisma generate --schema=./database/prisma/schema.prisma

# Verify migration
npx prisma migrate status --schema=./database/prisma/schema.prisma

# Launch Prisma Studio (optional)
npx prisma studio --schema=./database/prisma/schema.prisma
```

# 5. Rollback Strategy

## 5.1 Development Rollback

During development, use Prisma's built-in rollback:

```bash
# Roll back last migration (keeps schema changes)
npx prisma migrate reset --schema=./database/prisma/schema.prisma

# Or manually roll back one step
npx prisma migrate diff \
  --from-schema-datasource ./database/prisma/schema.prisma \
  --to-migrations ./database/prisma/migrations \
  --shadow-database-url $SHADOW_DATABASE_URL
```

## 5.2 Data Safety

| Scenario | Action |
|----------|--------|
| Migration fails before applying | No action needed; database unchanged |
| Migration fails mid-apply | `prisma migrate resolve` to mark as rolled-back |
| Migration succeeds but logic wrong | `prisma migrate reset` (development only, wipes data) |
| Production | Use `prisma migrate deploy` only; prepare rollback SQL manually |

## 5.3 Shadow Database

Prisma Migrate uses a shadow database automatically. Ensure the PostgreSQL user has `CREATE DATABASE` privilege:

```sql
-- If needed, grant privilege
ALTER USER visndt CREATEDB;
```

# 6. Backup Recommendation

## 6.1 Pre-Migration Backup

Before first migration, if the database already contains data:

```bash
# pg_dump backup
docker exec visndt-postgres pg_dump -U visndt visndt > backup_before_migration.sql

# Or use Docker volume backup
docker run --rm -v visndt_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_volume_backup.tar.gz -C /data .
```

## 6.2 Ongoing Backup

For MVP development, volume-based backup is sufficient:

```bash
# Backup PostgreSQL volume
docker run --rm \
  -v visndt_postgres_data:/data \
  -v ./backups:/backup \
  alpine tar czf /backup/postgres_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

## 6.3 Migration History

The `database/prisma/migrations/` directory is version-controlled. Each migration includes:
- `migration.sql` — the SQL that was executed
- `migration_lock.toml` — provider lock

**Recommendation**: Commit migrations to Git immediately after successful generation.

# 7. Final Recommendation

## 7.1 Status: READY (with pre-requisites)

| Check | Status | Action Required |
|-------|--------|-----------------|
| Prisma Schema | VALID | None |
| Docker Compose | VALID | None |
| .env.example | VALID | Copy to `.env` |
| PostgreSQL Container | NOT RUNNING | Start via docker compose |
| Workspace Config | BLOCKER | Add `database/` to workspace OR use direct CLI |
| Migration Directory | NOT CREATED | Will be created by `prisma migrate dev` |

## 7.2 Pre-Requisites (in order)

1. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

2. **Start PostgreSQL**:
   ```bash
   docker compose -f docker/docker-compose.yml up -d postgres
   ```

3. **Wait for healthy**:
   ```bash
   docker ps --filter name=visndt-postgres --format "{{.Status}}"
   # Expected: "Up X seconds (healthy)"
   ```

4. **Resolve workspace issue**: Either:
   - Add `"database/*"` to `pnpm-workspace.yaml` and create `database/package.json`
   - Or use direct command: `npx prisma migrate dev --schema=./database/prisma/schema.prisma --name init`

5. **Execute migration** (NOT included in this phase):
   ```bash
   npx prisma migrate dev --schema=./database/prisma/schema.prisma --name init
   ```

## 7.3 Decision

```
Migration Preparation Status: READY (3 pre-requisites pending)
```

- **Blockers**: 0 (structural)
- **Pre-requisites**: 3 (startup tasks)
- **Risk Level**: LOW

**RECOMMENDATION**: Proceed to execute pre-requisites and then run `prisma migrate dev`.

---

> **声明**: 本报告基于 2026-07-16 快照生成。未执行任何数据库迁移、写入或 schema 修改操作。