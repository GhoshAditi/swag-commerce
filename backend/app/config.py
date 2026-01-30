from pydantic_settings import BaseSettings
from functools import lru_cache
import json
from typing import Any


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/swagcommerce"
    
    # API
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Swag Commerce API"
    VERSION: str = "1.0.0"
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Google Gemini
    GEMINI_API_KEY: str = ""
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str) -> Any:
            """Parse environment variables, especially JSON arrays"""
            if field_name == 'CORS_ORIGINS':
                try:
                    return json.loads(raw_val)
                except json.JSONDecodeError:
                    return [raw_val]
            return raw_val


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
