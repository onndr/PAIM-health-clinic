import axios from 'axios';

export interface Book {
  id: number;
  title: string;
  author: string;
  publication_date: string;
  price: number;
  status: string;
  version: number;
}

export interface Loan {
  id: number;
  book_id: number;
  user_id: number;
  loan_date: string;
  return_date: string;
  returned_date: string;
  status: string;
}

const BOOKS_API_URL = '/api/books';
const LOANS_API_URL = '/api/loans';

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

const getBooks = async (): Promise<Book[]> => {
  const response = await axiosInstance.get(BOOKS_API_URL);
  return response.data;
};

const getBook = (id: string) => {
  return axiosInstance.get(`${BOOKS_API_URL}/${id}`);
};

const updateBook = (book: any) => {
  return axiosInstance.put(`${BOOKS_API_URL}/${book.id}`, book);
};

const addBook = (bookData: any) => {
  return axiosInstance.post(BOOKS_API_URL, bookData);
};

const deleteBook = (id: string) => {
  return axiosInstance.delete(`${BOOKS_API_URL}/${id}`);
};

const undeleteBook = (id: string) => {
  return axiosInstance.post(`${BOOKS_API_URL}/available/${id}`);
};

const reserveBook = (id: string) => {
  return axiosInstance.post(`${BOOKS_API_URL}/reserve/${id}`);
};

const unreserveBook = (id: string) => {
  return axiosInstance.post(`${BOOKS_API_URL}/cancel_reservation/${id}`);
}

const loanBook = (id: string) => {
  return axiosInstance.post(`${BOOKS_API_URL}/borrow/${id}`);
}

const returnLoan = (id: string) => {
  return axiosInstance.post(`${BOOKS_API_URL}/return/${id}`);
}

const getLoans = async (): Promise<Loan[]> => {
  const response = await axiosInstance.get(LOANS_API_URL);
  return response.data;
}

export default {
  getBooks,
  getBook,
  updateBook,
  addBook,
  deleteBook,
  undeleteBook,
  reserveBook,
  getLoans,
  loanBook,
  returnLoan,
  unreserveBook
};
