from sqlalchemy import Column, Integer, String, Date, Float, Boolean
from app.database import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    is_librarian = Column(Boolean)
    hashed_password = Column(String)
    version = Column(Integer, nullable=False, default=1)

    __mapper_args__ = {
        "version_id_col": version
    }

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

    @classmethod
    def hash_password(cls, password: str) -> str:
        return pwd_context.hash(password)