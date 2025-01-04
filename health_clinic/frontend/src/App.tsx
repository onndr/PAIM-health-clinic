import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import BookListPage from './components/BookListPage';
import BookDetailPage from './components/BookDetailPage';
import AddBookPage from './components/AddBookPage';
import LoansPage from './components/LoansPage';
import './App.css';
import { useAuth } from './context/AuthContext';
import UserDetailPage from './components/UserDetailPage';

const App: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Router>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
        <Link className="navbar-brand" to="/">Library</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/books">Books</Link>
            </li>
            {isLoggedIn? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/loans">Loans</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/me">Account</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={logout}>Logout</a>
                </li>
              </>) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )
            }
          </ul>
        </div>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/me" element={<UserDetailPage/>} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/add-book" element={<AddBookPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;