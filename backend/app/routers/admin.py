"""
Admin Router
נתיבי API לניהול המערכת
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from loguru import logger

from app.database import get_db
from app.models.form import Form, FormSubmission
from app import schemas

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/forms", response_model=List[schemas.FormResponse])
def get_all_forms(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    קבלת כל הטפסים
    """
    try:
        query = db.query(Form)
        
        if is_active is not None:
            query = query.filter(Form.is_active == is_active)
        
        forms = query.offset(skip).limit(limit).all()
        
        logger.info(f"📋 Retrieved {len(forms)} forms")
        return forms
        
    except Exception as e:
        logger.error(f"❌ Error getting forms: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/forms/{unique_id}", response_model=schemas.FormResponse)
def update_form(
    unique_id: str,
    form_update: schemas.FormCreate,
    db: Session = Depends(get_db)
):
    """
    עדכון טופס קיים
    """
    try:
        form = db.query(Form).filter(Form.unique_id == unique_id).first()
        
        if not form:
            raise HTTPException(status_code=404, detail="Form not found")
        
        # עדכון שדות
        update_data = form_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(form, field, value)
        
        db.commit()
        db.refresh(form)
        
        logger.info(f"✏️ Updated form: {unique_id}")
        return form
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating form: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/forms/{unique_id}")
def delete_form(
    unique_id: str,
    db: Session = Depends(get_db)
):
    """
    מחיקת טופס
    """
    try:
        form = db.query(Form).filter(Form.unique_id == unique_id).first()
        
        if not form:
            raise HTTPException(status_code=404, detail="Form not found")
        
        # מחיקה רכה - סימון כלא פעיל
        form.is_active = False
        db.commit()
        
        logger.info(f"🗑️ Deleted (soft) form: {unique_id}")
        return {"message": "Form deleted successfully", "unique_id": unique_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting form: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/forms/{unique_id}/submissions", response_model=List[schemas.FormSubmissionResponse])
def get_form_submissions(
    unique_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    passed_screening: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    קבלת כל השליחות של טופס מסוים
    """
    try:
        form = db.query(Form).filter(Form.unique_id == unique_id).first()
        
        if not form:
            raise HTTPException(status_code=404, detail="Form not found")
        
        query = db.query(FormSubmission).filter(FormSubmission.form_id == form.id)
        
        if passed_screening is not None:
            query = query.filter(FormSubmission.passed_screening == passed_screening)
        
        submissions = query.offset(skip).limit(limit).all()
        
        logger.info(f"📊 Retrieved {len(submissions)} submissions for form {unique_id}")
        return submissions
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting submissions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/submissions", response_model=List[schemas.FormSubmissionResponse])
def get_all_submissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    passed_screening: Optional[bool] = None,
    accepted_terms: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    קבלת כל השליחות במערכת
    """
    try:
        query = db.query(FormSubmission)
        
        if passed_screening is not None:
            query = query.filter(FormSubmission.passed_screening == passed_screening)
        
        if accepted_terms is not None:
            query = query.filter(FormSubmission.accepted_terms == accepted_terms)
        
        submissions = query.offset(skip).limit(limit).all()
        
        logger.info(f"📊 Retrieved {len(submissions)} total submissions")
        return submissions
        
    except Exception as e:
        logger.error(f"❌ Error getting submissions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/submissions/{submission_id}", response_model=schemas.FormSubmissionResponse)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db)
):
    """
    קבלת שליחה ספציפית
    """
    try:
        submission = db.query(FormSubmission).filter(FormSubmission.id == submission_id).first()
        
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        return submission
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting submission: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/overview")
def get_overview_stats(db: Session = Depends(get_db)):
    """
    סטטיסטיקות כלליות
    """
    try:
        # Count queries with error handling
        total_forms = db.query(Form).count() or 0
        active_forms = db.query(Form).filter(Form.is_active == True).count() or 0
        total_submissions = db.query(FormSubmission).count() or 0
        passed_submissions = db.query(FormSubmission).filter(
            FormSubmission.passed_screening == True
        ).count() or 0
        accepted_submissions = db.query(FormSubmission).filter(
            FormSubmission.accepted_terms == True
        ).count() or 0
        
        # סטטיסטיקות לפי תאריך (30 ימים אחרונים)
        try:
            thirty_days_ago = datetime.now() - timedelta(days=30)
            recent_submissions = db.query(FormSubmission).filter(
                FormSubmission.submitted_at >= thirty_days_ago
            ).count() or 0
        except:
            recent_submissions = 0
        
        # Calculate derived stats safely
        failed_screening = max(0, total_submissions - passed_submissions)
        rejected_terms = max(0, passed_submissions - accepted_submissions)
        
        # Calculate percentages safely
        pass_rate = round((passed_submissions / total_submissions * 100) if total_submissions > 0 else 0, 2)
        acceptance_rate = round((accepted_submissions / passed_submissions * 100) if passed_submissions > 0 else 0, 2)
        
        stats = {
            "total_forms": total_forms,
            "active_forms": active_forms,
            "inactive_forms": max(0, total_forms - active_forms),
            "total_submissions": total_submissions,
            "passed_screening": passed_submissions,
            "failed_screening": failed_screening,
            "accepted_terms": accepted_submissions,
            "rejected_terms": rejected_terms,
            "pass_rate": pass_rate,
            "acceptance_rate": acceptance_rate,
            "recent_submissions_30d": recent_submissions
        }
        
        logger.info(f"📈 Retrieved overview statistics: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"❌ Error getting stats: {str(e)}")
        logger.exception(e)  # Log full traceback
        # Return empty stats instead of error
        return {
            "total_forms": 0,
            "active_forms": 0,
            "inactive_forms": 0,
            "total_submissions": 0,
            "passed_screening": 0,
            "failed_screening": 0,
            "accepted_terms": 0,
            "rejected_terms": 0,
            "pass_rate": 0,
            "acceptance_rate": 0,
            "recent_submissions_30d": 0
        }


@router.get("/stats/forms/{unique_id}")
def get_form_stats(unique_id: str, db: Session = Depends(get_db)):
    """
    סטטיסטיקות לטופס ספציפי
    """
    try:
        form = db.query(Form).filter(Form.unique_id == unique_id).first()
        
        if not form:
            raise HTTPException(status_code=404, detail="Form not found")
        
        total = db.query(FormSubmission).filter(FormSubmission.form_id == form.id).count()
        passed = db.query(FormSubmission).filter(
            FormSubmission.form_id == form.id,
            FormSubmission.passed_screening == True
        ).count()
        accepted = db.query(FormSubmission).filter(
            FormSubmission.form_id == form.id,
            FormSubmission.accepted_terms == True
        ).count()
        
        stats = {
            "form_id": unique_id,
            "form_title": form.job_title,
            "total_submissions": total,
            "passed_screening": passed,
            "failed_screening": total - passed,
            "accepted_terms": accepted,
            "rejected_terms": passed - accepted,
            "pass_rate": round((passed / total * 100) if total > 0 else 0, 2),
            "acceptance_rate": round((accepted / passed * 100) if passed > 0 else 0, 2)
        }
        
        logger.info(f"📈 Retrieved stats for form {unique_id}")
        return stats
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting form stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
