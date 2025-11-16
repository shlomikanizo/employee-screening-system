"""
Pydantic Schemas
סכמות ולידציה
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class QuestionType(str, Enum):
    """סוגי שאלות"""
    TEXT = "text"
    NUMBER = "number"
    SELECT = "select"
    MULTI_SELECT = "multi_select"
    BOOLEAN = "boolean"


class ScreeningQuestion(BaseModel):
    """שאלת סינון"""
    id: str
    question: str
    type: QuestionType
    required: bool = True
    options: Optional[List[str]] = None
    correct_answer: Optional[Any] = None  # לשאלות עם תשובה נכונה


class Requirement(BaseModel):
    """דרישה מקדמית"""
    text: str
    is_mandatory: bool = True


class TermsAndConditions(BaseModel):
    """תנאים ושכר"""
    salary: str
    work_hours: str
    benefits: List[str]
    additional_info: Optional[str] = None


class FormCreate(BaseModel):
    """יצירת טופס חדש"""
    job_title: str = Field(..., min_length=1, max_length=200)
    job_description: str
    job_location: str
    salary_range: str
    
    company_name: str
    company_address: str
    company_lat: float
    company_lng: float
    company_logo_url: Optional[str] = None
    
    screening_questions: List[ScreeningQuestion]
    requirements: List[Requirement]
    terms_and_conditions: TermsAndConditions


class FormResponse(BaseModel):
    """תגובת טופס"""
    id: int
    unique_id: str
    job_title: str
    job_description: str
    job_location: str
    salary_range: str
    
    company_name: str
    company_address: str
    company_lat: float
    company_lng: float
    company_logo_url: Optional[str]
    
    screening_questions: List[Dict[str, Any]]
    requirements: List[Dict[str, Any]]
    terms_and_conditions: Dict[str, Any]
    
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class CandidateDetails(BaseModel):
    """פרטי מועמד"""
    full_name: str = Field(..., min_length=2, max_length=200)
    phone_number: str = Field(..., pattern=r"^(\+972|0)[0-9]{9}$")
    email: Optional[EmailStr] = None
    city: str
    
    @validator('phone_number')
    def validate_phone(cls, v):
        """וולידציה למספר טלפון"""
        # הסרת רווחים ומקפים
        cleaned = v.replace(" ", "").replace("-", "")
        if not cleaned.startswith(("+972", "0")):
            raise ValueError("מספר טלפון חייב להתחיל ב-0 או +972")
        return cleaned


class FormSubmissionCreate(BaseModel):
    """שליחת טופס"""
    form_unique_id: str
    
    # תשובות לשאלות סינון
    screening_answers: Dict[str, Any]
    
    # פרטי מועמד
    candidate_details: CandidateDetails
    
    # אישור תנאים
    accepted_terms: bool
    
    # נתונים נוספים
    additional_data: Optional[Dict[str, Any]] = None


class FormSubmissionResponse(BaseModel):
    """תגובת שליחת טופס"""
    id: int
    form_id: int
    full_name: str
    phone_number: str
    email: Optional[str]
    city: str
    
    screening_answers: Dict[str, Any]
    passed_screening: bool
    accepted_terms: bool
    
    pdf_path: Optional[str]
    pdf_sent: bool
    whatsapp_message_sent: bool
    
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class WhatsAppMessageRequest(BaseModel):
    """בקשת שליחת הודעת WhatsApp"""
    to: str  # מספר טלפון
    message: str
    form_url: Optional[str] = None


class WebhookMessage(BaseModel):
    """הודעה מ-Webhook של WhatsApp"""
    from_number: str
    message: str
    timestamp: datetime
