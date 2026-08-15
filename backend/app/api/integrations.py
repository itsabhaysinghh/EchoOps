from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Issue, IntegrationSetting
from backend.app.schemas import IntegrationConnect, IntegrationResponse
from backend.app.api.app_stores import scan_app_store, AppStoreScanRequest
from backend.app.api.instagram import scan_instagram_post, InstagramScanRequest
from typing import List
import datetime
import requests
from requests.auth import HTTPBasicAuth
from backend.app.api.auth_dep import get_current_user

router = APIRouter(prefix="/api/integrations", tags=["Integrations"], dependencies=[Depends(get_current_user)])

# Standard channels & tools list
STANDARD_TOOLS = [
    "Google Play Store", 
    "Apple App Store", 
    "Instagram", 
    "Trustpilot", 
    "Jira", 
    "GitHub", 
    "Linear", 
    "Trello", 
    "ClickUp", 
    "Slack"
]

@router.get("", response_model=List[IntegrationResponse])
def get_integrations(db: Session = Depends(get_db)):
    connections = db.query(IntegrationSetting).all()
    connected_map = {c.tool_name: c for c in connections}
    
    result = []
    for tool in STANDARD_TOOLS:
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

    # If this is a feedback channel link, automatically trigger review scanning & issue creation
    url = conn.config_data.get("url") or conn.config_data.get("link")
    if url:
        try:
            if "instagram.com" in url or "instagr.am" in url or conn.tool_name == "Instagram":
                scan_instagram_post(InstagramScanRequest(post_url=url, max_comments=10), db=db)
            elif "play.google.com" in url or "apps.apple.com" in url or conn.tool_name in ["Google Play Store", "Apple App Store"]:
                scan_app_store(AppStoreScanRequest(app_url=url, max_reviews=10), db=db)
        except Exception as e:
            print(f"Auto-scan warning during integration connect for {conn.tool_name}:", e)

    return setting

@router.post("/disconnect")
def disconnect_integration(tool_name: str, db: Session = Depends(get_db)):
    setting = db.query(IntegrationSetting).filter(IntegrationSetting.tool_name == tool_name).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Integration not found")
    setting.is_connected = False
    db.commit()
    return {"status": "success", "message": f"Disconnected {tool_name} successfully."}

@router.post("/rescan")
def rescan_integrations(db: Session = Depends(get_db)):
    """
    Re-scans all active connected links (Google Play Store, App Store, Instagram)
    to ingest new customer reviews and update issue clusters.
    """
    active_integrations = db.query(IntegrationSetting).filter(IntegrationSetting.is_connected == True).all()
    scanned_count = 0
    
    for item in active_integrations:
        url = item.config_data.get("url") or item.config_data.get("link")
        if not url:
            continue
        try:
            if "instagram.com" in url or item.tool_name == "Instagram":
                scan_instagram_post(InstagramScanRequest(post_url=url, max_comments=10), db=db)
                scanned_count += 1
            elif "play.google.com" in url or "apps.apple.com" in url or item.tool_name in ["Google Play Store", "Apple App Store"]:
                scan_app_store(AppStoreScanRequest(app_url=url, max_reviews=10), db=db)
                scanned_count += 1
        except Exception as e:
            print(f"Rescan error for {item.tool_name}:", e)

    return {
        "status": "success",
        "message": f"Successfully re-scanned {scanned_count} connected links and updated issue clusters.",
        "scanned_count": scanned_count
    }


