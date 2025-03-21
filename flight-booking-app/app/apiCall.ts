import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const apiCall = async (method: string, url: string, data = {}, params = {}, headers = {}, noBaseUrl = false): Promise<any> => {
  try {
    // Conditionally set the URL to include base URL or not
    const finalUrl = noBaseUrl ? url : `${axiosInstance.defaults.baseURL}${url}`;

    const response = await axiosInstance({
      method,
      url: finalUrl,  // Use the final URL based on the condition
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        toast.error('Session expired, Please log in again!');
        window.location.href = '/login';
      }
    } else {
      throw error;
    }
  }
};

export default apiCall;
