import enum

from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, Enum, Time, ForeignKey, DateTime

from app.database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Medic(Base):
    __tablename__ = 'medic'

    id = Column(Integer, primary_key=True, index=True)
    pesel = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    hashed_password = Column(String)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

    @classmethod
    def hash_password(cls, password: str) -> str:
        return pwd_context.hash(password)


class MedicDiseaseService(Base):
    __tablename__ = 'medic_disease_service'

    id = Column(Integer, primary_key=True, index=True)
    medic_id = Column(Integer, ForeignKey('medic.id'), index=True)
    disease_id = Column(Integer, ForeignKey('disease.id'), index=True)
    service = Column(String)


class AppointmentStatus(enum.Enum):
    Reserved = 'Reserved'
    Realized = 'Realized'
    Cancelled = 'Cancelled'
    Expired = 'Expired'

class Appointment(Base):
    __tablename__ = 'appointment'

    id = Column(Integer, primary_key=True, index=True)
    medic_id = Column(Integer, ForeignKey('medic.id'), index=True)
    patient_disease_id = Column(Integer, ForeignKey('patient_disease.id'), index=True)
    termin = Column(DateTime)
    status = Column(Enum(AppointmentStatus))
    medic_notes = Column(String)
    patient_rate = Column(Integer)
    patient_feedback = Column(String)


class Day(enum.Enum):
    Monday = 'Monday'
    Tuesday = 'Tuesday'
    Wednesday = 'Wednesday'
    Thursday = 'Thursday'
    Friday = 'Friday'
    Saturday = 'Saturday'
    Sunday = 'Sunday'

class MedicTimetable(Base):
    __tablename__ = 'medic_timetable'

    id = Column(Integer, primary_key=True, index=True)
    medic_id = Column(Integer, ForeignKey('medic.id'), index=True)
    day = Column(Enum(Day))
    from_time = Column(Time)
    to_time = Column(Time)
