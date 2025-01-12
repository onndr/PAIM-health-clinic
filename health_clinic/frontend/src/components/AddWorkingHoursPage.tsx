import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicTimetableService, { MedicTimetable } from '../services/MedicTimetableService';
import { useAuth } from '../context/AuthContext';

const AddWorkingHoursPage: React.FC = () => {
  const user_id = localStorage.getItem('user_id');
  const [day, setDay] = useState<string>('Monday');
  const [fromTime, setFromTime] = useState<string>('09:00');
  const [toTime, setToTime] = useState<string>('17:00');
  const [workingHours, setWorkingHours] = useState<MedicTimetable[]>([]); // Typ tablicy

  const { isPatient, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (isPatient) {
      navigate('/home');
      return;
    }

    MedicTimetableService.getMedicTimetables()
      .then((response) => setWorkingHours(response.data))
      .catch((error) => console.error('Error fetching working hours:', error));
  }, [isLoggedIn, isPatient, navigate]);

  const handleAddWorkingHours = () => {
    if (!day || !fromTime || !toTime || fromTime >= toTime) {
      alert('Invalid input. Please check all fields and ensure times are valid.');
      return;
    }

    MedicTimetableService.createMedicTimetable({ medic_id: user_id, day, from_time: fromTime, to_time: toTime })
      .then(({ data }) => setWorkingHours((prev) => [...prev, data]))
      .catch(() => alert('Failed to add working hours.'));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add Working Hours</h1>
      {/* Form do dodania godzin pracy */}
      <div className="form-group mb-4">
        <label htmlFor="daySelect" className="form-label">Day of the Week:</label>
        <select id="daySelect" className="form-select" value={day} onChange={(e) => setDay(e.target.value)}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <div className="form-group mb-4">
        <label htmlFor="fromTime" className="form-label">From Time:</label>
        <input type="time" id="fromTime" className="form-control" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
      </div>

      <div className="form-group mb-4">
        <label htmlFor="toTime" className="form-label">To Time:</label>
        <input type="time" id="toTime" className="form-control" value={toTime} onChange={(e) => setToTime(e.target.value)} />
      </div>

      <button className="btn btn-primary" onClick={handleAddWorkingHours}>
        Add Working Hours
      </button>

      {workingHours.length > 0 && (
        <div className="mt-5">
          <h3>Your Working Hours</h3>
          <ul className="list-group">
            {workingHours.map((work, index) => (
              <li key={index} className="list-group-item">
                {work.day}: {work.from_time} - {work.to_time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddWorkingHoursPage;
