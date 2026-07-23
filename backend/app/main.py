from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.api import onboarding, feedback, issues, chat, reports, integrations

app = FastAPI(title=settings.PROJECT_NAME)

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development ease, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(onboarding.router)
app.include_router(feedback.router)
app.include_router(issues.router)
app.include_router(chat.router)
app.include_router(reports.router)
app.include_router(integrations.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "message": "Welcome to EchoOps AI Feedback OS API. Ready to process pipeline inputs."
    }
