from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime
from backend.app.database import get_db
from backend.app.models import Company, Workspace, User, IntegrationSetting
from backend.app.schemas import CompanyCreate, CompanyResponse, WorkspaceCreate, WorkspaceResponse, UserInvite, UserResponse
from backend.app.api.auth_dep import get_current_user

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding"], dependencies=[Depends(get_current_user)])

@router.post("/company", response_model=CompanyResponse)
def create_company(company_in: CompanyCreate, db: Session = Depends(get_db)):
    company = Company(
        name=company_in.name,
        industry=company_in.industry,
        website=company_in.website,
        timezone=company_in.timezone
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.post("/workspace", response_model=WorkspaceResponse)
def create_workspace(workspace_in: WorkspaceCreate, db: Session = Depends(get_db)):
    # Check if company exists
    company = db.query(Company).filter(Company.id == workspace_in.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    workspace = Workspace(
        name=workspace_in.name,
        company_id=workspace_in.company_id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return workspace

from sqlalchemy import func

@router.post("/invite", response_model=List[UserResponse])
def invite_members(company_id: int, workspace_id: int, invites: List[UserInvite], db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    invited_users = []
    for inv in invites:
        clean_email = inv.email.strip().lower()
        # Check if user already exists (case-insensitive)
        existing = db.query(User).filter(func.lower(User.email) == clean_email).first()
        if existing:
            # Re-associate existing user without creating a duplicate account
            existing.company_id = company_id
            existing.workspace_id = workspace_id
            existing.role = inv.role
            db.commit()
            invited_users.append(existing)
        else:
            name_part = clean_email.split("@")[0].title()
            new_user = User(
                email=clean_email,
                name=name_part,
                role=inv.role,
                company_id=company_id,
                workspace_id=workspace_id
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            invited_users.append(new_user)
            
    return invited_users


@router.post("/connect-source")
def connect_source(source_name: str, db: Session = Depends(get_db)):
    # Check if integration setting exists or create it
    setting = db.query(IntegrationSetting).filter(IntegrationSetting.tool_name == source_name).first()
    if setting:
        setting.is_connected = True
    else:
        setting = IntegrationSetting(
            tool_name=source_name,
            config_data={"connected_at": str(datetime.datetime.utcnow())},
            is_connected=True
        )
        db.add(setting)
    db.commit()
    return {"status": "success", "message": f"{source_name} connected successfully."}
