# Crowe Logic™ Proprietary
from __future__ import annotations
from typing import List, Literal, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr, Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="CLX_", case_sensitive=False)

    env: Literal["dev", "staging", "prod"] = "dev"
    api_key: Optional[SecretStr] = None
    license_secret: SecretStr
    license_encrypt: int = 0  # 0/1
    allowed_hosts: List[str] = Field(default_factory=lambda: ["*"])
    cors_origins: List[str] = Field(default_factory=lambda: ["*"])
    influx_url: str = "http://influxdb:8086"
    influx_org: str = "clx"
    influx_bucket: str = "telemetry"


def get_settings() -> Settings:
    return Settings()  # cached by Pydantic
