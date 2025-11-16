# 📋 מערכת טופס סינון עובדים לוואטסאפ

מערכת מקצועית לניהול טפסי סינון עובדים עם אינטגרציה מלאה ל-WhatsApp Business API, יצירת PDF אוטומטית, ושליחת הודעות אוטומטיות.

## 🎯 תכונות עיקריות

### 💼 ניהול טפסים
- ✅ יצירת טפסים מותאמים אישית
- ✅ שאלות סינון מסוגים שונים (בחירה, טקסט, מספר)
- ✅ דרישות מקדמיות
- ✅ תנאי עבודה ושכר

### 📱 אינטגרציה עם WhatsApp
- ✅ שליחת הזמנות למילוי טופס
- ✅ הודעות אישור אוטומטיות
- ✅ שליחת PDF ישירות לוואטסאפ
- ✅ Webhook לקבלת הודעות

### 🎨 ממשק משתמש
- ✅ טופס רב-שלבי (4 שלבים)
- ✅ עיצוב מודרני ורספונסיבי
- ✅ תמיכה מלאה בעברית (RTL)
- ✅ אנימציות חלקות
- ✅ תצוגת bubble מלאה במובייל

### 📄 PDF מעוצב
- ✅ יצירה אוטומטית של PDF
- ✅ תמיכה בעברית (פונטים מתאימים)
- ✅ עיצוב מקצועי
- ✅ שמירה ושליחה אוטומטית

## 🏗️ ארכיטקטורה

```
┌─────────────────────────────────────────────────────────┐
│                    WhatsApp User                        │
│         (מקבל הודעה עם קישור לטופס)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │    Frontend (React)        │
        │  - טופס רב-שלבי            │
        │  - ולידציה                 │
        │  - אנימציות                │
        └────────────┬───────────────┘
                     │ API Calls
                     ▼
        ┌────────────────────────────┐
        │   Backend (FastAPI)        │
        │  - API Endpoints           │
        │  - Business Logic          │
        │  - Database (SQLite)       │
        └─────┬──────────────┬───────┘
              │              │
              ▼              ▼
    ┌─────────────┐   ┌──────────────┐
    │  WhatsApp   │   │  PDF Service │
    │  Business   │   │  (ReportLab) │
    │     API     │   └──────────────┘
    └─────────────┘
```

## 📦 מבנה הפרויקט

```
JOB WORKER/
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py            # Entry point
│   │   ├── config.py          # Configuration
│   │   ├── database.py        # Database setup
│   │   ├── schemas.py         # Pydantic models
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routers/           # API endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── whatsapp_service.py
│   │   │   ├── pdf_service.py
│   │   │   └── notification_service.py
│   │   └── utils/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormSteps/
│   │   │   └── shared/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
├── docs/                       # תיעוד
├── RULES.md                    # כללי הפרויקט
├── PLAN.md                     # תכנית עבודה
├── INSRUCTIONS.txt             # דרישות לקוח
├── setup.bat                   # סקריפט התקנה
├── start_backend.bat           # הפעלת Backend
├── start_frontend.bat          # הפעלת Frontend
└── README.md                   # קובץ זה
```

## 🚀 התקנה מהירה

### דרישות מקדימות
- Python 3.10
- Node.js 16+
- npm או yarn

### שלב 1: התקנה אוטומטית
```powershell
# הרץ את סקריפט ההתקנה
setup.bat
```

הסקריפט יבצע:
1. יצירת virtual environment ל-Python
2. התקנת כל התלויות (Python + Node.js)
3. יצירת קבצי .env
4. יצירת תיקיות נדרשות

### שלב 2: הגדרת API Keys

#### Backend (.env)
ערוך את `backend/.env`:
```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Company Info
COMPANY_NAME="Your Company Name"
JOB_TITLE="Job Title"
```

#### Frontend (.env)
ערוך את `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### שלב 3: הפעלה

#### הפעל את Backend
```powershell
start_backend.bat
```
השרת יעלה על: `http://localhost:8000`

#### הפעל את Frontend (בחלון נפרד)
```powershell
start_frontend.bat
```
האפליקציה תעלה על: `http://localhost:3000`

### שלב 4: יצירת טופס דמו
```powershell
cd backend
venv\Scripts\activate
python create_demo_form.py
```

תקבל קישור לטופס, לדוגמה:
```
http://localhost:3000/?id=abc12345
```

## 📖 מדריך שימוש

### יצירת טופס חדש

