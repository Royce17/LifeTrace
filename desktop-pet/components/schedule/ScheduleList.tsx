"use client";

import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import type { Schedule } from "@/lib/types";
import { api } from "@/lib/api";
import { ScheduleItem } from "./ScheduleItem";
import { ScheduleForm } from "./ScheduleForm";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";

interface ScheduleListProps {
  onScheduleChange?: () => void;
}

export function ScheduleList({ onScheduleChange }: ScheduleListProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSchedules({
        limit: 100,
        status: statusFilter || undefined,
      });
      setSchedules(response.data.schedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载日程失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [statusFilter]);

  const handleCreate = async (data: any) => {
    try {
      await api.createSchedule(data);
      setShowForm(false);
      await loadSchedules();
      onScheduleChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建日程失败");
      throw err;
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingSchedule) return;
    try {
      await api.updateSchedule(editingSchedule.id, data);
      setEditingSchedule(null);
      await loadSchedules();
      onScheduleChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新日程失败");
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个日程吗？")) return;
    try {
      await api.deleteSchedule(id);
      await loadSchedules();
      onScheduleChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除日程失败");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">日程管理</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant={statusFilter === null ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(null)}
              className="h-7 px-2 text-xs"
            >
              全部
            </Button>
            <Button
              variant={statusFilter === "pending" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
              className="h-7 px-2 text-xs"
            >
              待办
            </Button>
            <Button
              variant={statusFilter === "in_progress" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("in_progress")}
              className="h-7 px-2 text-xs"
            >
              进行中
            </Button>
            <Button
              variant={statusFilter === "completed" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
              className="h-7 px-2 text-xs"
            >
              已完成
            </Button>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            新建
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ScheduleForm
            schedule={editingSchedule}
            onSave={editingSchedule ? handleUpdate : handleCreate}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      ) : schedules.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>暂无日程</p>
            <Button onClick={() => setShowForm(true)} variant="secondary" size="sm" className="mt-4">
              <Plus className="w-4 h-4 mr-1" />
              创建第一个日程
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
          {schedules.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

