# Crowe Logic™ Proprietary
from __future__ import annotations
import functools, json, os, hmac
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, Iterable
from hashlib import sha256
from base64 import b64decode
from .settings import get_settings


class LicenseError(PermissionError): ...


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _decode_license(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Optionally decrypt sensitive fields if license_encrypt=1 was used during packaging."""
    settings = get_settings()
    if not doc.get("enc"):
        return doc
    if not settings.license_encrypt:
        raise LicenseError("Encrypted license requires CLX_LICENSE_ENCRYPT=1")
    try:
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM  # type: ignore
    except Exception as e:
        raise LicenseError("AES decryption not available") from e
    key = sha256(settings.license_secret.get_secret_value().encode()).digest()
    nonce = b64decode(doc["enc"]["nonce"])
    ct = b64decode(doc["enc"]["ciphertext"])
    aad = b"clx-license-v1"
    plain = AESGCM(key).decrypt(nonce, ct, aad)
    fields = json.loads(plain.decode())
    doc.update(fields)
    return doc


def load_license(license_path: str | os.PathLike[str]) -> Dict[str, Any]:
    with open(license_path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return _decode_license(raw)


def validate_license(license_doc: Dict[str, Any], category: str) -> None:
    expires_at = datetime.fromisoformat(license_doc["expires_at"])
    cats: Iterable[str] = [c.casefold() for c in license_doc.get("categories", [])]
    if _now() > expires_at:
        raise LicenseError(f"License expired at {expires_at.isoformat()}")
    if "all" not in cats and category.casefold() not in cats:
        raise LicenseError(f"Category '{category}' not permitted. Allowed: {list(cats)}")


def require_license(category: str, license_env_var: str = "CLX_LICENSE_FILE") -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            path = os.getenv(license_env_var)
            if not path or not Path(path).exists():
                raise LicenseError("License file not found. Set CLX_LICENSE_FILE")
            doc = load_license(path)
            settings = get_settings()
            secret = settings.license_secret.get_secret_value()
            payload = {k: doc[k] for k in ("partner", "categories", "issued_at", "expires_at")}
            blob = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
            expect_sig = hmac.new(secret.encode(), blob, sha256).hexdigest()
            if expect_sig != doc.get("signature"):
                raise LicenseError("Invalid license signature.")
            validate_license(doc, category)
            return func(*args, **kwargs)
        return wrapper
    return decorator
