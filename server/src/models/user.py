from sqlalchemy.orm import Mapped, mapped_column, relationship, WriteOnlyMapped
from sqlalchemy import String, Enum
from datetime import datetime, timezone
from .enum import UserRoles
from . import Base
from .bookmark import Bookmark
from .user_solution import UserSolution
from .upvote_solution import UpvoteSolution
from .downvote_solution import DownvoteSolution
from .submission import Submission
from uuid import uuid4, UUID


class User(Base):
    __tablename__ = "user"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    role: Mapped[UserRoles] = mapped_column(Enum(UserRoles), default=UserRoles.USER)
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )

    bookmarks: WriteOnlyMapped[Bookmark] = relationship(back_populates="user")
    user_solutions: WriteOnlyMapped[UserSolution] = relationship(back_populates="user")
    upvotes: WriteOnlyMapped[UpvoteSolution] = relationship(back_populates="user")
    downvotes: WriteOnlyMapped[DownvoteSolution] = relationship(back_populates="user")
    submissions: WriteOnlyMapped[Submission] = relationship(back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
