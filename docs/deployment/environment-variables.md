# VISNDT Production Environment Configuration

> 生成时间: 2026-07-27
> 用途: 生产部署环境变量参考

---

## Backend Environment Variables (`apps/api/.env`)

### Required

| 变量 | 用途 | 示例 | 注意事项 |
|------|------|------|----------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | `postgresql://user:password@host:5432/visndt` | 生产环境必须使用强密码 |
| `JWT_SECRET` | JWT 签名密钥 | `openssl rand -base64 64` | 至少 64 字符随机字符串 |
| `JWT_EXPIRES_IN` | JWT 过期时间 (秒) | `86400` (24h) | 建议 3600-86400 |
| `NODE_ENV` | 运行环境 | `production` | 生产环境必须设为 `production` |
| `CORS_ORIGIN` | 允许的跨域来源 | `https://admin.yourdomain.com` | 逗号分隔多个域名 |
| `PORT` | 后端监听端口 | `4000` | 默认 4000 |

### Optional (S3 Storage)

| 变量 | 用途 | 示例 | 注意事项 |
|------|------|------|----------|
| `S3_ENDPOINT` | S3 兼容存储端点 | `https://s3.amazonaws.com` | 如不使用文件上传可忽略 |
| `S3_REGION` | S3 区域 | `us-east-1` | |
| `S3_BUCKET` | S3 Bucket 名称 | `visndt-prod` | |
| `S3_ACCESS_KEY` | S3 Access Key | — | 生产必须使用 IAM 凭证 |
| `S3_SECRET_KEY` | S3 Secret Key | — | 不要提交到代码仓库 |

---

## Frontend Configuration

### Vite Build

Vite 构建默认使用 `production` 模式，无需额外 `.env` 文件。

### API Base URL

`apps/admin/src/api/client.ts` 中 `baseURL` 为 `/api/v1`，通过反向代理转发。

生产环境建议使用 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    # Frontend SPA
    root /var/www/visndt/admin/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Security Checklist (Production)

### 密钥管理

- [ ] `JWT_SECRET` 使用 `openssl rand -base64 64` 生成
- [ ] `S3_ACCESS_KEY` / `S3_SECRET_KEY` 使用 IAM 凭证
- [ ] `DATABASE_URL` 使用强密码
- [ ] **绝不**将 `.env` 提交到 Git

### 环境变量注入

推荐方式：

1. **Systemd 服务**: `EnvironmentFile`
2. **Docker**: `--env-file` 或 `environment`
3. **Kubernetes**: Secrets
4. **CI/CD**: GitHub Secrets → 注入到 workflow

### 禁止事项

- ❌ 使用默认密码 (`CHANGE_ME`, `admin`, `password`)
- ❌ 将 `.env` 文件提交到代码仓库
- ❌ `NODE_ENV=development` 在生产环境
- ❌ `CORS_ORIGIN=*` 在生产环境

---

## Quick Start (Production)

```bash
# 1. 配置环境变量
cp apps/api/.env.example apps/api/.env
# 编辑 apps/api/.env，填入生产环境值

# 2. 安装依赖
pnpm install --frozen-lockfile

# 3. 生成 Prisma Client
pnpm db:generate

# 4. 执行数据库迁移
pnpm --filter @visndt/database exec prisma migrate deploy

# 5. 构建
pnpm --filter @visndt/api build
pnpm --filter @visndt/admin build

# 6. 启动 Backend
NODE_ENV=production node apps/api/dist/main

# 7. 部署 Frontend (Nginx)
# 将 apps/admin/dist/ 部署到 Nginx 静态目录
```

---

**Path: docs/deployment/environment-variables.md**