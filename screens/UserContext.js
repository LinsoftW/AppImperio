import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/api";
import { Animated } from "react-native";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    token: null,
    nick: null,
    esAnonimo: false,
    telefono: null,
    nick: null,
    rol: null,
    esmensajero: null
  }); // { id: 1, nombre: "Ejemplo", email: "ejemplo@mail.com" }
  const [loading, setLoading] = useState(false);
  const login = async (userData) => {
    setUser({
      ...userData, // Conserva todas las propiedades
      id: userData.user.id,
      token: userData.token,
      esAnonimo: false,
      telefono: userData.user.telefono || null,
      nick: userData.user.nick || null,
      rol: userData.user.rol,
      esmensajero: userData.user.esMensajero || null
      // lastLogin: new Date()  // Puedes agregar más datos
    });
    setLoading(true);
  };

  const loginAnonimo = async (userData) => {
    setUser({
      ...userData, // Conserva todas las propiedades
      id: userData.id,
      token: userData.token,
      nick: userData.nick,
      esAnonimo: userData.esAnonimo,
      rol: 4,
      // lastLogin: new Date()  // Puedes agregar más datos
    });
  };

  // Función para mostrar el toast con animación
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage("");
    });
  };

  const CACHE_KEYS = {
    PRODUCTS: "Lproductos",
    FEATURED: "Ldestacados",
    CATEGORIES: "Lcategorias",
    FAVORITES: "Lfavoritos",
    TARJETAS: "Ltarjetas",
    CONTACTS: "Lcontacts",
    LAST_UPDATED: "lastUpdated",
  };

  // const logout = async () => {
  //   // console.log("salio")
  //   setUser({
  //     id: null,
  //     token: null,
  //     esAnonimo: false,
  //     nick: null,
  //     rol: 5,
  //   });
  //   setLoading(false);
  //   await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
  //   await AsyncStorage.removeItem("userData");
  // };

//   const changePassword = async (currentPassword, newPassword) => {
//     // console.log("Clave actual: ",currentPassword)
//     try {
//       const response = await api.put("/auth/change-password", {
//         userId: user.id,
//         currentPassword,
//         newPassword,
//       });
// // console.log(response)
//       if (!response.data.success) {
//         throw new Error(
//           response.data.message || "Error al cambiar la contraseña"
//         );
//       }

//       return true;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Error al cambiar la contraseña"
//       );
//     }
//   };

const changePassword = async (currentPassword, newPassword) => {
  try {
    // Validaciones básicas en el frontend
    if (!currentPassword || !newPassword) {
      throw new Error("Se requieren tanto la contraseña actual como la nueva");
    }

    if (currentPassword === newPassword) {
      throw new Error("La nueva contraseña debe ser diferente a la actual");
    }

    // Expresión regular para validar contraseña
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error(
        "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      );
    }

    // ✅ CORREGIDO: No enviar userId, el backend lo obtiene del token
    const response = await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    // console.log(response);

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Error al cambiar la contraseña"
      );
    }

    return {
      success: true,
      message: response.data.message || "Contraseña cambiada exitosamente"
    };
  } catch (error) {
    // Manejo mejorado de errores
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      throw new Error(
        error.response.data?.message || 
        "Error del servidor al cambiar la contraseña"
      );
    } else if (error.request) {
      // Error de red
      throw new Error("Error de conexión. Verifica tu internet.");
    } else {
      // Error local (validaciones, etc.)
      throw error;
    }
  }
};

  const logout = async () => {
    try {
      // 1. Limpiar el estado del usuario
      setUser({
        id: null,
        token: null,
        esAnonimo: false,
        nick: null,
        rol: 5,
      });

      // 2. Obtener todas las claves de AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();

      // 3. Filtrar y eliminar solo las claves de la aplicación (evitamos eliminar configuraciones del sistema)
      const appKeys = allKeys.filter(
        (key) =>
          key.startsWith("L") || // Nuestras claves de caché
          key === "userData" ||
          key === "anonUser" ||
          key === "cartItems" ||
          key === "lastUpdated"
      );

      // 4. Eliminar todas las claves de la aplicación
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
      }

      // 5. Opcional: Limpiar cualquier dato persistente adicional
      // Ejemplo: Si usas alguna librería que guarda datos persistentes

      console.log("Sesión cerrada y caché limpiada correctamente");
    } catch (error) {
      console.error("Error al limpiar datos durante logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  useEffect(() => {
    const loadUser = async () => {
      // setLoading(true)
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          setUser(JSON.parse(userData));
        }
        // setLoading(false);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setLoading,
        loading,
        login,
        logout,
        loginAnonimo,
        updateUser,
        changePassword,
        // showToast,
        // setToastMessage,
        // toastMessage
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("User debe usarse dentro de un UserProvider");
  }
  return context;
};
