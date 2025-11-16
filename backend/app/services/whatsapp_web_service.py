"""
WhatsApp Web Service (Alternative)
שירות שליחת הודעות דרך WhatsApp Web API
חלופה חינמית ל-WhatsApp Business API
"""
import requests
import os
from typing import Optional, Dict, Any
from loguru import logger
from app.config import settings


class WhatsAppWebService:
    """
    שירות שליחת הודעות WhatsApp דרך whatsapp-web.js server
    
    דורש:
    1. Node.js server עם whatsapp-web.js
    2. הרצת הסרבר ב-localhost:3001
    3. סריקת QR code
    """
    
    def __init__(self):
        # URL של ה-Node.js server (whatsapp-web.js)
        self.base_url = os.getenv("WHATSAPP_WEB_SERVER_URL", "http://localhost:3001")
        self.enabled = os.getenv("USE_WHATSAPP_WEB", "false").lower() == "true"
    
    async def send_message(
        self, 
        phone_number: str, 
        message: str
    ) -> Dict[str, Any]:
        """
        שליחת הודעת טקסט
        
        Args:
            phone_number: מספר טלפון בפורמט בינלאומי (972501234567)
            message: תוכן ההודעה
            
        Returns:
            Dict עם תוצאת השליחה
        """
        if not self.enabled:
            logger.warning("WhatsApp Web service is disabled")
            return {
                "success": False,
                "error": "WhatsApp Web service is disabled"
            }
        
        try:
            # הכנת מספר הטלפון
            # המרה מ-+972-50-123-4567 ל-972501234567
            clean_number = phone_number.replace("+", "").replace("-", "").replace(" ", "")
            
            # הוספת @c.us (WhatsApp ID format)
            whatsapp_id = f"{clean_number}@c.us"
            
            logger.info(f"📤 Sending WhatsApp Web message to {phone_number}")
            
            # שליחת בקשה ל-Node.js server
            response = requests.post(
                f"{self.base_url}/send-message",
                json={
                    "chatId": whatsapp_id,
                    "message": message
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ WhatsApp Web message sent successfully to {phone_number}")
                return {
                    "success": True,
                    "message_id": result.get("id"),
                    "data": result
                }
            else:
                logger.error(f"❌ Failed to send message: {response.text}")
                return {
                    "success": False,
                    "error": response.text
                }
                
        except requests.exceptions.ConnectionError:
            logger.error("❌ Cannot connect to WhatsApp Web server. Is it running?")
            return {
                "success": False,
                "error": "WhatsApp Web server not running"
            }
        except Exception as e:
            logger.error(f"❌ Error sending WhatsApp Web message: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def send_pdf(
        self,
        phone_number: str,
        pdf_path: str,
        caption: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        שליחת קובץ PDF
        
        Args:
            phone_number: מספר טלפון
            pdf_path: נתיב לקובץ PDF
            caption: כיתוב לקובץ (אופציונלי)
            
        Returns:
            Dict עם תוצאת השליחה
        """
        if not self.enabled:
            logger.warning("WhatsApp Web service is disabled")
            return {
                "success": False,
                "error": "WhatsApp Web service is disabled"
            }
        
        try:
            clean_number = phone_number.replace("+", "").replace("-", "").replace(" ", "")
            whatsapp_id = f"{clean_number}@c.us"
            
            logger.info(f"📎 Sending PDF via WhatsApp Web to {phone_number}")
            
            # קריאת הקובץ
            with open(pdf_path, 'rb') as f:
                pdf_data = f.read()
            
            # המרה ל-base64 (אופציונלי - תלוי במימוש הסרבר)
            import base64
            pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')
            
            response = requests.post(
                f"{self.base_url}/send-file",
                json={
                    "chatId": whatsapp_id,
                    "fileData": pdf_base64,
                    "fileName": os.path.basename(pdf_path),
                    "caption": caption or ""
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ PDF sent successfully via WhatsApp Web")
                return {
                    "success": True,
                    "message_id": result.get("id"),
                    "data": result
                }
            else:
                logger.error(f"❌ Failed to send PDF: {response.text}")
                return {
                    "success": False,
                    "error": response.text
                }
                
        except FileNotFoundError:
            logger.error(f"❌ PDF file not found: {pdf_path}")
            return {
                "success": False,
                "error": "PDF file not found"
            }
        except Exception as e:
            logger.error(f"❌ Error sending PDF: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def check_status(self) -> Dict[str, Any]:
        """
        בדיקת סטטוס החיבור ל-WhatsApp Web
        
        Returns:
            Dict עם סטטוס החיבור
        """
        try:
            response = requests.get(
                f"{self.base_url}/status",
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "connected": result.get("connected", False),
                    "data": result
                }
            else:
                return {
                    "success": False,
                    "connected": False
                }
                
        except Exception as e:
            logger.error(f"❌ Error checking status: {str(e)}")
            return {
                "success": False,
                "connected": False,
                "error": str(e)
            }


# Singleton instance
whatsapp_web_service = WhatsAppWebService()
