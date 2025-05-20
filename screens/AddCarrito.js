import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Config } from '../Config';
import api from '../api/api';
// import Config from 'react-native-config';

const AddToCartButton = ({ productoId, cantidad = 1 }) => {
    const { user } = useUser(); // Usa el hook personalizado
    // const server = '192.168.1.101';
    // const puerto = "5000";

    const agregarAlCarrito = async () => {
        if (!user) {
            Alert.alert('Inicia sesión', 'Debes iniciar sesión para agregar al carrito', [
                {
                    text: 'Iniciar sesión',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ]);
            return;
        }

        try {
            // await axios.post(`http://${Config.server}/carrito/agregar`, {
            //     usuario_id: user.id,
            //     producto_id: productoId,
            //     cantidad: cantidad
            // });
            await api.post(`http://${Config.server}/carrito/agregar`,
                {
                    usuario_id: user.id,
                    producto_id: productoId,
                    cantidad: cantidad
                }
            )
            Alert.alert('Éxito', 'Producto agregado al carrito');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Error al agregar al carrito');
        }
    };

    return (
        <TouchableOpacity
            style={styles.cartButton}
            onPress={agregarAlCarrito}
        >
            <Icon name="add-shopping-cart" size={24} color="white" />
            <Text style={styles.buttonText}>Agregar al carrito</Text>
        </TouchableOpacity>
    );
};