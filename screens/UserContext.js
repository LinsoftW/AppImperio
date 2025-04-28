import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id: 1, nombre: "Ejemplo", email: "ejemplo@mail.com" }
  const [server, setServer] = useState('172.20.10.5');
  const [puerto, setPuerto] = useState('5000');
  // const [colorPrimario, setColorPrimario] = useState('#4c669f');
  const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

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