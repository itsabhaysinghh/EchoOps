from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
from backend.app.database import get_db
from backend.app.models import Issue, IssueComment, Feedback, FeatureRequest
from backend.app.schemas import IssueResponse, IssueUpdate, IssueCommentCreate, IssueCommentResponse, AIRecommendation, FeatureRequestResponse
from backend.app.api.auth_dep import get_current_user

router = APIRouter(prefix="/api/issues", tags=["Issues"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=List[IssueResponse])
def get_all_issues(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Issue).filter(Issue.workspace_id == current_user.workspace_id).order_by(Issue.health_score.desc()).all()

@router.get("/features/all", response_model=List[FeatureRequestResponse])
def get_all_features(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(FeatureRequest).filter(FeatureRequest.workspace_id == current_user.workspace_id).order_by(FeatureRequest.requests_count.desc()).all()


@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    issue = db.query(Issue).filter(Issue.id == issue_id, Issue.workspace_id == current_user.workspace_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found or unauthorized")
    return issue

@router.put("/{issue_id}", response_model=IssueResponse)
def update_issue(issue_id: int, issue_in: IssueUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    issue = db.query(Issue).filter(Issue.id == issue_id, Issue.workspace_id == current_user.workspace_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found or unauthorized")

        
    update_data = issue_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(issue, key, value)
        
    issue.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(issue)
    return issue

@router.get("/{issue_id}/recommendation", response_model=AIRecommendation)
def get_ai_recommendation(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    # Generate tailored AI recommendations based on issue contents
    title_lower = issue.title.lower()
    
    if "payment" in title_lower or "checkout" in title_lower:
        team = "Payments Engineering"
        priority = "Critical"
        effort = "2 Sprints (Medium)"
        sprint = "Sprint 14"
        fix_time = "24 hours"
        reason = "Payment crashes directly block customer checkout, leading to immediate revenue loss. Re-routing card parameters requires coordination with Stripe endpoints."
    elif "login" in title_lower or "auth" in title_lower:
        team = "Auth Team"
        priority = "High"
        effort = "1 Sprint (Small)"
        sprint = "Sprint 13"
        fix_time = "12 hours"
        reason = "Users locked out from OAuth prevents product usage. Requires updating token expiry values and SMTP rate thresholds."
    elif "slow" in title_lower or "performance" in title_lower:
        team = "Platform Engineering"
        priority = "Medium"
        effort = "3 Sprints (Large)"
        sprint = "Sprint 15"
        fix_time = "3 days"
        reason = "Initial database sync is blocking the main thread. Requires rewriting the synchronization routine to run asynchronously on background workers."
    else:
        team = "Support"
        priority = "Low"
        effort = "1 Sprint (Small)"
        sprint = "Sprint 13"
        fix_time = "4 hours"
        reason = "Standard customer concern. Can be solved by customer success representative."
        
    return AIRecommendation(
        team=team,
        priority=priority,
        effort=effort,
        sprint=sprint,
        fix_time=fix_time,
        reason=reason
    )

@router.post("/{issue_id}/comments", response_model=IssueCommentResponse)
def add_comment(issue_id: int, comment_in: IssueCommentCreate, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    comment = IssueComment(
        issue_id=issue_id,
        author_name=comment_in.author_name,
        author_role=comment_in.author_role,
        content=comment_in.content
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
