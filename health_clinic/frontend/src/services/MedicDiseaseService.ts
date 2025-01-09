import axios from 'axios';

export interface MedicDiseaseService {
  id: number;
  medic_id: number;
  disease_id: number;
  service: string;
}


const MEDIC_DISEASE_SERVICES_API_URL = '/api/medic_disease_services';

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

const createMedicDiseaseService = (MedicDiseaseServiceData: any) => {
    return axiosInstance.post(MEDIC_DISEASE_SERVICES_API_URL, MedicDiseaseServiceData);
  };

  const getMedicDiseaseService = (id: string) => {
    return axiosInstance.get(`${MEDIC_DISEASE_SERVICES_API_URL}/${id}`);
  };

  const updateMedicDiseaseService = (MedicDiseaseService: any) => {
    return axiosInstance.put(`${MEDIC_DISEASE_SERVICES_API_URL}/${MedicDiseaseService.id}`, MedicDiseaseService);
  };

  const deleteMedicDiseaseService = (id: string) => {
    return axiosInstance.delete(`${MEDIC_DISEASE_SERVICES_API_URL}/${id}`);
  };

  const getMedicDiseaseServices = () => {
    return axiosInstance.get(`${MEDIC_DISEASE_SERVICES_API_URL}`);
  };



export default {
  createMedicDiseaseService,
  getMedicDiseaseService,
  updateMedicDiseaseService,
  deleteMedicDiseaseService,
  getMedicDiseaseServices
};
