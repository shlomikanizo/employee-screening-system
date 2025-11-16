"""
Main Application
נקודת הכניסה לאפליקציה
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from loguru import logger
import sys

from app.config import settings
from app.database import init_db
from app.routers import forms, whatsapp, admin


# הגדרת לוגר
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level="INFO"
)
logger.add(
    "logs/app.log",
    rotation="1 day",
    retention="30 days",
    level="DEBUG"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """אירועי startup ו-shutdown"""
    # Startup
    logger.info("🚀 Starting application...")
    logger.info(f"App Name: {settings.APP_NAME}")
    logger.info(f"Version: {settings.APP_VERSION}")
    logger.info(f"Debug Mode: {settings.DEBUG}")
    
    # אתחול בסיס נתונים
    try:
        init_db()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize database: {str(e)}")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down application...")


# יצירת אפליקציה
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="מערכת טופס סינון עובדים לשליחה בוואטסאפ",
    lifespan=lifespan
)


# הגדרת CORS
# Support multiple origins from settings (comma-separated)
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",  # In case port 3000 is busy
    "http://localhost:5173",  # Vite default
]

# Add origins from settings (can be comma-separated)
if settings.FRONTEND_URL:
    if "," in settings.FRONTEND_URL:
        # Multiple URLs separated by comma
        allowed_origins.extend([url.strip() for url in settings.FRONTEND_URL.split(",")])
    else:
        # Single URL
        allowed_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# רישום Routers
app.include_router(forms.router)
app.include_router(whatsapp.router)
app.include_router(admin.router)


# נתיבים בסיסיים
@app.get("/")
async def root():
    """נתיב שורש"""
    return {
        "message": "Welcome to Employee Screening Form API",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """בדיקת תקינות"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """טיפול גלובלי בשגיאות"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
