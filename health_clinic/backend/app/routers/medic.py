from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

medic_bp = Blueprint('medic', __name__)

def map_db_medic_to_response_medic(db_medic: models.medic.Medic) -> schemas.Medic:
    return schemas.Medic(
        id=db_medic.id,
        pesel=db_medic.pesel,
        email=db_medic.email,
        first_name=db_medic.first_name,
        last_name=db_medic.last_name,
        phone_number=db_medic.phone_number
    )

@medic_bp.route("/api/medics", methods=["POST"])
def create_medic():
    db = next(get_db())
    medic = schemas.MedicCreate(**request.json)
    db_medic = crud.create_medic(db=db, medic=medic)
    return jsonify(map_db_medic_to_response_medic(db_medic).dict())

@medic_bp.route("/api/medics/<int:medic_id>", methods=["GET"])
def read_medic(medic_id):
    db = next(get_db())
    db_medic = crud.get_medic(db=db, medic_id=medic_id)
    if db_medic is None:
        abort(404, "Medic not found")
    return jsonify(map_db_medic_to_response_medic(db_medic).dict())

@medic_bp.route("/api/medics/<int:medic_id>", methods=["PUT"])
def update_medic(medic_id):
    db = next(get_db())
    current_user = get_current_user()
    medic = schemas.MedicUpdate(**request.json)
    db_medic = crud.get_medic(db=db, medic_id=medic_id)
    if db_medic is None:
        abort(404, "Medic not found")
    db_medic = crud.update_medic(db=db, medic_id=medic_id, medic=medic)
    return jsonify(map_db_medic_to_response_medic(db_medic).dict())

@medic_bp.route("/api/medics/<int:medic_id>", methods=["DELETE"])
def delete_medic(medic_id):
    db = next(get_db())
    current_user = get_current_user()
    db_medic = crud.get_medic(db=db, medic_id=medic_id)
    if db_medic is None:
        abort(404, "Medic not found")
    db_medic = crud.delete_medic(db=db, medic_id=medic_id)
    return jsonify(map_db_medic_to_response_medic(db_medic).dict())

@medic_bp.route("/api/medics", methods=["GET"])
def read_medics():
    db = next(get_db())
    medics = crud.get_medics(db=db)
    return jsonify([map_db_medic_to_response_medic(medic).dict() for medic in medics])
