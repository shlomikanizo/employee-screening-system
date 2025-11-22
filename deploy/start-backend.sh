#!/bin/bash
# הפעלת Backend

cd /opt/employee-screening/backend

# יצירת סביבה וירטואלית (אם לא קיימת)
if [ ! -d "venv" ]; then
    python3.10 -m venv venv
fi

# הפעלת הסביבה
source venv/bin/activate

# התקנת תלויות
pip install -r requirements.txt

# הרצת השרת
uvicorn app.main:app --host 0.0.0.0 --port 8000
