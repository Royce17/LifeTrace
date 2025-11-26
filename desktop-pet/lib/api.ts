import axios from "axios";
import type { Schedule, ScheduleCreate, ScheduleListResponse, ScheduleUpdate } from "./types";

// API 基础地址
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };

// API 接口函数
export const api = {
  // 日程相关
  getSchedules: (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) => apiClient.get<ScheduleListResponse>("/api/schedules", { params }),

  getSchedule: (id: number) => apiClient.get<Schedule>(`/api/schedules/${id}`),

  createSchedule: (data: ScheduleCreate) => apiClient.post<Schedule>("/api/schedules", data),

  updateSchedule: (id: number, data: ScheduleUpdate) =>
    apiClient.put<Schedule>(`/api/schedules/${id}`, data),

  deleteSchedule: (id: number) => apiClient.delete(`/api/schedules/${id}`),
};

