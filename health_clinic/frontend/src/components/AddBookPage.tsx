import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';
import { useAuth } from '../context/AuthContext';

const AddBookPage: React.FC = () => {
  const [bookData, setBookData] = useState({ title: '', author: '', publication_date: '', price: 0 });
  const { isLibrarian } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookData.price = parseFloat(bookData.price as any);
    bookData.publication_date = new Date(bookData.publication_date).toISOString().split('T')[0];
    BookService.addBook(bookData).then((response: any) => {
      // check if response contains book data
      if (response.data.id) {
        alert('Book added successfully');
        navigate('/books');
      } else {
        alert('Failed to add book');
      }
    });
  };

  return (
    <div className="container mt-5">
      {isLibrarian && <h1 className="mb-4">Add Book</h1>}
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" name="title" placeholder="Title" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="author" className="form-label">Author</label>
        <input type="text" className="form-control" id="author" name="author" placeholder="Author" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="publication_date" className="form-label">Publication Date</label>
        <input type="date" className="form-control" id="publication_date" name="publication_date" placeholder="Publication Date" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">Price</label>
        <input type="text" className="form-control" id="price" name="price" placeholder="Price" onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">Add</button>
      </form>
    </div>
  );
};

export default AddBookPage;
