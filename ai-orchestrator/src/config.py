import os
from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    supabase_db_url: str = Field(
        default="postgresql://muwasa:dev_password@localhost:5432/muwasa",
        validation_alias=AliasChoices("SUPABASE_DB_URL", "DATABASE_URL", "supabase_db_url")
    )
    redis_url: str = Field(
        default="redis://localhost:6379",
        validation_alias=AliasChoices("REDIS_URL", "redis_url")
    )
    openai_api_key: str = Field(
        default="sk-placeholder-key",
        validation_alias=AliasChoices("OPENAI_API_KEY", "openai_api_key")
    )
    
    llm_model: str = "gpt-4o"
    safety_model: str = "gpt-4o-mini"
    classifier_model: str = "gpt-4o-mini"
    summarizer_model: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-large"
    embedding_dimensions: int = 1024
    
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    kb_version: str = "1.0.0"
    session_ttl_seconds: int = 86400 * 7  # 7 days
    
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
