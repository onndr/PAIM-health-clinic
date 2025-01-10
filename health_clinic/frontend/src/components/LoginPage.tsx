import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth(); // Funkcja login z kontekstu uwierzytelniania
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials.username, credentials.password)
      .then((response) => {
        if (response.data.token) {
          // Zapis tokenu i informacji o pacjencie do localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('is_patient', response.data.is_patient);
          localStorage.setItem('patient_id', response.data.id); // Przechowaj ID pacjenta
          alert('Login successful');
          navigate('/appointments'); // Przekierowanie po zalogowaniu
        } else {
          alert('Login failed');
        }
      })
      .catch((error) => {
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
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4 w-100">
          Login
        </button>
      </form>
      <p className="text-center mt-3">
        Don't have an account?{' '}
        <Link className="link" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
