# Crowe Logic™ Proprietary
from __future__ import annotations
from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from .vertical_lock import LicenseError

async def license_error_handler(_req: Request, exc: LicenseError):
    return JSONResponse(status_code=403, content={"detail": str(exc)})

async def validation_error_handler(_req: Request, exc: ValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})
