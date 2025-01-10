import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService from '../services/AppointmentService';
import { useAuth } from '../context/AuthContext';

const AddAppointmentPage: React.FC = () => {
  const [appointmentData, setAppointmentData] = useState({ title: '', author: '', publication_date: '', price: 0, version: 0 });
  const { isPatient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appointmentData.price = parseFloat(appointmentData.price as any);
    appointmentData.publication_date = new Date(appointmentData.publication_date).toISOString().split('T')[0];
    AppointmentService.createAppointment(appointmentData).then((response: any) => {
      // check if response contains appointment data
      if (response.data.id) {
        alert('Appointment added successfully');
        navigate('/appointments');
      } else {
        alert('Failed to add appointment');
      }
    });
  };

  return (
    <div className="container mt-5">
      {isPatient && <h1 className="mb-4">Add Appointment</h1>}
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

export default AddAppointmentPage;
