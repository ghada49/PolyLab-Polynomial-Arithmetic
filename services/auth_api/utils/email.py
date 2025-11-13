
from .tokens import make_token
from ..models.token import Token
from ..models.user import User
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

def send_verification_email(db: Session, user: User) -> str:
    token = make_token(db, user, "verify", minutes=60)
    # DEV: print the link
    link = f"/auth/verify-email?token={token}"
    print(f"[DEV] Verify link for {user.email}: {link}")
    return token

def send_reset_email(db: Session, user: User) -> str:
    token = make_token(db, user, "reset", minutes=30)
    link = f"/auth/reset/confirm?token={token}"
    print(f"[DEV] Reset link for {user.email}: {link}")
    return token
