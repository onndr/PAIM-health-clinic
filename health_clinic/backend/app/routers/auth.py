from fastapi.security import OAuth2PasswordBearer
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from app import schemas, models, crud
from app.database import get_db
from app.models.user import User
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta


auth_bp = Blueprint('auth', __name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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

def get_current_user():
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        return jsonify({"detail": "Could not validate credentials"}), 401
    token = token[len("Bearer "):]
    credentials_exception = jsonify({"detail": "Could not validate credentials"}), 401
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            return credentials_exception
    except JWTError:
        return credentials_exception
    db = next(get_db())
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        return credentials_exception
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@auth_bp.route("/api/users/register", methods=["POST"])
def register():
    data = request.get_json()
    db = next(get_db())
    user = schemas.UserCreate(**data)
    created_user = crud.create_user(db=db, user=user)
    return map_db_user_to_response_user(created_user).dict()

@auth_bp.route("/api/users/login", methods=["POST"])
def login():
    data = request.get_json()
    db = get_db()
    db_user = crud.get_user_by_username(next(db), username=data['username'])
    if not db_user or not pwd_context.verify(data['password'], db_user.hashed_password):
        return jsonify({"detail": "Incorrect username or password"}), 400
    access_token = create_access_token(data={"username": db_user.username})
    return jsonify({"token": access_token, "token_type": "bearer", "is_librarian": db_user.is_librarian})
