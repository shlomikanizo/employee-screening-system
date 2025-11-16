"""
WhatsApp Service
שירות שליחת הודעות WhatsApp דרך Meta Cloud API
"""
import requests
from typing import Optional, Dict, Any
from loguru import logger
from app.config import settings


class WhatsAppService:
    """שירות WhatsApp Business API"""
    
    def __init__(self):
        self.api_url = settings.WHATSAPP_API_URL
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
        self.access_token = settings.WHATSAPP_ACCESS_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    def send_text_message(self, to: str, message: str) -> Dict[str, Any]:
        """
        שליחת הודעת טקסט
        
        Args:
            to: מספר טלפון (בפורמט +972xxxxxxxxx)
            message: תוכן ההודעה
            
        Returns:
            Dict עם תגובה מה-API
        """
        try:
            # ניקוי מספר טלפון
            to_clean = self._clean_phone_number(to)
            
            url = f"{self.api_url}/{self.phone_number_id}/messages"
            
            payload = {
                "messaging_product": "whatsapp",
                "to": to_clean,
                "type": "text",
                "text": {
                    "body": message
                }
            }
            
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"הודעת WhatsApp נשלחה ל-{to_clean}: {result}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"שגיאה בשליחת הודעת WhatsApp: {str(e)}")
            raise
    
    def send_template_message(
        self, 
        to: str, 
        template_name: str, 
        language_code: str = "he",
        components: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        שליחת הודעה מתבנית מאושרת
        
        Args:
            to: מספר טלפון
            template_name: שם התבנית
            language_code: קוד שפה (ברירת מחדל: עברית)
            components: רכיבים נוספים לתבנית
            
        Returns:
            Dict עם תגובה מה-API
        """
        try:
            to_clean = self._clean_phone_number(to)
            
            url = f"{self.api_url}/{self.phone_number_id}/messages"
            
            payload = {
                "messaging_product": "whatsapp",
                "to": to_clean,
                "type": "template",
                "template": {
                    "name": template_name,
                    "language": {
                        "code": language_code
                    }
                }
            }
            
            if components:
                payload["template"]["components"] = components
            
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"הודעת תבנית נשלחה ל-{to_clean}: {result}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"שגיאה בשליחת הודעת תבנית: {str(e)}")
            raise
    
    def send_interactive_button(
        self, 
        to: str, 
        body_text: str,
        button_text: str,
        button_url: str
    ) -> Dict[str, Any]:
        """
        שליחת הודעה עם כפתור אינטראקטיבי
        
        Args:
            to: מספר טלפון
            body_text: טקסט ההודעה
            button_text: טקסט הכפתור
            button_url: URL של הכפתור
            
        Returns:
            Dict עם תגובה מה-API
        """
        try:
            to_clean = self._clean_phone_number(to)
            
            url = f"{self.api_url}/{self.phone_number_id}/messages"
            
            payload = {
                "messaging_product": "whatsapp",
                "to": to_clean,
                "type": "interactive",
                "interactive": {
                    "type": "cta_url",
                    "body": {
                        "text": body_text
                    },
                    "action": {
                        "name": "cta_url",
                        "parameters": {
                            "display_text": button_text,
                            "url": button_url
                        }
                    }
                }
            }
            
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"הודעה אינטראקטיבית נשלחה ל-{to_clean}: {result}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"שגיאה בשליחת הודעה אינטראקטיבית: {str(e)}")
            raise
    
    def send_document(
        self, 
        to: str, 
        document_url: str, 
        filename: str,
        caption: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        שליחת קובץ PDF
        
        Args:
            to: מספר טלפון
            document_url: URL של המסמך
            filename: שם הקובץ
            caption: כיתוב למסמך
            
        Returns:
            Dict עם תגובה מה-API
        """
        try:
            to_clean = self._clean_phone_number(to)
            
            url = f"{self.api_url}/{self.phone_number_id}/messages"
            
            payload = {
                "messaging_product": "whatsapp",
                "to": to_clean,
                "type": "document",
                "document": {
                    "link": document_url,
                    "filename": filename
                }
            }
            
            if caption:
                payload["document"]["caption"] = caption
            
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"מסמך נשלח ל-{to_clean}: {result}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"שגיאה בשליחת מסמך: {str(e)}")
            raise
    
    def _clean_phone_number(self, phone: str) -> str:
        """
        ניקוי וסטנדרטיזציה של מספר טלפון
        
        Args:
            phone: מספר טלפון
            
        Returns:
            מספר טלפון מנוקה בפורמט בינלאומי
        """
        # הסרת רווחים ומקפים
        cleaned = phone.replace(" ", "").replace("-", "")
        
        # המרה לפורמט בינלאומי
        if cleaned.startswith("0"):
            cleaned = "+972" + cleaned[1:]
        elif not cleaned.startswith("+"):
            cleaned = "+" + cleaned
        
        return cleaned
    
    def verify_webhook(self, mode: str, token: str, challenge: str) -> Optional[str]:
        """
        אימות webhook של WhatsApp
        
        Args:
            mode: מצב האימות
            token: טוקן לאימות
            challenge: קוד אתגר
            
        Returns:
            קוד אתגר אם האימות הצליח, None אחרת
        """
        if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
            logger.info("Webhook אומת בהצלחה")
            return challenge
        else:
            logger.warning("ניסיון אימות Webhook נכשל")
            return None
