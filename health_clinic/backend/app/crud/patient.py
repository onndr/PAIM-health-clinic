from sqlalchemy.orm import Session

from app.models.medic import Appointment
from app.models.patient import Patient, Disease, PatientDisease
from app.schemas.patient import PatientCreate, PatientUpdate, DiseaseCreate, DiseaseUpdate, PatientDiseaseCreate, PatientDiseaseUpdate


# CRUD operations for Patient
def create_patient(db: Session, patient: PatientCreate):
    db_patient = Patient(
        pesel=patient.pesel,
        email=patient.email,
        first_name=patient.first_name,
        last_name=patient.last_name,
        phone_number=patient.phone_number,
        hashed_password=Patient.hash_password(patient.password)
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, patient_id: int, patient: PatientUpdate):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if db_patient:
        for key, value in patient.dict().items():
            if key == 'password' and value:
                value = Patient.hash_password(value)
            setattr(db_patient, key, value)
        db.commit()
        db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, patient_id: int):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if db_patient:
        patient_diseases = db.query(PatientDisease).filter(PatientDisease.patient_id == patient_id).all()
        for patient_disease in patient_diseases:
            appointments = db.query(Appointment).filter(Appointment.patient_disease_id == patient_disease.id).all()
            for appointment in appointments:
                db.delete(appointment)
                db.commit()
            db.delete(patient_disease)
            db.commit()

        db.delete(db_patient)
        db.commit()
    return True

def get_patient(db: Session, patient_id: int):
    return db.query(Patient).filter(Patient.id == patient_id).first()

def get_patient_by_email(db: Session, email: str):
    return db.query(Patient).filter(Patient.email == email).first()

def get_patients(db: Session):
    return db.query(Patient).all()


# CRUD operations for Disease
def create_disease(db: Session, disease: DiseaseCreate):
    db_disease = Disease(name=disease.name)
    db.add(db_disease)
    db.commit()
    db.refresh(db_disease)
    return db_disease

def update_disease(db: Session, disease_id: int, disease: DiseaseUpdate):
    db_disease = db.query(Disease).filter(Disease.id == disease_id).first()
    if db_disease:
        for key, value in disease.dict().items():
            setattr(db_disease, key, value)
        db.commit()
        db.refresh(db_disease)
    return db_disease

def delete_disease(db: Session, disease_id: int):
    db_disease = db.query(Disease).filter(Disease.id == disease_id).first()
    if db_disease:
        db.delete(db_disease)
        db.commit()
    return db_disease

def get_disease(db: Session, disease_id: int):
    return db.query(Disease).filter(Disease.id == disease_id).first()

def get_diseases(db: Session):
    return db.query(Disease).all()


# CRUD operations for PatientDisease
def create_patient_disease(db: Session, patient_disease: PatientDiseaseCreate):
    db_patient_disease = PatientDisease(
        patient_id=patient_disease.patient_id,
        disease_id=patient_disease.disease_id
    )
    db.add(db_patient_disease)
    db.commit()
    db.refresh(db_patient_disease)
    return db_patient_disease

def update_patient_disease(db: Session, patient_disease_id: int, patient_disease: PatientDiseaseUpdate):
    db_patient_disease = db.query(PatientDisease).filter(PatientDisease.id == patient_disease_id).first()
    if db_patient_disease:
        for key, value in patient_disease.dict().items():
            setattr(db_patient_disease, key, value)
        db.commit()
        db.refresh(db_patient_disease)
    return db_patient_disease

def delete_patient_disease(db: Session, patient_disease_id: int):
    db_patient_disease = db.query(PatientDisease).filter(PatientDisease.id == patient_disease_id).first()
    if db_patient_disease:
        db.delete(db_patient_disease)
        db.commit()
    return db_patient_disease

def get_patient_disease(db: Session, patient_disease_id: int):
    return db.query(PatientDisease).filter(PatientDisease.id == patient_disease_id).first()

def get_patient_diseases(db: Session):
    return db.query(PatientDisease).all()
