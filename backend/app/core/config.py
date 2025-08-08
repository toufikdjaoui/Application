from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Mode DZ"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    API_V1_STR: str = "/api/v1"
    
    # Security
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "mode_dz"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # File uploads
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    UPLOAD_PATH: str = "uploads"
    
    # Email (for notifications)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    
    # External APIs
    OPENAI_API_KEY: Optional[str] = None  # For AI recommendations
    
    # Payment
    CIB_API_KEY: Optional[str] = None
    EDAHABIA_API_KEY: Optional[str] = None
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Create upload directories
def create_upload_dirs():
    upload_path = Path(settings.UPLOAD_PATH)
    directories = [
        "products",
        "avatars", 
        "boutiques",
        "reviews",
        "inspiration"
    ]
    
    for directory in directories:
        dir_path = upload_path / directory
        dir_path.mkdir(parents=True, exist_ok=True)

# Call on import
create_upload_dirs()
