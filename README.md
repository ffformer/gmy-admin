# GymPro 健身房管理系统

基于 Vue 3 构建的健身房运营管理中台，覆盖会员管理、课程排期、教练绩效与经营数据分析。项目采用前端 Mock 数据模拟后端接口，适合作为前端简历项目和后台管理系统学习案例。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 语言 | TypeScript |
| 构建 | Vite |
| 路由 | Vue Router 5 |
| 状态管理 | Pinia |
| 测试 | Vitest 单元测试，预留 Cypress E2E 配置 |
| 代码规范 | ESLint + Oxlint + Prettier |

## 功能模块

- **登录认证** — 账号密码登录，支持记录上次登录账号、可选记住密码
- **经营总览** — 仪表盘数据概览，包含到店人次、有效会员、月度营收、课程履约率及营收结构
- **会员管理** — 会员信息维护、6 位会员卡号、头像上传、有效期跟踪及私教会员分配
- **课程排期** — 课程列表展示，支持按课程类型、预约状态和关键词筛选
- **教练绩效** — 教练评分、课时统计、转化率分析

### 角色权限

| 角色 | 权限范围 |
|------|----------|
| 店长 (admin) | 全部模块 |
| 教练主管 (coach) | 经营总览、会员管理、课程排期 |
| 前台运营 (frontdesk) | 经营总览、会员管理 |

## 快速开始

### 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- 包管理器推荐使用 npm

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 测试

```bash
# 运行单元测试
npm run test:unit

# 运行 E2E 测试（需要本机已安装 Cypress）
npm run test:e2e

# 开发模式下运行 E2E 测试
npm run test:e2e:dev
```

### 代码检查

```bash
# 运行 Lint
npm run lint

# 格式化代码
npm run format
```

## 项目结构

```
gmy-admin/
├── src/
│   ├── api/            # API 接口与模拟数据
│   │   ├── http.ts     # HTTP 请求封装
│   │   ├── mock.ts     # 模拟数据
│   │   └── types.ts    # 类型定义
│   ├── assets/         # 全局样式
│   ├── components/     # 通用组件
│   │   ├── AppIcon.vue
│   │   ├── MetricCard.vue
│   │   ├── PaginationBar.vue
│   │   └── SimpleBarChart.vue
│   ├── layouts/        # 布局组件
│   │   └── AdminLayout.vue
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── views/          # 页面视图
│   │   ├── DashboardView.vue
│   │   ├── MembersView.vue
│   │   ├── CoursesView.vue
│   │   ├── CoachesView.vue
│   │   └── LoginView.vue
│   ├── App.vue         # 根组件
│   └── main.ts         # 应用入口
├── cypress/            # E2E 测试
├── public/             # 静态资源
├── index.html          # HTML 入口
└── vite.config.ts      # Vite 配置
```

## 演示账号

| 账号 | 密码 | 角色 |
|------|------|------|
| 13096752125 | abc147258369 | 店长 |
| 18587895134 | abc147258369 | 教练主管 |
| 748686818 | abc147258369 | 前台运营 |

## 项目亮点

- 使用 Vue Router 路由守卫实现登录拦截和页面权限控制
- 使用 Pinia 管理登录用户、Token 和权限信息
- 使用 TypeScript 定义会员、课程、教练和看板数据结构
- 通过 `src/api/http.ts` 封装接口方法，模拟真实前后端交互流程
- 会员管理模块包含搜索、筛选、分页、表单编辑、卡号唯一校验和头像上传预览

## 学习建议

建议按下面顺序阅读源码：

1. `src/main.ts`：项目入口
2. `src/router/index.ts`：路由配置和权限守卫
3. `src/stores/auth.ts`：登录状态管理
4. `src/api/mock.ts`：模拟数据
5. `src/api/http.ts`：接口封装
6. `src/layouts/AdminLayout.vue`：后台整体布局
7. `src/views/MembersView.vue`：会员管理核心页面
