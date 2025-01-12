import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiseaseService, { Disease } from '../services/DiseaseService';
import { useAuth } from '../context/AuthContext';
import PatientDiseaseService, { PatientDisease } from '../services/PatientDiseaseService';

const AddDiseasePage: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [patientDiseases, setPatientDiseases] = useState<PatientDisease[]>([]);
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
        setPatientDiseases((prev) => [...prev, { id: Date.now(), patient_id: Number(userId), disease_id: selectedDiseaseId }]);
        navigate('/appointments'); // Możesz przekierować na inną stronę po dodaniu choroby
      })
      .catch((error) => {
        console.error('Error adding disease:', error);
        alert('Failed to add disease.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your diseases</h1>

      {/* Lista obecnych chorób pacjenta */}
      <div className="mb-4">
        <h2>Existing Diseases:</h2>
        {patientDiseases.length > 0 ? (
          <ul className="list-group">
            {patientDiseases.map((patientDisease) => {
              const disease = diseases.find((d) => d.id === patientDisease.disease_id);
              return (
                <li key={patientDisease.id} className="list-group-item">
                  {disease ? disease.name : 'Unknown Disease'}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No diseases found for this patient.</p>
        )}
      </div>

      {/* Formularz dodawania chorób */}
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
