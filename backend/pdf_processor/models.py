from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from enum import Enum

class DeadlineCategory(str, Enum):
    DISCOVERY = "DISCOVERY"
    MOTION = "MOTION"
    TRIAL = "TRIAL"
    PRETRIAL = "PRETRIAL"
    HEARING = "HEARING"
    CONFERENCE = "CONFERENCE"
    OTHER = "OTHER"

class DeadlineStatus(str, Enum):
    ACTIVE = "ACTIVE"
    SUPERSEDED = "SUPERSEDED"
    COMPLETED = "COMPLETED"

class Deadline(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    due_date: datetime
    description: Optional[str] = Field(None, max_length=2000)
    category: DeadlineCategory
    status: DeadlineStatus = DeadlineStatus.ACTIVE
    confidence_score: float = Field(..., ge=0.0, le=1.0)

    @validator('due_date')
    def validate_due_date(cls, v):
        if v < datetime.now():
            raise ValueError("Due date cannot be in the past")
        return v

class DocumentType(str, Enum):
    SCHEDULING_ORDER = "SCHEDULING_ORDER"
    AMENDED_SCHEDULING_ORDER = "AMENDED_SCHEDULING_ORDER"

class ExtractedDocument(BaseModel):
    case_number: str = Field(..., regex=r'^[\w\-\s:]+$')
    document_type: DocumentType
    filing_date: Optional[datetime]
    court_name: Optional[str] = Field(None, max_length=200)
    judge_name: Optional[str] = Field(None, max_length=200)
    deadlines: List[Deadline]
    original_filename: str
    file_hash: str = Field(..., min_length=32)  # SHA-256 hash
    extraction_timestamp: datetime = Field(default_factory=datetime.utcnow)

class ProcessingResult(BaseModel):
    success: bool
    data: Optional[ExtractedDocument]
    error: Optional[str]
    needs_review: bool = False 