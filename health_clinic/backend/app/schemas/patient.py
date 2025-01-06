from pydantic import BaseModel, Field
from typing import List, Optional


# Patient schemas
class PatientBase(BaseModel):
    pesel: str
    email: str
    first_name: str
    last_name: str
    phone_number: str

class PatientCreate(PatientBase):
    password: str

class PatientUpdate(PatientBase):
    password: Optional[str] = None

class Patient(PatientBase):
    id: int

    class Config:
        orm_mode = True


# Disease schemas
class DiseaseBase(BaseModel):
    name: str

class DiseaseCreate(DiseaseBase):
    pass

class DiseaseUpdate(DiseaseBase):
    pass

class Disease(DiseaseBase):
    id: int

    class Config:
        orm_mode = True


# PatientDisease schemas
class PatientDiseaseBase(BaseModel):
    patient_id: int
    disease_id: int

class PatientDiseaseCreate(PatientDiseaseBase):
    pass

class PatientDiseaseUpdate(PatientDiseaseBase):
    pass

class PatientDisease(PatientDiseaseBase):
    id: int

    class Config:
        orm_mode = True
