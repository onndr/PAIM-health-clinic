from sqlalchemy.orm import Session
from app.models.medic import Medic, MedicDiseaseService, MedicTimetable, Appointment, AppointmentStatus
from app.schemas.medic import MedicCreate, MedicUpdate, MedicDiseaseServiceCreate, MedicDiseaseServiceUpdate, MedicTimetableCreate, MedicTimetableUpdate, AppointmentCreate, AppointmentUpdate


# CRUD operations for Medic
def create_medic(db: Session, medic: MedicCreate):
    db_medic = Medic(
        pesel=medic.pesel,
        email=medic.email,
        first_name=medic.first_name,
        last_name=medic.last_name,
        phone_number=medic.phone_number,
        hashed_password=Medic.hash_password(medic.password)
    )
    db.add(db_medic)
    db.commit()
    db.refresh(db_medic)
    return db_medic

def update_medic(db: Session, medic_id: int, medic: MedicUpdate):
    db_medic = db.query(Medic).filter(Medic.id == medic_id).first()
    if db_medic:
        for key, value in medic.dict().items():
            if key == 'password' and value:
                value = Medic.hash_password(value)
            setattr(db_medic, key, value)
        db.commit()
        db.refresh(db_medic)
    return db_medic

def delete_medic(db: Session, medic_id: int):
    db_medic = db.query(Medic).filter(Medic.id == medic_id).first()
    if db_medic:
        db.delete(db_medic)
        db.commit()
    return db_medic

def get_medic(db: Session, medic_id: int):
    return db.query(Medic).filter(Medic.id == medic_id).first()

def get_medic_by_email(db: Session, email: str):
    return db.query(Medic).filter(Medic.email == email).first()

def get_medics(db: Session):
    return db.query(Medic).all()


# CRUD operations for MedicDiseaseService
def create_medic_disease_service(db: Session, medic_disease_service: MedicDiseaseServiceCreate):
    db_medic_disease_service = MedicDiseaseService(
        medic_id=medic_disease_service.medic_id,
        disease_id=medic_disease_service.disease_id,
        service=medic_disease_service.service
    )
    db.add(db_medic_disease_service)
    db.commit()
    db.refresh(db_medic_disease_service)
    return db_medic_disease_service

def update_medic_disease_service(db: Session, medic_disease_service_id: int, medic_disease_service: MedicDiseaseServiceUpdate):
    db_medic_disease_service = db.query(MedicDiseaseService).filter(MedicDiseaseService.id == medic_disease_service_id).first()
    if db_medic_disease_service:
        for key, value in medic_disease_service.dict().items():
            setattr(db_medic_disease_service, key, value)
        db.commit()
        db.refresh(db_medic_disease_service)
    return db_medic_disease_service

def delete_medic_disease_service(db: Session, medic_disease_service_id: int):
    db_medic_disease_service = db.query(MedicDiseaseService).filter(MedicDiseaseService.id == medic_disease_service_id).first()
    if db_medic_disease_service:
        db.delete(db_medic_disease_service)
        db.commit()
    return db_medic_disease_service

def get_medic_disease_service(db: Session, medic_disease_service_id: int):
    return db.query(MedicDiseaseService).filter(MedicDiseaseService.id == medic_disease_service_id).first()

def get_medic_disease_services(db: Session):
    return db.query(MedicDiseaseService).all()


# CRUD operations for MedicTimetable
def create_medic_timetable(db: Session, medic_timetable: MedicTimetableCreate):
    db_medic_timetable = MedicTimetable(
        medic_id=medic_timetable.medic_id,
        day=str(medic_timetable.day.value),
        from_time=medic_timetable.from_time,
        to_time=medic_timetable.to_time
    )
    db.add(db_medic_timetable)
    db.commit()
    db.refresh(db_medic_timetable)
    return db_medic_timetable

def update_medic_timetable(db: Session, medic_timetable_id: int, medic_timetable: MedicTimetableUpdate):
    db_medic_timetable = db.query(MedicTimetable).filter(MedicTimetable.id == medic_timetable_id).first()
    if db_medic_timetable:
        for key, value in medic_timetable.dict().items():
            setattr(db_medic_timetable, key, value)
        db.commit()
        db.refresh(db_medic_timetable)
    return db_medic_timetable

def delete_medic_timetable(db: Session, medic_timetable_id: int):
    db_medic_timetable = db.query(MedicTimetable).filter(MedicTimetable.id == medic_timetable_id).first()
    if db_medic_timetable:
        db.delete(db_medic_timetable)
        db.commit()
    return db_medic_timetable

def get_medic_timetable(db: Session, medic_timetable_id: int):
    return db.query(MedicTimetable).filter(MedicTimetable.id == medic_timetable_id).first()

def get_medic_timetables(db: Session):
    return db.query(MedicTimetable).all()


# CRUD operations for Appointment
def create_appointment(db: Session, appointment: AppointmentCreate):
    db_appointment = Appointment(
        medic_id=appointment.medic_id,
        patient_disease_id=appointment.patient_disease_id,
        termin=appointment.termin,
        status=AppointmentStatus.Reserved,
        medic_notes=appointment.medic_notes,
        patient_rate=appointment.patient_rate,
        patient_feedback=appointment.patient_feedback
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def update_appointment(db: Session, appointment_id: int, appointment: AppointmentUpdate):
    db_appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if db_appointment:
        for key, value in appointment.dict().items():
            setattr(db_appointment, key, value)
        db.commit()
        db.refresh(db_appointment)
    return db_appointment

def delete_appointment(db: Session, appointment_id: int):
    db_appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if db_appointment:
        db.delete(db_appointment)
        db.commit()
    return db_appointment

def get_appointment(db: Session, appointment_id: int):
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()

def get_appointments(db: Session):
    return db.query(Appointment).all()
