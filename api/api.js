// En tu archivo de configuración de Axios (ej: api.js)
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const { server, imperioAppId } = Constants.expoConfig.extra;

const api = axios.create({
  baseURL: `http://${server}`,
  headers: {
    "X-App-ID": imperioAppId, // Configura esto según la app
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 60000,
});

// Interceptor para añadir token
api.interceptors.request.use(async (config) => {
  const newConfig = { ...config };

  try {
    // Asegura que el header X-App-ID esté siempre presente
    newConfig.headers = newConfig.headers || {};
    newConfig.headers["X-App-ID"] = imperioAppId;
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData?.token) {
        newConfig.headers.Authorization = `Bearer ${parsedData.token}`;
      }
    }
    return newConfig;
  } catch (error) {
    console.error("Error en el interceptor de Axios:", error);
    return newConfig; // Asegura que la petición continúe incluso si hay error
  }
});

// api.interceptors.response.use(response => {
//   console.log('Response:', response.config.headers);
//   return response;
// }, error => {
//   console.error('Error response:', error);
//   return Promise.reject(error);
// });

export default api;
