import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicService, { Medic } from '../services/MedicService';
import DiseaseService, { Disease } from '../services/DiseaseService';
import MedicDiseaseService, { MedicDiseaseService as MedicServiceType } from '../services/MedicDiseaseService';
import MedicTimetableService, { MedicTimetable } from '../services/MedicTimetableService';
import AppointmentService from '../services/AppointmentService';
import { useAuth } from '../context/AuthContext';
import PatientDiseaseService, { PatientDisease } from '../services/PatientDiseaseService';

const SearchMedicServicesPage: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [patientDiseases, setPatientDiseases] = useState<PatientDisease[]>([]);
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

    // Pobierz listę chorób pacjenta
    const userId = localStorage.getItem('user_id');
    if (userId) {
      PatientDiseaseService.getPatientDiseases()
        .then((response) => {
          const userDiseases = response.data.filter((disease: PatientDisease) => disease.patient_id === Number(userId));
          setPatientDiseases(userDiseases);
        })
        .catch((error) => {
          console.error('Error fetching patient diseases:', error);
          alert('Failed to fetch patient diseases');
        });
    }

    // Pobierz dane i ustaw tylko te usługi
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

  const getNextDateForDay = (dayOfWeek: string) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const targetDayOfWeek = daysOfWeek.indexOf(dayOfWeek);

    let daysUntilNext = targetDayOfWeek - todayDayOfWeek;
    if (daysUntilNext < 0) {
        daysUntilNext += 7;
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);

    return nextDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Pobieranie dostępnych terminów lekarza
  const handleSelectService = (serviceId: number) => {
    setSelectedServiceId(serviceId);

    const selectedService = medicServices.find((service) => service.id === serviceId);
    if (!selectedService) return;

    const medicTimetables = timetables.filter((timetable) => timetable.medic_id === selectedService.medic_id);

    const times: string[] = [];
    medicTimetables.forEach((timetable) => {
      const { day, from_time, to_time } = timetable;
      // here day is in format Day.DayOfWeek, e.g. Day.Monday
      // we need to convert it to YYYY-MM-DD format
      const dayOfWeek = day.split('.')[1]; // Extract the day of the week
      const formattedDate = getNextDateForDay(dayOfWeek);

      // now for each hour from from_time to to_time, add a time slot of 1 hour
      const fromHour = parseInt(from_time.split(':')[0], 10);
      const toHour = parseInt(to_time.split(':')[0], 10);

      for (let hour = fromHour; hour < toHour; hour++) {
        const fromFormattedHour = hour.toString().padStart(2, '0');
        const toFormattedHour = (hour + 1).toString().padStart(2, '0');
        times.push(`${formattedDate} ${fromFormattedHour}:00 - ${toFormattedHour}:00`);
      }
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

    const formattedDay = new Date(day).toISOString().split('T')[0]; // Ensure day is in YYYY-MM-DD format
    const formattedFromTime = fromTime.length === 5 ? `${fromTime}:00` : fromTime; // Ensure fromTime is in HH:MM:SS format

    const appointmentData = {
      medic_id: selectedService.medic_id,
      patient_disease_id: selectedService.disease_id,
      termin: `${formattedDay}T${formattedFromTime}`, // Przyjmując format ISO 8601
      status: 'Reserved',
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
            // check if disease is in patient diseases
            patientDiseases.find((pd) => pd.disease_id === disease.id) ? (
              <option key={disease.id} value={disease.id}>
                {disease.name}
              </option>
            ) : null))}
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
