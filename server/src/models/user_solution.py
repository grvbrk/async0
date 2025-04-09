from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship, WriteOnlyMapped
from datetime import datetime, timezone
from . import Base
from .user import User
from .problem import Problem
from .submission import Submission
from uuid import UUID, uuid4


class UserSolution(Base):
    __tablename__ = "user_solution"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    code: Mapped[str] = mapped_column(String)
    has_solved: Mapped[bool] = mapped_column(Boolean, default=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problem.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )

    user: Mapped[User] = relationship(
        lazy="joined", innerjoin=True, back_populates="user_solutions"
    )
    problem: Mapped[Problem] = relationship(
        lazy="joined", innerjoin=True, back_populates="user_solutions"
    )
    submissions: WriteOnlyMapped[Submission] = relationship(
        back_populates="user_solution"
    )

    def __repr__(self):
        return f"<UserSolution(id={self.id}, code={self.code}, has_solved={self.has_solved})>"
