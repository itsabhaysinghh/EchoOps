from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Issue, IntegrationSetting
from backend.app.schemas import IntegrationConnect, IntegrationResponse
from typing import List
import datetime

router = APIRouter(prefix="/api/integrations", tags=["Integrations"])

@router.get("", response_model=List[IntegrationResponse])
def get_integrations(db: Session = Depends(get_db)):
    # Standard tools list
    tools = ["Jira", "GitHub", "Linear", "Trello", "ClickUp", "Azure DevOps", "Slack", "Microsoft Teams"]
    connections = db.query(IntegrationSetting).all()
    connected_map = {c.tool_name: c for c in connections}
    
    result = []
    for tool in tools:
        if tool in connected_map:
            result.append(connected_map[tool])
        else:
            # Return disconnected representation
            result.append(
                IntegrationSetting(
                    tool_name=tool,
                    config_data={},
                    is_connected=False,
                    connected_at=datetime.datetime.utcnow()
                )
            )
    return result

@router.post("/connect", response_model=IntegrationResponse)
def connect_integration(conn: IntegrationConnect, db: Session = Depends(get_db)):
    setting = db.query(IntegrationSetting).filter(IntegrationSetting.tool_name == conn.tool_name).first()
    if setting:
        setting.is_connected = True
        setting.config_data = conn.config_data
        setting.connected_at = datetime.datetime.utcnow()
    else:
        setting = IntegrationSetting(
            tool_name=conn.tool_name,
            config_data=conn.config_data,
            is_connected=True,
            connected_at=datetime.datetime.utcnow()
        )
        db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting

@router.post("/disconnect")
def disconnect_integration(tool_name: str, db: Session = Depends(get_db)):
    setting = db.query(IntegrationSetting).filter(IntegrationSetting.tool_name == tool_name).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Integration not found")
    setting.is_connected = False
    db.commit()
    return {"status": "success", "message": f"Disconnected {tool_name}."}

# Mock creation endpoints for engineering tools
@router.post("/jira/{issue_id}")
def create_jira_ticket(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    # Simulate API creation
    ticket_key = f"FEEDBACK-{issue.id}"
    issue.status = "In Progress"
    issue.updated_at = datetime.datetime.utcnow()
    db.commit()
    
    return {
        "status": "success",
        "key": ticket_key,
        "url": f"https://acme-jira.atlassian.net/browse/{ticket_key}",
        "message": f"Successfully created Jira ticket {ticket_key}."
    }

@router.post("/github/{issue_id}")
def create_github_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    issue.status = "In Progress"
    issue.updated_at = datetime.datetime.utcnow()
    db.commit()
    
    return {
        "status": "success",
        "number": 100 + issue.id,
        "url": f"https://github.com/acme-saas/echoops-feedback/issues/{100+issue.id}",
        "message": f"Successfully created GitHub issue #{100+issue.id}."
    }

@router.post("/linear/{issue_id}")
def create_linear_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    issue.status = "In Progress"
    issue.updated_at = datetime.datetime.utcnow()
    db.commit()
    
    return {
        "status": "success",
        "key": f"OPS-{issue.id}",
        "url": f"https://linear.app/acme-ops/issue/OPS-{issue.id}",
        "message": f"Successfully created Linear issue OPS-{issue.id}."
    }

@router.post("/trello/{issue_id}")
def create_trello_card(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    return {
        "status": "success",
        "card_id": f"trello_card_{issue.id}",
        "url": f"https://trello.com/c/card{issue.id}",
        "message": "Successfully created Trello card."
    }

@router.post("/clickup/{issue_id}")
def create_clickup_task(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    return {
        "status": "success",
        "task_id": f"clk_{issue.id}",
        "url": f"https://app.clickup.com/t/clk_{issue.id}",
        "message": "Successfully created ClickUp task."
    }

@router.post("/azure/{issue_id}")
def create_azure_work_item(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    return {
        "status": "success",
        "work_item_id": 5000 + issue.id,
        "url": f"https://dev.azure.com/acme/feedback/_workitems/edit/{5000+issue.id}",
        "message": f"Successfully created Azure Work Item #{5000+issue.id}."
    }
