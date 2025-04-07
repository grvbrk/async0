from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from . import Base
import uuid


class TestCase(Base):
    __tablename__ = "testcase"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problems.id", ondelete="CASCADE")
    )
    input: Mapped[str] = mapped_column(String)
    output: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    problem = relationship("Problem", back_populates="test_cases")
