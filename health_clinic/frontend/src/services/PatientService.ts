import axios from 'axios';

export interface Patient {
  id: number;
  pesel: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  version: number;
}


const PATIENTS_API_URL = '/api/patients';

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

const createPatient = (PatientData: any) => {
    return axiosInstance.post(PATIENTS_API_URL, PatientData);
  };

  const getPatient = (id: string) => {
    return axiosInstance.get(`${PATIENTS_API_URL}/${id}`);
  };

  const updatePatient = (Patient: any) => {
    return axiosInstance.put(`${PATIENTS_API_URL}/${Patient.id}`, Patient);
  };

  const deletePatient = (id: string) => {
    return axiosInstance.delete(`${PATIENTS_API_URL}/${id}`);
  };

  const getPatients = () => {
    return axiosInstance.get(`${PATIENTS_API_URL}`);
  };

export default {
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
  getPatients,
};
