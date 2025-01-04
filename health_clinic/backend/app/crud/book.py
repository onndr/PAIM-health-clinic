from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.book import Book, BookStatus
from app.models.user import User
from app.models.loan import Loan, LoanStatus
from app.schemas.book import BookCreate, BookUpdate
from datetime import datetime, timedelta

def create_book(db: Session, book: BookCreate):
    db_book = Book(
        title=book.title,
        author=book.author,
        publication_date=datetime.strptime(book.publication_date, '%Y-%m-%d'),
        status=BookStatus.Available,
        price=book.price
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_book(db: Session, book_id: int):
    return db.query(Book).filter(Book.id == book_id).first()

def get_books(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Book).offset(skip).limit(limit).all()

def update_book(db: Session, book_id: int, book: BookUpdate):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if db_book:
        if db_book.version != book.version:
            raise HTTPException(status_code=409, detail="Conflict: The book was updated by another transaction.")

        for key, value in book.dict().items():
            setattr(db_book, key, value)

        db.commit()
        db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if db_book:
        setattr(db_book, 'status', BookStatus.PermanentlyUnavailable)
        db.commit()
        db.refresh(db_book)
    return db_book

def undelete_book(db: Session, book_id: int):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if db_book:
        setattr(db_book, 'status', BookStatus.Available)
        db.commit()
        db.refresh(db_book)
    return db_book

def reserve_book(db: Session, book_id: int, user: User):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if db_book and db_book.status == BookStatus.Available and user:
        setattr(db_book, 'status', BookStatus.Reserved)
        loan = Loan(
            book_id=book_id,
            user_id=user.id,
            loan_date=datetime.now().date(),
            status=LoanStatus.Reserved,
            return_date=datetime.now().date() + timedelta(days=1)
        )
        db.add(loan)
        try:
            db.commit()
            db.refresh(db_book)
        except StaleDataError:
            db.rollback()
            raise HTTPException(status_code=409, detail="Conflict: The book was updated by another transaction.")
        return db_book, loan
    return None, None

def borrow_book(db: Session, book: Book):
    # find loan of the book that is reserved by the user
    loan = db.query(Loan).filter(Loan.book_id == book.id, Loan.status == LoanStatus.Reserved).first()
    if loan:
        # update book
        setattr(book, 'status', BookStatus.Loaned)

        # update loan
        setattr(loan, 'status', LoanStatus.Taken)
        setattr(loan, 'loan_date', datetime.now().date())
        setattr(loan, 'return_date', datetime.now().date() + timedelta(days=30))

        db.commit()
        db.refresh(loan)
        db.refresh(book)
        return book, loan
    return None, None

def return_book(db: Session, book: Book):
    # find loan of the book that is loaned by the user
    loan = db.query(Loan).filter(Loan.book_id == book.id, Loan.status == LoanStatus.Taken).first()
    if loan:
        # update book
        setattr(book, 'status', BookStatus.Available)

        # update loan
        setattr(loan, 'status', LoanStatus.Returned)
        setattr(loan, 'returned_date', datetime.now().date())

        db.commit()
        db.refresh(loan)
        db.refresh(book)
        return book, loan
    return None, None

def unreserve_book(db: Session, book: Book):
    # find loan of the book that is reserved by the user
    loan = db.query(Loan).filter(Loan.book_id == book.id, Loan.status == LoanStatus.Reserved).first()
    if loan:
        # update book
        setattr(book, 'status', BookStatus.Available)

        # update loan
        setattr(loan, 'status', LoanStatus.ReservationCancelled)

        db.commit()
        db.refresh(loan)
        db.refresh(book)
        return book, loan
    return None, None

def get_loans(db: Session, user: User):
    if user.is_librarian:
        return db.query(Loan).all()
    return db.query(Loan).filter(Loan.user_id == user.id).all()
