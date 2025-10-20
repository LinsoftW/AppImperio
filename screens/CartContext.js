import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Función para actualizar el contador
  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const loadCart = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const response = await api.get(`/carrito/usuario/${user.id}`);
        
        if (response.data.success) {
          setCartItems(response.data.data);
          if (AsyncStorage.getItem('Lcarrito')){AsyncStorage.removeItem('Lcarrito')}
          await AsyncStorage.setItem("Lcarrito", JSON.stringify(cartItems));
          const count = response.data.data.reduce(
            (total, item) => total + item.attributes.cantidad, 
            0
          );
          setCartCount(count);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        await api.post('/carrito/agregar', {
          idpersona: user.id,
          idproducto: product.id,
          cantidad: product.cantidad || 1
        });
        await loadCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, loadCart, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};