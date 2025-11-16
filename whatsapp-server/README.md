# 📱 WhatsApp Web Server

שרת Node.js שמספק API לשליחת הודעות WhatsApp דרך WhatsApp Web.

חלופה **חינמית לחלוטין** ל-WhatsApp Business API של Meta!

---

## 🚀 התקנה מהירה

### 1. התקן Node.js
אם אין לך Node.js, הורד מ-[nodejs.org](https://nodejs.org/) (גרסה 16+)

### 2. התקן תלויות
```powershell
cd whatsapp-server
npm install
```

### 3. הרץ את השרת
```powershell
npm start
```

### 4. סרוק QR Code
- QR code יופיע בטרמינל
- פתח WhatsApp בטלפון
- לך ל-**Linked Devices** > **Link a Device**
- סרוק את ה-QR

✅ **זהו! השרת מחובר!**

---

## 📡 API Endpoints

### בדיקת סטטוס
```http
GET http://localhost:3001/status
```

Response:
```json
{
  "connected": true,
  "hasQR": false,
  "timestamp": "2025-11-15T17:30:00.000Z"
}
```

### שליחת הודעה
```http
POST http://localhost:3001/send-message
Content-Type: application/json

{
  "chatId": "972501234567@c.us",
  "message": "שלום! זו הודעת בדיקה"
}
```

Response:
```json
{
  "success": true,
  "id": "message_id_here",
  "timestamp": 1234567890,
  "to": "972501234567@c.us"
}
```

### שליחת קובץ (PDF)
```http
POST http://localhost:3001/send-file
Content-Type: application/json

{
  "chatId": "972501234567@c.us",
  "fileData": "base64_encoded_file_here",
  "fileName": "document.pdf",
  "caption": "הנה המסמך שלך"
}
```

### בדיקת מספר
```http
POST http://localhost:3001/check-number
Content-Type: application/json

{
  "phoneNumber": "972501234567"
}
```

---

## 🔧 שימוש עם Backend

### עדכן את backend/.env:
```env
# אפשר שימוש ב-WhatsApp Web
USE_WHATSAPP_WEB=true

# כתובת השרת
WHATSAPP_WEB_SERVER_URL=http://localhost:3001
```

### השרת יתחבר אוטומטית!
Backend יזהה שאתה משתמש ב-WhatsApp Web וישלח הודעות דרך השרת הזה.

---

## 📋 פורמט מספרים

### פורמט נכון:
```
972501234567@c.us  ✅ (עם @c.us)
972501234567       ✅ (ללא @c.us - נוסיף אוטומטית)
+972-50-123-4567   ✅ (ננקה אוטומטית)
```

### פורמט שגוי:
```
050-123-4567       ❌ (חסר קידומת מדינה)
501234567          ❌ (חסר 972)
```

---

## 🔄 שימור החיבור

ה-Session נשמר אוטומטית ב-`whatsapp-session/`.

**אחרי סריקת QR הראשונה:**
- ✅ לא צריך לסרוק שוב
- ✅ החיבור נשמר בין הפעלות
- ✅ השרת יתחבר אוטומטית

**אם רוצה להתנתק:**
```http
POST http://localhost:3001/logout
```

---

## 🛠️ פקודות שימושיות

### הפעלה רגילה
```powershell
npm start
```

### הפעלה עם auto-restart
```powershell
npm run dev
```

### בדיקת סטטוס
```powershell
curl http://localhost:3001/status
```

---

## ⚠️ הערות חשובות

### 1. שמירת החיבור
- **אל תסרוק QR במספר מקומות בו-זמנית**
- החיבור יישמר עד שתתנתק באפליקציה

### 2. מגבלות
- WhatsApp מגביל שליחת הודעות (לא מדויק כמה)
- אל תשלח spam - עלול להוביל לחסימה
- מומלץ: עד 100-200 הודעות ביום

### 3. אבטחה
- השרת רץ על localhost בלבד
- אין authentication - אל תחשוף לאינטרנט!
- בפרודקשן: הוסף authentication

### 4. לא רשמי
- זה **לא** פתרון רשמי של WhatsApp
- נגד תנאי השימוש של WhatsApp
- השתמש באחריותך

---

## 🐛 פתרון בעיות

### QR לא מופיע
1. וודא שיש לך Node.js 16+
2. נקה: `rm -rf node_modules && npm install`
3. נסה שוב: `npm start`

### "Session not ready"
- השרת עדיין לא מחובר
- המתן עד לסריקת QR
- בדוק `/status` - צריך `connected: true`

### "Cannot connect to server"
- וודא שהשרת רץ: `npm start`
- בדוק שהפורט 3001 פנוי
- בדוק Firewall

### הודעות לא נשלחות
1. בדוק שהמספר נכון (עם קידומת מדינה)
2. וודא שהמספר רשום אצלך בWhatsApp
3. בדוק שיש חיבור לאינטרנט

---

## 📊 Monitoring

### לוגים
כל הפעילות מודפסת לקונסול:
```
✅ הודעה נשלחה
📨 הודעה חדשה
❌ שגיאה
```

### Health Check
```http
GET http://localhost:3001/health
```

---

## 🎯 דוגמאות שימוש

### Python (Backend)
```python
import requests

# שליחת הודעה
response = requests.post(
    "http://localhost:3001/send-message",
    json={
        "chatId": "972501234567@c.us",
        "message": "שלום מהמערכת!"
    }
)
print(response.json())
```

### JavaScript (Frontend)
```javascript
// שליחת הודעה
const response = await fetch('http://localhost:3001/send-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chatId: '972501234567@c.us',
    message: 'שלום!'
  })
});
const result = await response.json();
console.log(result);
```

### cURL
```bash
# שליחת הודעה
curl -X POST http://localhost:3001/send-message \
  -H "Content-Type: application/json" \
  -d '{"chatId":"972501234567@c.us","message":"שלום!"}'
```

---

## 📚 מקורות נוספים

- [whatsapp-web.js Documentation](https://wwebjs.dev/)
- [GitHub Repository](https://github.com/pedroslopez/whatsapp-web.js)
- [Examples](https://github.com/pedroslopez/whatsapp-web.js/tree/main/example)

---

## 🎉 סיכום

**יתרונות:**
- ✅ חינם לחלוטין
- ✅ קל להתקנה
- ✅ עובד עם מספר רגיל
- ✅ תומך בכל תכונות WhatsApp

**חסרונות:**
- ⚠️ לא רשמי
- ⚠️ צריך סריקת QR
- ⚠️ מגבלות לא מוגדרות

**אידיאלי ל:**
- 🎯 פיתוח ובדיקות
- 🎯 פרויקטים קטנים-בינוניים
- 🎯 כשאין תקציב ל-Business API

---

**נבנה עם ❤️ למען חופש שליחת הודעות!**
