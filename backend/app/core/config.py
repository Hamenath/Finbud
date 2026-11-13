import os
import json
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FINBUD Financial Intelligence"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    
    # CORS Origins - supports comma-separated string, JSON list, or default localhost origins
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://finbud.vercel.app"
    ]
    
    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    # Supabase Credentials (Supports both SUPABASE_KEY and SUPABASE_ANON_KEY aliases)
    SUPABASE_URL: str = "https://demo-finbud.supabase.co"
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY") or "demo-anon-key"
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: str = "demo-service-role-key"
    SUPABASE_JWT_SECRET: str = "demo-jwt-secret"
    
    # LLM Settings (Read dynamically from backend/.env or hosting environment variables)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "demo-gemini-key")
    
    # Market Data Caching
    MARKET_CACHE_TTL_SECONDS: int = 3600

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

