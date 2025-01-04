import axios from 'axios';

const apiUrl = '/api/users';

const register = (userData: any) => {
  return axios.post(`${apiUrl}/register`, userData);
};

const login = (credentials: any) => {
  return axios.post(`${apiUrl}/login`, credentials);
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('is_librarian');
}

const isLoggedIn = () => {
  return localStorage.getItem('token') != null;
}

const isLibrarian = () => {
  return localStorage.getItem('is_librarian') == 'true';
}

export default {
  register,
  login,
  logout,
  isLoggedIn,
  isLibrarian
};
