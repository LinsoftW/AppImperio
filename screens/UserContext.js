import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    {
      id: null,
      token: null,
      nick: null,
      esAnonimo: false,
    }
  ); // { id: 1, nombre: "Ejemplo", email: "ejemplo@mail.com" }
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState('172.20.10.5');
  const [puerto, setPuerto] = useState('5000');
  // const [colorPrimario, setColorPrimario] = useState('#4c669f');
  const login = (userData) => {
    // console.log(userData.token)
    setUser({
      ...userData,          // Conserva todas las propiedades
      id: userData.user.id,
      token: userData.token,
      esAnonimo: false,
      nick: userData.user.nick || null,
      // lastLogin: new Date()  // Puedes agregar más datos
    });
  };

  const logout = () => {
    setUser({
      id: null,
      token: null,
      esAnonimo: false,
      nick: null,
    });
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{
      user, setUser,
      server, setPuerto, setServer,
      puerto, login, logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('User debe usarse dentro de un UserProvider');
  }
  return context;
};