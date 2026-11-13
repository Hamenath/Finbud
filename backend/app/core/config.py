import os
import json
from pydantic_settings import BaseSettings
from pydantic import field_validator, model_validator
from typing import List, Union, Optional

DEMO_PLACEHOLDERS = {
    "demo-anon-key",
    "demo-service-role-key",
    "demo-jwt-secret",
    "demo-gemini-key",
    "https://demo-finbud.supabase.co",
    "your-anon-key-here",
    "your-service-role-key-here",
    "your-jwt-secret-here",
    "your-gemini-api-key-here",
    "https://your-project.supabase.co"
}

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
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://tavndufcbqtvadkeypbl.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY") or "demo-anon-key"
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "demo-service-role-key")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "demo-jwt-secret")
    
    # LLM Settings (Read dynamically from backend/.env or hosting environment variables)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "demo-gemini-key")
    
    # Market Data Caching
    MARKET_CACHE_TTL_SECONDS: int = 3600

    @model_validator(mode="after")
    def validate_production_credentials(self) -> "Settings":
        """
        Enforces that production environments NEVER start with missing credentials or demo placeholders.
        Preserves local development fallback while preventing accidental production deployment of demo keys.
        """
        is_production = self.ENVIRONMENT.lower() in ["production", "prod", "staging"]
        
        # Resolve SUPABASE_KEY alias
        if not self.SUPABASE_KEY or self.SUPABASE_KEY == "demo-anon-key":
            if self.SUPABASE_ANON_KEY:
                self.SUPABASE_KEY = self.SUPABASE_ANON_KEY

        if is_production:
            required_credentials = {
                "SUPABASE_URL": self.SUPABASE_URL,
                "SUPABASE_KEY": self.SUPABASE_KEY,
                "SUPABASE_SERVICE_ROLE_KEY": self.SUPABASE_SERVICE_ROLE_KEY,
                "SUPABASE_JWT_SECRET": self.SUPABASE_JWT_SECRET,
            }

            missing_or_invalid = []
            for name, val in required_credentials.items():
                if not val or val in DEMO_PLACEHOLDERS:
                    missing_or_invalid.append(name)

            if missing_or_invalid:
                fields_str = ", ".join(missing_or_invalid)
                raise ValueError(
                    f"FATAL: Production startup blocked. Missing or placeholder credentials for: [{fields_str}]. "
                    f"Please inject genuine values into the production environment settings."
                )

        return self

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env")
        case_sensitive = True

settings = Settings()

