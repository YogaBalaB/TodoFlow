import axios from 'axios';
import { Platform } from 'react-native';
import { getItem, STORAGE_KEYS } from '../utils/storage';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};
    try {
      const token = await getItem(STORAGE_KEYS.token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching auth token in interceptor:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
