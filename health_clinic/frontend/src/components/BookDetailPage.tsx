import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';
import { useAuth } from '../context/AuthContext';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const { isLoggedIn, isLibrarian } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (id) {
      BookService.getBook(id).then((response) => {
        setBook(response.data);
      });
    }
  }, [id, isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    book.price = parseFloat(book.price as any);
    book.publication_date = new Date(book.publication_date).toISOString().split('T')[0];
    BookService.updateBook(book).then((response: any) => {
      // check if response contains book data
      if (response.data.id) {
        navigate('/books');
        alert('Book updated successfully');
      } else {
        alert('Failed to update book');
      }
    }).catch((error) => {
      console.error('Error:', error);
      if (error.status === 409) {
        alert('The book has been updated in another transaction. Please refresh the page.');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Book Detail</h1>
      {book && (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" name="title" value={book.title} onChange={handleChange} disabled={!isLibrarian} />
        </div>
        <div className="mb-3">
        <label htmlFor="author" className="form-label">Author</label>
        <input type="text" className="form-control" id="author" name="author" value={book.author} onChange={handleChange} disabled={!isLibrarian} />
        </div>
        <div className="mb-3">
        <label htmlFor="publication_date" className="form-label">Publication Date</label>
        <input type="date" className="form-control" id="publication_date" name="publication_date" value={book.publication_date} onChange={handleChange} disabled={!isLibrarian} />
        </div>
        <div className="mb-3">
        <label htmlFor="price" className="form-label">Price</label>
        <input type="text" className="form-control" id="price" name="price" value={book.price} onChange={handleChange} disabled={!isLibrarian} />
        </div>
        {isLibrarian && (
        <button type="submit" className="btn btn-primary">Update</button>
        )}
      </form>
      )}
    </div>
  );
};

export default BookDetailPage;
