from fastapi import Header, HTTPException, Depends
from typing import Optional, Dict, Any
from supabase import create_client
from app.core.config import settings

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Authenticates requests via Supabase JWT Bearer token.
    Derives user identity securely server-side.
    Rejects missing or invalid tokens with HTTP 401.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Missing or malformed Bearer token in Authorization header."
        )

    token = authorization.split("Bearer ", 1)[1].strip()

    try:
        # Validate JWT token with Supabase Auth API
        sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        user_response = sb.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired authentication session.")

        return {
            "id": user_response.user.id,
            "email": user_response.user.email,
            "role": user_response.user.role,
            "app_metadata": user_response.user.app_metadata,
            "user_metadata": user_response.user.user_metadata
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication token verification failed: {str(e)}")

def get_optional_current_user(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    """
    Attempts to authenticate Supabase JWT Bearer token if present.
    Returns None if missing or invalid without throwing HTTP 401.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split("Bearer ", 1)[1].strip()
    try:
        sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        user_response = sb.auth.get_user(token)
        if user_response and user_response.user:
            return {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "role": user_response.user.role,
                "app_metadata": user_response.user.app_metadata,
                "user_metadata": user_response.user.user_metadata
            }
    except Exception:
        pass
    return None
