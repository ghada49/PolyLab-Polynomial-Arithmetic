
from pydantic import BaseModel, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    APP_NAME: str = "auth-api"
    DEBUG: bool = True
    SECRET_KEY: str = "change-me-in-prod"
    DATABASE_URL: str = "sqlite:///./auth.db"
    SESSION_COOKIE_NAME: str = "session_id"
    SESSION_TTL_MINUTES: int = 120
    CSRF_COOKIE_NAME: str = "csrf_token"
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    HSTS_ENABLED: bool = False  # dev default
    RATE_LIMIT_PER_MINUTE: int = 120

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
