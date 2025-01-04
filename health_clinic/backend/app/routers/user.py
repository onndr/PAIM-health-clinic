from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.routers.auth import get_current_user
from app.database import get_db

router = APIRouter()

def map_db_user_to_response_user(db_user: models.user.User) -> schemas.User:
    return schemas.User(
        id=db_user.id,
        username=db_user.username if db_user.username else "",
        email=db_user.email if db_user.email else "",
        first_name=db_user.first_name if db_user.first_name else "",
        last_name=db_user.last_name if db_user.last_name else "",
        phone_number=db_user.phone_number if db_user.phone_number else "",
        is_librarian=db_user.is_librarian,
        version=db_user.version
    )

@router.get("/api/users", response_model=list[schemas.User])
def read_users(db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    if current_user.is_librarian is False:
        raise HTTPException(status_code=403, detail="User is not a librarian")
    users = crud.get_users(db)
    return [map_db_user_to_response_user(user) for user in users]

@router.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    if current_user.is_librarian is False:
        raise HTTPException(status_code=403, detail="User is not a librarian")
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return map_db_user_to_response_user(db_user)

@router.put("/api/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_user = crud.update_user(db=db, user_id=user_id, user=user)
    return map_db_user_to_response_user(db_user)

@router.get("/api/users/me/", response_model=schemas.User)
def read_current_user(current_user: models.user.User = Depends(get_current_user)):
    return map_db_user_to_response_user(current_user)

@router.delete("/api/users/me/", response_model=schemas.User)
def delete_current_user(db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    if current_user.is_librarian is True:
        raise HTTPException(status_code=403, detail="Librarians cannot delete their own accounts")
    db_user = crud.delete_user(db=db, user_id=current_user.id)
    return map_db_user_to_response_user(db_user)
