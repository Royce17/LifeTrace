"""日程管理路由"""

from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from lifetrace.schemas.schedule import ScheduleCreate, ScheduleListResponse, ScheduleResponse, ScheduleUpdate
from lifetrace.storage import schedule_mgr
from lifetrace.util.logging_config import get_logger

logger = get_logger()

router = APIRouter(prefix="/api/schedules", tags=["schedule"])


@router.get("", response_model=ScheduleListResponse)
async def list_schedules(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status: str | None = Query(None),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
):
    """获取日程列表"""
    try:
        start_dt = datetime.fromisoformat(start_date) if start_date else None
        end_dt = datetime.fromisoformat(end_date) if end_date else None

        schedules = schedule_mgr.list_schedules(
            limit=limit,
            offset=offset,
            status=status,
            start_date=start_dt,
            end_date=end_dt,
        )
        total_count = schedule_mgr.count_schedules(
            status=status,
            start_date=start_dt,
            end_date=end_dt,
        )

        return ScheduleListResponse(
            schedules=[ScheduleResponse(**s) for s in schedules],
            total_count=total_count,
        )
    except ValueError as e:
        logger.error(f"日期格式错误: {e}")
        raise HTTPException(status_code=400, detail=f"日期格式错误: {e}")
    except Exception as e:
        logger.error(f"获取日程列表失败: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/{schedule_id}", response_model=ScheduleResponse)
async def get_schedule(schedule_id: int):
    """获取单个日程"""
    try:
        schedule = schedule_mgr.get_schedule(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="日程不存在")
        return ScheduleResponse(**schedule)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取日程失败: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("", response_model=ScheduleResponse)
async def create_schedule(schedule_data: ScheduleCreate):
    """创建新日程"""
    try:
        schedule_id = schedule_mgr.create_schedule(
            title=schedule_data.title,
            description=schedule_data.description,
            start_time=schedule_data.start_time,
            end_time=schedule_data.end_time,
            status=schedule_data.status,
        )
        if not schedule_id:
            raise HTTPException(status_code=500, detail="创建日程失败")

        schedule = schedule_mgr.get_schedule(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="日程不存在")
        return ScheduleResponse(**schedule)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"创建日程失败: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.put("/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(schedule_id: int, schedule_data: ScheduleUpdate):
    """更新日程"""
    try:
        success = schedule_mgr.update_schedule(
            schedule_id=schedule_id,
            title=schedule_data.title,
            description=schedule_data.description,
            start_time=schedule_data.start_time,
            end_time=schedule_data.end_time,
            status=schedule_data.status,
        )
        if not success:
            raise HTTPException(status_code=404, detail="日程不存在")

        schedule = schedule_mgr.get_schedule(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="日程不存在")
        return ScheduleResponse(**schedule)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"更新日程失败: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.delete("/{schedule_id}")
async def delete_schedule(schedule_id: int):
    """删除日程"""
    try:
        success = schedule_mgr.delete_schedule(schedule_id)
        if not success:
            raise HTTPException(status_code=404, detail="日程不存在")
        return {"success": True, "message": "日程已删除"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除日程失败: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e