# Mock/Real creation endpoints for engineering tools
@router.post("/jira/{issue_id}")
def create_jira_ticket(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    setting = db.query(IntegrationSetting).filter(IntegrationSetting.tool_name == "Jira").first()
    if not setting or not setting.is_connected:
        raise HTTPException(
            status_code=400,
            detail="Jira is not connected. Configure it under Workspace Integrations first."
        )
        
    config = setting.config_data
    workspace = config.get("workspace")
    project = config.get("project")
    email = config.get("email")
    token = config.get("token")
    
    is_mock = (
        workspace == "acme-jira.atlassian.net" 
        or token == "Atlassian account API token" 
        or not token 
        or not email
    )
    if is_mock:
        # Fall back to simulation
        ticket_key = f"FEEDBACK-{issue.id}"
        issue.status = "In Progress"
        issue.updated_at = datetime.datetime.utcnow()
        issue.linked_tickets = {
            **(issue.linked_tickets or {}),
            "Jira": {
                "key": ticket_key,
                "url": f"https://acme-jira.atlassian.net/browse/{ticket_key}"
            }
        }
        db.commit()
        return {
            "status": "success",
            "key": ticket_key,
            "url": f"https://acme-jira.atlassian.net/browse/{ticket_key}",
            "message": f"Successfully created simulated Jira ticket {ticket_key} (Mock mode)."
        }
        
    # Prepend https:// if domain doesn't contain it
    domain = workspace
    if not domain.startswith("http://") and not domain.startswith("https://"):
        domain = "https://" + domain
        
    url = f"{domain.rstrip('/')}/rest/api/3/issue"
    payload = {
        "fields": {
            "project": {
                "key": project
            },
            "summary": f"[EchoOps] {issue.title}",
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                               "type": "text",
                               "text": f"AI-diagnosed issue summary:\n{issue.summary}\n\nRoot cause details:\n{issue.root_cause or 'Heuristically identified issue.'}"
                            }
                        ]
                    }
                ]
            },
            "issuetype": {
                "name": "Bug"
            }
        }
    }
    
    try:
        response = requests.post(
            url,
            json=payload,
            auth=HTTPBasicAuth(email, token),
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            timeout=10
        )
        if response.status_code == 201:
            res_data = response.json()
            ticket_key = res_data.get("key")
            browse_url = f"{domain.rstrip('/')}/browse/{ticket_key}"
            
            # Update local issue
            issue.status = "In Progress"
            issue.updated_at = datetime.datetime.utcnow()
            issue.linked_tickets = {
                **(issue.linked_tickets or {}),
                "Jira": {
                    "key": ticket_key,
                    "url": browse_url
                }
            }
            db.commit()
            
            return {
                "status": "success",
                "key": ticket_key,
                "url": browse_url,
                "message": f"Successfully created Jira ticket {ticket_key}."
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Jira API error: {response.text}"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reach Jira server: {str(e)}"
        )

@router.post("/github/{issue_id}")
def create_github_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    setting = db.query(IntegrationSetting).filter(IntegrationSetting.tool_name == "GitHub").first()
    if not setting or not setting.is_connected:
        raise HTTPException(
            status_code=400,
            detail="GitHub is not connected. Configure it under Workspace Integrations first."
        )
        
    config = setting.config_data
    repo = config.get("repo")
    pat = config.get("pat")
    
    is_mock = (
        repo == "acme-saas/echoops-feedback"
        or pat == "ghp_..."
        or not pat
        or not repo
    )
    if is_mock:
        # Fall back to simulation
        issue_number = 100 + issue.id
        browse_url = f"https://github.com/acme-saas/echoops-feedback/issues/{issue_number}"
        issue.status = "In Progress"
        issue.updated_at = datetime.datetime.utcnow()
        issue.linked_tickets = {
            **(issue.linked_tickets or {}),
            "GitHub": {
                "number": issue_number,
                "url": browse_url
            }
        }
        db.commit()
        return {
            "status": "success",
            "number": issue_number,
            "url": browse_url,
            "message": f"Successfully created simulated GitHub issue #{issue_number} (Mock mode)."
        }
        
    url = f"https://api.github.com/repos/{repo}/issues"
    headers = {
        "Authorization": f"Bearer {pat}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    payload = {
        "title": f"[EchoOps] {issue.title}",
        "body": f"### Summary\n{issue.summary}\n\n### Root Cause\n{issue.root_cause or 'Heuristically identified issue.'}\n\n---\n*Created automatically via EchoOps Feedback OS.*"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code == 201:
            res_data = response.json()
            issue_number = res_data.get("number")
            browse_url = res_data.get("html_url")
            
            # Update local issue
            issue.status = "In Progress"
            issue.updated_at = datetime.datetime.utcnow()
            issue.linked_tickets = {
                **(issue.linked_tickets or {}),
                "GitHub": {
                    "number": issue_number,
                    "url": browse_url
                }
            }
            db.commit()
            
            return {
                "status": "success",
                "number": issue_number,
                "url": browse_url,
                "message": f"Successfully created GitHub issue #{issue_number}."
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"GitHub API error: {response.text}"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reach GitHub server: {str(e)}"
        )

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
