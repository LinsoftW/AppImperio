import { TouchableOpacity, Text, Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import Constants from "expo-constants";
import api from '../api/api';
import { MaterialIcons } from '@expo/vector-icons';

const AddToCartButton = ({ productoId, cantidad = 1 }) => {
    const { user } = useUser(); // Usa el hook personalizado
    const { server, dirImg } = Constants.expoConfig.extra;

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
            await api.post(`http://${server}/carrito/agregar`,
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
            <MaterialIcons name="add-shopping-cart" size={24} color="white" />
            <Text style={styles.buttonText}>Agregar al carrito</Text>
        </TouchableOpacity>
    );
};