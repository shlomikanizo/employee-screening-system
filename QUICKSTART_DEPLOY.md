# ⚡ Deploy מהיר - 5 צעדים

---

## ✅ לפני שמתחילים:

צור חשבונות (חינם!) ב:
1. **GitHub**: https://github.com/signup
2. **Netlify**: https://app.netlify.com/signup
3. **Render**: https://dashboard.render.com/register

---

## 🚀 5 צעדים לאוויר:

### 1️⃣ העלה לGitHub (5 דקות)

```powershell
cd "C:\Users\User\OmegaGPT\JOB WORKER"

git init
git add .
git commit -m "Initial commit"

# החלף YOUR_USERNAME בשם המשתמש שלך
git remote add origin https://github.com/YOUR_USERNAME/employee-screening.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Deploy Frontend לNetlify (3 דקות)

1. גש ל: https://app.netlify.com
2. **"Add new site"** → **"Import an existing project"**
3. בחר **GitHub** → בחר את ה-repo
4. הגדרות:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
5. **Deploy!**

**📝 שמור את ה-URL**: `https://YOUR-SITE.netlify.app`

---

### 3️⃣ Deploy Backend לRender (5 דקות)

1. גש ל: https://dashboard.render.com
2. **"New +"** → **"Web Service"**
3. בחר את ה-GitHub repo
4. הגדרות:
   ```
   Name: employee-screening-backend
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

---

### 4️⃣ הוסף Environment Variables ב-Render

לחץ **"Environment"** והוסף:

```env
APP_NAME=Employee Screening Form
DEBUG=False
DATABASE_URL=sqlite:///./job_worker.db
FRONTEND_URL=https://YOUR-SITE.netlify.app
SECRET_KEY=your-generated-secret-key
COMPANY_NAME=Your Company
COMPANY_LAT=32.008679
COMPANY_LNG=34.749669
```

לחץ **"Save Changes"** → Backend יעשה deploy

**📝 שמור את ה-URL**: `https://YOUR-BACKEND.onrender.com`

---

### 5️⃣ חבר את Frontend ל-Backend

1. חזור ל-**Netlify Dashboard**
2. **Site settings** → **Environment variables**
3. הוסף:
   ```
   Key: VITE_API_URL
   Value: https://YOUR-BACKEND.onrender.com
   ```
4. **Deploys** → **Trigger deploy**

---

## 🎉 סיימת!

**המערכת שלך חיה באינטרנט!**

✅ Frontend: `https://YOUR-SITE.netlify.app`  
✅ Backend: `https://YOUR-BACKEND.onrender.com`  
✅ Admin: `https://YOUR-SITE.netlify.app/admin`

---

## 📱 שימוש:

1. פתח Admin: `https://YOUR-SITE.netlify.app/admin`
2. צור טופס חדש
3. העתק את הקישור
4. **שלח לכל אחד** - זה יעבוד מכל מקום! 🌍

---

## 🔧 אם משהו לא עובד:

### Frontend לא עולה:
- בדוק **Netlify → Deploys → Function log**

### Backend לא עולה:
- בדוק **Render → Logs**
- וודא שכל Environment Variables הוגדרו

### Frontend לא מתחבר לBackend:
- וודא ש-`VITE_API_URL` ב-Netlify = Backend URL ב-Render
- וודא ש-`FRONTEND_URL` ב-Render = Frontend URL ב-Netlify

---

## 📚 מדריך מפורט:

ראה `DEPLOYMENT.md` להסבר מלא עם screenshots ופתרון בעיות.

---

## 💡 טיפים:

### הוסף הודעות Email:

ב-Render Environment, הוסף:
```env
USE_EMAIL=true
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

### שנה שם אתר:

- **Netlify**: Site settings → Change site name
- **Render**: Settings → Name

---

## 🎯 הצלחה!

עכשיו המערכת שלך זמינה לכל העולם! 🌍
