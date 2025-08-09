# Crowe Logic™ Proprietary
from __future__ import annotations
import json, logging, time, uuid
from typing import Callable
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

def configure_json_logging(level: int = logging.INFO) -> None:
    logging.basicConfig(level=level, format="%(message)s")

class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        rid = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start = time.perf_counter()
        resp = await call_next(request)
        dur_ms = int((time.perf_counter() - start) * 1000)
        payload = {
            "event": "http_access",
            "method": request.method,
            "path": request.url.path,
            "status": resp.status_code,
            "duration_ms": dur_ms,
            "request_id": rid,
        }
        logging.getLogger("clx").info(json.dumps(payload))
        resp.headers["X-Request-ID"] = rid
        return resp
