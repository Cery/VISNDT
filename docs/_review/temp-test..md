收到，临时回答此问题，后续继续按照 **M13.x 开发执行模式（Trae 指令 → 执行结果 → 审核 → 下一阶段规划）**，不影响当前流程。

针对 VISNDT 项目，你目前是 **Monorepo 架构**：

```
VISNDT/
├── apps/
│   ├── api/        # NestJS 后端
│   ├── admin/      # React + Vite 管理后台
│   └── web/        # 前台（如果当前版本存在）
├── database/
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

预览前台和管理员后台，需要分别启动对应服务。

---

# 一、首次准备环境

## 1. 确认 Node 环境

项目要求：

```bash
node -v
```

建议：

```
Node >= 20
```

查看：

```bash
pnpm -v
```

建议：

```
pnpm >= 9
```

如果没有：

```bash
npm install -g pnpm
```

---

# 二、启动数据库环境

VISNDT 后端依赖：

* PostgreSQL
* Redis（如果当前模块使用）
* MinIO（M13.2.4 后才会加入）

当前阶段至少需要 PostgreSQL。

---

## 方式1：Docker启动（推荐）

进入项目根目录：

```bash
cd F:\Desktop\VISNDT
```

启动：

```bash
docker compose up -d
```

检查：

```bash
docker ps
```

应该看到类似：

```
postgres
redis
```

---

## 数据库初始化（首次）

如果数据库为空：

```bash
pnpm prisma migrate deploy
```

或者开发环境：

```bash
pnpm prisma migrate dev
```

生成客户端：

```bash
pnpm prisma generate
```

---

# 三、启动后端 API 服务

目录：

```
apps/api
```

进入：

```bash
cd apps/api
```

启动开发模式：

```bash
pnpm dev
```

正常：

```
Nest application successfully started
```

默认：

```
http://localhost:3000
```

---

## 后端接口测试

浏览器：

```
http://localhost:3000/api
```

或者：

```
http://localhost:3000/api/v1
```

（具体看当前 Swagger 配置）

如果有 Swagger：

```
http://localhost:3000/api/docs
```

---

# 四、启动管理员后台

目录：

```
apps/admin
```

新窗口：

```bash
cd F:\Desktop\VISNDT\apps\admin
```

安装：

```bash
pnpm install
```

启动：

```bash
pnpm dev
```

Vite 默认：

```
http://localhost:5173
```

浏览器打开：

```
http://localhost:5173
```

---

## 管理员登录流程

当前架构：

```
Admin React
      |
      |
Axios
      |
      ↓
NestJS API
      |
      ↓
PostgreSQL
```

所以必须：

先启动：

```
API
```

再启动：

```
Admin
```

否则：

```
Network Error
401
CORS
```

---

# 五、启动前台网站

这里需要根据当前项目实际结构确认。

如果存在：

```
apps/web
```

进入：

```bash
cd F:\Desktop\VISNDT\apps\web
```

启动：

```bash
pnpm dev
```

通常：

```
http://localhost:5174
```

或者：

```
http://localhost:3000
```

取决于 Vite 配置。

---

# 六、完整启动顺序（推荐）

以后开发测试固定使用：

## Terminal 1：数据库

项目根目录：

```bash
docker compose up -d
```

保持运行。

---

## Terminal 2：API

```bash
cd F:\Desktop\VISNDT\apps\api

pnpm dev
```

保持运行。

---

## Terminal 3：admin

```bash
cd F:\Desktop\VISNDT\apps\admin

pnpm dev
```

浏览：

```
http://localhost:5173
```

---

## Terminal 4：前台

如果存在：

```bash
cd F:\Desktop\VISNDT\apps\web

pnpm dev
```

浏览：

```
http://localhost:5174
```

---

# 七、检查当前运行状态

## 查看端口

Windows：

```powershell
netstat -ano | findstr "3000"
```

应该：

```
3000 LISTENING
```

API

```powershell
netstat -ano | findstr "5173"
```

应该：

```
5173 LISTENING
```

Admin

---

# 八、推荐安装 VS Code / Trae 调试插件

建议：

## 前端

Chrome：

```
React Developer Tools
```

---

## API测试

推荐：

```
Apifox
```

或者：

```
Postman
```

测试：

```
GET /products
GET /products/:id
POST /products
```

---

# 九、生产预览方式（后期）

目前：

```
开发预览
localhost
```

后期：

```
Admin
    |
    Vercel

Frontend
    |
    Vercel

API
    |
    Docker VPS

Database
    |
    PostgreSQL
```

---

# 十、VISNDT 当前阶段建议测试重点

按照目前 M13.2.x：

## Admin测试

重点：

```
/products
/products/:id
/products/:id/edit
/products/:id/media
```

验证：

✅ ProductList View按钮
✅ ProductDetail按钮
✅ Media Card显示

---

## API测试

重点：

```
GET /products/:id
```

确认返回：

```json
{
  "media":[]
}
```

M13.2.2修复目标。

---

## 当前开发阶段暂不测试

因为尚未完成：

```
FileAsset Upload
MinIO
AuditLog
```

所以：

暂不用测试：

```
文件上传
图片上传
审计记录
```

---

# 最简启动口诀

以后本地预览：

```
1. docker compose up -d

2. cd apps/api
   pnpm dev

3. cd apps/admin
   pnpm dev

4. 浏览器:
   http://localhost:5173
```

如果看前台：

再开：

```
apps/web
pnpm dev
```

---

以上仅作为临时环境说明。后续继续回到 **M13.2.5 规划及 Trae 执行流程**。
