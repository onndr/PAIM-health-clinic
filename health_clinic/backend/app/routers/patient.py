from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

patient_bp = Blueprint('patient', __name__)

def map_db_patient_to_response_patient(db_patient: models.patient.Patient) -> schemas.Patient:
    return schemas.Patient(
        id=db_patient.id,
        pesel=db_patient.pesel,
        email=db_patient.email,
        first_name=db_patient.first_name,
        last_name=db_patient.last_name,
        phone_number=db_patient.phone_number,
        version=db_patient.version
    )

@patient_bp.route("/api/patients", methods=["POST"])
def create_patient():
    db = next(get_db())
    patient = schemas.PatientCreate(**request.json)
    db_patient = crud.create_patient(db=db, patient=patient)
    return jsonify(map_db_patient_to_response_patient(db_patient).dict())

@patient_bp.route("/api/patients/<int:patient_id>", methods=["GET"])
def read_patient(patient_id):
    db = next(get_db())
    db_patient = crud.get_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        abort(404, "Patient not found")
    return jsonify(map_db_patient_to_response_patient(db_patient).dict())

@patient_bp.route("/api/patients/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    db = next(get_db())
    current_user = get_current_user()
    patient = schemas.PatientUpdate(**request.json)
    db_patient = crud.get_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        abort(404, "Patient not found")
    db_patient = crud.update_patient(db=db, patient_id=patient_id, patient=patient)
    return jsonify(map_db_patient_to_response_patient(db_patient).dict())

@patient_bp.route("/api/patients/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    db = next(get_db())
    current_user = get_current_user()
    db_patient = crud.get_patient(db=db, patient_id=patient_id)
    if db_patient is None:
        abort(404, "Patient not found")
    db_patient = crud.delete_patient(db=db, patient_id=patient_id)
    return jsonify(map_db_patient_to_response_patient(db_patient).dict())

@patient_bp.route("/api/patients", methods=["GET"])
def read_patients():
    db = next(get_db())
    patients = crud.get_patients(db=db)
    return jsonify([map_db_patient_to_response_patient(patient).dict() for patient in patients])
