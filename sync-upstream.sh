#!/bin/bash
# 同步上游仓库的所有分支到 fork 仓库
# 使用方法: ./sync-upstream.sh

echo "正在从 upstream 获取所有分支..."
git fetch upstream

echo ""
echo "正在获取所有上游分支列表..."
branches=$(git branch -r | grep "upstream/" | sed 's|upstream/||' | grep -v "HEAD")

echo ""
echo "找到 $(echo "$branches" | wc -l) 个分支需要同步"

for branch in $branches; do
    echo ""
    echo "正在同步分支: $branch"
    
    # 检查本地是否有该分支
    if git branch --list "$branch" | grep -q "$branch"; then
        echo "  本地分支已存在，切换到并更新..."
        git checkout "$branch" 2>/dev/null
        git merge "upstream/$branch" --no-edit 2>/dev/null
    else
        echo "  创建本地跟踪分支..."
        git checkout -b "$branch" "upstream/$branch" 2>/dev/null
    fi
    
    # 推送到 fork 仓库
    echo "  推送到 origin..."
    if git push origin "$branch" 2>/dev/null; then
        echo "  ✓ $branch 同步成功"
    else
        echo "  ✗ $branch 同步失败"
    fi
done

echo ""
echo "所有分支同步完成！"
echo ""
echo "提示: 你现在可以在自己的仓库中创建新分支了"
echo "例如: git checkout -b feat/my-feature"

