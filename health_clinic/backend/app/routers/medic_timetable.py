from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

medic_timetable_bp = Blueprint('medic_timetable', __name__)

def map_db_medic_timetable_to_response_medic_timetable(db_medic_timetable: models.medic.MedicTimetable) -> schemas.MedicTimetable:
    return schemas.MedicTimetable(
        id=db_medic_timetable.id,
        medic_id=db_medic_timetable.medic_id,
        day=db_medic_timetable.day,
        from_time=str(db_medic_timetable.from_time),
        to_time=str(db_medic_timetable.to_time)
    )

@medic_timetable_bp.route("/api/medic_timetables", methods=["POST"])
def create_medic_timetable():
    db = next(get_db())
    medic_timetable = schemas.MedicTimetableCreate(**request.json)
    db_medic_timetable = crud.create_medic_timetable(db=db, medic_timetable=medic_timetable)
    return jsonify(map_db_medic_timetable_to_response_medic_timetable(db_medic_timetable).dict())

@medic_timetable_bp.route("/api/medic_timetables/<int:medic_timetable_id>", methods=["GET"])
def read_medic_timetable(medic_timetable_id):
    db = next(get_db())
    db_medic_timetable = crud.get_medic_timetable(db=db, medic_timetable_id=medic_timetable_id)
    if db_medic_timetable is None:
        abort(404, "Medic timetable not found")
    return jsonify(map_db_medic_timetable_to_response_medic_timetable(db_medic_timetable).dict())

@medic_timetable_bp.route("/api/medic_timetables/<int:medic_timetable_id>", methods=["PUT"])
def update_medic_timetable(medic_timetable_id):
    db = next(get_db())
    current_user = get_current_user()
    medic_timetable = schemas.MedicTimetableUpdate(**request.json)
    db_medic_timetable = crud.get_medic_timetable(db=db, medic_timetable_id=medic_timetable_id)
    if db_medic_timetable is None:
        abort(404, "Medic timetable not found")
    db_medic_timetable = crud.update_medic_timetable(db=db, medic_timetable_id=medic_timetable_id, medic_timetable=medic_timetable)
    return jsonify(map_db_medic_timetable_to_response_medic_timetable(db_medic_timetable).dict())

@medic_timetable_bp.route("/api/medic_timetables/<int:medic_timetable_id>", methods=["DELETE"])
def delete_medic_timetable(medic_timetable_id):
    db = next(get_db())
    current_user = get_current_user()
    db_medic_timetable = crud.get_medic_timetable(db=db, medic_timetable_id=medic_timetable_id)
    if db_medic_timetable is None:
        abort(404, "Medic timetable not found")
    db_medic_timetable = crud.delete_medic_timetable(db=db, medic_timetable_id=medic_timetable_id)
    return jsonify(map_db_medic_timetable_to_response_medic_timetable(db_medic_timetable).dict())

@medic_timetable_bp.route("/api/medic_timetables", methods=["GET"])
def read_medic_timetables():
    db = next(get_db())
    medic_timetables = crud.get_medic_timetables(db=db)
    return jsonify([map_db_medic_timetable_to_response_medic_timetable(medic_timetable).dict() for medic_timetable in medic_timetables])
