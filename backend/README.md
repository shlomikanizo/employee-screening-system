# Backend - Employee Screening Form API

## תיאור
מערכת Backend לטופס סינון עובדים עם אינטגרציה ל-WhatsApp Business API.

## דרישות מקדימות
- Python 3.10
- pip
- Virtual Environment (מומלץ)

## התקנה

### 1. יצירת סביבה וירטואלית
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

### 2. התקנת תלויות
```powershell
pip install -r requirements.txt
```

### 3. הגדרת משתני סביבה
```powershell
# העתק את קובץ .env.example ל-.env
copy .env.example .env

# ערוך את .env והזן את הערכים שלך:
# - WHATSAPP_ACCESS_TOKEN
# - GOOGLE_MAPS_API_KEY
# - וכו'
```

## הפעלה

### מצב פיתוח
```powershell
python -m app.main
```

או עם uvicorn ישירות:
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

השרת יעלה על: `http://localhost:8000`

### תיעוד API
לאחר הפעלת השרת:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## מבנה הפרויקט
```
backend/
├── app/
│   ├── main.py              # Entry point
│   ├── config.py            # הגדרות
│   ├── database.py          # הגדרות DB
│   ├── schemas.py           # Pydantic schemas
│   ├── models/              # Database models
│   │   ├── __init__.py
│   │   └── form.py
│   ├── routers/             # API endpoints
│   │   ├── __init__.py
│   │   ├── forms.py
│   │   └── whatsapp.py
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   ├── whatsapp_service.py
│   │   ├── pdf_service.py
│   │   └── notification_service.py
│   └── utils/               # Helpers
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Forms
- `POST /api/forms/` - יצירת טופס חדש
- `GET /api/forms/{unique_id}` - קבלת טופס
- `POST /api/forms/submit` - שליחת טופס ממולא

### WhatsApp
- `GET /api/whatsapp/webhook` - אימות webhook
- `POST /api/whatsapp/webhook` - קבלת הודעות
- `POST /api/whatsapp/send-invitation` - שליחת הזמנה

## הגדרת WhatsApp Business API

### שלבים:
1. היכנס ל-[Meta for Developers](https://developers.facebook.com/)
2. צור אפליקציה חדשה
3. הוסף WhatsApp Business Product
4. קבל את:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
5. הגדר Webhook URL:
   - URL: `https://your-domain.com/api/whatsapp/webhook`
   - Verify Token: הערך מ-`WHATSAPP_VERIFY_TOKEN` שלך

## הגדרת Google Maps

1. היכנס ל-[Google Cloud Console](https://console.cloud.google.com/)
2. צור פרויקט חדש
3. הפעל Maps JavaScript API
4. צור API Key
5. הוסף את ה-Key ל-`.env` כ-`GOOGLE_MAPS_API_KEY`

## פונטים לPDF

לתמיכה בעברית ב-PDF, צריך להוריד פונט:

### Windows:
הפונט Arial כבר מותקן. הקוד ישתמש בו אוטומטית.

### Linux/Mac:
```bash
# התקן DejaVu Sans
sudo apt-get install fonts-dejavu  # Ubuntu/Debian
```

## בדיקות

```powershell
pytest
```

## לוגים
לוגים נשמרים ב-`logs/app.log`

## Troubleshooting

### שגיאה: "Module not found"
```powershell
pip install -r requirements.txt
```

### שגיאה: "Database error"
```powershell
# מחק את ה-DB ותן לו להיווצר מחדש
rm job_worker.db
```

### שגיאה: "WhatsApp API error"
בדוק ש:
- Access Token תקף
- Phone Number ID נכון
- יש לך הרשאות לשלוח הודעות

## רישיון
Proprietary - All rights reserved

## תמיכה
לתמיכה, פנה אל: support@yourcompany.com
