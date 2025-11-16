# Frontend - Employee Screening Form

## תיאור
אפליקציית React לטופס סינון עובדים רב-שלבי עם עיצוב מודרני ותמיכה מלאה בעברית.

## טכנולוגיות
- ⚛️ React 18
- ⚡ Vite
- 🎨 TailwindCSS
- 🎭 Framer Motion
- 📡 Axios
- 🎯 Lucide Icons

## תכונות
- ✅ טופס רב-שלבי (4 שלבים)
- ✅ עיצוב רספונסיבי (Mobile-First)
- ✅ אנימציות חלקות
- ✅ תמיכה מלאה בעברית (RTL)
- ✅ וולידציה בצד לקוח
- ✅ אינטגרציה עם Google Maps
- ✅ מסכי הצלחה/כישלון

## שלבי הטופס

### שלב 1 - מסך פתיחה
- לוגו החברה
- תיאור המשרה
- פרטי משרה (מיקום, שכר)
- מפה של מיקום החברה

### שלב 2 - סינון
- דרישות מקדמיות
- שאלות סינון
- תשובות מסוגים שונים (בחירה/טקסט/מספר)

### שלב 3 - תנאים
- פרטי שכר
- שעות עבודה
- הטבות
- אישור תנאים

### שלב 4 - פרטים אישיים
- שם מלא
- טלפון
- אימייל (אופציונלי)
- עיר מגורים
- שליחה לשרת

## התקנה

### 1. התקנת Dependencies
```powershell
cd frontend
npm install
```

### 2. הגדרת משתני סביבה
```powershell
# העתק את .env.example ל-.env
copy .env.example .env

# ערוך את .env:
# VITE_API_URL=http://localhost:8000
# VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

## הפעלה

### מצב פיתוח
```powershell
npm run dev
```

האפליקציה תעלה על: `http://localhost:3000`

### בנייה לפרודקשן
```powershell
npm run build
```

קבצי הבנייה יהיו בתיקייה `dist/`

### תצוגה מקדימה של Build
```powershell
npm run preview
```

## מבנה הפרויקט
```
frontend/
├── public/                 # קבצים סטטיים
├── src/
│   ├── components/
│   │   ├── FormSteps/     # קומפוננטות שלבי הטופס
│   │   │   ├── Step1Welcome.jsx
│   │   │   ├── Step2Screening.jsx
│   │   │   ├── Step3Terms.jsx
│   │   │   ├── Step4Details.jsx
│   │   │   ├── StepSuccess.jsx
│   │   │   └── StepFailed.jsx
│   │   └── shared/        # קומפוננטות משותפות
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   ├── services/
│   │   └── api.js         # API calls
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## שימוש

### פתיחת טופס
הטופס נפתח עם URL המכיל את ה-ID של הטופס:
```
http://localhost:3000/?id=FORM_UNIQUE_ID
```

### Flow של המשתמש
1. **שלב 1**: צפייה בפרטי המשרה והחברה
2. **שלב 2**: מעבר על דרישות מקדמיות ומענה על שאלות סינון
3. **שלב 3**: קריאת תנאי העבודה ואישור
4. **שלב 4**: מילוי פרטים אישיים ושליחה
5. **הצלחה/כישלון**: מסך סיכום

## עיצוב

### צבעים
- **Primary**: כחול (#0ea5e9)
- **Secondary**: סגול (#764ba2)
- **Success**: ירוק
- **Danger**: אדום

### פונטים
- **Hebrew**: Assistant (Google Fonts)
- **Fallback**: Arial, sans-serif

### Responsive
- **Mobile**: Full-screen bubble
- **Desktop**: Card מרכזי עם רקע gradient

## אינטגרציה עם Backend

### API Endpoints
- `GET /api/forms/{id}` - קבלת טופס
- `POST /api/forms/submit` - שליחת טופס ממולא

### תבנית Data
```javascript
{
  form_unique_id: "abc123",
  screening_answers: {
    "q1": true,
    "q2": "answer"
  },
  candidate_details: {
    full_name: "ישראל ישראלי",
    phone_number: "0501234567",
    email: "israel@example.com",
    city: "תל אביב"
  },
  accepted_terms: true
}
```

## Customization

### שינוי צבעים
ערוך `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // צבעים שלך
      }
    }
  }
}
```

### שינוי אנימציות
ערוך את תצורת Framer Motion ב-`App.jsx`

## בעיות נפוצות

### הטופס לא נטען
- וודא שה-Backend רץ
- בדוק את `VITE_API_URL` ב-.env
- בדוק את ה-Console לשגיאות

### המפה לא מוצגת
- וודא שיש `VITE_GOOGLE_MAPS_API_KEY` תקין
- וודא שה-API Key מאושר ל-Maps Embed API

### בעיות RTL
- וודא ש-`dir="rtl"` קיים ב-HTML
- בדוק את ה-CSS ל-text alignment

## Browser Support
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Performance
- Code splitting אוטומטי עם Vite
- Lazy loading לתמונות
- Optimized bundle size

## רישיון
Proprietary - All rights reserved

## תמיכה
לתמיכה טכנית: support@yourcompany.com
