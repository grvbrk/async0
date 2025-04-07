from sqlalchemy import Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from src.models.enum import Status
from . import Base
import uuid


class Submission(Base):
    __tablename__ = "submission"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    status: Mapped[Status] = mapped_column(Enum(Status), default=Status.Pending)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    problem_id: Mapped[str] = mapped_column(ForeignKey("problem.id"))
    user_solution_id: Mapped[str] = mapped_column(ForeignKey("user_solution.id"))
    passed_testcases: Mapped[int] = mapped_column(Integer)
    total_testcases: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")
    user_solution = relationship("UserSolution", back_populates="submissions")
