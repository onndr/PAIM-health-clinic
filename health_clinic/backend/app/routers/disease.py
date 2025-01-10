from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

disease_bp = Blueprint('disease', __name__)

def map_db_disease_to_response_disease(db_disease: models.patient.Disease) -> schemas.Disease:
    return schemas.Disease(
        id=db_disease.id,
        name=db_disease.name
    )

@disease_bp.route("/api/diseases", methods=["POST"])
def create_disease():
    db = next(get_db())
    disease = schemas.DiseaseCreate(**request.json)
    db_disease = crud.create_disease(db=db, disease=disease)
    return jsonify(map_db_disease_to_response_disease(db_disease).dict())

@disease_bp.route("/api/diseases/<int:disease_id>", methods=["GET"])
def read_disease(disease_id):
    db = next(get_db())
    db_disease = crud.get_disease(db=db, disease_id=disease_id)
    if db_disease is None:
        abort(404, "Disease not found")
    return jsonify(map_db_disease_to_response_disease(db_disease).dict())

@disease_bp.route("/api/diseases/<int:disease_id>", methods=["PUT"])
def update_disease(disease_id):
    db = next(get_db())
    current_user = get_current_user()
    disease = schemas.DiseaseUpdate(**request.json)
    db_disease = crud.get_disease(db=db, disease_id=disease_id)
    if db_disease is None:
        abort(404, "Disease not found")
    db_disease = crud.update_disease(db=db, disease_id=disease_id, disease=disease)
    return jsonify(map_db_disease_to_response_disease(db_disease).dict())

@disease_bp.route("/api/diseases/<int:disease_id>", methods=["DELETE"])
def delete_disease(disease_id):
    db = next(get_db())
    current_user = get_current_user()
    db_disease = crud.get_disease(db=db, disease_id=disease_id)
    if db_disease is None:
        abort(404, "Disease not found")
    db_disease = crud.delete_disease(db=db, disease_id=disease_id)
    return jsonify(map_db_disease_to_response_disease(db_disease).dict())

@disease_bp.route("/api/diseases", methods=["GET"])
def read_diseases():
    db = next(get_db())
    diseases = crud.get_diseases(db=db)
    return jsonify([map_db_disease_to_response_disease(disease).dict() for disease in diseases])
