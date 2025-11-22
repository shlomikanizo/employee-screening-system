#!/bin/bash
# הפעלת WhatsApp Web Server

cd /opt/employee-screening/whatsapp-server

# התקנת תלויות (אם לא מותקנות)
if [ ! -d "node_modules" ]; then
    npm install
fi

# הרצת השרת
node server.js
