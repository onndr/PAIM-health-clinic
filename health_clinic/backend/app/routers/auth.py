from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import schemas, models, crud
from app.database import get_db


auth_bp = Blueprint('auth', __name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            abort(401, "Could not validate credentials")
    except JWTError:
        abort(401, "Could not validate credentials")
    db = next(get_db())
    user = db.query(models.user.User).filter(models.user.User.username == username).first()
    if user is None:
        abort(401, "Could not validate credentials")
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
    try:
        created_user = crud.create_user(db=db, user=user)
    except Exception as e:
        return jsonify({"detail": str(e)}), 400
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
