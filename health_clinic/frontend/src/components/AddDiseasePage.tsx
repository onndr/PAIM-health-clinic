import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiseaseService, { Disease } from '../services/DiseaseService';
import { useAuth } from '../context/AuthContext';
import PatientDiseaseService from '../services/PatientDiseaseService';

const AddDiseasePage: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

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

  const handleAddDisease = () => {
    if (selectedDiseaseId === null) {
      alert('Please select a disease to add.');
      return;
    }

    const diseaseToAdd = diseases.find((disease) => disease.id === selectedDiseaseId);

    if (!diseaseToAdd) {
      alert('Selected disease is invalid.');
      return;
    }

    const userId = localStorage.getItem('user_id');
    PatientDiseaseService.createPatientDisease({ disease_id: selectedDiseaseId, patient_id: userId })
      .then(() => {
        alert('Disease added successfully!');
        navigate('/appointments'); // Możesz przekierować na inną stronę po dodaniu choroby
      })
      .catch((error) => {
        console.error('Error adding disease:', error);
        alert('Failed to add disease.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add a Disease</h1>
      <div className="form-group mb-3">
        <label htmlFor="diseaseSelect" className="form-label">
          Select a disease:
        </label>
        <select
          id="diseaseSelect"
          className="form-select"
          value={selectedDiseaseId || ''}
          onChange={(e) => setSelectedDiseaseId(Number(e.target.value))}
        >
          <option value="">-- Select a disease --</option>
          {diseases.map((disease) => (
            <option key={disease.id} value={disease.id}>
              {disease.name}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleAddDisease}>
        Add Disease
      </button>
    </div>
  );
};

export default AddDiseasePage;
