import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientService from '../services/PatientService';
import AppointmentService from '../services/AppointmentService';
import { useAuth } from '../context/AuthContext';

const UserDetailPage: React.FC = () => {
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const { isLoggedIn, isPatient, logout } = useAuth(); // Zakładamy, że kontekst zwraca dane o zalogowanym użytkowniku
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Pobierz ID zalogowanego pacjenta (np. z kontekstu `useAuth` lub tokena w `localStorage`)
    const patientId = localStorage.getItem('user_id'); // lub z kontekstu: useAuth().id

    if (!patientId) {
      console.error('No patient ID found.');
      navigate('/login');
      return;
    }

    // Pobierz dane pacjenta na podstawie jego ID
    PatientService.getPatient(patientId)
      .then((response) => {
        setPatient(response.data);

        // Pobierz wizyty pacjenta
        return AppointmentService.readAppointments();
      })
      .then((response) => {
        const userAppointments = response.data.filter(
          (appointment: any) => appointment.patient_id === parseInt(patientId, 10)
        );
        setAppointments(userAppointments);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to fetch user details or appointments.');
      });
  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    PatientService.updatePatient(patient)
      .then((response: any) => {
        if (response.data.id) {
          alert('Your account details updated successfully');
        } else {
          alert('Failed to update account details');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response?.status === 409) {
          alert('The account details have been updated in another transaction. Please refresh the page.');
        } else {
          alert('Failed to update account details');
        }
      });
  };

  const isElligibleToDeleteAccount = () => {
    return appointments.filter(
      (appointment: any) => appointment.status === 'Reserved'
    ).length === 0;
  };

  const handleDeleteAccount = () => {
    if (!isElligibleToDeleteAccount()) {
      alert('You have reserved appointments. Please cancel them before deleting your account.');
      return;
    }

    PatientService.deletePatient(patient.id)
      .then(() => {
        logout();
        navigate('/');
        alert('Account deleted successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to delete account.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Account Detail</h1>
      {patient && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={patient.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              value={patient.first_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              value={patient.last_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phone_number"
              name="phone_number"
              value={patient.phone_number || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pesel" className="form-label">Pesel</label>
            <input
              type="text"
              className="form-control"
              id="pesel"
              name="pesel"
              value={patient.pesel}
              disabled={true}
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      )}
      {isPatient && (
        <button
          type="button"
          className="btn btn-danger mt-3"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      )}
    </div>
  );
};

export default UserDetailPage;
