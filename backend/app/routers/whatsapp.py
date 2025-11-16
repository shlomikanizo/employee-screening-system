"""
WhatsApp Router
נתיבי API ל-WhatsApp Webhook
"""
from fastapi import APIRouter, Request, HTTPException, status, Query
from typing import Optional
from loguru import logger

from app.services import WhatsAppService, NotificationService
from app.config import settings

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

whatsapp_service = WhatsAppService()
notification_service = NotificationService()


@router.get("/webhook")
async def verify_webhook(
    mode: str = Query(None, alias="hub.mode"),
    token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge")
):
    """
    אימות Webhook של WhatsApp
    נקרא על ידי Meta כדי לאמת את ה-Webhook
    """
    logger.info(f"Webhook verification request: mode={mode}, token={token}")
    
    result = whatsapp_service.verify_webhook(mode, token, challenge)
    
    if result:
        return int(result)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Verification failed"
        )


@router.post("/webhook")
async def receive_webhook(request: Request):
    """
    קבלת הודעות מ-WhatsApp
    נקרא כאשר מתקבלת הודעה או אירוע מ-WhatsApp
    """
    try:
        body = await request.json()
        logger.info(f"Webhook received: {body}")
        
        # בדיקה אם יש הודעות
        if body.get("object"):
            if body.get("entry"):
                for entry in body["entry"]:
                    changes = entry.get("changes", [])
                    for change in changes:
                        value = change.get("value", {})
                        
                        # טיפול בהודעות
                        if "messages" in value:
                            messages = value["messages"]
                            for message in messages:
                                from_number = message.get("from")
                                message_type = message.get("type")
                                
                                logger.info(f"הודעה מ-{from_number}: {message_type}")
                                
                                # כאן אפשר להוסיף לוגיקה לטיפול בהודעות
                                # לדוגמה: עדכון סטטוס, שמירה בDB, וכו'
                        
                        # טיפול בסטטוסים
                        if "statuses" in value:
                            statuses = value["statuses"]
                            for status_obj in statuses:
                                message_id = status_obj.get("id")
                                status_val = status_obj.get("status")
                                
                                logger.info(f"סטטוס הודעה {message_id}: {status_val}")
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"שגיאה בטיפול ב-Webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing webhook: {str(e)}"
        )


@router.post("/send-invitation")
async def send_form_invitation(phone_number: str, form_url: str):
    """
    שליחת הזמנה למילוי טופס
    
    Args:
        phone_number: מספר טלפון
        form_url: קישור לטופס
    """
    try:
        result = notification_service.send_form_invitation(
            phone_number=phone_number,
            form_url=form_url
        )
        
        return {
            "status": "success",
            "message": "הזמנה נשלחה בהצלחה",
            "whatsapp_response": result
        }
        
    except Exception as e:
        logger.error(f"שגיאה בשליחת הזמנה: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"שגיאה בשליחת הזמנה: {str(e)}"
        )
