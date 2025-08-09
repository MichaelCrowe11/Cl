import json, os
from pathlib import Path
from clx_mpdet.vertical_lock import load_license, validate_license, LicenseError


def test_signature_mismatch(tmp_path):
    lic = tmp_path / "l.json"
    lic.write_text(json.dumps({
        "partner":"x","categories":["R&D"],"issued_at":"2025-01-01T00:00:00+00:00",
        "expires_at":"2099-01-01T00:00:00+00:00","signature":"deadbeef"
    }), encoding="utf-8")
    os.environ["CLX_LICENSE_SECRET"] = "secret"
    try:
        doc = load_license(lic)
        try:
            validate_license(doc, "R&D")
            assert False, "should raise"
        except LicenseError:
            pass
    finally:
        os.environ.pop("CLX_LICENSE_SECRET", None)
