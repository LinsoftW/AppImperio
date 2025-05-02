// En tu archivo de configuración de Axios (ej: api.js)
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../Config';

const api = axios.create({
  baseURL: `http://${Config.server}:${Config.puerto}`,
  timeout: 10000,
});

// Interceptor para añadir token
api.interceptors.request.use(async (config) => {
  const userData = await AsyncStorage.getItem('userData');
//   console.log(userData)
  if (userData) {
    const { token } = JSON.parse(userData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;