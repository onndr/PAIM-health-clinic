import axios from 'axios';

export interface Medic {
  id: number;
  pesel: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

const MEDICS_API_URL = '/api/medics';

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

const createMedic = (medicData: any) => {
    return axiosInstance.post(MEDICS_API_URL, medicData);
  };

  const getMedic = (id: string) => {
    return axiosInstance.get(`${MEDICS_API_URL}/${id}`);
  };

  const updateMedic = (medic: any) => {
    return axiosInstance.put(`${MEDICS_API_URL}/${medic.id}`, medic);
  };

  const deleteMedic = (id: string) => {
    return axiosInstance.delete(`${MEDICS_API_URL}/${id}`);
  };

  const getMedics = () => {
    return axiosInstance.get(`${MEDICS_API_URL}`);
  };

export default {
  createMedic,
  getMedic,
  updateMedic,
  deleteMedic,
  getMedics,
};
