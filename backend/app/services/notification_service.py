"""
Notification Service
שירות שליחת התראות והודעות אוטומטיות
תומך בשלוש אופציות:
1. WhatsApp Business API (רשמי, עם API Key)
2. WhatsApp Web (חינם, עם whatsapp-web.js)
3. Email (חינם, כחלופה מלאה)
"""
from typing import Dict, Any, Optional
import os
from loguru import logger
from app.services.whatsapp_service import WhatsAppService
from app.services.whatsapp_web_service import whatsapp_web_service
from app.services.email_service import email_service
from app.config import settings


class NotificationService:
    """שירות התראות"""
    
    def __init__(self):
        # בחירת שירות לפי הגדרות (דרך settings שקורא את .env)
        self.use_email = bool(settings.USE_EMAIL)
        self.use_whatsapp_web = bool(settings.USE_WHATSAPP_WEB)
        # WhatsApp Business API פעיל רק אם יש טוקן אמיתי שמתחיל ב-EAA
        self.use_whatsapp_api = bool(settings.WHATSAPP_ACCESS_TOKEN and settings.WHATSAPP_ACCESS_TOKEN.startswith("EAA"))
        
        # DEBUG: הדפסת ערכי משתני סביבה
        logger.info(f"🔍 DEBUG - USE_EMAIL: {settings.USE_EMAIL} (type: {type(settings.USE_EMAIL)})")
        logger.info(f"🔍 DEBUG - USE_WHATSAPP_WEB: {settings.USE_WHATSAPP_WEB} (type: {type(settings.USE_WHATSAPP_WEB)})")
        logger.info(f"🔍 DEBUG - WHATSAPP_WEB_SERVER_URL: {settings.WHATSAPP_WEB_SERVER_URL}")
        logger.info(f"🔍 DEBUG - WHATSAPP_ACCESS_TOKEN: {'***' if settings.WHATSAPP_ACCESS_TOKEN else 'None'}")
        
        # קביעת השירות העיקרי
        if self.use_email:
            logger.info("📧 משתמש באימייל")
            self.email_service = email_service
            self.whatsapp_service = None
            self.whatsapp_web = None
        elif self.use_whatsapp_web:
            logger.info("🌐 משתמש ב-WhatsApp Web")
            self.whatsapp_service = None
            self.whatsapp_web = whatsapp_web_service
            self.email_service = None
        elif self.use_whatsapp_api:
            logger.info("📱 משתמש ב-WhatsApp Business API")
            self.whatsapp_service = WhatsAppService()
            self.whatsapp_web = None
            self.email_service = None
        else:
            logger.info("🚫 מצב פיתוח: לא שולח הודעות (זה בסדר!)")
            self.whatsapp_service = None
            self.whatsapp_web = None
            self.email_service = None
    
    def send_form_invitation(self, phone_number: str, form_url: str, email: Optional[str] = None, candidate_name: str = "מועמד") -> Dict[str, Any]:
        """
        שליחת הזמנה למילוי טופס
        
        Args:
            phone_number: מספר טלפון של המועמד (או אימייל אם USE_EMAIL=true)
            form_url: קישור לטופס
            email: כתובת אימייל (אופציונלי, רלוונטי רק אם USE_EMAIL=true)
            candidate_name: שם המועמד
            
        Returns:
            תגובה מה-API
        """
        message = (
            f"שלום! 👋\n\n"
            f"תודה שהגשת קורות חיים למשרת {settings.JOB_TITLE} ב{settings.COMPANY_NAME}.\n\n"
            f"כדי להמשיך בתהליך, אנא מלא את טופס הסינון:\n"
            f"{form_url}\n\n"
            f"בהצלחה! 🎯"
        )
        
        try:
            if self.use_email:
                # שימוש באימייל
                contact_email = email or phone_number
                result = self.email_service.send_form_invitation(
                    email=contact_email,
                    candidate_name=candidate_name,
                    form_url=form_url,
                    job_title=settings.JOB_TITLE
                )
                logger.info(f"הזמנה נשלחה באימייל ל-{contact_email}")
                return result
            elif self.use_whatsapp_web:
                # שימוש ב-WhatsApp Web
                import asyncio
                result = asyncio.run(self.whatsapp_web.send_message(phone_number, message))
                logger.info(f"הזמנה נשלחה ב-WhatsApp Web ל-{phone_number}")
                return result
            elif self.use_whatsapp_api and self.whatsapp_service:
                # שימוש ב-WhatsApp Business API
                result = self.whatsapp_service.send_interactive_button(
                    to=phone_number,
                    body_text=message,
                    button_text="למילוי הטופס 📝",
                    button_url=form_url
                )
                logger.info(f"הזמנה נשלחה ב-WhatsApp API ל-{phone_number}")
                return result
            else:
                # אין שירות הודעות מוגדר - זה OK!
                logger.info(f"📝 טופס נוצר (אין שירות הודעות מוגדר): {form_url}")
                return {
                    "success": True,
                    "message": "Form created successfully (no notifications configured)",
                    "form_url": form_url
                }
        except Exception as e:
            logger.error(f"שגיאה בשליחת הזמנה לטופס: {str(e)}")
            # Don't raise - just log and return failure
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_submission_confirmation(
        self, 
        phone_number: str, 
        candidate_name: str,
        passed_screening: bool,
        email: Optional[str] = None,
        pdf_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        שליחת אישור קבלת טופס
        
        Args:
            phone_number: מספר טלפון (או אימייל אם USE_EMAIL=true)
            candidate_name: שם המועמד
            passed_screening: האם עבר את הסינון
            email: כתובת אימייל (אופציונלי)
            pdf_path: נתיב לקובץ PDF (אופציונלי)
            
        Returns:
            תגובה מה-API
        """
        if passed_screening:
            message = (
                f"שלום {candidate_name}! 🎉\n\n"
                f"תודה שמילאת את הטופס.\n"
                f"עברת בהצלחה את שלב הסינון הראשוני!\n\n"
                f"נציג מטעמנו יצור איתך קשר בקרוב לתיאום ריאיון.\n\n"
                f"בהצלחה! 💼\n"
                f"{settings.COMPANY_NAME}"
            )
        else:
            message = (
                f"שלום {candidate_name},\n\n"
                f"תודה שמילאת את הטופס.\n"
                f"לצערנו, במקרה זה לא נוכל להמשיך בתהליך.\n\n"
                f"נשמח לראות אותך שוב במשרות עתידיות!\n\n"
                f"בהצלחה,\n"
                f"{settings.COMPANY_NAME}"
            )
        
        try:
            if self.use_email:
                # שימוש באימייל
                contact_email = email or phone_number
                result = self.email_service.send_submission_confirmation(
                    email=contact_email,
                    candidate_name=candidate_name,
                    passed_screening=passed_screening,
                    pdf_path=pdf_path
                )
                logger.info(f"אישור נשלח באימייל ל-{contact_email}")
                return result
            elif self.use_whatsapp_web:
                # שימוש ב-WhatsApp Web
                import asyncio
                result = asyncio.run(self.whatsapp_web.send_message(phone_number, message))
                logger.info(f"אישור נשלח ב-WhatsApp Web ל-{phone_number}")
                return result
            elif self.use_whatsapp_api and self.whatsapp_service:
                # שימוש ב-WhatsApp Business API
                result = self.whatsapp_service.send_text_message(
                    to=phone_number,
                    message=message
                )
                logger.info(f"אישור נשלח ב-WhatsApp API ל-{phone_number}")
                return result
            else:
                # אין שירות הודעות - זה OK!
                logger.info(f"✅ טופס נשמר בהצלחה (אין שירות הודעות מוגדר)")
                return {
                    "success": True,
                    "message": "Submission saved successfully (no notifications configured)"
                }
        except Exception as e:
            logger.error(f"שגיאה בשליחת אישור: {str(e)}")
            # Don't raise - just log and return failure
            return {
                "success": False,
                "error": str(e)
            }

    def send_submission_summary_to_company(
        self,
        company_phone: str,
        candidate_name: str,
        candidate_phone: str,
        candidate_email: Optional[str],
        city: Optional[str],
        passed_screening: bool,
    ) -> Dict[str, Any]:
        """שליחת סיכום מלא של הטופס לחברה (למספר וואטסאפ של המגייס).

        עובד עם אותו שירות נבחר (WhatsApp Web / API / Email), אבל מתמקד בהודעת ניהול.
        """

        status_text = "עבר את הסינון הראשוני ✅" if passed_screening else "לא עבר את הסינון הראשוני ❌"

        message = (
            f"טופס סינון חדש התקבל במערכת {settings.COMPANY_NAME}\n\n"
            f"שם מועמד: {candidate_name}\n"
            f"טלפון מועמד: {candidate_phone}\n"
            f"אימייל: {candidate_email or 'לא צוין'}\n"
            f"עיר: {city or 'לא צוין'}\n"
            f"סטטוס ראשוני: {status_text}\n"
            f"משרה: {settings.JOB_TITLE}\n"
        )

        try:
            if self.use_whatsapp_web:
                import asyncio
                result = asyncio.run(self.whatsapp_web.send_message(company_phone, message))
                logger.info(f"סיכום טופס נשלח ב-WhatsApp Web לחברה ({company_phone})")
                return result
            elif self.use_whatsapp_api and self.whatsapp_service:
                result = self.whatsapp_service.send_text_message(
                    to=company_phone,
                    message=message
                )
                logger.info("סיכום טופס נשלח ב-WhatsApp API לחברה")
                return result
            elif self.use_email and email_service:
                # fallback לאימייל אם מוגדר
                result = self.email_service.send_plain_text_to_company(
                    subject=f"טופס סינון חדש - {settings.JOB_TITLE}",
                    body=message,
                )
                logger.info("סיכום טופס נשלח באימייל לחברה")
                return result
            else:
                logger.info("אין שירות הודעות מוגדר עבור שליחת סיכום לחברה")
                return {"success": True, "message": "No notification service configured for company summary"}
        except Exception as e:
            logger.error(f"שגיאה בשליחת סיכום לחברה: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def send_pdf_to_candidate(
        self, 
        phone_number: str, 
        pdf_url: str,
        candidate_name: str
    ) -> Dict[str, Any]:
        """
        שליחת PDF למועמד
        
        Args:
            phone_number: מספר טלפון
            pdf_url: URL של הPDF
            candidate_name: שם המועמד
            
        Returns:
            תגובה מה-API
        """
        try:
            if self.use_email:
                # אימייל כבר מצרף PDF באופן אוטומטי
                logger.info(f"PDF כבר נשלח באימייל")
                return {"success": True, "message": "PDF already sent with email"}
            elif self.use_whatsapp_web:
                # שימוש ב-WhatsApp Web
                import asyncio
                result = asyncio.run(self.whatsapp_web.send_pdf(
                    phone_number=phone_number,
                    pdf_path=pdf_url,
                    caption="עותק הטופס שמילאת"
                ))
                logger.info(f"PDF נשלח ב-WhatsApp Web ל-{phone_number}")
                return result
            elif self.use_whatsapp_api and self.whatsapp_service:
                # שימוש ב-WhatsApp Business API
                result = self.whatsapp_service.send_document(
                    to=phone_number,
                    document_url=pdf_url,
                    filename=f"{candidate_name}_form.pdf",
                    caption="עותק הטופס שמילאת"
                )
                logger.info(f"PDF נשלח ב-WhatsApp API ל-{phone_number}")
                return result
            else:
                logger.info(f"PDF נוצר (אין שירות הודעות): {pdf_url}")
                return {"success": True, "message": "PDF created (no notifications)"}
        except Exception as e:
            logger.error(f"שגיאה בשליחת PDF: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def send_pdf_to_company(
        self, 
        pdf_url: str,
        candidate_name: str
    ) -> Dict[str, Any]:
        """
        שליחת PDF לחברה (למנהל גיוס)
        
        Args:
            pdf_url: URL של הPDF
            candidate_name: שם המועמד
            
        Returns:
            תגובה מה-API
        """
        # מספר הטלפון של החברה צריך להיות ב-settings
        # כרגע נשלח למספר שמוגדר ב-WHATSAPP_PHONE_NUMBER_ID
        try:
            company_phone = settings.WHATSAPP_PHONE_NUMBER_ID  # או מספר אחר
            result = self.whatsapp_service.send_document(
                to=company_phone,
                document_url=pdf_url,
                filename=f"screening_{candidate_name}.pdf",
                caption=f"טופס סינון חדש מ-{candidate_name}"
            )
            logger.info(f"PDF נשלח לחברה")
            return result
        except Exception as e:
            logger.error(f"שגיאה בשליחת PDF לחברה: {str(e)}")
            raise
    
    def send_reminder(
        self, 
        phone_number: str, 
        form_url: str,
        candidate_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        שליחת תזכורת למילוי טופס
        
        Args:
            phone_number: מספר טלפון
            form_url: קישור לטופס
            candidate_name: שם המועמד (אופציונלי)
            
        Returns:
            תגובה מה-API
        """
        greeting = f"שלום {candidate_name}" if candidate_name else "שלום"
        message = (
            f"{greeting}! 👋\n\n"
            f"זוהי תזכורת למילוי טופס הסינון למשרת {settings.JOB_TITLE}.\n\n"
            f"נשמח אם תוכל להשלים את המילוי בהקדם:\n"
        )
        
        try:
            result = self.whatsapp_service.send_interactive_button(
                to=phone_number,
                body_text=message,
                button_text="למילוי הטופס 📝",
                button_url=form_url
            )
            logger.info(f"תזכורת נשלחה ל-{phone_number}")
            return result
        except Exception as e:
            logger.error(f"שגיאה בשליחת תזכורת: {str(e)}")
            raise
