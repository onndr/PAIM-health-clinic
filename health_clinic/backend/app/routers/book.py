from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.routers.auth import get_current_user
from app.database import get_db
from app.models.book import BookStatus

router = APIRouter()

def map_db_book_to_response_book(db_book: models.book.Book) -> schemas.Book:
    return schemas.Book(
        id=db_book.id,
        title=db_book.title,
        author=db_book.author,
        publication_date=str(db_book.publication_date),
        price=db_book.price,
        status=db_book.status.value,
        version=db_book.version
    )

def map_db_loan_to_response_loan(db_loan: models.loan.Loan) -> schemas.Loan:
    return schemas.Loan(
        id=int(db_loan.id),
        user_id=int(db_loan.user_id),
        book_id=int(db_loan.book_id),
        loan_date=str(db_loan.loan_date),
        return_date=str(db_loan.return_date),
        returned_date=str(db_loan.returned_date),
        status=db_loan.status.value
    )

@router.post("/api/books", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.create_book(db=db, book=book)
    return map_db_book_to_response_book(db_book)

@router.get("/api/books/{book_id}", response_model=schemas.Book)
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return map_db_book_to_response_book(db_book)

@router.put("/api/books/{book_id}", response_model=schemas.Book)
def update_book(book_id: int, book: schemas.BookUpdate, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.is_librarian is False:
        raise HTTPException(status_code=403, detail="User is not a librarian")
    db_book = crud.update_book(db=db, book_id=book_id, book=book)
    return map_db_book_to_response_book(db_book)

@router.delete("/api/books/{book_id}", response_model=schemas.Book)
def delete_book(book_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.is_librarian is False:
        raise HTTPException(status_code=403, detail="User is not a librarian")
    db_book = crud.delete_book(db=db, book_id=book_id)
    return map_db_book_to_response_book(db_book)

@router.post("/api/books/available/{book_id}", response_model=schemas.Book)
def delete_book(book_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.is_librarian is False:
        raise HTTPException(status_code=403, detail="User is not a librarian")
    db_book = crud.undelete_book(db=db, book_id=book_id)
    return map_db_book_to_response_book(db_book)

@router.get("/api/books", response_model=list[schemas.Book])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    books = crud.get_books(db=db, skip=skip, limit=limit)
    if current_user.is_librarian is False:
        books = [book for book in books if book.status != BookStatus.PermanentlyUnavailable]
    return [map_db_book_to_response_book(book) for book in books]

@router.post("/api/books/reserve/{book_id}", response_model=schemas.Loan)
def reserve_book(book_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.is_librarian is True:
        raise HTTPException(status_code=403, detail="User is not a reader")
    if db_book.status != BookStatus.Available:
        raise HTTPException(status_code=400, detail="Book is not available")
    _, db_loan = crud.reserve_book(db=db, book_id=book_id)
    return map_db_loan_to_response_loan(db_loan)

@router.post("/api/books/borrow/{book_id}", response_model=schemas.Loan)
def borrow_book(book_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.is_librarian is False:
        raise HTTPException(status_code=403, detail="User is not a reader")
    if db_book.status != BookStatus.Reserved:
        raise HTTPException(status_code=400, detail="Book is not reserved")
    _, db_loan = crud.borrow_book(db=db, book=db_book)
    return map_db_loan_to_response_loan(db_loan)

@router.post("/api/books/return/{book_id}", response_model=schemas.Loan)
def return_book(book_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.is_librarian is False:
        raise HTTPException(status_code=403, detail="User is not a librarian")
    if db_book.status != BookStatus.Loaned:
        raise HTTPException(status_code=400, detail="Book is not loaned")
    _, db_loan = crud.return_book(db=db, book=db_book)
    return map_db_loan_to_response_loan(db_loan)

@router.post("/api/books/cancel_reservation/{book_id}", response_model=schemas.Loan)
def cancel_reservation(book_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if current_user.is_librarian is True:
        raise HTTPException(status_code=403, detail="User is not a reader")
    if db_book.status != BookStatus.Reserved:
        raise HTTPException(status_code=400, detail="Book is not reserved")
    _, db_loan = crud.unreserve_book(db=db, book=db_book)
    return map_db_loan_to_response_loan(db_loan)

@router.get("/api/loans", response_model=list[schemas.Loan])
def read_loans(db: Session = Depends(get_db), current_user: models.user.User = Depends(get_current_user)):
    loans = crud.get_loans(db=db, user=current_user)
    return [map_db_loan_to_response_loan(loan) for loan in loans]
