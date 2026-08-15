from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.api import onboarding, feedback, issues, chat, reports, integrations, auth, admin, instagram, app_stores

app = FastAPI(title=settings.PROJECT_NAME)

# Custom Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Setup Restricted CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Include API Routers
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(feedback.router)
app.include_router(issues.router)
app.include_router(chat.router)
app.include_router(reports.router)
app.include_router(integrations.router)
app.include_router(admin.router)
app.include_router(instagram.router)
app.include_router(app_stores.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "message": "Welcome to EchoOps AI Feedback OS API. Ready to process pipeline inputs."
    }
