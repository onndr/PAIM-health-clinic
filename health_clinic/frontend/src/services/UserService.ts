import axios from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_librarian: boolean;
  version: number;
}

const USERS_API_URL = '/api/users';

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

const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get(USERS_API_URL);
  return response.data;
};

const getUserById = (id: string) => {
  return axiosInstance.get(`${USERS_API_URL}/${id}`);
};

const updateUser = (user: any) => {
    return axiosInstance.put(`${USERS_API_URL}/${user.id}`, user);
};

const getCurrentUserDetails = () => {
    return axiosInstance.get(`${USERS_API_URL}/me/`);
}

const deleteMe = () => {
    return axiosInstance.delete(`${USERS_API_URL}/me/`);
}

export default {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUserDetails,
  deleteMe
};
