import axios from 'axios';

export interface MedicTimetable {
  id: number;
  medic_id: number;
  day: string;
  from_time: string;
  to_time: string;
}


const MEDIC_TIMETABLES_API_URL = '/api/medic_timetables';

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

const createMedicTimetable = (medicTimetableData: any) => {
    return axiosInstance.post(MEDIC_TIMETABLES_API_URL, medicTimetableData);
  };

  const getMedicTimetable = (id: string) => {
    return axiosInstance.get(`${MEDIC_TIMETABLES_API_URL}/${id}`);
  };

  const updateMedicTimetable = (MedicTimetable: any) => {
    return axiosInstance.put(`${MEDIC_TIMETABLES_API_URL}/${MedicTimetable.id}`, MedicTimetable);
  };

  const deleteMedicTimetable = (id: string) => {
    return axiosInstance.delete(`${MEDIC_TIMETABLES_API_URL}/${id}`);
  };

  const getMedicTimetables = () => {
    return axiosInstance.get(`${MEDIC_TIMETABLES_API_URL}`);
  };

export default {
  createMedicTimetable,
  getMedicTimetable,
  updateMedicTimetable,
  deleteMedicTimetable,
  getMedicTimetables
};
