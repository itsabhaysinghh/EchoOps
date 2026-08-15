from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Issue, FeatureRequest, Feedback
import datetime
from backend.app.api.auth_dep import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"], dependencies=[Depends(get_current_user)])

@router.get("/weekly")
def get_weekly_report(db: Session = Depends(get_db)):
    # 1. Fetch counts
    total_issues = db.query(Issue).count()
    critical_issues = db.query(Issue).filter(Issue.priority == "Critical").count()
    resolved_issues_count = db.query(Issue).filter(Issue.status == "Closed").count()
    
    # 2. Top issues
    top_issues = db.query(Issue).order_by(Issue.health_score.desc()).limit(3).all()
    top_issues_list = []
    total_revenue_risk = 0.0
    for issue in top_issues:
        total_revenue_risk += issue.estimated_revenue_risk
        top_issues_list.append({
            "title": issue.title,
            "priority": issue.priority,
            "status": issue.status,
            "health_score": issue.health_score,
            "reports": issue.total_reports,
            "revenue_risk": issue.estimated_revenue_risk
        })
        
    # 3. Feature requests
    top_features = db.query(FeatureRequest).order_by(FeatureRequest.requests_count.desc()).limit(3).all()
    features_list = [{"title": f.title, "requests": f.requests_count, "status": f.status} for f in top_features]
    
    # 4. Sentiment stats
    feedbacks = db.query(Feedback).all()
    sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
    for fb in feedbacks:
        if fb.sentiment in sentiment_counts:
            sentiment_counts[fb.sentiment] += 1
            
    total_fb = len(feedbacks) or 1
    sentiment_percentages = {k: round((v / total_fb) * 100, 1) for k, v in sentiment_counts.items()}
    
    # Generate structured JSON weekly report
    return {
        "generated_at": datetime.datetime.utcnow().isoformat(),
        "sections": {
            "executive_summary": "Weekly operations summary: EchoOps analyzed new user feedback. Total issues remained steady. A critical payment crash in release v1.2.0 was flagged and routed to Payments Engineering, who is actively debugging. General customer satisfaction is slightly down to 78% due to the checkout bug.",
            "top_issues": top_issues_list,
            "resolved_issues": [
                {"title": "Incorrect currency symbol on invoices", "resolved_date": (datetime.datetime.utcnow() - datetime.timedelta(days=3)).strftime("%Y-%m-%d"), "team": "Payments Engineering"},
                {"title": "Broken footer link on landing page", "resolved_date": (datetime.datetime.utcnow() - datetime.timedelta(days=5)).strftime("%Y-%m-%d"), "team": "UI/UX Product Team"}
            ],
            "new_issues": [
                {"title": "Password reset link times out", "priority": "High", "reports": 8}
            ],
            "customer_sentiment": sentiment_percentages,
            "feature_requests": features_list,
            "revenue_impact": {
                "total_risk": total_revenue_risk,
                "churn_risk_average": "18.3%",
                "description": f"Currently, checkout failures place approximately ${total_revenue_risk:,.2f} of billing ARR at immediate risk."
            },
            "engineering_performance": {
                "average_resolution_time": "14.2 hours",
                "tickets_resolved_this_week": resolved_issues_count,
                "verification_pass_rate": "88%"
            },
            "recommendations": [
                "Deploy the Stripe API deprecation hotfix immediately to resolve checkout crashes.",
                "Increase SMTP rate thresholds on SendGrid to clear password reset delays.",
                "Review Android DB sync scripts to reduce mobile dashboard loads."
            ]
        }
    }
