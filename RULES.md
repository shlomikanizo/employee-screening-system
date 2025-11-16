# חוקי הפרויקט - מערכת טופס סינון עובדים לוואטסאפ

## עקרונות יסוד

### חוק יסוד - נתונים אמיתיים בלבד
- **אסור** להשתמש בנתונים מדומים, פיקטיביים או להדגמה
- **רק** נתונים אמיתיים שנשאבו ממקורות אמיתיים
- אין נתונים לדוגמא בקוד הייצור

### ארכיטקטורת הפרויקט
```
JOB WORKER/
├── backend/               # Python 3.10 FastAPI
│   ├── app/
│   │   ├── main.py       # Entry point
│   │   ├── models/       # Database models
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Business logic
│   │   │   ├── whatsapp_service.py
│   │   │   ├── pdf_service.py
│   │   │   └── notification_service.py
│   │   └── utils/        # Helper functions
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/              # React + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormSteps/
│   │   │   │   ├── Step1Welcome.jsx
│   │   │   │   ├── Step2Screening.jsx
│   │   │   │   ├── Step3Terms.jsx
│   │   │   │   └── Step4Details.jsx
│   │   │   └── shared/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
├── docs/                  # תיעוד
├── RULES.md              # קובץ זה
├── PLAN.md               # תכנית עבודה
└── INSRUCTIONS.txt       # דרישות לקוח
```

## כללי קידוד

### Python Backend
- **גרסה**: Python 3.10 בלבד
- **סביבה וירטואלית**: חובה לכל פרויקט
- **פורמט**: PEP 8
- **תיעוד**: Docstrings לכל פונקציה ומחלקה
- **Type hints**: חובה לכל פונקציה
- **Error handling**: try-except עם לוגים מפורטים

### Frontend
- **Framework**: React 18+
- **Styling**: TailwindCSS + shadcn/ui
- **Icons**: Lucide React
- **State**: React hooks (useState, useEffect)
- **Responsive**: Mobile-first approach

### אבטחה
- **API Keys**: רק ב-.env, לא בקוד
- **Validation**: בצד שרת וקליינט
- **HTTPS**: חובה לפרודקשן
- **CORS**: הגדרות מדויקות

### בסיס נתונים
- **פיתוח**: SQLite
- **ייצור**: PostgreSQL (אופציונלי)
- **ORM**: SQLAlchemy
- **Migrations**: Alembic

## תהליך עבודה

1. **ניתוח** - לפני כל שינוי, נתח את ההשפעה
2. **תכנון** - כתוב את הקוד במחברת לפני יישום
3. **יישום בשלבים** - חלקים קטנים, בדיקה אחר בדיקה
4. **בדיקה** - כל פיצ'ר נבדק מיד לאחר יישום
5. **תיעוד** - עדכן PLAN.md אחרי כל שלב

## אינטגרציות חיצוניות

### WhatsApp Business API
- **ספק**: Meta Cloud API או Twilio
- **אימות**: Access Token ב-.env
- **Rate limits**: שמירה על מגבלות API
- **Webhook**: לקבלת הודעות ואישורים

### Google Maps
- **API**: Maps Embed API
- **Key**: Google Cloud API Key ב-.env

### PDF Generation
- **ספרייה**: ReportLab או WeasyPrint
- **פונטים**: תמיכה בעברית (Arial/Noto Sans Hebrew)
- **תבנית**: עיצוב מקצועי וקריא

## בדיקות איכות

- [ ] כל endpoint מחזיר status codes נכונים
- [ ] Validation עובד בשרת וקליינט
- [ ] PDF נוצר תקין עם טקסט בעברית
- [ ] WhatsApp שולח ומקבל הודעות
- [ ] טופס מוצג תקין במובייל
- [ ] ניווט בין שלבים חלק
- [ ] שגיאות מוצגות בבירור למשתמש

## עדכון תכנית

יש לעדכן את PLAN.md לאחר כל:
- השלמת משימה
- גילוי בעיה חדשה
- שינוי בדרישות
- תיקון באג משמעותי

---

**נוצר**: נובמבר 2025
**עודכן לאחרונה**: נובמבר 2025
