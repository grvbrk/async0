from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, DateTime, Enum
from datetime import datetime
from .enum import UserRoles
from . import Base
import uuid


class User(Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    role: Mapped[UserRoles] = mapped_column(Enum(UserRoles), default=UserRoles.USER)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )
    bookmarks = relationship("Bookmark", back_populates="user")
    user_solutions = relationship("UserSolution", back_populates="user")
    upvotes = relationship("UpvoteSolution", back_populates="user")
    downvotes = relationship("DownvoteSolution", back_populates="user")
    submissions = relationship("Submission", back_populates="user")
