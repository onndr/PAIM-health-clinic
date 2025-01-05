from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from werkzeug.exceptions import abort

from app import crud, models, schemas
from app.routers.auth import get_current_user
from app.database import get_db


user_bp = Blueprint('user', __name__)

def map_db_user_to_response_user(db_user: models.user.User) -> schemas.User:
    return schemas.User(
        id=db_user.id,
        username=db_user.username if db_user.username else "",
        email=db_user.email if db_user.email else "",
        first_name=db_user.first_name if db_user.first_name else "",
        last_name=db_user.last_name if db_user.last_name else "",
        phone_number=db_user.phone_number if db_user.phone_number else "",
        is_librarian=db_user.is_librarian,
        version=db_user.version
    )

@user_bp.route("/api/users", methods=["GET"])
def read_users():
    db = next(get_db())
    current_user = get_current_user()
    if current_user.is_librarian is False:
        abort(403, "User is not a librarian")
    users = crud.get_users(db)
    return [map_db_user_to_response_user(user).dict() for user in users]

@user_bp.route("/api/users/<int:user_id>", methods=["GET"])
def read_user(user_id):
    db = next(get_db())
    current_user = get_current_user()
    if current_user.is_librarian is False:
        abort(403, "User is not a librarian")
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        abort(404, "User not found")
    return map_db_user_to_response_user(db_user).dict()

@user_bp.route("/api/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    db = next(get_db())
    current_user = get_current_user()
    if not current_user.is_librarian:
        abort(403, "User is not a librarian")
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        abort(404, "User not found")
    user_data = request.get_json()
    user = schemas.UserUpdate(**user_data)
    db_user = crud.update_user(db=db, user_id=user_id, user=user)
    return map_db_user_to_response_user(db_user).dict()

@user_bp.route("/api/users/me/", methods=["GET"])
def read_current_user():
    current_user = get_current_user()
    return map_db_user_to_response_user(current_user).dict()

@user_bp.route("/api/users/me/", methods=["DELETE"])
def delete_current_user():
    db = next(get_db())
    current_user = get_current_user()
    if current_user.is_librarian is True:
        abort(403, "Librarians cannot be deleted")
    db_user = crud.delete_user(db=db, user_id=current_user.id)
    return map_db_user_to_response_user(db_user).dict()
