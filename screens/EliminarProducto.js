import React, { useEffect, useState, useCallback } from 'react';
import { RefreshControl, View, Text, TextInput, FlatList, Image, StyleSheet, Button, TouchableOpacity, Modal, StatusBar, BackHandler, Alert, Platform, Animated, ActivityIndicator, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importar íconos
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; // Expo
import { useIsFocused } from '@react-navigation/native';
import { useUser } from './UserContext';
import axios from 'axios';
import { Config } from '../Config';
import api from '../api/api';
// import Config from 'react-native-config';

const EliminarProducto = ({ navigation, route }) => {

    const { user } = useUser(); // Usa el hook personalizado

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonScale] = useState(new Animated.Value(1));
    const [refreshing, setRefreshing] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const isFocused = useIsFocused();

    // const server = '192.168.1.101';
    // const puerto = "5000";

    useEffect(() => {
        setProductos([])
        if (isFocused || route.params?.refresh) {
            cargarProductos();
        }
    }, [isFocused, route.params?.refresh]);

    // Eliminar todos
    const eliminarTodos = async () => {
        // if (!user || !user.esAdmin) {
        //     Alert.alert('Acceso denegado', 'Solo administradores pueden realizar esta acción');
        //     return;
        // }

        Alert.alert(
            'Confirmar eliminación',
            '¿Estás SEGURO de eliminar TODOS los productos? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'ELIMINAR TODOS',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            // const response = await axios.delete(`http://${Config.server}:${Config.puerto}/productos`, {
                            //     data: { confirm: 'true' },
                            // });
                            const response1 = await fetch(`http://${Config.server}/productos`);
                            const data = await response1.json();
                            if (data.datos == "") {
                                Alert.alert(
                                    'Error',
                                    `No hay productos en el almacén`,
                                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                                );
                                return;
                            }
                            const response = await api.delete(`/productos`, {
                                data: { confirm: 'true' }
                            });

                            Alert.alert(
                                'Éxito',
                                `Se eliminaron ${response.data.deletedCount} productos`,
                                [{ text: 'OK', onPress: () => navigation.goBack() }]
                            );
                        } catch (error) {
                            console.error('Error eliminando:', error);
                            Alert.alert(
                                'Error',
                                error.response?.data?.error || 'Error al eliminar productos'
                            );
                        } finally {
                            setLoading(false);
                            setProductos([])
                        }
                    },
                },
            ]
        );
    };

    const cargarProductos = async () => {
        setLoading(true);
        setProductos([])
        try {
            const response = await fetch(`http://${Config.server}/productos`);
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

    // Función para manejar el refresh
    const onRefresh = async () => {
        setProductos([])
        setLoading(true);
        try {
            const response = await fetch(`http://${Config.server}/productos`);
            const data = await response.json();
            // console.log(data)
            setProductos(data.datos); // Suponiendo que "data" contiene un array de productos
            setFilteredData(data.datos);
        } catch (error) {
            // console.error('Error al cargar productos:', error);
            Alert.alert('Error', 'Error al cargar productos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductos = async () => {
        setLoading(true);
        setProductos([])
        try {
            const response = await fetch(`http://${Config.server}/productos`);
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
        setProductos([])
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

    // Eliminar producto
    const handleDelete = async (itemId) => {
        const fadeAnim = new Animated.Value(1);
        // console.log('URL:', `http://${server}:${puerto}/productos/${itemId}`);
        // console.log(itemId)
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que quieres eliminar este elemento?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                }, {
                    text: 'Eliminar',
                    onPress: async () => {
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(async () => {
                            // await axios.delete(`http://${server}:${puerto}/productos/${itemId}`);
                            // fetchProductos(); // Actualizar la lista después de eliminar
                            try {
                                // Cambia esta línea (asegúrate que la URL sea correcta)
                                // const response = await axios.delete(`http://${Config.server}:${Config.puerto}/productos/${itemId}`);
                                const response = await api.delete(`/productos/${itemId}`);
                                // console.log(response.data)
                                if (response.data.success) {
                                    // Actualiza el estado local para evitar recargar toda la lista
                                    setProductos(prev => prev.filter(item => item.id !== itemId));
                                    setFilteredData(prev => prev.filter(item => item.id !== itemId));
                                    Alert.alert('Éxito', 'Producto eliminado correctamente.');
                                } else {
                                    Alert.alert('Error', 'No se pudo eliminar');
                                }
                            } catch (error) {
                                console.error('Error eliminando:', error);
                                Alert.alert('Error', error.response?.data?.error || 'Error de conexión');
                            }
                        });
                    }
                }]);
    };
    // Whatsapp

    // const phoneNumber = '5354223460'; // Reemplaza con el número en formato internacional (sin +)
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
            <Image source={{ uri: `http://${Config.server}/${item.attributes.imagen}` }} style={styles.imagen} onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen })} />
            <View style={styles.info}>
                <Text style={styles.nombre} onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen })}>{item.attributes.nombre}</Text>
                <Text style={styles.precio}>$ {item.attributes.precio}</Text>
                <View style={styles.botonesContainer}>
                    {/* <TouchableOpacity
                        style={styles.botonAgregar}
                        // onPress={agregarAlCarrito(item.id, 1)}
                    >
                        <Icon name="cart-outline" size={20} color="#000" style={styles.iconoCarrito} />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={styles.botonAgregar}
                        onPress={() => navigation.navigate('Editar', { producto: item })}
                    >
                        <Icon name="pencil" size={20} color="#FFF" style={styles.iconoCarrito} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.botonDetalles}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Icon name="trash" size={20} color="#FFF" />
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
                    keyExtractor={(item, index) => `${item.id?.toString() || 'missing-id'}-${index}`}
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
                <TouchableOpacity style={styles.buyNowButton1} onPress={eliminarTodos}>
                    {/* <FontAwesome name="whatsapp" size={20} color="#FFF" /> */}
                    <Icon name="trash" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Eliminar todos</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={openWhatsApp}
                >
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                </TouchableOpacity> */}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: 'red',
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
        marginBottom: 16,
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
        // left:90,
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
        left: '50%',
        backgroundColor: '#00FA23', // Color naranja llamativo
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
        // left: '75%',
        backgroundColor: '#ff413e', // Color naranja llamativo
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
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default EliminarProducto;