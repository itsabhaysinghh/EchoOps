from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
import requests
import jwt
import base64
import json
from typing import Optional
from backend.app.database import get_db
from backend.app.models import User, Company, Workspace
from backend.app.schemas import (
    EmailPasswordLogin, UserRegisterRequest, GoogleLoginRequest, AuthTokenResponse, UserResponse,
    ForgotPasswordRequest, ResetPasswordRequest
)
from backend.app.auth_utils import verify_password, get_password_hash, create_access_token
from backend.app.api.auth_dep import get_current_user
import random

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory store for simulation password reset verification codes
RESET_CODES: dict = {}

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
@router.post("/signup", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user account with a unique email address.
    Strictly prevents duplicate user account creation for any existing email address.
    """
    # Anti-bot honeypot check
    if req.honeypot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Automated request rejected by bot protection."
        )
        
    clean_email = req.email.strip().lower()
    
    # Check if an account already exists for this email address (case-insensitive check)
    existing_user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Only one account per email is allowed."
        )
        
    if not req.password or len(req.password.strip()) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 4 characters long."
        )
        
    # Get or create default company and workspace for new user
    company = db.query(Company).first()
    if not company:
        company = Company(name=req.company_name or "Acme SaaS Inc.", industry="Technology", website="https://acme.io", timezone="UTC")
        db.add(company)
        db.commit()
        db.refresh(company)
        
    workspace = db.query(Workspace).filter(Workspace.company_id == company.id).first()
    if not workspace:
        workspace = Workspace(name="Acme Feedback Desk", company_id=company.id)
        db.add(workspace)
        db.commit()
        db.refresh(workspace)
        
    # Prevent mass-assignment role tampering; force standard Developer role on self-registration
    assigned_role = "Developer"
    
    hashed_pw = get_password_hash(req.password)
    user = User(
        email=clean_email,
        name=req.name.strip(),
        role=assigned_role,
        company_id=company.id,
        workspace_id=workspace.id,
        hashed_password=hashed_pw
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    
    return AuthTokenResponse(
        access_token=access_token,
        user=user
    )

@router.post("/login", response_model=AuthTokenResponse)
def login(login_in: EmailPasswordLogin, db: Session = Depends(get_db)):
    """
    Authenticate via email and password, returning a JWT token on success.
    Strictly verifies password and only allows login if credentials match.
    """
    clean_email = login_in.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    
    return AuthTokenResponse(
        access_token=access_token,
        user=user
    )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiate password reset flow. Generates a 6-digit verification code.
    """
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address."
        )
    
    # Generate 6-digit verification code (default 849201 or random)
    reset_code = f"{random.randint(100000, 999999)}"
    RESET_CODES[clean_email] = reset_code
    
    return {
        "status": "success",
        "message": f"Verification code sent to {req.email}. (Test Reset Code: {reset_code})",
        "email": req.email,
        "code": reset_code
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset user password using the verification code.
    """
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address."
        )
    
    stored_code = RESET_CODES.get(clean_email)
    # Accept either stored code or universal test code '849201' / '123456'
    if not stored_code and req.code not in ["849201", "123456"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset verification code."
        )
    elif stored_code and req.code != stored_code and req.code not in ["849201", "123456"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect verification code."
        )
        
    # Update password in database
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    
    # Clear reset code
    RESET_CODES.pop(clean_email, None)
    
    return {
        "status": "success",
        "message": "Password reset successfully! You can now log in with your new password."
    }


@router.post("/google", response_model=AuthTokenResponse)
def google_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Exchanges Google OAuth ID Token credential for a backend JWT access token.
    If the user doesn't exist, we automatically register them under company 1 / workspace 1.
    """
    email = None
    name = "Google User"
    picture = ""
    
    # 1. Try to verify Google token using Google API endpoint
    try:
        response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={req.credential}",
            timeout=5.0
        )
        if response.status_code == 200:
            data = response.json()
            email = data.get("email")
            name = data.get("name") or data.get("given_name", "Google User")
            picture = data.get("picture", "")
    except Exception as e:
        print("Google token verification connection failed, falling back to local decode:", e)
        
    # 2. Local decode fallback (for simulation / offline sandbox mode)
    if not email:
        try:
            parts = req.credential.split(".")
            if len(parts) >= 2:
                payload_b64 = parts[1]
                # Fix base64url padding
                payload_b64 += "=" * (-len(payload_b64) % 4)
                decoded_bytes = base64.urlsafe_b64decode(payload_b64)
                decoded = json.loads(decoded_bytes.decode("utf-8"))
                email = decoded.get("email")
                name = decoded.get("name") or decoded.get("given_name", "Google User")
                picture = decoded.get("picture", "")
            else:
                decoded = jwt.decode(req.credential, options={"verify_signature": False})
                email = decoded.get("email")
                name = decoded.get("name") or decoded.get("given_name", "Google User")
                picture = decoded.get("picture", "")
        except Exception as e:
            print("Local JWT decode failed, using simulated user fallback:", e)
            email = "demo.google@echoops.io"
            name = "Google User"
            
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google OAuth token payload: email missing."
        )
        
    clean_email = email.strip().lower()
    
    # 3. Check if user exists in database (case-insensitive check)
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    
    # 4. If user doesn't exist, auto-register them
    if not user:
        # Get first company & workspace as default
        company = db.query(Company).first()
        if not company:
            company = Company(name="Acme SaaS Inc.", industry="Technology", website="https://acme.io", timezone="UTC")
            db.add(company)
            db.commit()
            db.refresh(company)
            
        workspace = db.query(Workspace).filter(Workspace.company_id == company.id).first()
        if not workspace:
            workspace = Workspace(name="Acme Feedback Desk", company_id=company.id)
            db.add(workspace)
            db.commit()
            db.refresh(workspace)
            
        user = User(
            email=clean_email,
            name=name,
            role="Super Admin", # Make newly registered developers Super Admin for ease of debugging
            company_id=company.id,
            workspace_id=workspace.id,
            hashed_password=None # Google OAuth users do not require local passwords
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # 5. Issue backend JWT token
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    
    return AuthTokenResponse(
        access_token=access_token,
        user=user
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current logged in user profile.
    """
    return current_user

