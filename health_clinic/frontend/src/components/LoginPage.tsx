import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials.username, credentials.password).then(response => {
      // handle response
      if (response.data.token) {
        console.log(response.data);
        alert('Login successful');
        // store token in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('is_librarian', response.data.is_librarian);
        // redirect to book list page
        navigate('/books');
      } else {
        alert('Login failed');
      }
    }).catch(error => {
      console.error('Error:', error);
      alert('Login failed');
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Login</h1>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
        type="text"
        name="username"
        id="username"
        className="form-control"
        onChange={handleChange}
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="password">Password</label>
        <input
        type="password"
        name="password"
        id="password"
        className="form-control"
        onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-4 w-100">
        Login
      </button>
      </form>
      <p className="text-center mt-3">
      Don't have an account? <a href='' onClick={() => navigate('/register')}>Register</a>
      </p>
    </div>
  );
};

export default LoginPage;
