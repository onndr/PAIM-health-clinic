import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService, { Loan, Book } from '../services/BookService';
import UserService, { User } from '../services/UserService';
import { useAuth } from '../context/AuthContext';

const LoansPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { isLoggedIn, isLibrarian } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
        BookService.getLoans().then((data) => {
            setLoans(data);
            BookService.getBooks().then((data) => {
                setBooks(data);
                if (isLibrarian) {
                    UserService.getUsers().then((data) => {
                        setUsers(data);
                    }).catch((error) => {
                        console.error('Error:', error);
                        alert('Failed to fetch users');
                    })
                }
            }).catch((error) => {
                console.error('Error:', error);
                alert('Failed to fetch books');
            });
        }).catch((error) => {
            console.error('Error:', error);
            alert('Failed to fetch loans');
        });
    }
  }, [isLoggedIn]);

  const getBookTitle = (bookId: number) => {
    const book = books.find(book => book.id === bookId);
    return book ? book.title : 'Unknown Title';
  };

  const getUserName = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : 'Unknown User';
  }

  const makeLoanStatusReadable = (loan: Loan) => {
    switch (loan.status) {
      case 'TAKEN':
        return 'Taken';
      case 'RETURNED':
        return 'Returned';
      case 'RESERVED':
        return 'Reserved';
      case 'RESERVATION_CANCELLED':
        return 'Reservation cancelled';
      case 'RESERVATION_EXPIRED':
        return 'Reservation expired';
      case 'LOAN_EXPIRED':
        return 'Loan expired';
      default:
        return 'Unknown';
    }
  }

  return (
    <div className="container mt-5">
      {isLibrarian? <h1 className="mb-4">All Loans</h1> : <h1 className="mb-4">Your Loans</h1>}
      <ul className="list-group">
        {loans.map(loan => (
          <li key={loan.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column flex-md-row justify-content-between w-100">
              <div className="d-flex flex-column flex-md-row">
                <strong className="me-md-3">{getBookTitle(loan.book_id)}</strong>
                <span className="me-md-3">{makeLoanStatusReadable(loan)} {isLibrarian && <>by {getUserName(loan.user_id)}</>}</span>
                <span>Due date: {loan.return_date}</span>
              </div>
              <div className="d-flex flex-column flex-md-row align-items-md-center">
                {isLibrarian && loan.status === "RESERVED" && (
                  <button className="btn btn-danger btn-sm me-md-3" onClick={() => {
                    BookService.loanBook(loan.book_id.toString()).then(() => {
                      loan.status = "TAKEN";
                      setLoans([...loans]);
                      alert('Book loaned successfully');
                    });
                  }}>
                    Loan
                  </button>
                )}
                {isLibrarian && loan.status === "TAKEN" && (
                  <button className="btn btn-danger btn-sm me-md-3" onClick={() => {
                    BookService.returnLoan(loan.book_id.toString()).then(() => {
                      loan.status = "RETURNED";
                      setLoans([...loans]);
                      alert('Loan returned successfully');
                    });
                  }}>
                    Return
                  </button>
                )}
                {!isLibrarian && loan.status === "RESERVED" && (
                  <button className="btn btn-danger btn-sm" onClick={() => {
                    BookService.unreserveBook(loan.book_id.toString()).then(() => {
                      loan.status = "RESERVATION_CANCELLED";
                      setLoans([...loans]);
                      alert('Loan cancelled successfully');
                    });
                  }}>
                    Cancel reservation
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoansPage;