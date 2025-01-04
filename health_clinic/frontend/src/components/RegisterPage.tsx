import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    password_confirmation: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const { register } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.password !== userData.password_confirmation) {
      alert('Password and password confirmation do not match');
      return;
    }
    register(userData).then(response => {
      if (response.data.id) {
        alert('User registered successfully');
        navigate('/login');
      } else {
        alert('Failed to register user');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Register</h1>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
      <div className="form-group mb-3">
        <input type="text" name="username" className="form-control" placeholder="Username" onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <input type="text" name="first_name" className="form-control" placeholder="First Name" onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <input type="text" name="last_name" className="form-control" placeholder="Last Name" onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <input type="text" name="phone_number" className="form-control" placeholder="Phone Number" onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <input type="password" name="password_confirmation" className="form-control" placeholder="Confirm Password" onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;