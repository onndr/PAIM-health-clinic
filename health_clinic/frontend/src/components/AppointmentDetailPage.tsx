import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppointmentService, { Appointment } from '../services/AppointmentService';
import MedicService, { Medic } from '../services/MedicService';
import DiseaseService, { Disease } from '../services/DiseaseService';

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [medics, setMedics] = useState<Medic[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Pobierz szczegóły wizyty
      AppointmentService.readAppointment(id)
        .then((response) => {
          setAppointment(response.data);
        })
        .catch((error) => {
          console.error('Error fetching appointment details:', error);
          alert('Failed to fetch appointment details');
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
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (appointment) {
      setAppointment({ ...appointment, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appointment) {
      AppointmentService.updateAppointment(appointment)
        .then(() => {
          alert('Appointment updated successfully');
          navigate('/appointments');
        })
        .catch((error) => {
          console.error('Error updating appointment:', error);
          alert('Failed to update appointment');
        });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Appointment Detail</h1>
      {appointment && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="medic_id" className="form-label">Medic</label>
            <select
              id="medic_id"
              name="medic_id"
              className="form-select"
              value={appointment.medic_id}
              onChange={handleChange}
            >
              {medics.map((medic) => (
                <option key={medic.id} value={medic.id}>
                  {medic.first_name} {medic.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="patient_disease_id" className="form-label">Disease</label>
            <select
              id="patient_disease_id"
              name="patient_disease_id"
              className="form-select"
              value={appointment.patient_disease_id}
              onChange={handleChange}
            >
              {diseases.map((disease) => (
                <option key={disease.id} value={disease.id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="termin" className="form-label">Date and Time</label>
            <input
              type="datetime-local"
              id="termin"
              name="termin"
              className="form-control"
              value={appointment.termin}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={appointment.status}
              onChange={handleChange}
            >
              <option value="Reserved">Reserved</option>
              <option value="Realized">Realized</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="medic_notes" className="form-label">Medic Notes</label>
            <textarea
              id="medic_notes"
              name="medic_notes"
              className="form-control"
              value={appointment?.medic_notes || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setAppointment({ ...appointment!, medic_notes: e.target.value })
              }
               />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      )}
    </div>
  );
};

export default AppointmentDetailPage;
