# Crowe Logic™ Proprietary
from __future__ import annotations
import json, os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from hashlib import sha256


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def env(name: str) -> str:
    val = os.getenv(name)
    if not val:
        raise RuntimeError(f"Environment variable {name} not set")
    return val


def write_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2)


def read_json(path: str | Path) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def read_yaml(path: str | Path) -> Any:
    import yaml  # type: ignore
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def sign_payload(payload: Any, secret: str) -> tuple[str, str]:
    blob = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    digest = sha256(blob).hexdigest()
    import hmac
    sig = hmac.new(secret.encode(), blob, sha256).hexdigest()
    return sig, digest
