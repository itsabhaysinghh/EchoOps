from fastapi import Header, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from backend.app.database import get_db
from backend.app.models import User
from backend.app.auth_utils import verify_access_token

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    """
    FastAPI dependency to extract Bearer JWT tokens from the Authorization header
    and return the currently authenticated database User.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Missing or invalid Authorization header.",
        )
    
    token = authorization.split(" ")[1]
    payload = verify_access_token(token)
    if not payload or "email" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
        )
    
    user = db.query(User).filter(User.email == payload["email"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )
    return user
