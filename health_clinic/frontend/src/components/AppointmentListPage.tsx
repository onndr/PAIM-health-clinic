import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService, { Appointment } from '../services/AppointmentService';
import MedicService, { Medic } from '../services/MedicService';
import DiseaseService, { Disease } from '../services/DiseaseService';
import { useAuth } from '../context/AuthContext';
import PatientDiseaseService from '../services/PatientDiseaseService';

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medics, setMedics] = useState<Medic[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [patientDiseases, setPatientDiseases] = useState<any[]>([]);
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

    // Pobierz liste chorob pacjenta
    PatientDiseaseService.getPatientDiseases()
      .then((response) => {
        setPatientDiseases(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patient diseases:', error);
        alert('Failed to fetch patient diseases');
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

  // Wyświetl listę wizyt
  // jesli uzytkownik jest pacjetem, to tylko jego wizyty
  // jesli uzytkownik jest lekarzem, to wszystkie wizyty danego lekarza

  const { isPatient } = useAuth();
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    console.error('No patient ID found.');
    navigate('/login');
    return null;
  }

  if (isPatient){
    // appoinment zawieta pole patient_disease_id nie patient_id
    var patiend_diseases = patientDiseases.filter(
      (patient_disease) => patient_disease.patient_id === parseInt(userId, 10)
    );
    var apps = appointments.filter(
      (appointment) => patiend_diseases.find((disease) => disease.id === appointment.patient_disease_id)
    );
  } else {
    var apps = appointments.filter(
      (appointment) => appointment.medic_id === parseInt(userId, 10)
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your Appointments</h1>
      <ul className="list-group">
        {apps.map((appointment) => (
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
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                >
                  View
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentListPage;
