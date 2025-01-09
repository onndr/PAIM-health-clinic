import axios from 'axios';

export interface Disease {
    id: number;
    name: string;
}

const DISEASES_API_URL = '/api/diseases';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  const createDisease = (diseaseData: any) => {
    return axiosInstance.post(DISEASES_API_URL, diseaseData);
  };

  const getDisease = (id: string) => {
    return axiosInstance.get(`${DISEASES_API_URL}/${id}`);
  };

  const updateDisease = (disease: any) => {
    return axiosInstance.put(`${DISEASES_API_URL}/${disease.id}`, disease);
  };

  const deleteDisease = (id: string) => {
    return axiosInstance.delete(`${DISEASES_API_URL}/${id}`);
  };

  const getDiseases = () => {
    return axiosInstance.get(`${DISEASES_API_URL}`);
  };



  export default {
    getDiseases,
    getDisease,
    createDisease,
    updateDisease,
    deleteDisease
  };