"""日程相关的 Pydantic 模型"""

from datetime import datetime

from pydantic import BaseModel


class ScheduleCreate(BaseModel):
    """创建日程请求模型"""

    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime | None = None
    status: str = "pending"  # pending, in_progress, completed


class ScheduleUpdate(BaseModel):
    """更新日程请求模型"""

    title: str | None = None
    description: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    status: str | None = None


class ScheduleResponse(BaseModel):
    """日程响应模型"""

    id: int
    title: str
    description: str | None
    start_time: datetime
    end_time: datetime | None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ScheduleListResponse(BaseModel):
    """日程列表响应"""

    schedules: list[ScheduleResponse]
    total_count: int

