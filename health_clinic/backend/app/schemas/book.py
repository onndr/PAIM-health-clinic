from pydantic import BaseModel, Field
from datetime import datetime

class BookBase(BaseModel):
    title: str
    author: str
    publication_date: str
    price: float
    version: int

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class Book(BookBase):
    id: int
    status: str

    class Config:
        orm_mode = True