from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from . import Base
from .user import User
from .problem import Problem
from uuid import uuid4, UUID


class Bookmark(Base):
    __tablename__ = "bookmark"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
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
        lazy="joined", innerjoin=True, back_populates="bookmark"
    )
    problem: Mapped[Problem] = relationship(
        lazy="joined", innerjoin=True, back_populates="bookmark"
    )

    __table_args__ = (UniqueConstraint("user_id", "problem_id"),)

    def __repr__(self):
        return f"<Bookmark(id={self.id}, user_id={self.user_id}, problem_id={self.problem_id})>"
