from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routers import auth, book, user
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.book import Book, BookStatus
from app.models.loan import Loan, LoanStatus

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    try:
        # Add initial users
        users = [
            User(username="Gandalf", email="gandalf@hobbit.com", is_librarian=True, hashed_password=User.hash_password("Gandalf")),
            User(username="Frodo", email="frodo@hobbit.com", is_librarian=False, hashed_password=User.hash_password("Frodo")),
            User(username="Sam", email="samwise@hobbit.com", is_librarian=False, hashed_password=User.hash_password("Sam"))
        ]
        for user in users:
            db.add(user)
        db.commit()

        # Add initial books
        books = [
            Book(title="The Fellowship of the Ring", author="J.R.R. Tolkien", status=BookStatus.Reserved, price=10.99),
            Book(title="The Two Towers", author="J.R.R. Tolkien", status=BookStatus.Loaned, price=12.99),
            Book(title="The Return of the King", author="J.R.R. Tolkien", status=BookStatus.Available, price=14.99),
            Book(title="Harry Potter and the Philosopher's Stone", author="J.K. Rowling", status=BookStatus.Available, price=9.99),
            Book(title="1984", author="George Orwell", status=BookStatus.Available, price=8.99),
            Book(title="The Great Gatsby", author="F. Scott Fitzgerald", status=BookStatus.Available, price=7.99),
        ]
        for book in books:
            db.add(book)
        db.commit()

        # Add initial loans
        loans = [
            Loan(user_id=2, book_id=1, loan_date="2025-01-01", return_date="2023-01-02", status=LoanStatus.Reserved),
            Loan(user_id=2, book_id=2, loan_date="2025-01-05", return_date="2025-02-05", status=LoanStatus.Taken),
        ]
        for loan in loans:
            db.add(loan)

        db.commit()
    finally:
        db.close()

# Initialize the database with initial data
# init_db()

# Serve the React build directory
app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")

templates = Jinja2Templates(directory="../frontend/build")

@app.get("/")
async def serve_spa(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(auth.router)
app.include_router(book.router)
app.include_router(user.router)

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the FastAPI Book API"}
