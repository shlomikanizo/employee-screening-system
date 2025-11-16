# 🚀 התקנה מהירה - WhatsApp Web Server

## הבעיה שתוקנה
הסקריפט `start_whatsapp_server.bat` תוקן לעבוד נכון ב-Windows.

## צעדים להרצה

### 1. התקן Node.js (אם אין)
```
https://nodejs.org/
```
הורד והתקן את הגרסה האחרונה (LTS מומלץ).

### 2. הרץ את הסקריפט המתוקן
```powershell
start_whatsapp_server.bat
```

### מה יקרה:
1. ✅ בדיקה שתיקיית whatsapp-server קיימת
2. ✅ בדיקה ש-Node.js מותקן
3. ✅ התקנת תלויות אוטומטית (npm install)
4. ✅ הפעלת השרת
5. ✅ הצגת QR code

### 3. סרוק QR Code
- פתח WhatsApp בטלפון
- הגדרות → Linked Devices (מכשירים מקושרים)
- Link a Device (קשר מכשיר)
- סרוק את ה-QR

### 4. עדכן Backend
ערוך `backend\.env`:
```env
USE_WHATSAPP_WEB=true
WHATSAPP_WEB_SERVER_URL=http://localhost:3001
```

### 5. הרץ Backend + Frontend
```powershell
# טרמינל 1
start_backend.bat

# טרמינל 2
start_frontend.bat
```

## בדיקת תקינות

### בדוק שהשרת רץ:
```
http://localhost:3001/status
```

צריך להחזיר:
```json
{
  "connected": true,
  "hasQR": false
}
```

## פתרון בעיות

### אם Node.js לא מזוהה
1. התקן מ-https://nodejs.org/
2. אתחל את הטרמינל
3. נסה שוב

### אם התיקייה לא נמצאת
וודא שאתה בנתיב הנכון:
```powershell
cd "C:\Users\User\OmegaGPT\JOB WORKER"
```

### אם npm install נכשל
נסה ידנית:
```powershell
cd whatsapp-server
npm install
```

### אם הסקריפט עדיין לא עובד
הרץ ידנית:
```powershell
cd whatsapp-server
npm install
npm start
```

## מה השתנה בסקריפט

### לפני (לא עבד):
```batch
cd whatsapp-server
npm start
```
**בעיה**: אם cd נכשל, npm start רץ בתיקייה הלא נכונה.

### אחרי (עובד):
```batch
set "WHATSAPP_DIR=%SCRIPT_DIR%whatsapp-server"
if not exist "%WHATSAPP_DIR%" (exit)
cd /d "%WHATSAPP_DIR%"
npm start
```
**פתרון**: שימוש בנתיב מלא + בדיקות.

## הרצה ידנית (אם הסקריפט לא עובד)

```powershell
# צעד 1: נווט לתיקייה
cd "C:\Users\User\OmegaGPT\JOB WORKER\whatsapp-server"

# צעד 2: התקן תלויות (פעם אחת)
npm install

# צעד 3: הרץ שרת
npm start
```

## סטטוס
✅ הסקריפט תוקן
✅ כל הקבצים במקום
✅ מוכן להרצה

**נסה עכשיו!** 🚀
