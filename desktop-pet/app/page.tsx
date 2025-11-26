"use client";

import { ScheduleList } from "@/components/schedule/ScheduleList";
import { WindowControls } from "@/components/common/WindowControls";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 窗口控制栏 */}
      <div className="window-drag border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-sm font-semibold text-muted-foreground">LifeTrace 日程管理</h1>
          <div className="window-no-drag">
            <WindowControls />
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="p-4">
        <ScheduleList />
      </div>
    </div>
  );
}

