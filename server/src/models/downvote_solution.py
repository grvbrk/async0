from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from . import Base
import uuid


class DownvoteSolution(Base):
    __tablename__ = "downvote_solution"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problem.id", ondelete="CASCADE")
    )
    solution_id: Mapped[str] = mapped_column(
        ForeignKey("solution.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    user = relationship("User", back_populates="downvote_solutions")
    problem = relationship("Problem")
    solution = relationship("Solution", back_populates="downvote_solutions")

    __table_args__ = (
        UniqueConstraint("user_id", "solution_id"),
        Index("ix_downvote_solution_user_id", "user_id"),
        Index("ix_downvote_solution_solution_id", "solution_id"),
    )
