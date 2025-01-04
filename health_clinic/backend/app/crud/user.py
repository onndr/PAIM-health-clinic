from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.loan import Loan
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from datetime import datetime, timedelta

def create_user(db: Session, user: UserCreate, is_librarian: bool = False):
    db_user = User(
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        is_librarian=is_librarian,
        hashed_password=User.hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        if db_user.version != user.version:
            raise HTTPException(status_code=409, detail="Conflict: The user data was updated by another transaction.")

        for key, value in user.dict().items():
            if key == 'is_librarian':
                continue
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        user_loans = db.query(Loan).filter(Loan.user_id == user_id).all()
        for loan in user_loans:
            db.delete(loan)
        db.delete(db_user)
        db.commit()
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: Session):
    users = db.query(User).all()
    return users
