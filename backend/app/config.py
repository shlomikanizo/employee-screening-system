"""
Application Configuration
קובץ הגדרות המערכת
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """הגדרות אפליקציה"""
    
    # Application
    APP_NAME: str = "Employee Screening Form"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./job_worker.db"
    
    # Notification Services (Optional)
    USE_EMAIL: Optional[bool] = False
    USE_WHATSAPP_WEB: Optional[bool] = False
    
    # Email Service (Optional)
    SMTP_SERVER: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    EMAIL_USER: Optional[str] = None
    EMAIL_PASSWORD: Optional[str] = None
    EMAIL_FROM_NAME: Optional[str] = None
    
    # WhatsApp Web (Optional)
    WHATSAPP_WEB_SERVER_URL: Optional[str] = None
    
    # WhatsApp Business API (Optional)
    WHATSAPP_API_URL: Optional[str] = None
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None
    WHATSAPP_ACCESS_TOKEN: Optional[str] = None
    WHATSAPP_VERIFY_TOKEN: Optional[str] = None
    
    # Google Maps (Optional)
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    
    # Company Info
    COMPANY_NAME: str = "Your Company"
    COMPANY_ADDRESS: str = ""
    COMPANY_LAT: float = 32.0853
    COMPANY_LNG: float = 34.7818
    COMPANY_LOGO_URL: str = ""
    
    # Job Details
    JOB_TITLE: str = "Job Position"
    JOB_DESCRIPTION: str = ""
    JOB_SALARY_RANGE: str = ""
    JOB_LOCATION: str = ""
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production-please"
    ALGORITHM: str = "HS256"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    PDF_OUTPUT_DIR: str = "./pdfs"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# יצירת instance של ההגדרות
settings = Settings()
