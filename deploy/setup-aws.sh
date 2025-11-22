#!/bin/bash
# סקריפט התקנה ל-AWS EC2 (Ubuntu)
# הרץ כ-root או עם sudo

set -e

echo "🚀 מתחיל התקנה על AWS EC2..."

# עדכון מערכת
echo "📦 מעדכן מערכת..."
apt-get update
apt-get upgrade -y

# התקנת Python 3.10
echo "🐍 מתקין Python 3.10..."
apt-get install -y python3.10 python3.10-venv python3-pip

# התקנת Node.js 18.x
echo "📦 מתקין Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# התקנת תלויות נוספות
echo "📦 מתקין תלויות נוספות..."
apt-get install -y chromium-browser git nginx

# יצירת תיקיות
echo "📁 יוצר תיקיות..."
mkdir -p /opt/employee-screening/{backend,frontend,whatsapp-server}
mkdir -p /var/lib/employee-screening/{data,pdfs,uploads}

echo "✅ התקנה הושלמה!"
echo ""
echo "השלבים הבאים:"
echo "1. העתק את הקוד לתיקייה /opt/employee-screening"
echo "2. הרץ את סקריפט start-services.sh"
