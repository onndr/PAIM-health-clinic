from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

appointment_bp = Blueprint('appointment', __name__)

def map_db_appointment_to_response_appointment(db_appointment: models.medic.Appointment) -> schemas.Appointment:
    appointment = schemas.Appointment(
        id=db_appointment.id,
        medic_id=db_appointment.medic_id,
        patient_disease_id=db_appointment.patient_disease_id,
        termin=str(db_appointment.termin),
        status=db_appointment.status.value,
        medic_notes=db_appointment.medic_notes,
        patient_rate=db_appointment.patient_rate,
        patient_feedback=db_appointment.patient_feedback
    )
    return {**appointment.dict(), "status": str(appointment.status.value)}

@appointment_bp.route("/api/appointments", methods=["POST"])
def create_appointment():
    db = next(get_db())
    appointment = schemas.AppointmentCreate(**request.json)
    db_appointment = crud.create_appointment(db=db, appointment=appointment)
    return jsonify(map_db_appointment_to_response_appointment(db_appointment))

@appointment_bp.route("/api/appointments/<int:appointment_id>", methods=["GET"])
def read_appointment(appointment_id):
    db = next(get_db())
    db_appointment = crud.get_appointment(db=db, appointment_id=appointment_id)
    if db_appointment is None:
        abort(404, "Appointment not found")
    return jsonify(map_db_appointment_to_response_appointment(db_appointment))

@appointment_bp.route("/api/appointments/<int:appointment_id>", methods=["PUT"])
def update_appointment(appointment_id):
    db = next(get_db())
    current_user = get_current_user()
    appointment = schemas.AppointmentUpdate(**request.json)
    db_appointment = crud.get_appointment(db=db, appointment_id=appointment_id)
    if db_appointment is None:
        abort(404, "Appointment not found")
    db_appointment = crud.update_appointment(db=db, appointment_id=appointment_id, appointment=appointment)
    return jsonify(map_db_appointment_to_response_appointment(db_appointment))

@appointment_bp.route("/api/appointments/<int:appointment_id>", methods=["DELETE"])
def delete_appointment(appointment_id):
    db = next(get_db())
    current_user = get_current_user()
    db_appointment = crud.get_appointment(db=db, appointment_id=appointment_id)
    if db_appointment is None:
        abort(404, "Appointment not found")
    db_appointment = crud.delete_appointment(db=db, appointment_id=appointment_id)
    return jsonify(map_db_appointment_to_response_appointment(db_appointment))

@appointment_bp.route("/api/appointments", methods=["GET"])
def read_appointments():
    db = next(get_db())
    appointments = crud.get_appointments(db=db)
    return jsonify([map_db_appointment_to_response_appointment(appointment) for appointment in appointments])
