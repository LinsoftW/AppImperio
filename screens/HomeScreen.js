import React, { useEffect, useState, useCallback, useContext } from 'react';
import { RefreshControl, View, Text, TextInput, FlatList, Image, StyleSheet, Button, TouchableOpacity, Modal, StatusBar, BackHandler, Alert, Platform, Animated, ActivityIndicator, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importar íconos
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; // Expo
import { useIsFocused } from '@react-navigation/native';
import { useUser } from './UserContext';
import axios from 'axios';
import QuantitySelector from './QuantitySelector';
import { Config } from '../Config';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Config from 'react-native-config';

const HomeScreen = ({ navigation, route }) => {

    // const { user, server, puerto } = useContext(useUser); // Usa el hook personalizado

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonScale] = useState(new Animated.Value(1));
    const [refreshing, setRefreshing] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const { user } = useUser();

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused || route.params?.refresh) {
            cargarProductos();
        }
    }, [isFocused, route.params?.refresh]);

    const cargarProductos = async () => {
        setProductos([])
        setLoading(true);
        try {
            const response = await fetch(`http://${Config.server}:${Config.puerto}/productos`);
            const data = await response.json();
            // console.log(data.datos)
            setProductos(data.datos); // Suponiendo que "data" contiene un array de productos
            setFilteredData(data.datos);
        } catch (error) {
            // console.error('Error al cargar productos:', error);
            Alert.alert('Error', 'Error al cargar productos.');
        } finally {
            setLoading(false);
        }
    };

    // Estado para guardar las cantidades seleccionadas
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
    };

    // const addToCart = async (product) => {
    //     const quantity = quantities[product.id] || 1;
    //     const userId = user?.id || await AsyncStorage.getItem('userId');
    //     // console.log(userId)

    //     if (!userId) {
    //         Alert.alert('Error', 'Debes iniciar sesión para agregar al carrito');
    //         navigation.navigate('Login');
    //         return;
    //     }
    //     try {
    //         const response = await axios.post(`http://${Config.server}:${Config.puerto}/carrito/agregar`, {
    //             idpersona: userId, // Asumiendo que tienes autenticación
    //             idproducto: product.id,
    //             cantidad: quantity,
    //         });
    //         Alert.alert('Éxito', 'Producto añadido al carrito');
    //         // Resetear la cantidad después de añadir
    //         setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    //     } catch (error) {
    //         Alert.alert('Error', 'No se pudo añadir al carrito');
    //     }
    // };
    const comprobarStock = () => {

    }

    const addToCart = async (product) => {
        const quantity = quantities[product.id] || 1;

        try {
            // 1. Verificar si hay usuario logueado
            // console.log(user.id)
            const Estadostock = comprobarStock()
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
                idproducto: product.id,
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

    // Función auxiliar para registro anónimo
    const registerAnonymous = async () => {
        try {
            const response = await axios.post(`http://${Config.server}:${Config.puerto}/usuarios/anonimo`);

            // Guardar usuario anónimo en AsyncStorage
            await AsyncStorage.setItem('anonUser', JSON.stringify({
                id: response.data.id,
                token: response.data.token,
                esAnonimo: true
            }));

            // Actualizar estado global (si usas Context, Redux, etc.)
            setUser({
                id: response.data.id,
                token: response.data.token,
                esAnonimo: true
            });

            Alert.alert('Modo invitado', 'Puedes navegar pero necesitarás registrarte para comprar');
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear sesión temporal');
        }
    };

    // Función para manejar el refresh
    const onRefresh = async () => {
        setProductos([])
        setLoading(true);
        try {
            const response = await fetch(`http://${Config.server}:${Config.puerto}/productos`);
            const data = await response.json();
            // console.log(data.datos)
            setProductos(data.datos); // Suponiendo que "data" contiene un array de productos
            setFilteredData(data.datos);
        } catch (error) {
            // console.error('Error al cargar productos:', error);
            Alert.alert('Error', 'Error al cargar productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Llamada a la API
        const fetchProductos = async () => {
            setProductos([])
            setLoading(true);
            try {
                const response = await fetch(`http://${Config.server}:${Config.puerto}/productos`);
                const data = await response.json();
                // console.log(data.datos)
                setProductos(data.datos); // Suponiendo que "data" contiene un array de productos
                setFilteredData(data.datos);
            } catch (error) {
                // console.error('Error al cargar productos:', error);
                Alert.alert('Error', 'Error al cargar productos.');
            } finally {
                setLoading(false);
            }
            // Cargar el contacto de whatsapp para poder escribirle
            try {
                const response1 = await fetch(`http://${Config.server}:${Config.puerto}/contactos`);
                const data1 = await response1.json();
                setphoneNumber(data1.datos[0].attributes.numero); // Reemplaza con el número en formato internacional (sin +)
            } catch (error) {
                Alert.alert('Error', 'Error al cargar el contacto.');
            } finally {
                // console.log(data)
            }
        };

        fetchProductos();
    }, []);

    // Filtrado de datos
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(productos);
        } else {
            const filtered = productos.filter(item =>
                item.attributes.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                // || item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, productos]);

    const handleExit = () => {
        Alert.alert(
            'Confirmar salida',
            '¿Estás seguro de que quieres salir?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Salir',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            BackHandler.exitApp();
                        } else {
                            // Alternativa para iOS (no cierra, pero muestra mensaje)
                            Alert.alert(
                                'iOS',
                                'Presiona el botón Home para salir',
                                [{ text: 'OK' }]
                            );
                        }
                    },
                },
            ]
        );
    };

    // Whatsapp

    const message = 'Hola, me interesa tu producto'; // Mensaje opcional

    const openWhatsApp = async () => {
        // Formatea la URL para WhatsApp

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        try {
            // Verifica si WhatsApp está instalado
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                // Si WhatsApp no está instalado, abre el navegador con la versión web
                const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
                await Linking.openURL(webUrl);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir WhatsApp');
            // console.error('Error al abrir WhatsApp:', error);
        }
    };
    // Fin whatsapp

    const renderProducto = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: `http://${Config.server}:${Config.puerto}/${item.attributes.imagen}` }} style={styles.imagen} onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen, descripcion: item.attributes.descripcion, id: item.id, usuario: user, cantActual: quantities[item.id] || 1 })} />
            <View style={styles.info}>
                <Text style={styles.nombre} onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen, descripcion: item.attributes.descripcion, id: item.id, usuario: user, cantActual: quantities[item.id] || 1 })}>{item.attributes.nombre}</Text>
                <Text style={styles.precio}>$ {item.attributes.precio}</Text>
                <QuantitySelector
                    initialQuantity={quantities[item.id] || 1}
                    onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                    maxQuantity={item.attributes.cantidad}
                />

                <View style={styles.botonesContainer}>
                    <TouchableOpacity
                        style={styles.botonAgregar}
                        onPress={() => addToCart(item)}
                    >
                        <Icon name="cart-outline" size={20} color="#000" style={styles.iconoCarrito} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.botonComprar}
                        onPress={() => alert(`Producto agregado: ${item.attributes.nombre}`)}
                    >
                        <Icon name="flash-outline" size={20} color="#FFF" style={styles.iconoCarrito} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.botonDetalles}
                        onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen, descripcion: item.attributes.descripcion, id: item.id, usuario: user, cantActual: quantities[item.id] || 1})}
                    >
                        <Icon name="list" size={20} color="#000" style={styles.iconoCarrito} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <View style={styles.container}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <View
                        style={[styles.titulo1, loading && styles.disabledButton]}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.titulo}>Productos en Stock</Text>
                        )}
                    </View>
                </Animated.View>
                {/* <Text style={styles.titulo}>Productos en Stock</Text> */}

                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
                    {/* <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} /> */}
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar productos..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="close" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
                {/* Resultados */}
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProducto}
                    ListEmptyComponent={
                        <Text style={styles.noResults}>No se encontraron resultados</Text>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#FFF']} // Color del spinner (opcional, solo Android)
                            tintColor="#FFF" // Color del spinner (iOS)
                        />
                    }
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleExit}>
                    <Icon name="exit" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Salir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton1} onPress={() => navigation.navigate('Carrito')}>
                    {/* <FontAwesome name="whatsapp" size={20} color="#FFF" /> */}
                    <Icon name="cart-outline" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Mi carrito</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={openWhatsApp}
                >
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.verCarritoBoton}
                    onPress={() => navigation.navigate('Carrito')}
                >
                    <Icon name="cart" size={24} color="#FFF" />
                    <Text style={styles.verCarritoText}>Ver Carrito</Text>
                </TouchableOpacity> */}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    verCarritoBoton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
    },
    verCarritoText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    whatsappButton: {
        position: 'absolute',
        bottom: 50,
        right: 1,
        backgroundColor: '#25D366', // Verde de WhatsApp
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    appContainer: {
        flex: 1, // Ocupa toda la pantalla
        backgroundColor: '#1C1C1C', // Fondo oscuro o el que prefieras
    },
    botonesContainer: {
        flexDirection: 'row', // Coloca los botones en la misma línea
        marginTop: 10,
        justifyContent: 'space-between', // Espacio uniforme entre botones
    },
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#1C1C1C', // Fondo oscuro
    },
    buttonContainer: {
        flexDirection: 'row',
        // backgroundColor: '#FFA500',
        justifyContent: 'space-between',
        marginTop: 1,
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
    button: {
        width: 200,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
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
    buyNowButton1: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4d6bfe',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
        top: 0,
        marginBottom: 10,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    titulo1: {
        fontSize: 25,
        fontWeight: '700',
        top: 0,
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    salir: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 1,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    imagen: {
        width: 80,
        height: 80,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#555', // Bordes discretos para combinar con el tema oscuro
    },
    info: {
        marginLeft: 15,
        justifyContent: 'space-between',
        flex: 1
    },
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F5F5F5', // Texto claro para buena visibilidad
    },
    precio: {
        fontSize: 16,
        color: '#FFA500', // Precio naranja vibrante que resalta en el tema oscuro
        fontWeight: 'bold'
    },
    botonAgregar: {
        width: 40, // Ancho igual a la altura para que sea perfectamente circular
        height: 40,
        backgroundColor: '#FFA500', // Color naranja llamativo
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25, // Radio igual a la mitad de la altura para hacerlo circular
        elevation: 3, // Sombra para dar profundidad
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    iconoCarrito: {
        color: '#000', // Ícono en negro para contraste
    },
    textoBotonAgregar: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000', // Texto negro para contraste en el botón naranja
    },
    botonComprar: {
        width: 40, // Ancho igual a la altura para que sea perfectamente circular
        height: 40,
        // left: '80%',
        backgroundColor: '#3498db', // Color naranja llamativo
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25, // Radio igual a la mitad de la altura para hacerlo circular
        elevation: 3, // Sombra para dar profundidad
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    botonDetalles: {
        width: 40, // Ancho igual a la altura para que sea perfectamente circular
        height: 40,
        // left: '80%',
        backgroundColor: 'yellow', // Color naranja llamativo
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25, // Radio igual a la mitad de la altura para hacerlo circular
        elevation: 3, // Sombra para dar profundidad
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemCategory: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#00FA23',
    },
});

export default HomeScreen;
