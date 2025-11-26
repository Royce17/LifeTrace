"use client";

import { Edit2, Trash2, Clock, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { Schedule } from "@/lib/types";
import { formatDateTime, formatTime } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { cn } from "@/lib/utils";

interface ScheduleItemProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: number) => void;
}

export function ScheduleItem({ schedule, onEdit, onDelete }: ScheduleItemProps) {
  const statusConfig = {
    pending: { icon: Circle, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", label: "待办" },
    in_progress: {
      icon: PlayCircle,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      label: "进行中",
    },
    completed: {
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      label: "已完成",
    },
  };

  const config = statusConfig[schedule.status];
  const StatusIcon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon className={cn("w-4 h-4", config.color)} />
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg, config.color)}>
                {config.label}
              </span>
            </div>
            <h3 className="font-semibold text-base mb-1 truncate">{schedule.title}</h3>
            {schedule.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{schedule.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(schedule.start_time)}</span>
              </div>
              {schedule.end_time && (
                <div className="flex items-center gap-1">
                  <span>至</span>
                  <span>{formatTime(schedule.end_time)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(schedule)}
              className="h-8 w-8 p-0"
              title="编辑"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(schedule.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

