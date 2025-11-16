"""
Email Service
שירות שליחת אימיילים כחלופה ל-WhatsApp
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from typing import Optional, Dict, Any
from loguru import logger


class EmailService:
    """
    שירות שליחת אימיילים
    תומך ב-Gmail, Outlook, וכל SMTP server
    """
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.email_user = os.getenv("EMAIL_USER", "")
        self.email_password = os.getenv("EMAIL_PASSWORD", "")
        self.from_name = os.getenv("EMAIL_FROM_NAME", "מערכת סינון מועמדים")
        self.enabled = os.getenv("USE_EMAIL", "false").lower() == "true"
        
        if self.enabled and not self.email_user:
            logger.warning("⚠️ Email service enabled but EMAIL_USER not configured")
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        body: str,
        body_html: Optional[str] = None,
        attachment_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        שליחת אימייל
        
        Args:
            to_email: כתובת אימייל של הנמען
            subject: נושא האימייל
            body: תוכן טקסט פשוט
            body_html: תוכן HTML (אופציונלי)
            attachment_path: נתיב לקובץ מצורף (אופציונלי)
            
        Returns:
            Dict עם תוצאת השליחה
        """
        if not self.enabled:
            logger.warning("📧 Email service is disabled")
            return {
                "success": False,
                "error": "Email service is disabled"
            }
        
        if not self.email_user or not self.email_password:
            logger.error("❌ Email credentials not configured")
            return {
                "success": False,
                "error": "Email credentials not configured"
            }
        
        try:
            # יצירת ההודעה
            msg = MIMEMultipart('alternative')
            msg['From'] = f"{self.from_name} <{self.email_user}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # הוספת תוכן טקסט
            msg.attach(MIMEText(body, 'plain', 'utf-8'))
            
            # הוספת תוכן HTML אם קיים
            if body_html:
                msg.attach(MIMEText(body_html, 'html', 'utf-8'))
            
            # הוספת קובץ מצורף אם קיים
            if attachment_path and os.path.exists(attachment_path):
                with open(attachment_path, 'rb') as f:
                    attachment = MIMEApplication(f.read())
                    attachment.add_header(
                        'Content-Disposition',
                        'attachment',
                        filename=os.path.basename(attachment_path)
                    )
                    msg.attach(attachment)
            
            # שליחת האימייל
            logger.info(f"📧 Sending email to {to_email}")
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
            
            logger.info(f"✅ Email sent successfully to {to_email}")
            return {
                "success": True,
                "to": to_email,
                "subject": subject
            }
            
        except smtplib.SMTPAuthenticationError:
            logger.error("❌ Email authentication failed - check credentials")
            return {
                "success": False,
                "error": "Authentication failed"
            }
        except Exception as e:
            logger.error(f"❌ Error sending email: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_form_invitation(
        self,
        email: str,
        candidate_name: str,
        form_url: str,
        job_title: str
    ) -> Dict[str, Any]:
        """
        שליחת הזמנה למילוי טופס
        """
        subject = f"הזמנה למילוי טופס - {job_title}"
        
        body = f"""שלום {candidate_name}!

תודה שהגשת קורות חיים למשרת {job_title}.

כדי להמשיך בתהליך, אנא מלא את טופס הסינון בקישור הבא:
{form_url}

הטופס כולל שאלות קצרות ויסייע לנו להכיר אותך טוב יותר.

בהצלחה!
צוות הגיוס
"""
        
        body_html = f"""
        <html dir="rtl">
            <body style="font-family: Arial, sans-serif; text-align: right;">
                <h2>שלום {candidate_name}!</h2>
                <p>תודה שהגשת קורות חיים למשרת <strong>{job_title}</strong>.</p>
                <p>כדי להמשיך בתהליך, אנא מלא את טופס הסינון:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="{form_url}" 
                       style="background-color: #4CAF50; color: white; padding: 15px 32px; 
                              text-decoration: none; display: inline-block; border-radius: 4px;">
                        למילוי הטופס 📝
                    </a>
                </p>
                <p>הטופס כולל שאלות קצרות ויסייע לנו להכיר אותך טוב יותר.</p>
                <p>בהצלחה!<br>צוות הגיוס</p>
            </body>
        </html>
        """
        
        return self.send_email(email, subject, body, body_html)
    
    def send_submission_confirmation(
        self,
        email: str,
        candidate_name: str,
        passed_screening: bool,
        pdf_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        שליחת אישור קבלת טופס
        """
        if passed_screening:
            subject = "עברת את שלב הסינון! 🎉"
            body = f"""שלום {candidate_name}!

תודה שמילאת את הטופס.
עברת בהצלחה את שלב הסינון הראשוני! 🎉

נציג מטעמנו יצור איתך קשר בקרוב לתיאום ריאיון.

בהצלחה! 💼
"""
            body_html = f"""
            <html dir="rtl">
                <body style="font-family: Arial, sans-serif; text-align: right;">
                    <h2 style="color: #4CAF50;">שלום {candidate_name}! 🎉</h2>
                    <p>תודה שמילאת את הטופס.</p>
                    <p><strong>עברת בהצלחה את שלב הסינון הראשוני!</strong></p>
                    <p>נציג מטעמנו יצור איתך קשר בקרוב לתיאום ריאיון.</p>
                    <p>בהצלחה! 💼</p>
                </body>
            </html>
            """
        else:
            subject = "תודה על ההגשה"
            body = f"""שלום {candidate_name},

תודה שמילאת את הטופס.
לצערנו, במקרה זה לא נוכל להמשיך בתהליך.

נשמח לראות אותך שוב במשרות עתידיות!

בהצלחה,
צוות הגיוס
"""
            body_html = f"""
            <html dir="rtl">
                <body style="font-family: Arial, sans-serif; text-align: right;">
                    <h2>שלום {candidate_name},</h2>
                    <p>תודה שמילאת את הטופס.</p>
                    <p>לצערנו, במקרה זה לא נוכל להמשיך בתהליך.</p>
                    <p>נשמח לראות אותך שוב במשרות עתידיות!</p>
                    <p>בהצלחה,<br>צוות הגיוס</p>
                </body>
            </html>
            """
        
        return self.send_email(
            email,
            subject,
            body,
            body_html,
            attachment_path=pdf_path
        )


# Singleton instance
email_service = EmailService()
