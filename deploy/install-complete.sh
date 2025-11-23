#!/bin/bash
# 🚀 התקנה אוטומטית מלאה - Employee Screening System
# הרץ סקריפט זה והכל יעבוד!

set -e

echo "🎯 התקנה אוטומטית מלאה - Employee Screening System"
echo "================================================"

# בדיקת הרשאות root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ הרץ עם sudo!"
    exit 1
fi

# עדכון מערכת
echo "📦 מעדכן מערכת..."
apt-get update -qq
apt-get upgrade -y -qq

# התקנת תלויות בסיסיות
echo "📦 מתקין תלויות..."
apt-get install -y -qq \
    python3.10 \
    python3.10-venv \
    python3-pip \
    nodejs \
    npm \
    nginx \
    git \
    curl \
    chromium-browser \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils

# יצירת משתמש לשירות
echo "👤 יוצר משתמש לשירות..."
if ! id -u employee-app > /dev/null 2>&1; then
    useradd -r -s /bin/bash -d /opt/employee-screening employee-app
fi

# יצירת תיקיות
echo "📁 יוצר תיקיות..."
mkdir -p /opt/employee-screening/{backend,frontend,whatsapp-server}
mkdir -p /var/lib/employee-screening/{data,pdfs,uploads}
mkdir -p /var/log/employee-screening

# הגדרת הרשאות
chown -R employee-app:employee-app /opt/employee-screening
chown -R employee-app:employee-app /var/lib/employee-screening
chown -R employee-app:employee-app /var/log/employee-screening

# העתקת קבצים
echo "📋 מעתיק קבצים..."
cp -r ~/employee-screening-deploy/backend/* /opt/employee-screening/backend/
cp -r ~/employee-screening-deploy/frontend/* /opt/employee-screening/frontend/
cp -r ~/employee-screening-deploy/whatsapp-server/* /opt/employee-screening/whatsapp-server/

# התקנת Backend
echo "🐍 מתקין Backend..."
cd /opt/employee-screening/backend
sudo -u employee-app python3.10 -m venv venv
sudo -u employee-app ./venv/bin/pip install --upgrade pip
sudo -u employee-app ./venv/bin/pip install -r requirements.txt

# יצירת קובץ .env
echo "יוצר קובץ הגדרות..."
cat > /opt/employee-screening/backend/.env << 'EOL'
DATABASE_URL=sqlite:////var/lib/employee-screening/data/job_worker.db
USE_WHATSAPP_WEB=true
USE_EMAIL=false
WHATSAPP_WEB_SERVER_URL=http://localhost:3001
COMPANY_WHATSAPP_PHONE=972XXXXXXXXX
FRONTEND_URL=http://16.171.37.19
COMPANY_NAME=Your Company
JOB_TITLE=Job Position
UPLOAD_DIR=/var/lib/employee-screening/uploads
PDF_OUTPUT_DIR=/var/lib/employee-screening/pdfs
SECRET_KEY=change-this-in-production-$(openssl rand -hex 32)
EOL

chown employee-app:employee-app /opt/employee-screening/backend/.env

# התקנת WhatsApp Server
echo "מתקין WhatsApp Server..."
cd /opt/employee-screening/whatsapp-server
sudo -u employee-app npm install

# בניית Frontend
echo "בונה Frontend..."
cd /opt/employee-screening/frontend
sudo -u employee-app npm install
sudo -u employee-app VITE_API_URL=http://16.171.37.19:8000 npm run build

# יצירת systemd service ל-Backend
echo "יוצר systemd services..."
cat > /etc/systemd/system/employee-backend.service << 'EOL'
[Unit]
Description=Employee Screening Backend API
After=network.target

[Service]
Type=simple
User=employee-app
WorkingDirectory=/opt/employee-screening/backend
Environment="PATH=/opt/employee-screening/backend/venv/bin"
ExecStart=/opt/employee-screening/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10
StandardOutput=append:/var/log/employee-screening/backend.log
StandardError=append:/var/log/employee-screening/backend-error.log

[Install]
WantedBy=multi-user.target
EOL

# יצירת systemd service ל-WhatsApp
cat > /etc/systemd/system/employee-whatsapp.service << 'EOL'
[Unit]
Description=Employee Screening WhatsApp Web Server
After=network.target

[Service]
Type=simple
User=employee-app
WorkingDirectory=/opt/employee-screening/whatsapp-server
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=append:/var/log/employee-screening/whatsapp.log
StandardError=append:/var/log/employee-screening/whatsapp-error.log

[Install]
WantedBy=multi-user.target
EOL

# הגדרת NGINX ל-Frontend
echo "מגדיר NGINX..."
cat > /etc/nginx/sites-available/employee-screening << 'EOL'
server {
    listen 80;
    server_name 16.171.37.19;

    # Frontend
    location / {
        root /opt/employee-screening/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend Docs
    location /docs {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /openapi.json {
        proxy_pass http://localhost:8000;
    }
}
EOL

ln -sf /etc/nginx/sites-available/employee-screening /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# בדיקת תצורת NGINX
nginx -t

# טעינה מחדש של systemd
echo "טוען שירותים..."
systemctl daemon-reload

# הפעלת השירותים
echo "מפעיל שירותים..."
systemctl enable employee-backend
systemctl enable employee-whatsapp
systemctl enable nginx

systemctl start employee-backend
systemctl start employee-whatsapp
systemctl restart nginx

# המתנה קצרה
sleep 3

# בדיקת סטטוס
echo ""
echo "ההתקנה הושלמה!"
echo "===================="
echo ""
echo "סטטוס שירותים:"
systemctl status employee-backend --no-pager -l | head -5
systemctl status employee-whatsapp --no-pager -l | head -5
systemctl status nginx --no-pager -l | head -5

echo ""
echo "הגישה למערכת:"
echo "   Frontend: http://16.171.37.19"
echo "   Backend API: http://16.171.37.19:8000/docs"
echo "   WhatsApp Status: http://16.171.37.19:3001/status"
echo ""
echo "לסריקת QR Code של WhatsApp:"
echo "   sudo journalctl -u employee-whatsapp -f"
echo ""
echo "לוגים:"
echo "   Backend: sudo tail -f /var/log/employee-screening/backend.log"
echo "   WhatsApp: sudo tail -f /var/log/employee-screening/whatsapp.log"
echo ""
