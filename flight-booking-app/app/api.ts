import apiCall from './apiCall';

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
  const response = apiCall('post', '/payment', paymentDetails);
  return response;
};

export const getPayment = async () => {
  const response = apiCall('get', '/payment');
  return response;
};

export const fetchFlights = async (
  origin: string,
  destination: string,
  date: string
): any => {
  const response = await apiCall('get', '/flights?origin=' + origin + '&destination=' + destination + '&date=' + date);
  return response.data.flights;
};

export const loginUser = async (credentials: Credentials) => {
  const response = apiCall('post', '/auth/login', credentials);
  return response;
};

export const registerUser = async (userData: UserData) => {
  const response = apiCall('post', '/auth/register', userData);
  return response;
};

export const fetchUserProfile = async () => {
  const response = apiCall('get', '/users/profile');
  return response;
};

export const getAnalytics = async () => {
  const response = apiCall('get', '/analytics');
  return response;
};

export const cancelBooking = async (bookingId: string) => {
  return apiCall('delete', `/users/bookings/${bookingId}`);
};
