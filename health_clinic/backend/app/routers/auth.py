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

def map_db_patient_to_response_patient(db_user: models.patient.Patient) -> schemas.Patient:
    return schemas.Patient(
        id=db_user.id,
        email=db_user.email if db_user.email else "",
        first_name=db_user.first_name if db_user.first_name else "",
        last_name=db_user.last_name if db_user.last_name else "",
        phone_number=db_user.phone_number if db_user.phone_number else "",
        pesel=db_user.pesel if db_user.pesel else "",
    )

def map_db_medic_to_response_medic(db_user: models.medic.Medic) -> schemas.Medic:
    return schemas.Medic(
        id=db_user.id,
        email=db_user.email if db_user.email else "",
        first_name=db_user.first_name if db_user.first_name else "",
        last_name=db_user.last_name if db_user.last_name else "",
        phone_number=db_user.phone_number if db_user.phone_number else "",
        pesel=db_user.pesel if db_user.pesel else "",
    )

def get_current_user():
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        return jsonify({"detail": "Could not validate credentials"}), 401
    token = token[len("Bearer "):]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        is_patient: bool = payload.get("is_patient")
        if email is None or is_patient is None:
            abort(401, "Could not validate credentials")
    except JWTError:
        abort(401, "Could not validate credentials")
    db = next(get_db())

    if is_patient:
        user = db.query(models.patient.Patient).filter(models.patient.Patient.email == email).first()
    else:
        user = db.query(models.medic.Medic).filter(models.medic.Medic.email == email).first()

    if user is None:
        abort(401, "Could not validate credentials")

    if is_patient:
        return map_db_patient_to_response_patient(user)
    else:
        return map_db_medic_to_response_medic(user)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@auth_bp.route("/api/patients/register/", methods=["POST"])
def register_patient():
    data = request.get_json()
    db = next(get_db())
    user = schemas.PatientCreate(**data)
    try:
        created_user = crud.create_patient(db=db, patient=user)
    except Exception as e:
        return abort(400, str(e))
    return map_db_patient_to_response_patient(created_user).dict()

@auth_bp.route("/api/medics/register/", methods=["POST"])
def register_medic():
    data = request.get_json()
    db = next(get_db())
    user = schemas.MedicCreate(**data)
    try:
        created_user = crud.create_medic(db=db, medic=user)
    except Exception as e:
        return abort(400, str(e))
    return map_db_medic_to_response_medic(created_user).dict()

@auth_bp.route("/api/users/login", methods=["POST"])
def login():
    data = request.get_json()
    db = next(get_db())
    data = {**data, 'is_patient': True}
    db_user = crud.get_patient_by_email(db, email=data['email'])

    if not db_user:
        data['is_patient'] = False
        db_user = crud.get_medic_by_email(db, email=data['email'])

    if not db_user or not pwd_context.verify(data['password'], db_user.hashed_password):
        abort(401, "Invalid credentials")

    access_token = create_access_token(data={"email": db_user.email, **data})
    return jsonify({"token": access_token, "token_type": "bearer", 'is_patient': data['is_patient'], 'id': db_user.id})
