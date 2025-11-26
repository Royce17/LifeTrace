"use client";

import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import type { Schedule, ScheduleCreate, ScheduleUpdate } from "@/lib/types";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";

interface ScheduleFormProps {
  schedule?: Schedule | null;
  onSave: (data: ScheduleCreate | ScheduleUpdate) => Promise<void>;
  onCancel: () => void;
}

export function ScheduleForm({ schedule, onSave, onCancel }: ScheduleFormProps) {
  const [title, setTitle] = useState(schedule?.title || "");
  const [description, setDescription] = useState(schedule?.description || "");
  const [startTime, setStartTime] = useState(
    schedule?.start_time ? new Date(schedule.start_time).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    schedule?.end_time ? new Date(schedule.end_time).toISOString().slice(0, 16) : ""
  );
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(
    (schedule?.status as "pending" | "in_progress" | "completed") || "pending"
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime) return;

    setLoading(true);
    try {
      const data: ScheduleCreate | ScheduleUpdate = {
        title: title.trim(),
        description: description.trim() || null,
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
        status,
      };
      await onSave(data);
    } catch (error) {
      console.error("保存失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{schedule ? "编辑日程" : "新建日程"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">标题 *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入日程标题"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入日程描述（可选）"
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">开始时间 *</label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">结束时间</label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={startTime}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">状态</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "in_progress" | "completed")}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="pending">待办</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading || !title.trim() || !startTime} className="flex-1">
              {loading ? "保存中..." : "保存"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

