"""
סקריפט ליצירת טופס דמו
משמש לבדיקות ופיתוח
"""
import requests
import json

# כתובת ה-API
API_URL = "http://localhost:8000"

# נתוני טופס לדוגמא
demo_form = {
    "job_title": "מפתח Full Stack",
    "job_description": "אנחנו מחפשים מפתח/ת Full Stack מוכשר/ת להצטרף לצוות הפיתוח שלנו.\n\nהתפקיד כולל עבודה עם טכנולוגיות מתקדמות, פיתוח תכונות חדשות, ושיפור מערכות קיימות.",
    "job_location": "תל אביב",
    "salary_range": "15,000-20,000 ₪",
    
    "company_name": "Tech Solutions Ltd",
    "company_address": "רחוב הארבעה 7, תל אביב",
    "company_lat": 32.0853,
    "company_lng": 34.7818,
    "company_logo_url": "https://via.placeholder.com/200x100/0ea5e9/ffffff?text=TechSolutions",
    
    "screening_questions": [
        {
            "id": "q1",
            "question": "האם יש לך ניסיון של לפחות שנתיים בפיתוח Full Stack?",
            "type": "boolean",
            "required": True,
            "options": None,
            "correct_answer": True
        },
        {
            "id": "q2",
            "question": "באילו טכנולוגיות יש לך ניסיון? (בחר את המתאימה ביותר)",
            "type": "select",
            "required": True,
            "options": [
                "Python + React",
                "Node.js + Vue",
                "Java + Angular",
                "אחר"
            ],
            "correct_answer": None  # כל תשובה תקינה
        },
        {
            "id": "q3",
            "question": "האם את/ה יכול/ה לעבוד במשרה מלאה?",
            "type": "boolean",
            "required": True,
            "options": None,
            "correct_answer": True
        },
        {
            "id": "q4",
            "question": "כמה שנות ניסיון יש לך בתכנות?",
            "type": "number",
            "required": True,
            "options": None,
            "correct_answer": None
        }
    ],
    
    "requirements": [
        {
            "text": "ניסיון של לפחות שנתיים בפיתוח תוכנה",
            "is_mandatory": True
        },
        {
            "text": "שליטה בשפת תכנות אחת לפחות",
            "is_mandatory": True
        },
        {
            "text": "יכולת עבודה בצוות",
            "is_mandatory": True
        },
        {
            "text": "זמינות למשרה מלאה",
            "is_mandatory": True
        }
    ],
    
    "terms_and_conditions": {
        "salary": "15,000-20,000 ₪ ברוטו לחודש (בהתאם לניסיון)",
        "work_hours": "משרה מלאה, 9:00-18:00, 5 ימים בשבוע",
        "benefits": [
            "ביטוח בריאות מקיף",
            "קרן השתלמות",
            "אופציות לעובדים",
            "ימי חופשה נוספים",
            "אפשרויות עבודה היברידית",
            "תקציב השתלמות שנתי"
        ],
        "additional_info": "החברה שלנו מציעה סביבת עבודה דינמית ומאתגרת עם אפשרויות קידום."
    }
}


def create_demo_form():
    """יצירת טופס דמו"""
    try:
        print("🚀 יוצר טופס דמו...")
        print(f"📡 שולח בקשה ל-{API_URL}/api/forms/")
        
        response = requests.post(
            f"{API_URL}/api/forms/",
            json=demo_form,
            headers={"Content-Type": "application/json"}
        )
        
        response.raise_for_status()
        
        data = response.json()
        unique_id = data.get('unique_id')
        
        print("✅ טופס נוצר בהצלחה!")
        print(f"📝 Form ID: {unique_id}")
        print(f"🔗 קישור לטופס: http://localhost:3000/?id={unique_id}")
        print(f"\n📋 פרטי הטופס:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        return unique_id
        
    except requests.exceptions.ConnectionError:
        print("❌ שגיאה: לא ניתן להתחבר לשרת")
        print("   וודא שהשרת רץ על http://localhost:8000")
    except requests.exceptions.HTTPError as e:
        print(f"❌ שגיאת HTTP: {e}")
        print(f"   תגובה: {e.response.text}")
    except Exception as e:
        print(f"❌ שגיאה: {str(e)}")


if __name__ == "__main__":
    print("=" * 60)
    print("         יצירת טופס דמו - Employee Screening System")
    print("=" * 60)
    print()
    
    create_demo_form()
    
    print()
    print("=" * 60)
