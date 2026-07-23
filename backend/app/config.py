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
    
    class Config:
        env_file = ".env"

settings = Settings()
