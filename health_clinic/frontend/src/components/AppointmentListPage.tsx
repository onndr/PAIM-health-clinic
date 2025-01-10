import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService, { Appointment } from '../services/AppointmentService';
import MedicService, { Medic } from '../services/MedicService';
import DiseaseService, { Disease } from '../services/DiseaseService';
import { useAuth } from '../context/AuthContext';

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medics, setMedics] = useState<Medic[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Pobierz listę wizyt
    AppointmentService.readAppointments()
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
        alert('Failed to fetch appointments');
      });

    // Pobierz listę lekarzy
    MedicService.getMedics()
      .then((response) => {
        setMedics(response.data);
      })
      .catch((error) => {
        console.error('Error fetching medics:', error);
        alert('Failed to fetch medics');
      });

    // Pobierz listę chorób
    DiseaseService.getDiseases()
      .then((response) => {
        setDiseases(response.data);
      })
      .catch((error) => {
        console.error('Error fetching diseases:', error);
        alert('Failed to fetch diseases');
      });
  }, [isLoggedIn, navigate]);

  const getMedicName = (medicId: number) => {
    const medic = medics.find((m) => m.id === medicId);
    return medic ? `${medic.first_name} ${medic.last_name}` : 'Unknown Medic';
  };

  const getDiseaseName = (diseaseId: number) => {
    const disease = diseases.find((d) => d.id === diseaseId);
    return disease ? disease.name : 'Unknown Disease';
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your Appointments</h1>
      <ul className="list-group">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Date:</strong> {new Date(appointment.termin).toLocaleString()}
              </div>
              <div>
                <strong>Medic:</strong> {getMedicName(appointment.medic_id)}
              </div>
              <div>
                <strong>Disease:</strong> {getDiseaseName(appointment.patient_disease_id)}
              </div>
              <div>
                <strong>Status:</strong> {appointment.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentListPage;
