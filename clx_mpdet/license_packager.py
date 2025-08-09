# Crowe Logic™ Proprietary
from __future__ import annotations
import os, shutil, tarfile, time, secrets
from pathlib import Path
from typing import Dict, List
from base64 import b64encode
from hashlib import sha256
from .utils import utcnow, write_json, sign_payload, env
from .settings import get_settings

EXCLUDES = {".git", ".venv", "deployments", "__pycache__", ".mypy_cache", ".pytest_cache",
            ".ruff_cache", "dist", "build", ".github", "tests"}


def _tar_filter(info: tarfile.TarInfo) -> tarfile.TarInfo:
    info.uid = 0; info.gid = 0; info.uname = "root"; info.gname = "root"
    info.mtime = 1700000000  # deterministic
    return info


def generate_license(partner: str, categories: List[str], term_years: int, secret: str) -> Dict:
    issued = utcnow()
    expires = issued.replace(year=issued.year + term_years)
    payload = {
        "brand": "Crowe Logic™",
        "partner": partner,
        "categories": categories,
        "issued_at": issued.isoformat(),
        "expires_at": expires.isoformat(),
    }
    sig, digest = sign_payload(payload, secret)
    payload["signature"] = sig
    payload["digest"] = digest
    return payload


def _maybe_encrypt(doc: Dict) -> Dict:
    settings = get_settings()
    if not settings.license_encrypt:
        return doc
    try:
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM  # type: ignore
    except Exception:
        return doc
    key = sha256(settings.license_secret.get_secret_value().encode()).digest()
    aad = b"clx-license-v1"
    nonce = secrets.token_bytes(12)
    fields = {k: doc[k] for k in ("partner", "categories", "issued_at", "expires_at")}
    ct = AESGCM(key).encrypt(nonce, __import__("json").dumps(fields).encode(), aad)
    enc = {"nonce": b64encode(nonce).decode(), "ciphertext": b64encode(ct).decode()}
    out = {**doc, "enc": enc}
    return out


def package_bundle(partner: str, categories: List[str], term_years: int) -> Path:
    secret = env("CLX_LICENSE_SECRET")
    root = Path(".").resolve()
    out_dir = root / "deployments" / f"{partner}_bundle"
    if out_dir.exists(): shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    license_doc = generate_license(partner, categories, term_years, secret)
    license_doc = _maybe_encrypt(license_doc)
    write_json(out_dir / "license.json", license_doc)

    for rel in ["clx_mpdet", "data", "ops", "pyproject.toml", "README.md", "LICENSE.txt"]:
        src = root / rel
        dst = out_dir / rel
        if src.is_dir(): shutil.copytree(src, dst)
        elif src.exists(): shutil.copy2(src, dst)

    (out_dir / "BUNDLE_README.txt").write_text(
        f"""Crowe Logic™ — MPDET Partner Bundle
Partner: {partner}
Categories: {', '.join(categories)}
License: deployments/{partner}_bundle/license.json
Run:
  export CLX_LICENSE_SECRET=**** 
  export CLX_LICENSE_FILE=$(pwd)/deployments/{partner}_bundle/license.json
  uvicorn clx_mpdet.service:app --host 0.0.0.0 --port 8000
""",
        encoding="utf-8",
    )

    tar_path = out_dir.with_suffix(".tar.gz")
    with tarfile.open(tar_path, "w:gz") as tar:
        tar.add(out_dir, arcname=out_dir.name, filter=_tar_filter)
    return tar_path
