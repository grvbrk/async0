from sqlalchemy import String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from . import Base
import uuid


class Solution(Base):
    __tablename__ = "solution"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String)
    rank: Mapped[int] = mapped_column(Integer, default=1)
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problem.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    problem = relationship("Problem", back_populates="solutions")
    upvote_solutions = relationship("UpvoteSolution", back_populates="solution")
    downvote_solutions = relationship("DownvoteSolution", back_populates="solution")
