# 同步上游仓库的所有分支到 fork 仓库
# 使用方法: .\sync-upstream.ps1

Write-Host "正在从 upstream 获取所有分支..." -ForegroundColor Cyan
git fetch upstream

Write-Host "`n正在获取所有上游分支列表..." -ForegroundColor Cyan
$branches = git branch -r | Select-String "upstream/" | ForEach-Object { 
    $branch = $_.Line.Trim().Replace("upstream/", "")
    if ($branch -ne "HEAD -> main" -and $branch -ne "HEAD") {
        $branch
    }
}

Write-Host "`n找到 $($branches.Count) 个分支需要同步" -ForegroundColor Yellow

foreach ($branch in $branches) {
    Write-Host "`n正在同步分支: $branch" -ForegroundColor Green
    
    # 检查本地是否有该分支
    $localBranch = git branch --list $branch
    if ($localBranch) {
        Write-Host "  本地分支已存在，切换到并更新..." -ForegroundColor Gray
        git checkout $branch 2>&1 | Out-Null
        git merge "upstream/$branch" --no-edit 2>&1 | Out-Null
    } else {
        Write-Host "  创建本地跟踪分支..." -ForegroundColor Gray
        git checkout -b $branch "upstream/$branch" 2>&1 | Out-Null
    }
    
    # 推送到 fork 仓库
    Write-Host "  推送到 origin..." -ForegroundColor Gray
    git push origin $branch 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $branch 同步成功" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $branch 同步失败" -ForegroundColor Red
    }
}

Write-Host "`n所有分支同步完成！" -ForegroundColor Cyan
Write-Host "`n提示: 你现在可以在自己的仓库中创建新分支了" -ForegroundColor Yellow
Write-Host "例如: git checkout -b feat/my-feature" -ForegroundColor Gray

