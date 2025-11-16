# 🚀 התחלה מהירה - 5 דקות

מדריך מהיר להפעלת מערכת טופס סינון עובדים.

## צעד 1: התקנה (3 דקות) ⚙️

```powershell
# הרץ את סקריפט ההתקנה המלא
setup.bat
```

הסקריפט יבצע:
- ✅ יצירת virtual environment
- ✅ התקנת Python packages
- ✅ התקנת Node.js packages
- ✅ יצירת קבצי .env

## צעד 2: הגדרת API Keys (1 דקה) 🔑

### Backend
ערוך `backend\.env`:
```env
# חובה להפעלה בסיסית
SECRET_KEY=my-super-secret-key-change-this

# אופציונלי (לפיצ'רים מלאים)
WHATSAPP_ACCESS_TOKEN=your_token_here
GOOGLE_MAPS_API_KEY=your_key_here
```

### Frontend
ערוך `frontend\.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

**💡 טיפ**: אפשר להתחיל ללא WhatsApp/Maps - המערכת תעבוד ללא התכונות האלו.

## צעד 3: הפעלה (30 שניות) ▶️

### חלון 1 - Backend
```powershell
start_backend.bat
```
✅ השרת יעלה על: `http://localhost:8000`

### חלון 2 - Frontend
```powershell
start_frontend.bat
```
✅ האפליקציה תעלה על: `http://localhost:3000`

## צעד 4: יצירת טופס דמו (30 שניות) 📝

```powershell
cd backend
venv\Scripts\activate
python create_demo_form.py
```

תקבל פלט דומה ל:
```
✅ טופס נוצר בהצלחה!
📝 Form ID: abc12345
🔗 קישור לטופס: http://localhost:3000/?id=abc12345
```

## צעד 5: בדיקה (1 דקה) ✨

1. **העתק את הקישור** מהפלט
2. **פתח בדפדפן** (רצוי במובייל או במצב responsive)
3. **עבור את השלבים**:
   - שלב 1: צפה בפרטי המשרה
   - שלב 2: ענה על שאלות הסינון
   - שלב 3: אשר תנאים
   - שלב 4: מלא פרטים אישיים
   - הצלחה! 🎉

---

## 🎯 זהו! המערכת רצה

### מה עכשיו?

#### לשימוש מקומי
- ✅ המערכת מוכנה לשימוש מקומי
- ✅ נתונים נשמרים ב-SQLite
- ✅ PDF's נוצרים בתיקייה `backend/pdfs/`

#### להפעלה מלאה עם WhatsApp
1. **קבל API Token** מ-[Meta for Developers](https://developers.facebook.com/)
2. **הוסף ל-.env**: `WHATSAPP_ACCESS_TOKEN=your_token`
3. **הגדר Webhook** ב-Meta Console
4. **שלח הזמנות** למועמדים דרך WhatsApp

#### להוספת Google Maps
1. **קבל API Key** מ-[Google Cloud Console](https://console.cloud.google.com/)
2. **הוסף ל-.env**: `GOOGLE_MAPS_API_KEY=your_key`
3. **המפה תופיע** בשלב 1 של הטופס

---

## 🆘 עזרה מהירה

### Backend לא עולה?
```powershell
# בדוק Python version
python --version  # צריך להיות 3.10

# התקן requirements שוב
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend לא עולה?
```powershell
# בדוק Node version
node --version  # צריך להיות 16+

# התקן dependencies שוב
cd frontend
npm install
```

### הטופס לא נטען?
- ✅ וודא Backend רץ על port 8000
- ✅ בדוק את Console לשגיאות
- ✅ וודא שה-Form ID נכון

---

## 📚 למידע נוסף

- **תיעוד מלא**: `README.md`
- **מבנה הפרויקט**: `RULES.md`
- **תכנית עבודה**: `PLAN.md`
- **Backend API**: `backend/README.md`
- **Frontend**: `frontend/README.md`

---

## 🎓 דוגמאות קוד

### יצירת טופס מותאם אישית
```python
import requests

form_data = {
    "job_title": "המשרה שלך",
    "job_description": "תיאור...",
    # ... שאר השדות
}

response = requests.post("http://localhost:8000/api/forms/", json=form_data)
form_id = response.json()["unique_id"]
print(f"http://localhost:3000/?id={form_id}")
```

### שליחת הזמנה בוואטסאפ
```python
import requests

requests.post(
    "http://localhost:8000/api/whatsapp/send-invitation",
    json={
        "phone_number": "+972501234567",
        "form_url": "http://localhost:3000/?id=abc123"
    }
)
```

---

**🎉 בהצלחה עם המערכת החדשה שלך!**

נבנה עם ❤️ במיוחד עבורך
