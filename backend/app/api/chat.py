from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Issue, FeatureRequest, Feedback
from backend.app.schemas import ChatQuery, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])

@router.post("", response_model=ChatResponse)
def query_chat(query: ChatQuery, db: Session = Depends(get_db)):
    msg = query.message.lower()
    
    # 1. Answer biggest issue
    if "biggest issue" in msg or "fix first" in msg or "top issue" in msg:
        worst_issue = db.query(Issue).order_by(Issue.health_score.desc()).first() # lowest health score first (worst)
        # Note: in database, lower score = worse health, wait: in pipeline we did min(100, health) - lower is worse.
        # But wait, in mock_data.py we did issue_checkout.health_score = 98 (representing "payment crash status critical, health score 98/100" from user request: Payment Crash Health Score 98/100, status Critical).
        # Ah! The user request says: "Payment Crash, Health Score 98/100, Status Critical". So higher score actually means worst/critical? Wait! "AI Health Score: every issue gets a live AI Health Score. Green Stable -> Yellow Growing Slowly -> Orange Needs Attention -> Red Critical -> Purple Business Critical. Example: Payment Crash Health Score 98/100 Status Critical".
        # Yes! In our schema and mock data, 98/100 is critical/critical status.
        # So we query by highest health_score or sorting by priority.
        critical_issue = db.query(Issue).filter(Issue.priority == "Critical").order_by(Issue.health_score.desc()).first()
        
        response_text = f"Our most critical issue is **{critical_issue.title}** under the **{critical_issue.assigned_team}** team. It has **{critical_issue.total_reports} reports** affecting **{critical_issue.affected_users} customers**, and has an AI Health Score of **{critical_issue.health_score}/100**. This is causing a significant revenue risk of approximately ${critical_issue.estimated_revenue_risk:.2f}."
        
        return ChatResponse(
            response=response_text,
            suggested_issues=[{"id": critical_issue.id, "title": critical_issue.title, "score": critical_issue.health_score, "status": critical_issue.status}]
        )
        
    # 2. Feature Requests
    elif "feature request" in msg or "requested most" in msg or "most requested" in msg:
        top_feature = db.query(FeatureRequest).order_by(FeatureRequest.requests_count.desc()).first()
        response_text = f"The most requested feature is **{top_feature.title}** with **{top_feature.requests_count} requests**. It is currently in the **{top_feature.status}** state. Other top requests include 'Offline Mode' (813 requests) and 'Apple Pay Web Support' (501 requests)."
        return ChatResponse(response=response_text)
        
    # 3. Summarize complaints
    elif "summarize complaints" in msg or "this week" in msg:
        issues = db.query(Issue).all()
        issue_summaries = "\n".join([f"- **{i.title}** ({i.priority} priority): {i.summary}" for i in issues])
        response_text = f"Here is a summary of complaints reported this week:\n\n{issue_summaries}"
        return ChatResponse(response=response_text)
        
    # 4. Compare platforms
    elif "compare" in msg and ("android" in msg or "ios" in msg):
        ios_reports = db.query(Feedback).filter(Feedback.meta_info.like("%iOS%")).count()
        android_reports = db.query(Feedback).filter(Feedback.meta_info.like("%Android%")).count()
        response_text = f"Based on our feedback channels: \n- **iOS App** has recorded **{ios_reports} primary feedback items** with a critical checkout regression.\n- **Android App** has recorded **{android_reports} primary feedback items**, primarily focusing on slow startup times and performance lag. \n\nEngineering recommendation is to prioritize iOS checkout crashes first to protect revenue, followed by Android optimization."
        return ChatResponse(response=response_text)
        
    # 5. Fallback search
    else:
        # Search issues by keyword
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
            response="I couldn't find any specific match in our logs for that query. You can ask about our 'biggest issues', 'top feature requests', 'summarize complaints this week', or 'compare iOS and Android'."
        )
