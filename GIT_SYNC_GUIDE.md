# Git 仓库同步指南

## 仓库配置

本项目已配置为使用 fork 仓库作为主要远程仓库：

- **origin**: `https://github.com/Royce17/LifeTrace.git` (你的 fork 仓库)
- **upstream**: `https://github.com/FreeU-group/LifeTrace` (原始仓库)

## 分支同步

### 自动同步所有分支

使用提供的脚本可以一键同步所有上游分支到你的 fork 仓库：

**Windows PowerShell:**
```powershell
.\sync-upstream.ps1
```

**Linux/Mac:**
```bash
chmod +x sync-upstream.sh
./sync-upstream.sh
```

### 手动同步单个分支

1. **获取最新更新:**
   ```bash
   git fetch upstream
   ```

2. **切换到要同步的分支（如果本地不存在则创建）:**
   ```bash
   git checkout -b <branch-name> upstream/<branch-name>
   # 或者如果本地已存在
   git checkout <branch-name>
   git merge upstream/<branch-name>
   ```

3. **推送到你的 fork 仓库:**
   ```bash
   git push origin <branch-name>
   ```

### 同步 main 分支

```bash
git checkout main
git pull upstream main
git push origin main
```

## 创建自己的分支

你可以在 fork 仓库中创建自己的分支，这些分支不会影响原始仓库：

```bash
# 从 main 分支创建新分支
git checkout main
git pull upstream main
git checkout -b feat/my-feature

# 或者从其他分支创建
git checkout -b feat/my-feature upstream/dev
```

## 日常开发流程

1. **创建功能分支:**
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feat/my-feature
   ```

2. **开发并提交:**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   ```

3. **推送到你的 fork 仓库:**
   ```bash
   git push origin feat/my-feature
   ```

4. **定期同步上游更新:**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## 注意事项

- 你的 fork 仓库中的所有分支都会自动跟踪对应的 upstream 分支
- 使用 `git fetch upstream` 可以获取原始仓库的最新更新，不会影响你的本地工作
- 使用 `git pull upstream <branch>` 可以合并上游分支的更新到当前分支
- 你的个人分支（如 `feat/my-feature`）只会存在于你的 fork 仓库中

## 查看分支状态

```bash
# 查看所有分支（包括远程）
git branch -a

# 查看分支跟踪关系
git branch -vv

# 查看远程仓库信息
git remote show origin
git remote show upstream
```

