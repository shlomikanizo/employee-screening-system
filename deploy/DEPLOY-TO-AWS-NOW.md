# 🚀 פריסה אוטומטית ל-AWS - הוראות שלב אחר שלב

## ✅ פרטי השרת שלך:
- **IP**: 16.171.37.19
- **Domain**: ec2-16-171-37-19.eu-north-1.compute.amazonaws.com
- **Key**: omega-key.pem
- **User**: ubuntu
- **Region**: Stockholm (eu-north-1)

---

## 🎯 פריסה ב-4 שלבים פשוטים

### שלב 1️⃣: הכן את הקוד (במחשב Windows שלך)

```powershell
# פתח PowerShell בתור Administrator
cd "C:\Users\User\OmegaGPT\JOB WORKER"

# ארכב את הקוד
tar -czf employee-screening-deploy.tar.gz backend frontend whatsapp-server deploy

# בדוק שהקובץ נוצר
ls -l employee-screening-deploy.tar.gz
```

---

### שלב 2️⃣: העלה את הקוד ל-AWS

```powershell
# ודא שיש לך את omega-key.pem באותה תיקייה
# אם לא, העתק אותו לכאן

# העלה את הקובץ (זה ייקח כ-30 שניות)
scp -i "omega-key.pem" employee-screening-deploy.tar.gz ubuntu@16.171.37.19:~/
```

---

### שלב 3️⃣: התחבר לשרת והתקן

```powershell
# התחבר ל-EC2
ssh -i "omega-key.pem" ubuntu@16.171.37.19
```

**עכשיו אתה בשרת!** הרץ:

```bash
# חלץ את הקבצים
tar -xzf employee-screening-deploy.tar.gz

# הפוך את הסקריפט להרצה
chmod +x deploy/install-complete.sh

# ⚠️ חשוב: ערוך את מספר הטלפון לפני ההתקנה!
nano deploy/install-complete.sh

# חפש את השורה:
# COMPANY_WHATSAPP_PHONE=972XXXXXXXXX
# ושנה ל:
# COMPANY_WHATSAPP_PHONE=972YOUR-PHONE-NUMBER

# שמור: Ctrl+O, Enter, Ctrl+X

# הרץ התקנה אוטומטית (ייקח 5-10 דקות)
sudo ./deploy/install-complete.sh
```

**הסקריפט יעשה הכל אוטומטית:**
- ✅ התקנת Python, Node.js, NGINX
- ✅ יצירת משתמש ותיקיות
- ✅ התקנת Backend, WhatsApp, Frontend
- ✅ הגדרת שירותים אוטומטיים
- ✅ הגדרת NGINX
- ✅ הפעלת הכל!

---

### שלב 4️⃣: סרוק QR Code של WhatsApp

אחרי ההתקנה, הרץ:

```bash
# צפה בלוגים של WhatsApp
sudo journalctl -u employee-whatsapp -f
```

**תראה קוד QR בטרמינל!**

1. פתח WhatsApp בטלפון
2. לחץ על ⋮ (שלוש נקודות) → Linked Devices
3. לחץ "Link a Device"
4. סרוק את ה-QR Code מהטרמינל

✅ ברגע שסרקת - WhatsApp מחובר!

לצאת מהלוגים: `Ctrl+C`

---

## 🎉 סיימת! המערכת עובדת!

### 🌐 גש למערכת:

- **Frontend (האתר)**: http://16.171.37.19
- **Backend API (תיעוד)**: http://16.171.37.19:8000/docs
- **WhatsApp Status**: http://16.171.37.19:3001/status

---

## ⚙️ פקודות שימושיות

### בדיקת סטטוס שירותים:
```bash
sudo systemctl status employee-backend
sudo systemctl status employee-whatsapp
sudo systemctl status nginx
```

### צפייה בלוגים:
```bash
# Backend
sudo tail -f /var/log/employee-screening/backend.log

# WhatsApp
sudo tail -f /var/log/employee-screening/whatsapp.log

# או בלוגים של systemd:
sudo journalctl -u employee-backend -f
sudo journalctl -u employee-whatsapp -f
```

### הפעלה מחדש של שירות:
```bash
sudo systemctl restart employee-backend
sudo systemctl restart employee-whatsapp
sudo systemctl restart nginx
```

### עצירת שירות:
```bash
sudo systemctl stop employee-backend
sudo systemctl stop employee-whatsapp
```

### הפעלת שירות:
```bash
sudo systemctl start employee-backend
sudo systemctl start employee-whatsapp
```

---

## 🔒 Security Groups ב-AWS

**חשוב!** פתח את ה-Ports הבאים ב-AWS Console:

1. היכנס ל-AWS Console → EC2
2. בחר את ה-Instance → Security → Security Groups
3. לחץ "Edit inbound rules"
4. הוסף:

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | My IP (או Anywhere) |
| HTTP | 80 | Anywhere (0.0.0.0/0) |
| Custom TCP | 8000 | Anywhere (0.0.0.0/0) |
| Custom TCP | 3001 | Anywhere (0.0.0.0/0) |

---

## 🔧 עדכון הקוד (אחרי שינויים)

אם עשית שינויים בקוד במחשב שלך:

```powershell
# במחשב Windows
cd "C:\Users\User\OmegaGPT\JOB WORKER"
tar -czf employee-screening-deploy.tar.gz backend frontend whatsapp-server
scp -i "omega-key.pem" employee-screening-deploy.tar.gz ubuntu@16.171.37.19:~/
```

```bash
# בשרת
tar -xzf employee-screening-deploy.tar.gz
sudo cp -r backend/* /opt/employee-screening/backend/
sudo cp -r frontend/* /opt/employee-screening/frontend/

# עדכן Frontend
cd /opt/employee-screening/frontend
sudo -u employee-app VITE_API_URL=http://16.171.37.19:8000 npm run build

# הפעל מחדש
sudo systemctl restart employee-backend
sudo systemctl restart nginx
```

---

## ✅ הכל עובד אוטומטית!

- ✅ **Backend רץ אוטומטית** בהפעלת השרת
- ✅ **WhatsApp רץ אוטומטית** בהפעלת השרת  
- ✅ **Frontend מוגש דרך NGINX** (פורט 80)
- ✅ **הטפסים נשמרים** ב-SQLite (לא נמחקים!)
- ✅ **WhatsApp שולח הודעות** אוטומטית
- ✅ **PDF נוצרים** אוטומטית

---

## 📞 זקוק לעזרה?

בדוק את הלוגים:
```bash
sudo tail -f /var/log/employee-screening/backend.log
sudo tail -f /var/log/employee-screening/whatsapp.log
```

או:
```bash
sudo journalctl -u employee-backend -n 50
sudo journalctl -u employee-whatsapp -n 50
```

---

## 🎯 סיימת! המערכת פועלת ב-AWS! 🚀
