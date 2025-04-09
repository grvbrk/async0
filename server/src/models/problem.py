from sqlalchemy.orm import Mapped, mapped_column, relationship, WriteOnlyMapped
from sqlalchemy import String, Integer, Enum
from datetime import datetime, timezone
from .enum import Difficulty
from . import Base
from .testcase import TestCase
from .topic import Topic
from .list import List
from .bookmark import Bookmark
from .solution import Solution
from .user_solution import UserSolution
from .submission import Submission
from .upvote_solution import UpvoteSolution
from .downvote_solution import DownvoteSolution
from .association import TopicProblem, ListProblem
from uuid import uuid4, UUID


class Problem(Base):

    __tablename__ = "problem"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(
        String(64), index=True, unique=True, nullable=False
    )
    description: Mapped[str] = mapped_column(String)
    difficulty: Mapped[Difficulty] = mapped_column(
        Enum(Difficulty), default=Difficulty.NA
    )
    starter_code: Mapped[str] = mapped_column(String)
    link: Mapped[str | None] = mapped_column(String, nullable=True)
    time_limit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    memory_limit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )

    test_cases: WriteOnlyMapped[TestCase] = relationship(back_populates="problem")
    topics: Mapped[list[Topic]] = relationship(
        lazy="selectin", secondary=TopicProblem, back_populates="problem"
    )
    lists: Mapped[list[List]] = relationship(
        lazy="selectin", secondary=ListProblem, back_populates="problem"
    )
    bookmarks: WriteOnlyMapped[Bookmark] = relationship(back_populates="problem")
    solutions: WriteOnlyMapped[Solution] = relationship(back_populates="problem")
    user_solutions: WriteOnlyMapped[UserSolution] = relationship(
        back_populates="problem"
    )
    upvote_solutions: WriteOnlyMapped[UpvoteSolution] = relationship(
        back_populates="problem"
    )
    downvote_solutions: WriteOnlyMapped[DownvoteSolution] = relationship(
        back_populates="problem"
    )
    submissions: WriteOnlyMapped[Submission] = relationship(back_populates="problem")

    def __repr__(self):
        return f"<Problem(id={self.id}, name={self.name})>"
