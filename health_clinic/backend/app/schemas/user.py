from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    phone_number: str
    version: int

class UserCreate(UserBase):
    password: str
    password_confirmation: str

class UserUpdate(UserBase):
    pass

class User(UserBase):
    id: int
    is_librarian: bool

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str

