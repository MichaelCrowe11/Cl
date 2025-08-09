# Crowe Logic™ Proprietary
from __future__ import annotations
from pathlib import Path
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware import Middleware

from .models import TelemetryFrame
from .cultivation import load_alert_map, simulate_alerts
from .utils import read_yaml, read_json
from .settings import get_settings
from .auth import require_api_key
from .exception_handlers import license_error_handler
from .vertical_lock import LicenseError
from .logging_utils import configure_json_logging, RequestLogMiddleware

try:
    from .kb_search import search as kb_search, KbNotBuilt  # type: ignore
except Exception:
    kb_search, KbNotBuilt = None, Exception  # type: ignore

settings = get_settings()
configure_json_logging()

middleware = [
    Middleware(GZipMiddleware, minimum_size=1024),
    Middleware(RequestLogMiddleware),
    Middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts),
]
app = FastAPI(
    title="Crowe Logic™ MPDET API",
    default_response_class=ORJSONResponse,
    version="0.1.0",
    middleware=middleware,
    docs_url=None if settings.env == "prod" else "/docs",
    redoc_url=None,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.add_exception_handler(LicenseError, license_error_handler)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/api/recipes", dependencies=[Depends(require_api_key)])
def list_recipes() -> List[Dict[str, Any]]:
    path = Path("data/recipes/clx_mpdet_crowe_layer_recipes.yaml")
    if not path.exists():
        raise HTTPException(status_code=500, detail="recipes file missing")
    return read_yaml(path)


@app.post("/api/ei/alert-sim", dependencies=[Depends(require_api_key)])
def alert_sim(frame: TelemetryFrame) -> Dict[str, Any]:
    amap = load_alert_map()
    return simulate_alerts(frame, amap)


@app.get("/api/bootstrap/files", dependencies=[Depends(require_api_key)])
def list_bootstrap_files() -> Dict[str, Any]:
    return read_json("clx_mpdet_bootstrap_artifacts.json")


@app.get("/api/kb/search", dependencies=[Depends(require_api_key)])
def api_kb_search(q: str = Query(..., description="Query text"), k: int = 5):
    try:
        return {"query": q, "results": kb_search(q, top_k=k)}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
