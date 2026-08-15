from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Issue, FeatureRequest, Feedback
from backend.app.schemas import ChatQuery, ChatResponse
from backend.app.api.auth_dep import get_current_user

router = APIRouter(prefix="/api/chat", tags=["AI Chat"], dependencies=[Depends(get_current_user)])

@router.post("", response_model=ChatResponse)
def query_chat(query: ChatQuery, db: Session = Depends(get_db)):
    msg = query.message.lower()
    
    # 1. Answer biggest issue
    if "biggest issue" in msg or "fix first" in msg or "top issue" in msg:
        critical_issue = db.query(Issue).order_by(Issue.health_score.desc()).first()
        if not critical_issue:
            return ChatResponse(
                response="There are currently no open issues in your workspace. Submit or ingest new customer feedback to let EchoOps identify issues in real-time!",
                suggested_issues=[]
            )
        
        response_text = f"Our most critical issue is **{critical_issue.title}** under the **{critical_issue.assigned_team}** team. It has **{critical_issue.total_reports} reports** affecting **{critical_issue.affected_users} customers**, and has an AI Health Score of **{critical_issue.health_score}/100**. This is causing an estimated revenue risk of approximately ${critical_issue.estimated_revenue_risk:.2f}."
        
        return ChatResponse(
            response=response_text,
            suggested_issues=[{"id": critical_issue.id, "title": critical_issue.title, "score": critical_issue.health_score, "status": critical_issue.status}]
        )
        
    # 2. Feature Requests
    elif "feature request" in msg or "requested most" in msg or "most requested" in msg:
        top_feature = db.query(FeatureRequest).order_by(FeatureRequest.requests_count.desc()).first()
        if not top_feature:
            return ChatResponse(
                response="No feature requests logged in your database yet. Ingest feedback to track top customer feature requests automatically."
            )
        response_text = f"The most requested feature is **{top_feature.title}** with **{top_feature.requests_count} requests**. It is currently in the **{top_feature.status}** state."
        return ChatResponse(response=response_text)
        
    # 3. Summarize complaints
    elif "summarize complaints" in msg or "this week" in msg:
        issues = db.query(Issue).all()
        if not issues:
            return ChatResponse(
                response="No customer complaints recorded this week. Submit new feedback via the Ingest console or connect your App Store / Gmail integration to stream live data."
            )
        issue_summaries = "\n".join([f"- **{i.title}** ({i.priority} priority): {i.summary}" for i in issues])
        response_text = f"Here is a summary of complaints reported:\n\n{issue_summaries}"
        return ChatResponse(response=response_text)
        
    # 4. Compare platforms
    elif "compare" in msg and ("android" in msg or "ios" in msg):
        ios_reports = db.query(Feedback).filter(Feedback.meta_info.like("%iOS%")).count()
        android_reports = db.query(Feedback).filter(Feedback.meta_info.like("%Android%")).count()
        response_text = f"Based on our recorded feedback items:\n- **iOS**: {ios_reports} items recorded.\n- **Android**: {android_reports} items recorded."
        return ChatResponse(response=response_text)
        
    # 5. Fallback search
    else:
        keywords = msg.split()
        matched = []
        for word in keywords:
            if len(word) > 3:
                issues = db.query(Issue).filter(Issue.title.like(f"%{word}%") | Issue.summary.like(f"%{word}%")).all()
                matched.extend(issues)
                
        matched = list(set(matched))
        if matched:
            issue_titles = ", ".join([m.title for m in matched])
            response_text = f"I found the following issues matching your search: **{issue_titles}**. How would you like me to help you with these?"
            return ChatResponse(
                response=response_text,
                suggested_issues=[{"id": m.id, "title": m.title, "score": m.health_score, "status": m.status} for m in matched]
            )
            
        return ChatResponse(
            response="I couldn't find any matching issues in your workspace database. Ask about 'biggest issues', 'top feature requests', or ingest new feedback to analyze!"
        )
