from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

patient_disease_bp = Blueprint('patient_disease', __name__)

def map_db_patient_disease_to_response_patient_disease(db_patient_disease: models.patient.PatientDisease) -> schemas.PatientDisease:
    return schemas.PatientDisease(
        id=db_patient_disease.id,
        patient_id=db_patient_disease.patient_id,
        disease_id=db_patient_disease.disease_id
    )

@patient_disease_bp.route("/api/patient_diseases", methods=["POST"])
def create_patient_disease():
    db = next(get_db())
    patient_disease = schemas.PatientDiseaseCreate(**request.json)
    db_patient_disease = crud.create_patient_disease(db=db, patient_disease=patient_disease)
    return jsonify(map_db_patient_disease_to_response_patient_disease(db_patient_disease).dict())

@patient_disease_bp.route("/api/patient_diseases/<int:patient_disease_id>", methods=["GET"])
def read_patient_disease(patient_disease_id):
    db = next(get_db())
    db_patient_disease = crud.get_patient_disease(db=db, patient_disease_id=patient_disease_id)
    if db_patient_disease is None:
        abort(404, "Patient disease not found")
    return jsonify(map_db_patient_disease_to_response_patient_disease(db_patient_disease).dict())

@patient_disease_bp.route("/api/patient_diseases/<int:patient_disease_id>", methods=["PUT"])
def update_patient_disease(patient_disease_id):
    db = next(get_db())
    current_user = get_current_user()
    patient_disease = schemas.PatientDiseaseUpdate(**request.json)
    db_patient_disease = crud.get_patient_disease(db=db, patient_disease_id=patient_disease_id)
    if db_patient_disease is None:
        abort(404, "Patient disease not found")
    db_patient_disease = crud.update_patient_disease(db=db, patient_disease_id=patient_disease_id, patient_disease=patient_disease)
    return jsonify(map_db_patient_disease_to_response_patient_disease(db_patient_disease).dict())

@patient_disease_bp.route("/api/patient_diseases/<int:patient_disease_id>", methods=["DELETE"])
def delete_patient_disease(patient_disease_id):
    db = next(get_db())
    current_user = get_current_user()
    db_patient_disease = crud.get_patient_disease(db=db, patient_disease_id=patient_disease_id)
    if db_patient_disease is None:
        abort(404, "Patient disease not found")
    db_patient_disease = crud.delete_patient_disease(db=db, patient_disease_id=patient_disease_id)
    return jsonify(map_db_patient_disease_to_response_patient_disease(db_patient_disease).dict())

@patient_disease_bp.route("/api/patient_diseases", methods=["GET"])
def read_patient_diseases():
    db = next(get_db())
    patient_diseases = crud.get_patient_diseases(db=db)
    return jsonify([map_db_patient_disease_to_response_patient_disease(patient_disease).dict() for patient_disease in patient_diseases])
