# FastAPI Library Project

This project is a FastAPI application that provides user registration and login functionalities using JWT, along with CRUD operations for a book object. It connects to a PostgreSQL database and utilizes SQLAlchemy for ORM.

## Setup Instructions

1. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

3. **Set up the PostgreSQL database:**
   - Create a PostgreSQL database and update the connection details in `app/database.py`.

4. **Start the FastAPI application:**
   ```
   uvicorn app.main:app --reload
   ```

## Usage

- **User Registration:**
  - Endpoint: `POST /auth/register`
  - Request body: `{ "username": "user", "email": "user@example.com", "password": "password" }`

- **User Login:**
  - Endpoint: `POST /auth/login`
  - Request body: `{ "username": "user", "password": "password" }`

- **CRUD Operations for Books:**
  - Create a book: `POST /books`
  - Read all books: `GET /books`
  - Read a specific book: `GET /books/{book_id}`
  - Update a book: `PUT /books/{book_id}`
  - Delete a book: `DELETE /books/{book_id}`
