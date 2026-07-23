import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    industry = Column(String)
    website = Column(String)
    timezone = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    workspaces = relationship("Workspace", back_populates="company")
    users = relationship("User", back_populates="company")

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="workspaces")
    users = relationship("User", back_populates="workspace")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)  # Super Admin, Admin, Product Manager, Engineering Manager, Developer, Customer Support, Viewer
    company_id = Column(Integer, ForeignKey("companies.id"))
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="users")
    workspace = relationship("Workspace", back_populates="users")

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text)
    status = Column(String, default="New")  # New, AI Verified, Assigned, In Progress, QA, Released, AI Verification, Closed
    priority = Column(String)  # Critical, High, Medium, Low
    health_score = Column(Float, default=100.0)  # 0 to 100 (where 0 is worst, 100 is stable)
    health_status = Column(String, default="Stable")  # Stable, Growing Slowly, Needs Attention, Critical, Business Critical
    assigned_team = Column(String)  # Engineering, Support, Marketing, etc.
    assigned_to_name = Column(String, nullable=True)
    assigned_to_email = Column(String, nullable=True)
    
    # Root Cause Details
    root_cause = Column(Text, nullable=True)
    confidence = Column(Float, default=0.0)  # 0 to 100
    release_correlation = Column(String, nullable=True)
    
    # Aggregated distribution statistics (stored as JSON)
    affected_devices = Column(JSON, default=dict)
    affected_countries = Column(JSON, default=dict)
    affected_versions = Column(JSON, default=dict)
    platform_distribution = Column(JSON, default=dict)
    
    # Churn / Risk estimation
    estimated_revenue_risk = Column(Float, default=0.0)
    estimated_churn_risk = Column(Float, default=0.0)
    affected_users = Column(Integer, default=0)
    total_reports = Column(Integer, default=0)
    average_rating = Column(Float, default=5.0)
    linked_tickets = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    feedbacks = relationship("Feedback", back_populates="issue")
    comments = relationship("IssueComment", back_populates="issue", cascade="all, delete-orphan")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)  # Google Play Store, Apple App Store, Gmail, Trustpilot, CSV Upload, Call recordings, etc.
    original_text = Column(Text)
    cleaned_text = Column(Text)
    is_spam = Column(Boolean, default=False)
    language = Column(String, default="English")
    transcript = Column(Text, nullable=True)  # Used for audio/video sources
    
    sentiment = Column(String)  # Positive, Neutral, Negative
    sentiment_score = Column(Float)  # -1.0 to 1.0
    emotion = Column(String)  # Anger, Frustration, Joy, Sadness, Neutral
    
    priority_score = Column(Float)  # 0 to 100
    health_score = Column(Float)  # 0 to 100
    
    # Source metadata (JSON containing device info, user email, rating, location)
    meta_info = Column(JSON, default=dict)
    
    issue_id = Column(Integer, ForeignKey("issues.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    issue = relationship("Issue", back_populates="feedbacks")

class IssueComment(Base):
    __tablename__ = "issue_comments"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    author_name = Column(String)
    author_role = Column(String)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    issue = relationship("Issue", back_populates="comments")

class FeatureRequest(Base):
    __tablename__ = "feature_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    requests_count = Column(Integer, default=0)
    category = Column(String, default="Feature Request")  # Bug, Feature Request, Question, Complaint, Praise
    status = Column(String, default="Proposed")  # Proposed, Under Review, Planned, In Development, Released
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Release(Base):
    __tablename__ = "releases"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, unique=True, index=True)
    release_date = Column(DateTime, default=datetime.datetime.utcnow)
    feedback_count_before = Column(Integer, default=0)
    feedback_count_after = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    verification_report = Column(JSON, default=dict)

class IntegrationSetting(Base):
    __tablename__ = "integration_settings"

    id = Column(Integer, primary_key=True, index=True)
    tool_name = Column(String)  # Jira, GitHub, Linear, Trello, etc.
    config_data = Column(JSON, default=dict)
    is_connected = Column(Boolean, default=False)
    connected_at = Column(DateTime, default=datetime.datetime.utcnow)

class WeeklyReport(Base):
    __tablename__ = "weekly_reports"

    id = Column(Integer, primary_key=True, index=True)
    generated_date = Column(DateTime, default=datetime.datetime.utcnow)
    sections_data = Column(JSON)  # HTML-ready report data JSON
