from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Integer, DateTime, Enum
from datetime import datetime
from .enum import Difficulty
from . import Base
import uuid


class Problem(Base):
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, primary_key=True)
    description: Mapped[str] = mapped_column(String)
    difficulty: Mapped[Difficulty] = mapped_column(
        Enum(Difficulty), default=Difficulty.NA
    )
    starter_code: Mapped[str] = mapped_column(String)
    link: Mapped[str | None] = mapped_column(String, nullable=True)
    time_limit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    memory_limit: Mapped[int | None] = mapped_column(Integer, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    test_cases = relationship("TestCase", back_populates="problem")
    topics = relationship(
        "Topic", secondary="topic_problems", back_populates="problems"
    )
    lists = relationship("List", secondary="list_problems", back_populates="problems")
    bookmarks = relationship("Bookmark", back_populates="problem")
    solutions = relationship("Solution", back_populates="problem")
    user_solutions = relationship("UserSolution", back_populates="problem")
    submissions = relationship("Submission", back_populates="problem")
