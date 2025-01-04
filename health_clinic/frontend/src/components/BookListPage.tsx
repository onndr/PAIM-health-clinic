import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService, { Book } from '../services/BookService';
import { useAuth } from '../context/AuthContext';

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const navigate = useNavigate();
  const { isLibrarian, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      BookService.getBooks().then((data: Book[]) => {
        setBooks(data);
      }).catch((error) => {
        console.error('Error:', error);
        alert('Failed to fetch books');
      });
    } else {
      navigate('/login');
    }
  }, [isLoggedIn]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Book List</h1>
      {isLibrarian &&
        <button className="btn btn-primary mb-3" onClick={() => navigate('/add-book')}>
          Add Book
        </button>
      }
      <ul className="list-group">
      {books.map(book => (
        <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <a href={`/books/${book.id}`}>{book.title}</a> - {book.status}
        </div>
        <div>
          {book.status === 'AVAILABLE' && isLibrarian && (
          <button className="btn btn-warning btn-sm me-2" onClick={() => {
            BookService.deleteBook(book.id).then(async () => {
              setBooks(await BookService.getBooks());
              alert(`The book "${book.title}" is now under status permanently unavailable.`);
            });
          }}>
            Make permanently unavailable
          </button>
          )}
          {book.status === 'PERMANENTLY_UNAVAILABLE' && isLibrarian && (
          <button className="btn btn-success btn-sm me-2" onClick={() => {
            BookService.undeleteBook(book.id).then(async () => {
              setBooks(await BookService.getBooks());
              alert(`The book "${book.title}" is now under status available.`);
            });
          }}>
            Make available
          </button>
          )}
          {book.status === 'AVAILABLE' && !isLibrarian && (
          <button className="btn btn-info btn-sm" onClick={() => {
            BookService.reserveBook(book.id).then(async () => {
              setBooks(await BookService.getBooks());
              alert(`The book "${book.title}" was reserved successfully.`);
            });
          }}>
            Reserve book
          </button>
          )}
        </div>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default BookListPage;
