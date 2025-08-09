# Crowe Logic™ Proprietary
from __future__ import annotations
from fastapi import HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader
from .settings import get_settings

_api_key_header = APIKeyHeader(name="X-CLX-Key", auto_error=False)

def require_api_key(api_key: str | None = Security(_api_key_header)) -> None:
    settings = get_settings()
    configured = settings.api_key.get_secret_value() if settings.api_key else None
    if configured is None:
        if settings.env == "prod":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API key required")
        return
    if api_key != configured:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
