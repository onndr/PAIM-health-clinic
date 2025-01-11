import axios from 'axios';

const USERS_API_URL = '/api/users';
const PATIENTS_API_URL = '/api/patients';
const MEDICS_API_URL = '/api/medics';

const register = (userData: any) => {
  if (userData.is_medic) {
    return register_medic(userData);
  } else {
    return register_patient(userData);
  }
};

const register_patient = (userData: any) => {
  return axios.post(`${PATIENTS_API_URL}/register`, userData);
};

const register_medic = (userData: any) => {
  return axios.post(`${MEDICS_API_URL}/register`, userData);
};

const login = (credentials: any) => {
  return axios.post(`${USERS_API_URL}/login`, credentials);
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('is_patient');
}

const isLoggedIn = () => {
  return localStorage.getItem('token') != null;
}

const isPatient = () => {
  return localStorage.getItem('is_patient') == 'true';
}

export default {
  register,
  login,
  logout,
  isLoggedIn,
  isPatient
};
