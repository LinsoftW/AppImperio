// import React from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const DetallesScreen = ({ route }) => {
//     const { productoId, precio, imag } = route.params; // Recuperar los parámetros

//     return (

//         <LinearGradient
//             colors={['#4c669f', '#3b5998', '#192f6a']}
//             style={styles.container}
//         >

//             <View style={styles.container}>
//                 <Image source={imag} style={styles.imagen} />
//                 <Text style={styles.title}>Detalles del Producto</Text>
//                 <Text style={styles.text}>Nombre del producto: {productoId}</Text>
//                 <Text style={styles.text}>Precio del producto: {precio}</Text>
//             </View>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1C' },
//     title: { fontSize: 24, color: '#F5F5F5', marginBottom: 20, top: 20 },
//     text: { fontSize: 18, color: '#FFA500' },
//     imagen: {
//         width: 150,
//         height: 150,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#555', // Bordes discretos para combinar con el tema oscuro
//     },
// });

// export default DetallesScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Config } from '../Config';
import QuantitySelector from './QuantitySelector';
import { useUser } from './UserContext';
import axios from 'axios';
import api from '../api/api';

const DetallesScreen = ({ route, navigation }) => {
    const { productoId, precio, stock, imag, descripcion, id, usuario, cantActual } = route.params;

    const { user } = useUser();

    // Estado para guardar las cantidades seleccionadas
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
    };

    const ComprarAhora = (p) => {
        const quantity = quantities[id] || 1;
        navigation.navigate('Checkout1', { total: p * quantity, pagina: 'S' })
    }

    const addToCart = async (product) => {
        const quantity = quantities[product.id] || 1;

        try {
            // 1. Verificar si hay usuario logueado
            // console.log(user.id)
            let userId = user?.id;
            let token = user?.token;

            // Si no hay usuario, verificar si existe anónimo en AsyncStorage
            if (!userId) {
                // console.log("Nooo")
                const anonUser = await AsyncStorage.getItem('anonUser');
                if (anonUser) {
                    const parsedAnon = JSON.parse(anonUser);
                    userId = parsedAnon.id;
                    token = parsedAnon.token;
                }
            }

            // 2. Si no hay ningún usuario, redirigir a selección de login/anonimo
            if (!userId) {
                Alert.alert(
                    'Acción requerida',
                    '¿Deseas continuar como invitado o iniciar sesión?',
                    [
                        {
                            text: 'Invitado',
                            onPress: () => registerAnonymous(),
                            style: 'default'
                        },
                        {
                            text: 'Iniciar sesión',
                            onPress: () => navigation.navigate('Login'),
                            style: 'cancel'
                        }
                    ]
                );
                return;
            }
            // 3. Hacer la petición con el token
            const response = await api.post('/carrito/agregar', {
                idpersona: userId,
                idproducto: id,
                cantidad: quantity,
            });

            // 4. Manejar respuesta exitosa
            Alert.alert('Éxito', 'Producto añadido al carrito');
            setQuantities(prev => ({ ...prev, [product.id]: 1 }));

            // 5. Si el usuario es anónimo, sugerir registro
            if (user?.esAnonimo) {
                Alert.alert(
                    'Cuenta temporal',
                    'Para finalizar tu compra necesitas registrar una cuenta completa',
                    [
                        { text: 'Registrarme', onPress: () => navigation.navigate('Registro') },
                        { text: 'Más tarde', style: 'cancel' }
                    ]
                );
            }

        } catch (error) {
            // 6. Manejo específico de errores
            if (error.response?.status === 403) {
                if (error.response.data?.code === 'UPGRADE_REQUIRED') {
                    Alert.alert(
                        'Acción requerida',
                        'Para agregar al carrito necesitas una cuenta completa',
                        [
                            { text: 'Registrarme', onPress: () => navigation.navigate('Registro') },
                            { text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') }
                        ]
                    );
                } else {
                    Alert.alert('Error', 'No tienes permiso para esta acción');
                }
            } else {
                Alert.alert('Error', 'No se pudo añadir al carrito');
                console.error('Error adding to cart:', error);
            }
        }
    };

    const BackButton = () => {
        const navigation = useNavigation();

        return (
            <View >
                {/* <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        color: '#FFF',
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#000" />
                    <Text style={{ color: '#FFF', marginLeft: 5, fontSize: 16 }}>
                        Atrás
                    </Text>
                </TouchableOpacity> */}
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradientContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalles del Producto</Text>
                </View> */}

                <View style={styles.card}>
                    <Image
                        source={{ uri: `http://${Config.server}:${Config.puerto}/${imag}` }}
                        style={styles.imagePlaceholder}
                        resizeMode="contain"
                    />
                    <View style={styles.detailsContainer}>
                        <Text style={styles.productName}>{productoId}</Text>
                        <Text style={styles.price}>${precio}</Text>
                        <Text style={styles.productName}>Cantidad en stock: {stock}</Text>
                        <QuantitySelector
                            initialQuantity={cantActual}
                            onQuantityChange={(qty) => handleQuantityChange({ id }.id, qty)}
                            maxQuantity={stock}
                        />
                        <View style={styles.separator} />
                        <Text style={styles.sectionTitle}>Descripción</Text>
                        <Text style={styles.description}>
                            {descripcion}
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart({ id })}>
                                <Icon name="cart-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Añadir al carrito</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buyNowButton} onPress={() => ComprarAhora(precio)}>
                                <Icon name="flash-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Comprar ahora</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View>
                {/* <Text style={styles.addToCartButton}> Atrás</Text> */}
                <BackButton />
                {/* <TouchableOpacity style={styles.addToCartButton} onPress={handleExit}>
                    <Icon name="exit" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Atrás</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.buyNowButton} onPress={openWhatsApp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Contáctanos</Text>
                </TouchableOpacity> */}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    imageButton: {
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    imagePlaceholder: {
        width: '100%',
        height: 180,
        // width: '100%',
        // height: 250,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        borderStyle: 'dashed',
    },
    imagen: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    registerText: {
        color: '#fff',
        marginTop: 20,
    },
    gradientContainer: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton1: {
        padding: 8,
        marginRight: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    detailsContainer: {
        paddingHorizontal: 10,
    },
    productName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 8,
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFD700',
        marginBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        marginBottom: 25,
    },
    buttonContainer: {
        flexDirection: 'row',
        // backgroundColor: '#FFA500',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    addToCartButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFA500',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    buyNowButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default DetallesScreen;