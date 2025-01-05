from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.routers.auth import get_current_user
from app.database import get_db
from app.models.book import BookStatus


book_bp = Blueprint('book', __name__)

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

@book_bp.route("/api/books", methods=["POST"])
def create_book():
    db = next(get_db())
    current_user = get_current_user()
    book = schemas.BookCreate(**request.json)
    db_book = crud.create_book(db=db, book=book)
    return jsonify(map_db_book_to_response_book(db_book).dict())

@book_bp.route("/api/books/<int:book_id>", methods=["GET"])
def read_book(book_id):
    db = next(get_db())
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    return jsonify(map_db_book_to_response_book(db_book).dict())

@book_bp.route("/api/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    db = next(get_db())
    current_user = get_current_user()
    book = schemas.BookUpdate(**request.json)
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    if not current_user.is_librarian:
        abort(403, "User is not a librarian")
    db_book = crud.update_book(db=db, book_id=book_id, book=book)
    return jsonify(map_db_book_to_response_book(db_book).dict())

@book_bp.route("/api/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    db = next(get_db())
    current_user = get_current_user()
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    if not current_user.is_librarian:
        abort(403, "User is not a librarian")
    db_book = crud.delete_book(db=db, book_id=book_id)
    return jsonify(map_db_book_to_response_book(db_book).dict())

@book_bp.route("/api/books/available/<int:book_id>", methods=["POST"])
def undelete_book(book_id):
    db = next(get_db())
    current_user = get_current_user()
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    if not current_user.is_librarian:
        abort(403, "User is not a librarian")
    db_book = crud.undelete_book(db=db, book_id=book_id)
    return jsonify(map_db_book_to_response_book(db_book).dict())

@book_bp.route("/api/books", methods=["GET"])
def read_books():
    db = next(get_db())
    current_user = get_current_user()
    skip = request.args.get("skip", 0, type=int)
    limit = request.args.get("limit", 100, type=int)
    books = crud.get_books(db=db, skip=skip, limit=limit)
    if not current_user.is_librarian:
        books = [book for book in books if book.status != BookStatus.PermanentlyUnavailable]
    return jsonify([map_db_book_to_response_book(book).dict() for book in books])

@book_bp.route("/api/books/reserve/<int:book_id>", methods=["POST"])
def reserve_book(book_id):
    db = next(get_db())
    current_user = get_current_user()
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    if current_user.is_librarian:
        abort(403, "User is not a reader")
    if db_book.status != BookStatus.Available:
        abort(400, "Book is not available")
    _, db_loan = crud.reserve_book(db=db, book_id=book_id, user=current_user)
    return jsonify(map_db_loan_to_response_loan(db_loan).dict())

@book_bp.route("/api/books/borrow/<int:book_id>", methods=["POST"])
def borrow_book(book_id):
    db = next(get_db())
    current_user = get_current_user()
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    if not current_user.is_librarian:
        abort(403, "User is not a librarian")
    if db_book.status != BookStatus.Reserved:
        abort(400, "Book is not reserved")
    _, db_loan = crud.borrow_book(db=db, book=db_book)
    return jsonify(map_db_loan_to_response_loan(db_loan).dict())

@book_bp.route("/api/books/return/<int:book_id>", methods=["POST"])
def return_book(book_id):
    db = next(get_db())
    current_user = get_current_user()
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    if not current_user.is_librarian:
        abort(403, "User is not a librarian")
    if db_book.status != BookStatus.Loaned:
        abort(400, "Book is not loaned")
    _, db_loan = crud.return_book(db=db, book=db_book)
    return jsonify(map_db_loan_to_response_loan(db_loan).dict())

@book_bp.route("/api/books/cancel_reservation/<int:book_id>", methods=["POST"])
def cancel_reservation(book_id):
    db = next(get_db())
    current_user = get_current_user()
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        abort(404, "Book not found")
    if current_user.is_librarian:
        abort(403, "User is not a reader")
    if db_book.status != BookStatus.Reserved:
        abort(400, "Book is not reserved")
    _, db_loan = crud.unreserve_book(db=db, book=db_book, user=current_user)
    return jsonify(map_db_loan_to_response_loan(db_loan).dict())

@book_bp.route("/api/loans", methods=["GET"])
def read_loans():
    db = next(get_db())
    current_user = get_current_user()
    loans = crud.get_loans(db=db, user=current_user)
    return jsonify([map_db_loan_to_response_loan(loan).dict() for loan in loans])
