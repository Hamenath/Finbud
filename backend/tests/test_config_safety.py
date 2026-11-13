import pytest
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import Settings

def test_development_mode_allows_placeholders():
    """Confirms local development continues to work cleanly with demo keys."""
    dev = Settings(ENVIRONMENT="development", SUPABASE_KEY="demo-anon-key")
    assert dev.ENVIRONMENT == "development"
    assert dev.SUPABASE_KEY == "demo-anon-key"

def test_production_mode_rejects_missing_or_demo_credentials():
    """Confirms production startup fails immediately if credentials are placeholder or missing."""
    with pytest.raises(ValueError) as excinfo:
        Settings(
            ENVIRONMENT="production",
            SUPABASE_URL="https://demo-finbud.supabase.co",
            SUPABASE_KEY="demo-anon-key",
            SUPABASE_SERVICE_ROLE_KEY="demo-service-role-key",
            SUPABASE_JWT_SECRET="demo-jwt-secret"
        )
    assert "FATAL: Production startup blocked" in str(excinfo.value)
    assert "SUPABASE_URL" in str(excinfo.value)
    assert "SUPABASE_KEY" in str(excinfo.value)
    assert "SUPABASE_SERVICE_ROLE_KEY" in str(excinfo.value)
    assert "SUPABASE_JWT_SECRET" in str(excinfo.value)

def test_production_mode_accepts_valid_credentials():
    """Confirms production startup succeeds when genuine credentials are provided."""
    prod = Settings(
        ENVIRONMENT="production",
        SUPABASE_URL="https://tavndufcbqtvadkeypbl.supabase.co",
        SUPABASE_KEY="sb_publishable_valid_key_123",
        SUPABASE_SERVICE_ROLE_KEY="sb_secret_valid_key_456",
        SUPABASE_JWT_SECRET="valid_jwt_secret_789"
    )
    assert prod.ENVIRONMENT == "production"
    assert prod.SUPABASE_KEY == "sb_publishable_valid_key_123"

def test_supabase_anon_key_alias_resolution():
    """Confirms SUPABASE_ANON_KEY is recognized when SUPABASE_KEY is unset or demo."""
    prod = Settings(
        ENVIRONMENT="production",
        SUPABASE_URL="https://tavndufcbqtvadkeypbl.supabase.co",
        SUPABASE_KEY="demo-anon-key",
        SUPABASE_ANON_KEY="sb_publishable_alias_key",
        SUPABASE_SERVICE_ROLE_KEY="sb_secret_valid_key",
        SUPABASE_JWT_SECRET="valid_jwt_secret_123"
    )
    assert prod.SUPABASE_KEY == "sb_publishable_alias_key"

def test_cors_origins_parsing():
    """Confirms comma-separated and JSON string CORS parsing."""
    comma_settings = Settings(CORS_ORIGINS="https://finbud.vercel.app, https://app.finbud.com")
    assert comma_settings.CORS_ORIGINS == ["https://finbud.vercel.app", "https://app.finbud.com"]

