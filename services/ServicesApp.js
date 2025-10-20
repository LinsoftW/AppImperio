// services/dataService.js
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEYS = {
  PRODUCTS: "Lproductos",
  FEATURED: "Ldestacados",
  CATEGORIES: "Lcategorias",
  FAVORITES: "Lfavoritos",
  TARJETAS: "Ltarjetas",
  CONTACTS: "Lcontacts",
};

export const initializeData = async (userId) => {
  try {
    const [productosRes, favoritosRes] = await Promise.all([
      api.get("/productos"),
      userId ? api.get(`/favoritos/${userId}`) : Promise.resolve({ data: [] }),
    ]);

    const data = {
      productos: productosRes.data.datos || [],
      favoritos: favoritosRes.data.data || [],
    };

    // Guardar en caché
    await AsyncStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(data.productos));
    await AsyncStorage.setItem(CACHE_KEYS.FAVORITES, JSON.stringify(data.favoritos));

    return data;
  } catch (error) {
    console.error("Error en initializeData:", error);
    throw error;
  }
};