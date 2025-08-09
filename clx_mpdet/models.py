# Crowe Logic™ Proprietary
from __future__ import annotations
from pydantic import BaseModel


class TelemetryFrame(BaseModel):
    data: dict
