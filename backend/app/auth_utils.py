import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = "supersecretkeyforechoopsapp"  # In production, this would be loaded from env/settings
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def get_password_hash(password: str) -> str:
    """
    Generate SHA256 PBKDF2 hash of the password.
    """
    salt = b"echoops_salt_123"
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return dk.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hashed value.
    Returns False if either parameter is missing, empty, or None, or if the hash doesn't match.
    """
    if not plain_password or not hashed_password:
        return False
    return get_password_hash(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token encoding the provided data dictionary.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token. Returns decoded dictionary or None.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
