# 🚀 הוראות פריסה ל-AWS EC2

## שלב 1: הכנה מקומית

### 1.1 ארכב את הקוד
```bash
# במחשב המקומי שלך (Windows)
cd "c:\Users\User\OmegaGPT\JOB WORKER"
tar -czf employee-screening.tar.gz backend frontend whatsapp-server
```

### 1.2 העלה את הקובץ ל-AWS
```bash
# החלף YOUR-KEY.pem ו-YOUR-IP
scp -i YOUR-KEY.pem employee-screening.tar.gz ubuntu@YOUR-IP:~/
```

---

## שלב 2: התקנה על השרת

### 2.1 התחבר ל-EC2
```bash
ssh -i YOUR-KEY.pem ubuntu@YOUR-IP
```

### 2.2 הרץ התקנה
```bash
# העבר את קובץ ההתקנה
cd ~
tar -xzf employee-screening.tar.gz

# הפוך את הסקריפטים להרצה
chmod +x deploy/*.sh

# הרץ התקנה (דורש sudo)
sudo ./deploy/setup-aws.sh
```

### 2.3 העתק את הקוד למיקום הסופי
```bash
sudo cp -r backend /opt/employee-screening/
sudo cp -r frontend /opt/employee-screening/
sudo cp -r whatsapp-server /opt/employee-screening/
sudo cp deploy/*.sh /opt/employee-screening/
```

---

## שלב 3: הגדרת משתני סביבה

### 3.1 ערוך את ה-.env
```bash
sudo nano /opt/employee-screening/backend/.env
```

ערוך את המשתנים הבאים:
```env
DATABASE_URL=sqlite:////var/lib/employee-screening/data/job_worker.db
USE_WHATSAPP_WEB=true
USE_EMAIL=false
WHATSAPP_WEB_SERVER_URL=http://localhost:3001
COMPANY_WHATSAPP_PHONE=972XXXXXXXXX
FRONTEND_URL=http://YOUR-IP:3000
```

---

## שלב 4: הרצת השירותים

### 4.1 הפעל את Backend
```bash
# בטרמינל 1
cd /opt/employee-screening
sudo bash start-backend.sh
```

### 4.2 הפעל את WhatsApp Server
```bash
# בטרמינל 2 (פתח SSH נוסף)
cd /opt/employee-screening
sudo bash start-whatsapp.sh
```

⚠️ **חשוב**: לאחר הפעלת WhatsApp Server, **סרוק את קוד QR** שיופיע בטרמינל.

### 4.3 הפעל את Frontend
```bash
# בטרמינל 3
cd /opt/employee-screening/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

---

## שלב 5: פתיחת Ports ב-AWS Security Group

1. היכנס ל-AWS Console
2. עבור ל-EC2 → Security Groups
3. בחר את ה-Security Group של ה-Instance
4. הוסף Inbound Rules:
   - Port 8000 (Backend)
   - Port 3000 (Frontend)
   - Port 3001 (WhatsApp Server) - **רק אם צריך גישה חיצונית**

---

## שלב 6: בדיקה

### 6.1 בדוק Backend
```
http://YOUR-IP:8000/docs
```

### 6.2 בדוק Frontend
```
http://YOUR-IP:3000
```

---

## 🔧 פתרון בעיות

### Backend לא עולה?
```bash
# בדוק לוגים
cd /opt/employee-screening/backend
source venv/bin/activate
python -m app.main
```

### WhatsApp לא עובד?
```bash
# בדוק שהשרת רץ
curl http://localhost:3001/status
```

### טפסים נמחקים?
ודא ש-DATABASE_URL מצביע על תיקייה קבועה:
```
DATABASE_URL=sqlite:////var/lib/employee-screening/data/job_worker.db
```

---

## 🎯 שירותים אוטומטיים (systemd)

אם אתה רוצה שהשירותים יעלו אוטומטית בהפעלה:

```bash
# צור קובץ systemd
sudo nano /etc/systemd/system/employee-screening-backend.service
```

הוסף:
```ini
[Unit]
Description=Employee Screening Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/employee-screening/backend
ExecStart=/opt/employee-screening/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

הפעל:
```bash
sudo systemctl daemon-reload
sudo systemctl enable employee-screening-backend
sudo systemctl start employee-screening-backend
```

---

## 📞 צור קשר

אם יש בעיות, בדוק:
1. לוגים של Backend
2. לוגים של WhatsApp Server
3. Security Groups פתוחים
4. משתני סביבה מוגדרים נכון
