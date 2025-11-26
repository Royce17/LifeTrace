# LifeTrace Desktop Pet - 日程管理桌宠

独立的桌面桌宠应用，用于日程管理。基于 Electron + Next.js + React + TypeScript 构建。

## 功能特性

- 📅 日程管理：创建、编辑、删除日程
- 📋 列表视图：清晰的日程列表展示
- 🎯 状态筛选：按状态（待办/进行中/已完成）筛选
- 🎨 现代化 UI：简洁美观的界面设计
- 🌓 暗色模式：支持暗色主题
- 🪟 窗口控制：最小化、关闭、置顶功能
- 🖱️ 可拖拽：无边框窗口，支持拖拽移动

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **桌面框架**: Electron
- **HTTP 客户端**: Axios
- **图标**: lucide-react

## 开发

### 环境要求

- **Node.js**: 20+ 
- **包管理器**: pnpm
- **后端服务**: LifeTrace 后端运行在 `http://localhost:8000`

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 方式 1: 分别启动 Next.js 和 Electron
pnpm dev          # 启动 Next.js (端口 3001)
pnpm electron     # 在另一个终端启动 Electron

# 方式 2: 使用 concurrently 同时启动（推荐）
pnpm electron:dev
```

应用将在 `http://localhost:3001` 启动，Electron 窗口会自动打开。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 项目结构

```
desktop-pet/
├── electron/              # Electron 主进程代码
│   ├── main.js           # 主进程入口
│   └── preload.js        # 预加载脚本
├── app/                  # Next.js App Router
│   ├── layout.tsx        # 根布局
│   ├── page.tsx         # 主页面
│   └── globals.css      # 全局样式
├── components/           # React 组件
│   ├── common/         # 通用组件
│   └── schedule/       # 日程相关组件
├── lib/                # 工具库
│   ├── api.ts         # API 客户端
│   ├── types.ts       # 类型定义
│   └── utils.ts       # 工具函数
└── package.json       # 项目配置
```

## 环境变量

创建 `.env.local` 文件（如果不存在）：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 窗口控制

- **拖拽**: 点击窗口顶部标题栏区域可以拖拽窗口
- **最小化**: 点击最小化按钮
- **关闭**: 点击关闭按钮
- **置顶**: 点击置顶按钮，窗口将始终显示在其他窗口之上

## 端口配置

- **前端开发服务器**: 3001（避免与主前端应用的 3000 端口冲突）
- **后端 API**: 8000（与主应用共享）

## 注意事项

1. 确保后端服务正在运行（`http://localhost:8000`）
2. 首次运行需要创建数据库表（后端会自动处理）
3. 开发模式下，Electron 会自动打开开发者工具

## 后续扩展

- 与截图数据库关联：显示日程相关的截图序列
- 提醒功能：日程开始前提醒
- 日历视图：切换日历视图显示
- 拖拽排序：支持日程项拖拽排序
- 标签分类：为日程添加标签

