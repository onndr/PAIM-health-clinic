import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicService, { Medic } from '../services/MedicService';
import DiseaseService, { Disease } from '../services/DiseaseService';
import MedicDiseaseService, { MedicDiseaseService as MedicServiceType } from '../services/MedicDiseaseService';
import MedicTimetableService, { MedicTimetable } from '../services/MedicTimetableService';
import AppointmentService from '../services/AppointmentService';
import { useAuth } from '../context/AuthContext';

const SearchMedicServicesPage: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [medicServices, setMedicServices] = useState<MedicServiceType[]>([]);
  const [medics, setMedics] = useState<Medic[]>([]);
  const [timetables, setTimetables] = useState<MedicTimetable[]>([]);
  const [filteredServices, setFilteredServices] = useState<MedicServiceType[]>([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { isPatient, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Pobierz dane
    DiseaseService.getDiseases().then((response) => setDiseases(response.data)).catch(console.error);
    MedicDiseaseService.getMedicDiseaseServices()
      .then((response) => setMedicServices(response.data))
      .catch(console.error);
    MedicService.getMedics().then((response) => setMedics(response.data)).catch(console.error);
    MedicTimetableService.getMedicTimetables()
      .then((response) => setTimetables(response.data))
      .catch(console.error);
  }, [isLoggedIn, navigate]);

  // Filtrowanie usług po chorobach
  useEffect(() => {
    if (selectedDiseaseId) {
      const services = medicServices.filter((service) => service.disease_id === selectedDiseaseId);
      setFilteredServices(services);
    } else {
      setFilteredServices(medicServices);
    }
  }, [selectedDiseaseId, medicServices]);

  // Pobieranie dostępnych terminów lekarza
  const handleSelectService = (serviceId: number) => {
    setSelectedServiceId(serviceId);

    const selectedService = medicServices.find((service) => service.id === serviceId);
    if (!selectedService) return;

    const medicTimetables = timetables.filter((timetable) => timetable.medic_id === selectedService.medic_id);

    const times: string[] = [];
    medicTimetables.forEach((timetable) => {
      const { day, from_time, to_time } = timetable;
      times.push(`${day} ${from_time} - ${to_time}`);
    });

    setAvailableTimes(times);
    setSelectedTime(null); // Resetowanie wybranego czasu
  };

  const handleBookService = () => {
    if (!isPatient) {
      alert('You must be a patient to book a service.');
      navigate('/appointments');
      return;
    }

    if (!selectedServiceId || !selectedTime) {
      alert('Please select a service and a time to book.');
      return;
    }

    const selectedService = medicServices.find((service) => service.id === selectedServiceId);
    if (!selectedService) {
      alert('Selected service is invalid.');
      return;
    }

    const [day, timeRange] = selectedTime.split(' ');
    const [fromTime] = timeRange.split(' - ');

    const appointmentData = {
      medic_id: selectedService.medic_id,
      patient_disease_id: selectedService.disease_id,
      termin: `${day}T${fromTime}`, // Przyjmując format ISO 8601
      status: 'pending',
    };

    AppointmentService.createAppointment(appointmentData)
      .then(() => {
        alert('Service booked successfully!');
        navigate('/appointments'); // Przekierowanie na listę wizyt
      })
      .catch((error) => {
        console.error('Error booking service:', error);
        alert('Failed to book service.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Search Medical Services</h1>

      {/* Filtracja po chorobach */}
      <div className="form-group mb-4">
        <label htmlFor="diseaseFilter" className="form-label">
          Filter by disease:
        </label>
        <select
          id="diseaseFilter"
          className="form-select"
          value={selectedDiseaseId || ''}
          onChange={(e) => setSelectedDiseaseId(Number(e.target.value))}
        >
          <option value="">-- All diseases --</option>
          {diseases.map((disease) => (
            <option key={disease.id} value={disease.id}>
              {disease.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista usług */}
      <ul className="list-group mb-4">
        {filteredServices.map((service) => {
          const medic = medics.find((m) => m.id === service.medic_id);
          return (
            <li
              key={service.id}
              className={`list-group-item ${service.id === selectedServiceId ? 'active' : ''}`}
              onClick={() => handleSelectService(service.id)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <strong>Service:</strong> {service.service}
              </div>
              <div>
                <strong>Medic:</strong> {medic ? `${medic.first_name} ${medic.last_name}` : 'Unknown Medic'}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Dostępne terminy */}
      {selectedServiceId && (
        <div className="mb-4">
          <h4>Available Times</h4>
          <ul className="list-group">
            {availableTimes.length > 0 ? (
              availableTimes.map((time, index) => (
                <li
                  key={index}
                  className={`list-group-item ${time === selectedTime ? 'active' : ''}`}
                  onClick={() => setSelectedTime(time)}
                  style={{ cursor: 'pointer' }}
                >
                  {time}
                </li>
              ))
            ) : (
              <li className="list-group-item">No available times</li>
            )}
          </ul>
        </div>
      )}

      {/* Przycisk zapisania się */}
      <button className="btn btn-primary" onClick={handleBookService} disabled={!selectedServiceId || !selectedTime}>
        Book Service
      </button>
    </div>
  );
};

export default SearchMedicServicesPage;
