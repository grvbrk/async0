from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from datetime import datetime, timezone
from . import Base
from .problem import Problem
from uuid import uuid4, UUID


class TestCase(Base):
    __tablename__ = "testcase"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problems.id", ondelete="CASCADE")
    )
    input: Mapped[str] = mapped_column(String)
    output: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )

    problem: Mapped[Problem] = relationship(
        lazy="joined", innerjoin=True, back_populates="testcase"
    )

    def __repr__(self):
        return f"<TestCase(id={self.id}, problem_id={self.problem_id})>"
