from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from app.database import Base
from app.models.book import BookStatus, Book
from app.models.user import User
import enum

class LoanStatus(enum.Enum):
    Reserved = 'RESERVED'
    Taken = 'TAKEN'
    Returned = 'RETURNED'
    ReservationCancelled = 'RESERVATION_CANCELLED'
    ReservationExpired = 'RESERVATION_EXPIRED'
    LoanExpired = 'LOAN_EXPIRED'


class Loan(Base):
    __tablename__ = 'loan'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('user.id'), index=True)
    book_id = Column(Integer, ForeignKey('book.id'), index=True)
    loan_date = Column(Date)
    return_date = Column(Date)
    returned_date = Column(Date)
    status = Column(Enum(LoanStatus))
