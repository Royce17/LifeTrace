"""日程管理器 - 负责日程相关的数据库操作"""

from datetime import datetime
from typing import Any

from sqlalchemy.exc import SQLAlchemyError

from lifetrace.storage.database_base import DatabaseBase
from lifetrace.storage.models import Schedule
from lifetrace.util.logging_config import get_logger

logger = get_logger()


class ScheduleManager:
    """日程管理类"""

    def __init__(self, db_base: DatabaseBase):
        self.db_base = db_base

    def create_schedule(
        self,
        title: str,
        start_time: datetime,
        description: str | None = None,
        end_time: datetime | None = None,
        status: str = "pending",
    ) -> int | None:
        """创建新日程"""
        try:
            with self.db_base.get_session() as session:
                schedule = Schedule(
                    title=title,
                    description=description,
                    start_time=start_time,
                    end_time=end_time,
                    status=status,
                )
                session.add(schedule)
                session.flush()
                logger.info(f"创建日程: {schedule.id} - {title}")
                return schedule.id
        except SQLAlchemyError as e:
            logger.error(f"创建日程失败: {e}")
            return None

    def get_schedule(self, schedule_id: int) -> dict[str, Any] | None:
        """获取单个日程"""
        try:
            with self.db_base.get_session() as session:
                schedule = session.query(Schedule).filter_by(id=schedule_id, deleted_at=None).first()
                if schedule:
                    return {
                        "id": schedule.id,
                        "title": schedule.title,
                        "description": schedule.description,
                        "start_time": schedule.start_time,
                        "end_time": schedule.end_time,
                        "status": schedule.status,
                        "created_at": schedule.created_at,
                        "updated_at": schedule.updated_at,
                    }
                return None
        except SQLAlchemyError as e:
            logger.error(f"获取日程失败: {e}")
            return None

    def list_schedules(
        self,
        limit: int = 100,
        offset: int = 0,
        status: str | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> list[dict[str, Any]]:
        """列出所有日程"""
        try:
            with self.db_base.get_session() as session:
                query = session.query(Schedule).filter_by(deleted_at=None)

                if status:
                    query = query.filter_by(status=status)

                if start_date:
                    query = query.filter(Schedule.start_time >= start_date)

                if end_date:
                    query = query.filter(Schedule.start_time <= end_date)

                schedules = query.order_by(Schedule.start_time.asc()).offset(offset).limit(limit).all()

                return [
                    {
                        "id": s.id,
                        "title": s.title,
                        "description": s.description,
                        "start_time": s.start_time,
                        "end_time": s.end_time,
                        "status": s.status,
                        "created_at": s.created_at,
                        "updated_at": s.updated_at,
                    }
                    for s in schedules
                ]
        except SQLAlchemyError as e:
            logger.error(f"列出日程失败: {e}")
            return []

    def count_schedules(
        self,
        status: str | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:
        """统计日程数量"""
        try:
            with self.db_base.get_session() as session:
                query = session.query(Schedule).filter_by(deleted_at=None)

                if status:
                    query = query.filter_by(status=status)

                if start_date:
                    query = query.filter(Schedule.start_time >= start_date)

                if end_date:
                    query = query.filter(Schedule.start_time <= end_date)

                return query.count()
        except SQLAlchemyError as e:
            logger.error(f"统计日程失败: {e}")
            return 0

    def update_schedule(
        self,
        schedule_id: int,
        title: str | None = None,
        description: str | None = None,
        start_time: datetime | None = None,
        end_time: datetime | None = None,
        status: str | None = None,
    ) -> bool:
        """更新日程"""
        try:
            with self.db_base.get_session() as session:
                schedule = session.query(Schedule).filter_by(id=schedule_id, deleted_at=None).first()
                if not schedule:
                    logger.warning(f"日程不存在: {schedule_id}")
                    return False

                if title is not None:
                    schedule.title = title
                if description is not None:
                    schedule.description = description
                if start_time is not None:
                    schedule.start_time = start_time
                if end_time is not None:
                    schedule.end_time = end_time
                if status is not None:
                    schedule.status = status

                schedule.updated_at = datetime.now()
                session.flush()
                logger.info(f"更新日程: {schedule_id}")
                return True
        except SQLAlchemyError as e:
            logger.error(f"更新日程失败: {e}")
            return False

    def delete_schedule(self, schedule_id: int) -> bool:
        """删除日程（软删除）"""
        try:
            with self.db_base.get_session() as session:
                schedule = session.query(Schedule).filter_by(id=schedule_id, deleted_at=None).first()
                if not schedule:
                    logger.warning(f"日程不存在: {schedule_id}")
                    return False

                schedule.deleted_at = datetime.now()
                schedule.updated_at = datetime.now()
                session.flush()
                logger.info(f"删除日程: {schedule_id}")
                return True
        except SQLAlchemyError as e:
            logger.error(f"删除日程失败: {e}")
            return False

