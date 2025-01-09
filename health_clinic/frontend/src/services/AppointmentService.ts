import axios from 'axios';

export interface Appointment {
    id: number;
    medic_id: number;
    patient_disease_id: number;
    termin: string;
    status: string;
    medic_notes: string;
    patient_rate: number;
    patient_feedback: string;
  }

const APPOINTMENTS_API_URL = '/api/appointments';

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

  const createAppointment = (appointmentData: any) => {
    return axiosInstance.post(APPOINTMENTS_API_URL, appointmentData);
  };

  const readAppointment = (id: string) => {
    return axiosInstance.get(`${APPOINTMENTS_API_URL}/${id}`);
  };

  const updateAppointment = (appointment: any) => {
    return axiosInstance.put(`${APPOINTMENTS_API_URL}/${appointment.id}`, appointment);
  };

  const deleteAppointment = (id: string) => {
    return axiosInstance.delete(`${APPOINTMENTS_API_URL}/${id}`);
  };

  const readAppointments = () => {
    return axiosInstance.get(`${APPOINTMENTS_API_URL}`);
  };



  export default {
    createAppointment,
    readAppointment,
    updateAppointment,
    deleteAppointment,
    readAppointments
  };