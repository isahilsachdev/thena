import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Update with your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  console.log('first1', response)
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
  const response = await api.get('/user/profile');
  return response.data;
};

export default api;
