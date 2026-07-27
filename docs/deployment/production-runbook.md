# VISNDT V1.0 Production Deployment Runbook

> 版本: 1.0
> 更新: 2026-07-27
> 适用: V1.0 Production Release

---

## 1. Environment Preparation

### 1.1 Prerequisites

| 组件 | 版本要求 | 状态 |
|------|---------|:---:|
| Docker | >= 24.x | ⬜ |
| Docker Compose | >= 2.x | ⬜ |
| Node.js | >= 20.0.0 | ⬜ |
| pnpm | >= 9.0.0 | ⬜ |
| Git | — | ⬜ |

### 1.2 Environment Variables

创建 `.env` 文件在项目根目录：

```bash
# Required
JWT_SECRET=<generate with: openssl rand -base64 64>
POSTGRES_PASSWORD=<strong-password>
CORS_ORIGIN=https://admin.yourdomain.com

# Optional (defaults provided)
NODE_ENV=production
API_PORT=4000
ADMIN_PORT=80
POSTGRES_PORT=5432
POSTGRES_USER=visndt
POSTGRES_DB=visndt
JWT_EXPIRES_IN=86400
```

### 1.3 Clone Repository

```bash
git clone <repo-url> /opt/visndt
cd /opt/visndt
```

---

## 2. Database Setup

### 2.1 Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2.2 Run Migrations

```bash
# Option A: Via docker compose
docker compose run --rm api sh -c "npx prisma migrate deploy"

# Option B: Via local pnpm
pnpm --filter @visndt/database exec prisma migrate deploy
```

### 2.3 Verify

```bash
docker compose exec postgres psql -U visndt -d visndt -c "\dt"
```

---

## 3. Docker Deployment

### 3.1 Build Images

```bash
docker compose build
```

### 3.2 Start All Services

```bash
docker compose up -d
```

### 3.3 Verify Status

```bash
docker compose ps
```

Expected output:

```
NAME              STATUS                   PORTS
visndt-postgres   Up (healthy)            0.0.0.0:5432->5432/tcp
visndt-api        Up (healthy)            0.0.0.0:4000->4000/tcp
visndt-admin      Up (healthy)            0.0.0.0:80->80/tcp
```

---

## 4. Service Startup

### 4.1 Startup Order

```
1. postgres → healthy
2. api → healthy
3. admin → healthy
```

### 4.2 Ports

| Service | Port | URL |
|---------|------|-----|
| API | 4000 | `http://localhost:4000/api/v1/health` |
| Admin | 80 | `http://localhost` |
| PostgreSQL | 5432 | (internal) |

---

## 5. Health Check

### 5.1 API Health

```bash
curl http://localhost:4000/api/v1/health
```

Expected: `{"success": true, "data": {"status": "ok"}, ...}`

### 5.2 Admin Frontend

```bash
curl http://localhost
```

Expected: Returns HTML (index.html)

### 5.3 Database

```bash
docker compose exec postgres pg_isready -U visndt
```

Expected: `/var/run/postgresql:5432 - accepting connections`

---

## 6. Admin Verification

### 6.1 Login

1. Navigate to `http://localhost`
2. Login with admin credentials
3. Verify redirect to Dashboard

### 6.2 Page Verification

| 页面 | 验证项 |
|------|--------|
| Dashboard | Stats display correctly |
| Products | List, Create, Edit, Detail |
| Demands | List, Detail, Match |
| RFQs | List, Create, Detail |
| Offers | List, Detail |
| Matching | Monitor stats |
| Users | List, Create, Edit, Detail |
| Organizations | List, Create, Edit, Detail |
| Suppliers | List, Detail |
| Notifications | List, Detail |

---

## 7. Rollback Procedure

### 7.1 Stop Services

```bash
docker compose down
```

### 7.2 Restore Database (if needed)

```bash
# Restore from backup
docker compose exec -T postgres psql -U visndt -d visndt < backup.sql
```

### 7.3 Rollback to Previous Version

```bash
git checkout <previous-tag>
docker compose build
docker compose up -d
```

### 7.4 Data Safety

- `postgres_data` volume is NOT deleted by `docker compose down`
- To delete: `docker compose down -v` (⚠️ DESTRUCTIVE)

---

## 8. Monitoring

### 8.1 Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
```

### 8.2 Resource Check

```bash
docker stats
```

---

## 9. Backup

### 9.1 Database Backup

```bash
docker compose exec -T postgres pg_dump -U visndt visndt > backup_$(date +%Y%m%d).sql
```

### 9.2 Volume Backup

```bash
docker run --rm -v visndt_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

---

**Path: docs/deployment/production-runbook.md**