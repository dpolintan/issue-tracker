from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy.sql.expression import null
from database import Base
from sqlalchemy import String, Integer, Column, Text, DateTime, text, Enum as SQLEnum


class IssueStatus(str, PyEnum):
    OPEN = "open"
    CLOSED = "closed"


class Issue(Base):
    __tablename__ = 'issues'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(SQLEnum(IssueStatus, name="issue_status", native_enum=False), nullable=False, server_default=IssueStatus.OPEN.value)
    created_on = Column(DateTime, nullable=False, default=datetime.utcnow, server_default=text('now()'), index=True)