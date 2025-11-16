"""
Forms Router
נתיבי API לטפסים
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from loguru import logger

from app.database import get_db
from app.models import Form, FormSubmission
from app.schemas import (
    FormCreate, FormResponse, 
    FormSubmissionCreate, FormSubmissionResponse
)
from app.services import PDFService, NotificationService
from app.config import settings

router = APIRouter(prefix="/api/forms", tags=["forms"])

pdf_service = PDFService()
notification_service = NotificationService()


@router.post("/", response_model=FormResponse, status_code=status.HTTP_201_CREATED)
async def create_form(form_data: FormCreate, db: Session = Depends(get_db)):
    """יצירת טופס חדש"""
    try:
        unique_id = str(uuid.uuid4())[:8]
        
        new_form = Form(
            unique_id=unique_id,
            job_title=form_data.job_title,
            job_description=form_data.job_description,
            job_location=form_data.job_location,
            salary_range=form_data.salary_range,
            company_name=form_data.company_name,
            company_address=form_data.company_address,
            company_lat=str(form_data.company_lat),
            company_lng=str(form_data.company_lng),
            company_logo_url=form_data.company_logo_url,
            screening_questions=[q.dict() for q in form_data.screening_questions],
            requirements=[r.dict() for r in form_data.requirements],
            terms_and_conditions=form_data.terms_and_conditions.dict()
        )
        
        db.add(new_form)
        db.commit()
        db.refresh(new_form)
        
        logger.info(f"טופס חדש נוצר: {unique_id}")
        return new_form
        
    except Exception as e:
        logger.error(f"שגיאה ביצירת טופס: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"שגיאה ביצירת טופס: {str(e)}"
        )


@router.get("/{unique_id}", response_model=FormResponse)
async def get_form(unique_id: str, db: Session = Depends(get_db)):
    """קבלת טופס לפי ID"""
    form = db.query(Form).filter(Form.unique_id == unique_id).first()
    
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="טופס לא נמצא"
        )
    
    if not form.is_active:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="טופס זה אינו פעיל יותר"
        )
    
    return form


@router.post("/submit", response_model=FormSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_form(submission: FormSubmissionCreate, db: Session = Depends(get_db)):
    """שליחת טופס ממולא"""
    try:
        form = db.query(Form).filter(Form.unique_id == submission.form_unique_id).first()
        
        if not form:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="טופס לא נמצא")
        
        passed_screening = check_screening_answers(submission.screening_answers, form.screening_questions)
        
        new_submission = FormSubmission(
            form_id=form.id,
            full_name=submission.candidate_details.full_name,
            phone_number=submission.candidate_details.phone_number,
            email=submission.candidate_details.email,
            city=submission.candidate_details.city,
            screening_answers=submission.screening_answers,
            passed_screening=passed_screening,
            accepted_terms=submission.accepted_terms,
            additional_data=submission.additional_data or {}
        )
        
        db.add(new_submission)
        db.commit()
        db.refresh(new_submission)
        
        # יצירת PDF
        try:
            pdf_path = pdf_service.create_submission_pdf(
                submission_data={
                    'full_name': new_submission.full_name,
                    'phone_number': new_submission.phone_number,
                    'email': new_submission.email,
                    'city': new_submission.city,
                    'screening_answers': new_submission.screening_answers,
                    'passed_screening': new_submission.passed_screening,
                    'accepted_terms': new_submission.accepted_terms
                },
                form_data={
                    'job_title': form.job_title,
                    'company_name': form.company_name,
                    'company_logo_url': form.company_logo_url,
                    'screening_questions': form.screening_questions
                }
            )
            new_submission.pdf_path = pdf_path
            db.commit()
        except Exception as e:
            logger.error(f"שגיאה ביצירת PDF: {str(e)}")
        
        # שליחת הודעה
        try:
            notification_service.send_submission_confirmation(
                phone_number=new_submission.phone_number,
                candidate_name=new_submission.full_name,
                passed_screening=new_submission.passed_screening
            )
            new_submission.whatsapp_message_sent = True
            db.commit()
        except Exception as e:
            logger.error(f"שגיאה בשליחת הודעה: {str(e)}")
        
        return new_submission
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"שגיאה בשליחת טופס: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


def check_screening_answers(answers: dict, questions: list) -> bool:
    """בדיקה אם עבר את הסינון"""
    for question in questions:
        q_id = question.get('id')
        correct_answer = question.get('correct_answer')
        
        if correct_answer is not None:
            user_answer = answers.get(q_id)
            if user_answer != correct_answer:
                return False
    
    return True
