import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "FINBUD Financial Intelligence"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # Supabase Credentials
    SUPABASE_URL: str = "https://demo-finbud.supabase.co"
    SUPABASE_KEY: str = "demo-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: str = "demo-service-role-key"
    SUPABASE_JWT_SECRET: str = "demo-jwt-secret"
    
    # LLM Settings
    GEMINI_API_KEY: str = "demo-gemini-key"
    
    # Market Data Caching
    MARKET_CACHE_TTL_SECONDS: int = 3600

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

