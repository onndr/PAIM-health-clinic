import enum

from pydantic import BaseModel, Field
from typing import List, Optional


# Medic schemas
class MedicBase(BaseModel):
    pesel: str
    email: str
    first_name: str
    last_name: str
    phone_number: str

class MedicCreate(MedicBase):
    password: str

class MedicUpdate(MedicBase):
    password: Optional[str] = None

class Medic(MedicBase):
    id: int

    class Config:
        orm_mode = True


# MedicDiseaseService schemas
class MedicDiseaseServiceBase(BaseModel):
    medic_id: int
    disease_id: int
    service: str

class MedicDiseaseServiceCreate(MedicDiseaseServiceBase):
    pass

class MedicDiseaseServiceUpdate(MedicDiseaseServiceBase):
    pass

class MedicDiseaseService(MedicDiseaseServiceBase):
    id: int

    class Config:
        orm_mode = True


# AppointmentStatus enum
class AppointmentStatus(enum.Enum):
    Reserved = 'RESERVED'
    Realized = 'REALIZED'
    Cancelled = 'CANCELLED'
    Expired = 'EXPIRED'

# Appointment schemas
class AppointmentBase(BaseModel):
    medic_id: int
    patient_disease_id: int
    termin: str
    status: AppointmentStatus
    medic_notes: Optional[str] = None
    patient_rate: Optional[int] = None
    patient_feedback: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int

    class Config:
        orm_mode = True


# Day enum
class Day(enum.Enum):
    Monday = 'MONDAY'
    Tuesday = 'TUESDAY'
    Wednesday = 'WEDNESDAY'
    Thursday = 'THURSDAY'
    Friday = 'FRIDAY'
    Saturday = 'SATURDAY'
    Sunday = 'SUNDAY'

# MedicTimetable schemas
class MedicTimetableBase(BaseModel):
    medic_id: int
    day: Day
    from_time: str
    to_time: str

class MedicTimetableCreate(MedicTimetableBase):
    pass

class MedicTimetableUpdate(MedicTimetableBase):
    pass

class MedicTimetable(MedicTimetableBase):
    id: int

    class Config:
        orm_mode = True
