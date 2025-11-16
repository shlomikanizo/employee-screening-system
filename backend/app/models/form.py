"""
Form Models
מודלים של טפסים
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Form(Base):
    """
    מודל טופס - מייצג טופס סינון עובדים
    """
    __tablename__ = "forms"
    
    id = Column(Integer, primary_key=True, index=True)
    unique_id = Column(String(50), unique=True, index=True, nullable=False)
    
    # פרטי משרה
    job_title = Column(String(200), nullable=False)
    job_description = Column(Text)
    job_location = Column(String(200))
    salary_range = Column(String(100))
    
    # חברה
    company_name = Column(String(200))
    company_address = Column(String(500))
    company_lat = Column(String(50))
    company_lng = Column(String(50))
    company_logo_url = Column(String(500))
    
    # שאלות סינון (JSON)
    screening_questions = Column(JSON)  # [{question: str, type: str, required: bool, options: []}]
    
    # דרישות מקדמיות (JSON)
    requirements = Column(JSON)  # [str]
    
    # תנאים ושכר (JSON)
    terms_and_conditions = Column(JSON)  # {salary: str, hours: str, benefits: [str]}
    
    # סטטוס
    is_active = Column(Boolean, default=True)
    
    # טיימסטמפים
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # יחסים
    submissions = relationship("FormSubmission", back_populates="form")
    
    def __repr__(self):
        return f"<Form {self.unique_id} - {self.job_title}>"


class FormSubmission(Base):
    """
    מודל שליחת טופס - מייצג טופס שמולא על ידי מועמד
    """
    __tablename__ = "form_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)
    
    # פרטי מועמד
    full_name = Column(String(200), nullable=False)
    phone_number = Column(String(20), nullable=False)
    email = Column(String(200))
    city = Column(String(100))
    
    # תשובות לשאלות סינון (JSON)
    screening_answers = Column(JSON)  # {question_id: answer}
    
    # האם עבר את הסינון
    passed_screening = Column(Boolean, default=False)
    
    # האם אישר תנאים
    accepted_terms = Column(Boolean, default=False)
    
    # נתונים נוספים (JSON)
    additional_data = Column(JSON)
    
    # PDF
    pdf_path = Column(String(500))
    pdf_sent = Column(Boolean, default=False)
    
    # WhatsApp
    whatsapp_message_sent = Column(Boolean, default=False)
    whatsapp_message_id = Column(String(200))
    
    # סטטוס
    status = Column(String(50), default="submitted")  # submitted, reviewed, approved, rejected
    
    # טיימסטמפים
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # יחסים
    form = relationship("Form", back_populates="submissions")
    
    def __repr__(self):
        return f"<FormSubmission {self.id} - {self.full_name}>"
