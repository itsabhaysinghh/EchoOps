import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EchoOps Feedback OS"
    DATABASE_URL: str = "sqlite:///./echoops.db"
    
    # AI API Keys (Optional, falls back to rich heuristic mock pipeline)
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Slack / Teams Mock Configuration
    SLACK_WEBHOOK_URL: str = ""
    TEAMS_WEBHOOK_URL: str = ""
    
    # Security & Authentication Settings
    SECRET_KEY: str = "echoops_secret_key_prod_default_change_in_env_394827"
    ENCRYPTION_KEY: str = "echoops_data_enc_key_32bytes_sec"
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    RATE_LIMIT_LOGIN_PER_MINUTE: int = 10
    
    # Google OAuth Credentials
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()

