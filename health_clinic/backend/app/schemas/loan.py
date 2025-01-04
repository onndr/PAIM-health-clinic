from pydantic import BaseModel

class LoanBase(BaseModel):
    book_id: int
    user_id: int
    loan_date: str
    return_date: str
    returned_date: str

class LoanCreate(LoanBase):
    pass

class LoanUpdate(LoanBase):
    pass

class Loan(LoanBase):
    id: int
    status: str

    class Config:
        orm_mode = True
