from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# Auth / Onboarding
class CompanyCreate(BaseModel):
    name: str
    industry: str
    website: str
    timezone: str

class TimezoneUpdateRequest(BaseModel):
    timezone: str = Field(..., max_length=100)


class CompanyResponse(BaseModel):
    id: int
    name: str
    industry: str
    website: str
    timezone: str
    created_at: datetime
    class Config:
        from_attributes = True

class WorkspaceCreate(BaseModel):
    name: str
    company_id: int

class WorkspaceResponse(BaseModel):
    id: int
    name: str
    company_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class UserInvite(BaseModel):
    email: EmailStr
    role: str

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    role: str
    company_id: int
    workspace_id: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    company_id: int
    workspace_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

# Feedback
class FeedbackCreate(BaseModel):
    source: str = Field(..., max_length=100)
    original_text: str = Field(..., max_length=10000)
    meta_info: Optional[Dict[str, Any]] = None


class FeedbackResponse(BaseModel):
    id: int
    source: str
    original_text: str
    cleaned_text: Optional[str]
    is_spam: bool
    language: str
    transcript: Optional[str]
    sentiment: str
    sentiment_score: float
    emotion: str
    priority_score: float
    health_score: float
    meta_info: Dict[str, Any]
    issue_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

# Issues
class IssueCommentCreate(BaseModel):
    content: str
    author_name: str
    author_role: str

class IssueCommentResponse(BaseModel):
    id: int
    issue_id: int
    author_name: str
    author_role: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True

class IssueUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_team: Optional[str] = None
    assigned_to_name: Optional[str] = None
    assigned_to_email: Optional[str] = None

class IssueResponse(BaseModel):
    id: int
    title: str
    summary: str
    status: str
    priority: str
    health_score: float
    health_status: str
    assigned_team: str
    assigned_to_name: Optional[str]
    assigned_to_email: Optional[str]
    root_cause: Optional[str]
    confidence: float
    release_correlation: Optional[str]
    affected_devices: Dict[str, Any]
    affected_countries: Dict[str, Any]
    affected_versions: Dict[str, Any]
    platform_distribution: Dict[str, Any]
    estimated_revenue_risk: float
    estimated_churn_risk: float
    affected_users: int
    average_rating: float
    created_at: datetime
    updated_at: datetime
    feedbacks: List[FeedbackResponse] = []
    comments: List[IssueCommentResponse] = []
    linked_tickets: Optional[Dict[str, Any]] = None
    class Config:
        from_attributes = True

# AI Recommendation Schema
class AIRecommendation(BaseModel):
    team: str
    priority: str
    effort: str
    sprint: str
    fix_time: str
    reason: str

# Feature Requests
class FeatureRequestResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    requests_count: int
    category: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Releases
class ReleaseResponse(BaseModel):
    id: int
    version: str
    release_date: datetime
    feedback_count_before: int
    feedback_count_after: int
    is_verified: bool
    verification_report: Dict[str, Any]
    class Config:
        from_attributes = True

# Integrations
class IntegrationConnect(BaseModel):
    tool_name: str
    config_data: Dict[str, Any]

class IntegrationResponse(BaseModel):
    id: Optional[int]
    tool_name: str
    config_data: Dict[str, Any]
    is_connected: bool
    connected_at: datetime
    class Config:
        from_attributes = True

# Weekly Report
class WeeklyReportResponse(BaseModel):
    id: int
    generated_date: datetime
    sections_data: Dict[str, Any]
    class Config:
        from_attributes = True

# AI Chat & Search
class ChatQuery(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    suggested_issues: List[Dict[str, Any]] = []

class AudioUploadResponse(BaseModel):
    transcript: str
    speakers: List[Dict[str, Any]]
    summary: str
    extracted_problem: str
    sentiment: str
    emotion: str
    suggested_team: str
    suggested_priority: str

# Auth Schemas

class EmailPasswordLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=128)

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4, max_length=128)
    name: str = Field(..., min_length=1, max_length=100)
    role: Optional[str] = "Developer"
    company_name: Optional[str] = Field(None, max_length=100)
    honeypot: Optional[str] = None  # Anti-bot honeypot field (must remain empty)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., max_length=10)
    new_password: str = Field(..., min_length=4, max_length=128)

class GoogleLoginRequest(BaseModel):
    credential: str = Field(..., max_length=4096)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

