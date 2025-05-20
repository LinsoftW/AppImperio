// En tu archivo de configuración de Axios (ej: api.js)
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../Config';

const api = axios.create({
  baseURL: `http://${Config.server}`,
  timeout: 30000,
});

// Interceptor para añadir token
api.interceptors.request.use(async (config) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData?.token) { // Verificación segura con optional chaining
        config.headers.Authorization = `Bearer ${parsedData.token}`;
      }
    }
    return config;
  } catch (error) {
    console.error('Error en el interceptor de Axios:', error);
    return config; // Asegura que la petición continúe incluso si hay error
  }
});

export default api;