import React, { useEffect, useState } from 'react';
import AppointmentService, { Appointment } from '../services/AppointmentService';
import MedicService, { Medic } from '../services/MedicService';
import DiseaseService, { Disease } from '../services/DiseaseService';
import { useAuth } from '../context/AuthContext';

const RealisedAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medics, setMedics] = useState<Medic[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const { isPatient } = useAuth();

  useEffect(() => {
    if (isPatient) {
      // Pobierz wizyty
      AppointmentService.readAppointments()
        .then((response) => {
          const allAppointments = response.data as Appointment[];
          const realisedAppointments = allAppointments.filter(
            (appointment) => appointment.status === 'realised'
          );
          setAppointments(realisedAppointments);
        })
        .catch((error) => {
          console.error('Error fetching appointments:', error);
        });

      // Pobierz dane lekarzy
      MedicService.getMedics()
        .then((response) => setMedics(response.data))
        .catch((error) => console.error('Error fetching medics:', error));

      // Pobierz dane chorób
      DiseaseService.getDiseases()
        .then((response) => setDiseases(response.data))
        .catch((error) => console.error('Error fetching diseases:', error));
    }
  }, [isPatient]);

  const getMedicName = (medicId: number) => {
    const medic = medics.find((medic) => medic.id === medicId);
    return medic ? `${medic.first_name} ${medic.last_name}` : 'Unknown Medic';
  };

  const getDiseaseName = (patientDiseaseId: number) => {
    const disease = diseases.find((disease) => disease.id === patientDiseaseId);
    return disease ? disease.name : 'Unknown Disease';
  };

  if (!appointments.length) {
    return <div>No realised appointments found.</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Realised Appointments</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Medic</th>
            <th>Disease</th>
            <th>Notes</th>
            <th>Rating</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{new Date(appointment.termin).toLocaleString()}</td>
              <td>{getMedicName(appointment.medic_id)}</td>
              <td>{getDiseaseName(appointment.patient_disease_id)}</td>
              <td>{appointment.medic_notes || 'N/A'}</td>
              <td>{appointment.patient_rate || 'No rating'}</td>
              <td>{appointment.patient_feedback || 'No feedback'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RealisedAppointments;
