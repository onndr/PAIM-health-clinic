from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Patient(Base):
    __tablename__ = 'patient'

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


class Disease(Base):
    __tablename__ = 'disease'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)


class PatientDisease(Base):
    __tablename__ = 'patient_disease'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patient.id'), index=True)
    disease_id = Column(Integer, ForeignKey('disease.id'), index=True)
