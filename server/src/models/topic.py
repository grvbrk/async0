from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from . import Base
from .problem import Problem
from .association import TopicProblem
from uuid import uuid4, UUID


class Topic(Base):
    __tablename__ = "topic"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now(timezone.utc), index=True
    )

    problems: Mapped[list[Problem]] = relationship(
        lazy="selectin", secondary=TopicProblem, back_populates="topic"
    )

    def __repr__(self):
        return f"<Topic(id={self.id}, name={self.name})>"
