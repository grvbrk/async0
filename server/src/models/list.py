from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import Base
from .problem import Problem
from uuid import uuid4, UUID


class List(Base):
    __tablename__ = "list"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(16))

    problems: Mapped[list[Problem]] = relationship(
        lazy="selectin", back_populates="list"
    )

    def __repr__(self):
        return f"<List(id={self.id}, name={self.name})>"
