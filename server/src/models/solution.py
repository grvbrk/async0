from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship, WriteOnlyMapped
from datetime import datetime, timezone
from . import Base
from .problem import Problem
from .upvote_solution import UpvoteSolution
from .downvote_solution import DownvoteSolution
from uuid import UUID, uuid4


class Solution(Base):
    __tablename__ = "solution"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    code: Mapped[str] = mapped_column(String)
    rank: Mapped[int] = mapped_column(Integer, default=1)
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problem.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )

    problem: Mapped[Problem] = relationship(
        lazy="joined", innerjoin=True, back_populates="solutions"
    )
    upvote_solutions: WriteOnlyMapped[UpvoteSolution] = relationship(
        back_populates="solution"
    )
    downvote_solutions: WriteOnlyMapped[DownvoteSolution] = relationship(
        back_populates="solution"
    )

    def __repr__(self):
        return f"<Solution(id={self.id}, code={self.code}, rank={self.rank})>"
