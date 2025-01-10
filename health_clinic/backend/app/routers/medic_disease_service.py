from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

medic_disease_service_bp = Blueprint('medic_disease_service', __name__)

def map_db_medic_disease_service_to_response_medic_disease_service(db_medic_disease_service: models.medic.MedicDiseaseService) -> schemas.MedicDiseaseService:
    return schemas.MedicDiseaseService(
        id=db_medic_disease_service.id,
        medic_id=db_medic_disease_service.medic_id,
        disease_id=db_medic_disease_service.disease_id,
        service=db_medic_disease_service.service
    )

@medic_disease_service_bp.route("/api/medic_disease_services", methods=["POST"])
def create_medic_disease_service():
    db = next(get_db())
    medic_disease_service = schemas.MedicDiseaseServiceCreate(**request.json)
    db_medic_disease_service = crud.create_medic_disease_service(db=db, medic_disease_service=medic_disease_service)
    return jsonify(map_db_medic_disease_service_to_response_medic_disease_service(db_medic_disease_service).dict())

@medic_disease_service_bp.route("/api/medic_disease_services/<int:medic_disease_service_id>", methods=["GET"])
def read_medic_disease_service(medic_disease_service_id):
    db = next(get_db())
    db_medic_disease_service = crud.get_medic_disease_service(db=db, medic_disease_service_id=medic_disease_service_id)
    if db_medic_disease_service is None:
        abort(404, "Medic disease service not found")
    return jsonify(map_db_medic_disease_service_to_response_medic_disease_service(db_medic_disease_service).dict())

@medic_disease_service_bp.route("/api/medic_disease_services/<int:medic_disease_service_id>", methods=["PUT"])
def update_medic_disease_service(medic_disease_service_id):
    db = next(get_db())
    current_user = get_current_user()
    medic_disease_service = schemas.MedicDiseaseServiceUpdate(**request.json)
    db_medic_disease_service = crud.get_medic_disease_service(db=db, medic_disease_service_id=medic_disease_service_id)
    if db_medic_disease_service is None:
        abort(404, "Medic disease service not found")
    db_medic_disease_service = crud.update_medic_disease_service(db=db, medic_disease_service_id=medic_disease_service_id, medic_disease_service=medic_disease_service)
    return jsonify(map_db_medic_disease_service_to_response_medic_disease_service(db_medic_disease_service).dict())

@medic_disease_service_bp.route("/api/medic_disease_services/<int:medic_disease_service_id>", methods=["DELETE"])
def delete_medic_disease_service(medic_disease_service_id):
    db = next(get_db())
    current_user = get_current_user()
    db_medic_disease_service = crud.get_medic_disease_service(db=db, medic_disease_service_id=medic_disease_service_id)
    if db_medic_disease_service is None:
        abort(404, "Medic disease service not found")
    db_medic_disease_service = crud.delete_medic_disease_service(db=db, medic_disease_service_id=medic_disease_service_id)
    return jsonify(map_db_medic_disease_service_to_response_medic_disease_service(db_medic_disease_service).dict())

@medic_disease_service_bp.route("/api/medic_disease_services", methods=["GET"])
def read_medic_disease_services():
    db = next(get_db())
    medic_disease_services = crud.get_medic_disease_services(db=db)
    return jsonify([map_db_medic_disease_service_to_response_medic_disease_service(medic_disease_service).dict() for medic_disease_service in medic_disease_services])
