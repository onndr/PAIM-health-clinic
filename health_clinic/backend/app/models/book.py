from sqlalchemy import Column, Integer, String, Date, Float, Enum
from app.database import Base
import enum

class BookStatus(enum.Enum):
    Available = 'AVAILABLE'
    Reserved = 'RESERVED'
    Loaned = 'LOANED'
    PermanentlyUnavailable = 'PERMANENTLY_UNAVAILABLE'

class Book(Base):
    __tablename__ = 'book'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    publication_date = Column(Date)
    price = Column(Float)
    status = Column(Enum(BookStatus))
    version = Column(Integer, nullable=False, default=1)

    __mapper_args__ = {
        "version_id_col": version
    }