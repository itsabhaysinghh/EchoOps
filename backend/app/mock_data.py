import datetime
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, Base, engine
from backend.app.models import (
    Company, Workspace, User, Issue, Feedback, IssueComment, FeatureRequest, Release, IntegrationSetting
)
from backend.app.auth_utils import get_password_hash

def seed_database(db: Session):
    # Drop and recreate tables to ensure a clean slate
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. Seed Company & Workspaces
    company = Company(
        name="Acme SaaS Inc.",
        industry="Enterprise software",
        website="https://acme.io",
        timezone="America/New_York"
    )
    db.add(company)
    db.commit()
    db.refresh(company)

    workspace = Workspace(
        name="Acme Feedback Desk",
        company_id=company.id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    # 2. Seed Users with distinct Roles
    users = [
        User(email="superadmin@acme.io", name="Sarah Connor", role="Super Admin", company_id=company.id, workspace_id=workspace.id, hashed_password=get_password_hash("password123")),
        User(email="admin@acme.io", name="John Connor", role="Admin", company_id=company.id, workspace_id=workspace.id, hashed_password=get_password_hash("password123")),
        User(email="pm@acme.io", name="Rahul Sharma", role="Product Manager", company_id=company.id, workspace_id=workspace.id, hashed_password=get_password_hash("password123")),
        User(email="em@acme.io", name="Marcus Wright", role="Engineering Manager", company_id=company.id, workspace_id=workspace.id, hashed_password=get_password_hash("password123")),
        User(email="dev@acme.io", name="Kyle Reese", role="Developer", company_id=company.id, workspace_id=workspace.id, hashed_password=get_password_hash("password123")),
        User(email="cs@acme.io", name="Dani Ramos", role="Customer Support", company_id=company.id, workspace_id=workspace.id, hashed_password=get_password_hash("password123")),
        User(email="viewer@acme.io", name="Grace Harper", role="Viewer", company_id=company.id, workspace_id=workspace.id, hashed_password=get_password_hash("password123"))
    ]
    for u in users:
        db.add(u)
    db.commit()

    # 3. Seed Releases
    v11 = Release(
        version="v1.1.0",
        release_date=datetime.datetime.utcnow() - datetime.timedelta(days=20),
        feedback_count_before=42,
        feedback_count_after=12,
        is_verified=True,
        verification_report={
            "summary": "Complaints dropped by 71% post-release.",
            "status": "Suggest Close"
        }
    )
    v12 = Release(
        version="v1.2.0",
        release_date=datetime.datetime.utcnow() - datetime.timedelta(days=2),
        feedback_count_before=15,
        feedback_count_after=35,
        is_verified=False,
        verification_report={
            "summary": "Complaints increased by 133% post-release. Potential regression in checkout flow.",
            "status": "Suggest Reopen"
        }
    )
    db.add(v11)
    db.add(v12)
    db.commit()

    # 4. Seed Issues
    issue_checkout = Issue(
        title="Payment Checkout Failure & Crash",
        summary="Customers are encountering 'Error 500' when checking out with Apple Pay and Stripe on mobile devices. This is causing significant revenue loss.",
        status="In Progress",
        priority="Critical",
        health_score=98.0,
        health_status="Critical",
        assigned_team="Payments Engineering",
        assigned_to_name="Rahul Sharma",
        assigned_to_email="pm@acme.io",
        root_cause="Stripe integration timeout due to incorrect API headers.",
        confidence=92.0,
        release_correlation="v1.2.0",
        affected_devices={"iPhone 15": 28, "Samsung S24": 12, "Pixel 8": 6},
        affected_countries={"United States": 35, "Canada": 7, "United Kingdom": 4},
        affected_versions={"v1.2.0": 40, "v1.1.9": 6},
        platform_distribution={"iOS": 28, "Android": 18},
        estimated_revenue_risk=24500.00,
        estimated_churn_risk=0.35,
        affected_users=46,
        total_reports=58,
        average_rating=1.2,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3),
        updated_at=datetime.datetime.utcnow() - datetime.timedelta(hours=4)
    )

    issue_login = Issue(
        title="User Authentication & Password Reset Failures",
        summary="Users are locked out because Google OAuth tokens are expiring prematurely and the password reset email is taking over 30 minutes to arrive.",
        status="AI Verified",
        priority="High",
        health_score=72.0,
        health_status="Needs Attention",
        assigned_team="Auth Team",
        assigned_to_name="Kyle Reese",
        assigned_to_email="dev@acme.io",
        root_cause="SendGrid SMTP rate-limiting and Google token expiry mismatch.",
        confidence=85.0,
        release_correlation="v1.1.0",
        affected_devices={"Desktop Chrome": 18, "Desktop Safari": 9, "iPhone 13": 5},
        affected_countries={"United States": 15, "Germany": 10, "India": 7},
        affected_versions={"v1.1.0": 25, "v1.2.0": 7},
        platform_distribution={"Web": 27, "iOS": 5},
        estimated_revenue_risk=8900.00,
        estimated_churn_risk=0.18,
        affected_users=32,
        total_reports=38,
        average_rating=2.1,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=7),
        updated_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    )

    issue_slow = Issue(
        title="Performance Degradation on Mobile Devices",
        summary="Android app loads extremely slowly after login, showing a spinning loader for up to 15 seconds. Customers are claiming the app freezes.",
        status="New",
        priority="Medium",
        health_score=58.0,
        health_status="Growing Slowly",
        assigned_team="Platform Engineering",
        assigned_to_name="Marcus Wright",
        assigned_to_email="em@acme.io",
        root_cause="Heavy initial database sync on startup blocking the main thread.",
        confidence=78.0,
        release_correlation="v1.1.0",
        affected_devices={"Samsung S22": 15, "OnePlus 11": 10},
        affected_countries={"India": 12, "Brazil": 8, "United States": 5},
        affected_versions={"v1.1.0": 20, "v1.0.0": 5},
        platform_distribution={"Android": 25},
        estimated_revenue_risk=3200.00,
        estimated_churn_risk=0.12,
        affected_users=25,
        total_reports=30,
        average_rating=2.8,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=10),
        updated_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
    )

    db.add(issue_checkout)
    db.add(issue_login)
    db.add(issue_slow)
    db.commit()
    db.refresh(issue_checkout)
    db.refresh(issue_login)
    db.refresh(issue_slow)

    # 5. Seed Feedbacks linked to Issues
    feedbacks = [
        Feedback(
            source="Apple App Store",
            original_text="The checkout process keeps crashing when I choose Apple Pay. This is unacceptable, I was trying to purchase a subscription!",
            cleaned_text="The checkout process keeps crashing when I choose Apple Pay. This is unacceptable, I was trying to purchase a subscription!",
            is_spam=False,
            sentiment="Negative",
            sentiment_score=-0.8,
            emotion="Anger",
            priority_score=95.0,
            health_score=15.0,
            meta_info={"device": "iPhone 15", "country": "United States", "version": "v1.2.0", "rating": 1, "platform": "iOS", "email": "customer1@gmail.com"},
            issue_id=issue_checkout.id,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        Feedback(
            source="Google Play Store",
            original_text="Every time I try to complete the payment for my order, the app throws an Error 500. Please fix immediately, I am losing sales!",
            cleaned_text="Every time I try to complete the payment for my order, the app throws an Error 500. Please fix immediately, I am losing sales!",
            is_spam=False,
            sentiment="Negative",
            sentiment_score=-0.7,
            emotion="Frustration",
            priority_score=92.0,
            health_score=20.0,
            meta_info={"device": "Samsung S24", "country": "United States", "version": "v1.2.0", "rating": 1, "platform": "Android", "email": "business_user@yahoo.com"},
            issue_id=issue_checkout.id,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=12)
        ),
        Feedback(
            source="Gmail",
            original_text="Subject: Cannot pay for my renewal invoice.\nHi Support, I am trying to pay my invoice but the page freezes at checkout. Can you run my card manually?",
            cleaned_text="Cannot pay for my renewal invoice. Hi Support, I am trying to pay my invoice but the page freezes at checkout. Can you run my card manually?",
            is_spam=False,
            sentiment="Negative",
            sentiment_score=-0.4,
            emotion="Frustration",
            priority_score=80.0,
            health_score=40.0,
            meta_info={"device": "Desktop Chrome", "country": "Canada", "version": "v1.2.0", "rating": 2, "platform": "Web", "email": "billing-issue@company.com"},
            issue_id=issue_checkout.id,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
        ),
        Feedback(
            source="Call recordings",
            original_text="Transcribed call: The user says Google login doesn't work. It shows token expired and loops back to login.",
            cleaned_text="Transcribed call: The user says Google login doesn't work. It shows token expired and loops back to login.",
            is_spam=False,
            sentiment="Negative",
            sentiment_score=-0.5,
            emotion="Frustration",
            priority_score=75.0,
            health_score=45.0,
            meta_info={"device": "Desktop Safari", "country": "Germany", "version": "v1.1.0", "rating": 2, "platform": "Web", "email": "alex@web.de"},
            issue_id=issue_login.id,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ),
        Feedback(
            source="Trustpilot",
            original_text="Great platform when it works, but the Android application is extremely sluggish and slow to load, sometimes taking 15 seconds.",
            cleaned_text="Great platform when it works, but the Android application is extremely sluggish and slow to load, sometimes taking 15 seconds.",
            is_spam=False,
            sentiment="Negative",
            sentiment_score=-0.6,
            emotion="Frustration",
            priority_score=68.0,
            health_score=35.0,
            meta_info={"device": "OnePlus 11", "country": "India", "version": "v1.1.0", "rating": 2, "platform": "Android", "email": "dev-user@outlook.com"},
            issue_id=issue_slow.id,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
        )
    ]
    for fb in feedbacks:
        db.add(fb)
    db.commit()

    # 6. Seed Comments
    comments = [
        IssueComment(
            issue_id=issue_checkout.id,
            author_name="Sarah Connor",
            author_role="Super Admin",
            content="This is causing our daily revenue capture to drop. Payments team, please look at the Stripe error log immediately.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ),
        IssueComment(
            issue_id=issue_checkout.id,
            author_name="Rahul Sharma",
            author_role="Product Manager",
            content="I am on it. Checked the logs and Stripe is returning HTTP 400 because our client SDK is passing deprecated card parameters.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        )
    ]
    for c in comments:
        db.add(c)
    db.commit()

    # 7. Seed Feature Requests
    features = [
        FeatureRequest(title="Dark Mode Support", description="Add dark mode for dashboard and settings screens.", requests_count=1284, category="Feature Request", status="Planned"),
        FeatureRequest(title="Offline Mode", description="Allow caching feedback and reading issues without connection.", requests_count=813, category="Feature Request", status="Proposed"),
        FeatureRequest(title="Apple Pay Support for Web Checkout", description="Add Apple Pay support directly inside web invoices, not just iOS app.", requests_count=501, category="Feature Request", status="In Development"),
        FeatureRequest(title="Full text search on feedbacks", description="Need natural language search across all support channels.", requests_count=320, category="Feature Request", status="Released")
    ]
    for f in features:
        db.add(f)
    db.commit()

    # 8. Seed Integrations
    integrations = [
        IntegrationSetting(tool_name="Jira", config_data={"workspace": "acme-jira", "project": "FEEDBACK"}, is_connected=True),
        IntegrationSetting(tool_name="GitHub", config_data={"repo": "acme-saas/echoops-feedback"}, is_connected=True),
        IntegrationSetting(tool_name="Linear", config_data={"workspace_slug": "acme-ops"}, is_connected=False),
        IntegrationSetting(tool_name="Trello", config_data={"board_id": "9218bc210"}, is_connected=False)
    ]
    for i in integrations:
        db.add(i)
    db.commit()

    print("Database seeded successfully with premium mock data.")

def clear_demo_data(db: Session):
    """
    Purges all demo issues, feedbacks, comments, feature requests, releases, and integration settings,
    leaving a clean workspace ready for real user testing and live data ingestion.
    Preserves user accounts so logged in users stay authenticated.
    """
    db.query(Feedback).delete()
    db.query(IssueComment).delete()
    db.query(Issue).delete()
    db.query(FeatureRequest).delete()
    db.query(Release).delete()
    db.query(IntegrationSetting).delete()
    db.commit()
    print("All demo data cleared successfully. Database is now clean and ready for real data.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

