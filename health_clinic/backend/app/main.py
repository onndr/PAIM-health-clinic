import os

from flask import Flask, send_from_directory
from sqlalchemy import inspect, text

import app.models as models
import app.routers as routers
from app.database import engine, Base, SessionLocal


app = Flask(__name__, static_folder='../../frontend/build')

app.register_blueprint(routers.auth.auth_bp)
app.register_blueprint(routers.patient.patient_bp)
app.register_blueprint(routers.disease.disease_bp)
app.register_blueprint(routers.patient_disease.patient_disease_bp)

app.register_blueprint(routers.medic.medic_bp)
app.register_blueprint(routers.medic_disease_service.medic_disease_service_bp)
app.register_blueprint(routers.medic_timetable.medic_timetable_bp)
app.register_blueprint(routers.appointment.appointment_bp)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

Base.metadata.create_all(bind=engine)

# Initialize the database with initial data
def init_db():
    db = SessionLocal()
    try:
        # Add initial patients
        patients = [
            models.Patient(
                pesel="12345678901",
                email="patient1@example.com",
                first_name="John",
                last_name="Doe",
                phone_number="123456789",
                hashed_password=models.Patient.hash_password("111")
            ),
            models.Patient(
                pesel="23456789012",
                email="patient2@example.com",
                first_name="Jane",
                last_name="Smith",
                phone_number="987654321",
                hashed_password=models.Patient.hash_password("111")
            )
        ]
        for patient in patients:
            db.add(patient)
        db.commit()

        # Add initial medics
        medics = [
            models.Medic(
                pesel="34567890123",
                email="medic1@example.com",
                first_name="Alice",
                last_name="Brown",
                phone_number="123123123",
                hashed_password=models.Medic.hash_password("111")
            ),
            models.Medic(
                pesel="45678901234",
                email="medic2@example.com",
                first_name="Bob",
                last_name="Johnson",
                phone_number="321321321",
                hashed_password=models.Medic.hash_password("111")
            )
        ]
        for medic in medics:
            db.add(medic)
        db.commit()

        # Add initial diseases
        diseases = [
            models.Disease(name="Flu"),
            models.Disease(name="Cold"),
            models.Disease(name="COVID-19")
        ]
        for disease in diseases:
            db.add(disease)
        db.commit()

        # Add initial patient diseases
        patient_diseases = [
            models.PatientDisease(patient_id=1, disease_id=1),
            models.PatientDisease(patient_id=2, disease_id=2)
        ]
        for patient_disease in patient_diseases:
            db.add(patient_disease)
        db.commit()

        # Add initial medic disease services
        medic_disease_services = [
            models.MedicDiseaseService(medic_id=1, disease_id=1, service="Consultation"),
            models.MedicDiseaseService(medic_id=2, disease_id=2, service="Treatment")
        ]
        for medic_disease_service in medic_disease_services:
            db.add(medic_disease_service)
        db.commit()

        # Add initial appointments
        appointments = [
            models.Appointment(
                medic_id=1,
                patient_disease_id=1,
                termin="2025-01-01T10:00:00",
                status=models.AppointmentStatus.Realized,
                medic_notes="Initial consultation",
                patient_rate=5,
                patient_feedback="Very good"
            ),
            models.Appointment(
                medic_id=2,
                patient_disease_id=2,
                termin="2025-01-02T11:00:00",
                status=models.AppointmentStatus.Realized,
                medic_notes="Follow-up",
                patient_rate=4,
                patient_feedback="Good"
            )
        ]
        for appointment in appointments:
            db.add(appointment)
        db.commit()

        # Add initial medic timetables
        medic_timetables = [
            models.MedicTimetable(
                medic_id=1,
                day=models.Day.Monday,
                from_time="09:00:00",
                to_time="17:00:00"
            ),
            models.MedicTimetable(
                medic_id=2,
                day=models.Day.Tuesday,
                from_time="10:00:00",
                to_time="18:00:00"
            )
        ]
        for medic_timetable in medic_timetables:
            db.add(medic_timetable)
        db.commit()

    finally:
        db.close()

# check if db tables are empty
def is_db_empty():
    db = SessionLocal()
    try:
        for table_name in inspect(engine).get_table_names():
            if db.execute(text(f"SELECT 1 FROM {table_name} LIMIT 1")).first():
                return False
        return True
    finally:
        db.close()

if is_db_empty():
    init_db()

app.run(use_reloader=True, port=5000, threaded=True)
