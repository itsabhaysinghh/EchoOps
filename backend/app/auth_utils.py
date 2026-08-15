import os
import hashlib
import base64
import jwt
from datetime import datetime, timedelta
from typing import Optional
from cryptography.fernet import Fernet
from backend.app.config import settings

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Derive 32-byte URL-safe base64 key for Fernet encryption from settings.ENCRYPTION_KEY
_enc_key_raw = hashlib.sha256(settings.ENCRYPTION_KEY.encode('utf-8')).digest()
_fernet_key = base64.urlsafe_b64encode(_enc_key_raw)
_cipher = Fernet(_fernet_key)

def encrypt_sensitive_data(plain_text: str) -> str:
    """
    Encrypt sensitive string data (API keys, webhooks) using AES-256 Fernet encryption.
    """
    if not plain_text:
        return ""
    encrypted_bytes = _cipher.encrypt(plain_text.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')

def decrypt_sensitive_data(cipher_text: str) -> str:
    """
    Decrypt AES-256 Fernet encrypted cipher text.
    """
    if not cipher_text:
        return ""
    try:
        decrypted_bytes = _cipher.decrypt(cipher_text.encode('utf-8'))
        return decrypted_bytes.decode('utf-8')
    except Exception:
        # Fallback if text was not encrypted
        return cipher_text

def get_password_hash(password: str, salt: Optional[bytes] = None) -> str:
    """
    Generate SHA256 PBKDF2 hash of the password with per-password random salt.
    Format: $pbkdf2-sha256$100000$salt_hex$hash_hex
    """
    if not salt:
        salt = os.urandom(16)
    salt_hex = salt.hex()
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return f"$pbkdf2-sha256$100000${salt_hex}${dk.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hashed value. Supports salted and legacy hashes.
    """
    if not plain_password or not hashed_password:
        return False

    # Check for salted format: $pbkdf2-sha256$100000$salt$hash
    if hashed_password.startswith("$pbkdf2-sha256$"):
        try:
            parts = hashed_password.split("$")
            if len(parts) == 5:
                iterations = int(parts[2])
                salt_bytes = bytes.fromhex(parts[3])
                expected_hash = parts[4]
                dk = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt_bytes, iterations)
                return dk.hex() == expected_hash
        except Exception:
            return False

    # Legacy static-salt fallback verification
    legacy_salt = b"echoops_salt_123"
    legacy_dk = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), legacy_salt, 100000)
    return legacy_dk.hex() == hashed_password

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
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token. Returns decoded dictionary or None.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

