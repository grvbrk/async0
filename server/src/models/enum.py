import enum


class UserRoles(enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class Difficulty(enum.Enum):
    Easy = "Easy"
    Medium = "Medium"
    Hard = "Hard"
    NA = "NA"


class Status(enum.Enum):
    Accepted = "Accepted"
    Rejected = "Rejected"
    Pending = "Pending"
    TimeLimit = "TimeLimit"
