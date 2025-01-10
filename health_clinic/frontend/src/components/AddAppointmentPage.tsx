import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService from '../services/AppointmentService';
import MedicService, { Medic } from '../services/MedicService';
import DiseaseService, { Disease } from '../services/DiseaseService';
import { useAuth } from '../context/AuthContext';

const AddAppointmentPage: React.FC = () => {
  const [appointmentData, setAppointmentData] = useState({
    medic_id: '',
    disease_id: '',
    termin: '',
  });
  const [medics, setMedics] = useState<Medic[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const { isPatient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Pobierz listę lekarzy
    MedicService.getMedics()
      .then((response) => setMedics(response.data))
      .catch((error) => {
        console.error('Error fetching medics:', error);
        alert('Failed to fetch medics');
      });

    // Pobierz listę chorób
    DiseaseService.getDiseases()
      .then((response) => setDiseases(response.data))
      .catch((error) => {
        console.error('Error fetching diseases:', error);
        alert('Failed to fetch diseases');
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AppointmentService.createAppointment(appointmentData)
      .then((response: any) => {
        if (response.data.id) {
          alert('Appointment added successfully');
          navigate('/appointments');
        } else {
          alert('Failed to add appointment');
        }
      })
      .catch((error) => {
        console.error('Error creating appointment:', error);
        alert('Failed to add appointment');
      });
  };

  return (
    <div className="container mt-5">
      {isPatient && <h1 className="mb-4">Add Appointment</h1>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="medic_id" className="form-label">
            Select Medic
          </label>
          <select
            id="medic_id"
            name="medic_id"
            className="form-select"
            value={appointmentData.medic_id}
            onChange={handleChange}
          >
            <option value="">Select a Medic</option>
            {medics.map((medic) => (
              <option key={medic.id} value={medic.id}>
                {medic.first_name} {medic.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="disease_id" className="form-label">
            Select Disease
          </label>
          <select
            id="disease_id"
            name="disease_id"
            className="form-select"
            value={appointmentData.disease_id}
            onChange={handleChange}
          >
            <option value="">Select a Disease</option>
            {diseases.map((disease) => (
              <option key={disease.id} value={disease.id}>
                {disease.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="termin" className="form-label">
            Appointment Date and Time
          </label>
          <input
            type="datetime-local"
            id="termin"
            name="termin"
            className="form-control"
            value={appointmentData.termin}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Appointment
        </button>
      </form>
    </div>
  );
};

export default AddAppointmentPage;
