import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Update with your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token to headers
  },
});

// Add an Axios response interceptor
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error response status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - logging out user');
      // Clear the token from localStorage
      localStorage.removeItem('token');
      // Redirect the user to the login page
      window.location.href = '/login';
    }
    // Reject the promise with the error
    return Promise.reject(error);
  }
);

// Define types for parameters
interface Credentials {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
}

// Mock flight data generator
export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  origin: string;
  destination: string;
  date: string;
}

// API call functions
export const processPayment = async (paymentDetails: { cardNumber: string; amount: number; flightId: string[] }) => {
  const response = await api.post('/payment', paymentDetails);
  return response.data;
};

export const getPayment = async () => {
  const response = await api.get('/payment');
  return response.data;
};

export const fetchFlights = async (
  origin: string,
  destination: string,
  date: string
): Promise<Flight[]> => {
  const response = await api.get('/flights?origin=' + origin + '&destination=' + destination + '&date=' + date);
  return response.data.data.flights;
};

export const loginUser = async (credentials: Credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: UserData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export default api;