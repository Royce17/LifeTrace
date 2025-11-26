export interface Schedule {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface ScheduleCreate {
  title: string;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
  status?: "pending" | "in_progress" | "completed";
}

export interface ScheduleUpdate {
  title?: string;
  description?: string | null;
  start_time?: string;
  end_time?: string | null;
  status?: "pending" | "in_progress" | "completed";
}

export interface ScheduleListResponse {
  schedules: Schedule[];
  total_count: number;
}

