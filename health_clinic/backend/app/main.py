import os

from flask import Flask, send_from_directory
from sqlalchemy import inspect

import app.models as models
import app.routers as routers
from app.database import engine, Base, SessionLocal



app = Flask(__name__, static_folder='../../frontend/build')

app.register_blueprint(routers.auth.auth_bp)
app.register_blueprint(routers.patient.patient_bp)
app.register_blueprint(routers.disease.disease_bp)
app.register_blueprint(routers.patient_disease.patient_disease_bp)

app.register_blueprint(routers.medic.medic_bp)
app.register_blueprint(routers.medic_disease_service.medic_disease_service_bp)
app.register_blueprint(routers.medic_timetable.medic_timetable_bp)
app.register_blueprint(routers.appointment.appointment_bp)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

Base.metadata.create_all(bind=engine)

# Initialize the database with initial data
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
# check if db is initialized already

# if not inspect(engine).has_table("user"):
#     init_db()
# app.run(use_reloader=True, port=5000, threaded=True)
