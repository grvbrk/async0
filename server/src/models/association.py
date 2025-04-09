from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey, Table
from . import Base

TopicProblem = Table(
    "topic_problem",
    Base.metadata,
    Column(
        "topic_id",
        ForeignKey("topic.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    ),
    Column(
        "problem_id",
        ForeignKey("problem.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    ),
)

ListProblem = Table(
    "list_problem",
    Base.metadata,
    Column(
        "list_id",
        ForeignKey("list.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    ),
    Column(
        "problem_id",
        ForeignKey("problem.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    ),
)