#### דרך API
```python
import requests

form_data = {
    "job_title": "מפתח Full Stack",
    "job_description": "תיאור המשרה...",
    "job_location": "תל אביב",
    "salary_range": "15,000-20,000 ₪",
    "company_name": "שם החברה",
    # ... שאר הנתונים
}

response = requests.post(
    "http://localhost:8000/api/forms/",
    json=form_data
)

form = response.json()
form_url = f"http://localhost:3000/?id={form['unique_id']}"
```

#### שליחת הזמנה בוואטסאפ
```python
import requests

requests.post(
    "http://localhost:8000/api/whatsapp/send-invitation",
    json={
        "phone_number": "+972501234567",
        "form_url": "http://localhost:3000/?id=abc12345"
    }
)
```

### Flow של מועמד

1. **מקבל הודעת וואטסאפ** עם קישור לטופס
2. **לוחץ על הקישור** - נפתח הטופס במובייל (full-screen bubble)
3. **שלב 1 - מסך פתיחה**: רואה פרטי משרה, חברה, מפה
4. **שלב 2 - סינון**: עובר על דרישות ועונה על שאלות
5. **שלב 3 - תנאים**: קורא תנאי עבודה ומאשר
6. **שלב 4 - פרטים**: ממלא פרטים אישיים ושולח
7. **מקבל אישור בוואטסאפ** + PDF של הטופס

## 🔧 API Endpoints

### Forms
- `POST /api/forms/` - יצירת טופס חדש
- `GET /api/forms/{unique_id}` - קבלת טופס
- `GET /api/forms/` - קבלת כל הטפסים
- `POST /api/forms/submit` - שליחת טופס ממולא

### WhatsApp
- `GET /api/whatsapp/webhook` - אימות webhook
- `POST /api/whatsapp/webhook` - קבלת הודעות
- `POST /api/whatsapp/send-invitation` - שליחת הזמנה

### תיעוד מלא
Swagger UI: `http://localhost:8000/docs`

## 🔐 אבטחה

- ✅ כל ה-API Keys ב-.env (לא בקוד)
- ✅ Validation בצד שרת וקליינט
- ✅ CORS מוגדר נכון
- ✅ HTTPS לפרודקשן (מומלץ)

## 📊 Database Schema

### Forms Table
- `id`, `unique_id`, `job_title`, `job_description`
- `company_name`, `company_address`, `company_lat`, `company_lng`
- `screening_questions` (JSON)
- `requirements` (JSON)
- `terms_and_conditions` (JSON)

### Form Submissions Table
- `id`, `form_id`, `full_name`, `phone_number`, `email`, `city`
- `screening_answers` (JSON)
- `passed_screening`, `accepted_terms`
- `pdf_path`, `whatsapp_message_sent`

## 🧪 בדיקות

### בדיקה ידנית
1. הפעל Backend ו-Frontend
2. צור טופס דמו
3. פתח את הקישור בדפדפן
4. עבור את כל השלבים
5. בדוק שההודעות נשלחו

### בדיקות אוטומטיות (עתידי)
```powershell
cd backend
pytest
```

## 🐛 Troubleshooting

### Backend לא עולה
- וודא Python 3.10 מותקן
- בדוק שכל התלויות הותקנו: `pip install -r requirements.txt`
- בדוק שהפורט 8000 פנוי

### Frontend לא עולה
- וודא Node.js מותקן
- הרץ `npm install` מחדש
- בדוק שהפורט 3000 פנוי

### WhatsApp לא שולח
- וודא Access Token תקין
- בדוק שה-Phone Number ID נכון
- וודא שיש לך הרשאות לשלוח הודעות

### PDF לא נוצר
- וודא שיש תיקיית `pdfs/`
- בדוק שהפונט העברי קיים במערכת
- בדוק logs לשגיאות

## 📚 טכנולוגיות

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **Pydantic** - Validation
- **ReportLab** - PDF generation
- **Requests** - HTTP client

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide** - Icons

### External APIs
- **WhatsApp Business API** (Meta Cloud)
- **Google Maps Embed API**

## 🎓 למידה נוספת

- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)

## 📄 רישיון

Proprietary - All rights reserved

## 👥 תמיכה

לתמיכה טכנית או שאלות:
- 📧 Email: support@yourcompany.com
- 📱 Phone: 050-1234567

## 🗺️ Roadmap

### גרסה 1.1 (עתידית)
- [ ] Dashboard לניהול טפסים
- [ ] דוחות וסטטיסטיקות
- [ ] אינטגרציה עם CRM
- [ ] תמיכה במספר שפות
- [ ] תבניות טפסים מוכנות

### גרסה 2.0 (עתידית)
- [ ] Mobile App (React Native)
- [ ] Advanced analytics
- [ ] AI-powered screening
- [ ] Video interviews integration

---

**נבנה עם ❤️ במיוחד עבורך**
