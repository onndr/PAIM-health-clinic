import axios from 'axios';
import backendUrl from './utils';

export interface PatientDisease {
  id: number;
  patient_id: number;
  disease_id: number;
}


const PATIENT_DISEASES_API_URL = backendUrl + '/api/patient_diseases';

const axiosInstance = axios.create();


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const createPatientDisease = (patientDiseaseData: any) => {
    return axiosInstance.post(PATIENT_DISEASES_API_URL, patientDiseaseData);
  };

  const getPatientDisease = (id: string) => {
    return axiosInstance.get(`${PATIENT_DISEASES_API_URL}/${id}`);
  };

  const updatePatientDisease = (PatientDisease: any) => {
    return axiosInstance.put(`${PATIENT_DISEASES_API_URL}/${PatientDisease.id}`, PatientDisease);
  };

  const deletePatientDisease = (id: string) => {
    return axiosInstance.delete(`${PATIENT_DISEASES_API_URL}/${id}`);
  };

  const getPatientDiseases = () => {
    return axiosInstance.get(`${PATIENT_DISEASES_API_URL}`);
  };

export default {
  createPatientDisease,
  getPatientDisease,
  updatePatientDisease,
  deletePatientDisease,
  getPatientDiseases,
};
