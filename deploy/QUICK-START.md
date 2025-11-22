# ⚡ התחלה מהירה - AWS ללא Docker

## 📦 מה אתה צריך:

- ✅ EC2 Instance (t2.small מומלץ, t2.micro יעבוד)
- ✅ Ubuntu 20.04 / 22.04
- ✅ גישת SSH
- ✅ Security Group עם Ports: 22, 8000, 3000, 3001

---

## 🚀 פריסה ב-3 שלבים

### שלב 1️⃣: העתקת הקוד (במחשב שלך)

```powershell
# PowerShell במחשב Windows שלך
cd "C:\Users\User\OmegaGPT\JOB WORKER"

# ארכב את הקוד
tar -czf employee-screening.tar.gz backend frontend whatsapp-server deploy

# העלה ל-AWS (החלף YOUR-KEY.pem ו-YOUR-IP)
scp -i "path\to\YOUR-KEY.pem" employee-screening.tar.gz ubuntu@YOUR-IP:~/
```

---

### שלב 2️⃣: התקנה על AWS (בשרת)

```bash
# התחבר ל-EC2
ssh -i YOUR-KEY.pem ubuntu@YOUR-IP

# חלץ את הקוד
tar -xzf employee-screening.tar.gz

# הרץ התקנה אוטומטית
chmod +x deploy/setup-aws.sh
sudo ./deploy/setup-aws.sh

# העתק קבצים
sudo mkdir -p /opt/employee-screening
sudo cp -r backend frontend whatsapp-server deploy /opt/employee-screening/
sudo chmod +x /opt/employee-screening/deploy/*.sh

# צור תיקיות נתונים
sudo mkdir -p /var/lib/employee-screening/{data,pdfs,uploads}
sudo chown -R ubuntu:ubuntu /var/lib/employee-screening
```

---

### שלב 3️⃣: הגדר והפעל (בשרת)

```bash
# ערוך .env
cd /opt/employee-screening/backend
cp ../deploy/.env.aws.example .env
nano .env

# עדכן:
# - COMPANY_WHATSAPP_PHONE=972YOUR-NUMBER
# - FRONTEND_URL=http://YOUR-IP:3000
# - COMPANY_NAME=השם שלך
```

**הפעל את השירותים:**

```bash
# טרמינל 1: Backend
cd /opt/employee-screening
bash deploy/start-backend.sh

# טרמינל 2: WhatsApp (פתח SSH נוסף)
ssh -i YOUR-KEY.pem ubuntu@YOUR-IP
cd /opt/employee-screening
bash deploy/start-whatsapp.sh
# ⚠️ סרוק את קוד ה-QR שיופיע!

# טרמינל 3: Frontend (פתח SSH נוסף)
ssh -i YOUR-KEY.pem ubuntu@YOUR-IP
cd /opt/employee-screening/frontend
npm install
VITE_API_URL=http://YOUR-IP:8000 npm run dev -- --host 0.0.0.0 --port 3000
```

---

## ✅ בדיקה

1. **Backend API**: `http://YOUR-IP:8000/docs`
2. **Frontend**: `http://YOUR-IP:3000`
3. **WhatsApp Status**: `http://YOUR-IP:3001/status`

---

## 🔒 Security Group (AWS Console)

פתח את ה-Ports הבאים ב-Inbound Rules:

| Port | שימוש |
|------|-------|
| 22 | SSH |
| 8000 | Backend API |
| 3000 | Frontend |
| 3001 | WhatsApp (אופציונלי) |

---

## 🔄 שירותים אוטומטיים

אם אתה רוצה שהשירותים יעלו אוטומטית:

```bash
# יצירת systemd services
sudo nano /etc/systemd/system/employee-backend.service
```

הוסף:
```ini
[Unit]
Description=Employee Screening Backend
After=network.target

[Service]
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
sudo systemctl enable employee-backend
sudo systemctl start employee-backend
```

חזור על זה ל-WhatsApp ו-Frontend.

---

## 🎯 סיימת!

- ✅ **הטפסים לא נמחקים** (SQLite בתיקייה קבועה)
- ✅ **WhatsApp Web עובד**
- ✅ **שליטה מלאה**
- ✅ **ללא עלויות נוספות**

**זקוק לעזרה?** בדוק את `AWS-DEPLOYMENT-GUIDE.md` להוראות מפורטות.
