from sqlalchemy import String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from . import Base
import uuid


class UserSolution(Base):
    __tablename__ = "user_solution"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String)
    has_solved: Mapped[bool] = mapped_column(Boolean, default=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    problem_id: Mapped[str] = mapped_column(
        ForeignKey("problem.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    user = relationship("User", back_populates="user_solutions")
    problem = relationship("Problem", back_populates="user_solutions")
    submissions = relationship("Submission", back_populates="user_solution")
