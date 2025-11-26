# 快速开始指南

## 前置要求

1. 确保 LifeTrace 后端服务正在运行（`http://localhost:8000`）
2. 安装 Node.js 20+ 和 pnpm

## 安装和启动

### 1. 安装依赖

```bash
cd desktop-pet
pnpm install
```

### 2. 启动应用

```bash
# 方式 1: 使用 concurrently 同时启动 Next.js 和 Electron（推荐）
pnpm electron:dev

# 方式 2: 分别启动
# 终端 1: 启动 Next.js
pnpm dev

# 终端 2: 启动 Electron
pnpm electron
```

### 3. 使用应用

- 点击"新建"按钮创建日程
- 点击日程项右侧的编辑/删除按钮进行管理
- 使用顶部筛选按钮按状态筛选日程
- 拖拽窗口顶部标题栏移动窗口
- 点击置顶按钮让窗口始终显示在最前

## 数据库

数据库表会在后端首次启动时自动创建，无需手动迁移。

## 故障排查

1. **无法连接到后端**: 确保后端服务运行在 `http://localhost:8000`
2. **窗口无法打开**: 检查端口 3001 是否被占用
3. **API 请求失败**: 检查 `.env.local` 中的 `NEXT_PUBLIC_API_URL` 配置

