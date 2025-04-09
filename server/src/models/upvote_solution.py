from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from . import Base
from .user import User
from .problem import Problem
from .solution import Solution
from uuid import UUID, uuid4


class UpvoteSolution(Base):
    __tablename__ = "upvote_solution"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problem.id", ondelete="CASCADE")
    )
    solution_id: Mapped[str] = mapped_column(
        ForeignKey("solution.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )

    user: Mapped[User] = relationship(
        lazy="joined", innerjoin=True, back_populates="upvote_solution"
    )
    problem: Mapped[Problem] = relationship(
        lazy="joined", innerjoin=True, back_populates="upvote_solution"
    )
    solution: Mapped[Solution] = relationship(
        lazy="joined", innerjoin=True, back_populates="upvote_solution"
    )

    __table_args__ = UniqueConstraint("user_id", "problem_id")

    def __repr__(self):
        return f"<UpvoteSolution(id={self.id}, user_id={self.user_id}, problem_id={self.problem_id}, solution_id={self.solution_id})>"
