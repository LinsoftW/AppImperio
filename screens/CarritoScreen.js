import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from './UserContext';
import axios from 'axios';
import { Config } from '../Config';
import api from '../api/api';

const CarritoScreen = ({ navigation }) => {
    const { user } = useUser();
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [total, setTotal] = useState(0);

    const cargarCarrito = async () => {
        setCarrito([])
        try {
            setRefreshing(true);
            const response = await axios.get(
                `http://${Config.server}:${Config.puerto}/carrito/usuario/${user.id}`
            );

            if (response.data.success) {
                setCarrito(response.data.data);
                setTotal(response.data.total);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar el carrito');
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            cargarCarrito();
        }
    }, [user]);

    // const actualizarCantidad = async (itemId, nuevaCantidad) => {
    //     try {
    //         await axios.put(`http://${Config.server}:${Config.puerto}/carrito/${itemId}`, {
    //             cantidad: nuevaCantidad
    //         });
    //         cargarCarrito();
    //     } catch (error) {
    //         Alert.alert('Error', 'No se pudo actualizar la cantidad');
    //         console.error('Error actualizando cantidad:', error);
    //     }
    // };

    const actualizarCantidad = async (itemId, nuevaCantidad) => {
        const producto = carrito.find(item => item.id === itemId);
        try {
            // const response = await axios.put(
            //     `http://${Config.server}:${Config.puerto}/carrito/${itemId}`,
            //     { cantidad: nuevaCantidad }
            // );
            const response = await api.put(`/carrito/${itemId}`, {
                cantidad: nuevaCantidad
            });
            // console.log(response.data)
            if (response.data.success) {
                if (producto && nuevaCantidad > response.data.stockDisponible) {
                    Alert.alert(
                        'Stock insuficiente',
                        `Solo hay ${response.data.stockDisponible} unidades disponibles`
                    );
                    return;
                }
                // Actualizar el estado local si es necesario
                setCarrito(prev => prev.map(item =>
                    item.id === itemId
                        ? {
                            ...item,
                            attributes: {
                                ...item.attributes,
                                cantidad: nuevaCantidad
                            }
                        }
                        : item
                ));
            } else {
                Alert.alert('Error', response.data.error || 'No se pudo actualizar');
                cargarCarrito(); // Recargar datos actuales
            }
        } catch (error) {
            // console.error('Error actualizando cantidad:', error);

            if (error.response?.data?.stockDisponible) {
                Alert.alert(
                    'Stock insuficiente',
                    `Solo hay ${error.response.data.stockDisponible} unidades disponibles`
                );
            } else {
                Alert.alert('Error', 'No se pudo actualizar la cantidad');
            }

            cargarCarrito(); // Recargar datos actuales
        }
        cargarCarrito(); // Recargar datos actuales
    };

    const eliminarItem = async (itemId) => {
        try {
            // await axios.delete(`http://${Config.server}:${Config.puerto}/carrito/${itemId}`);
            await api.delete(`/carrito/${itemId}`);
            cargarCarrito();
        } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el item');
            console.error('Error eliminando item:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: `http://${Config.server}:${Config.puerto}/${item.attributes.imagen}` }}
                style={styles.imagen}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.nombre}>{item.attributes.nombre}</Text>
                <Text style={styles.precio}>${item.attributes.precio.toFixed(2)} c/u</Text>

                <View style={styles.cantidadContainer}>
                    <TouchableOpacity
                        style={styles.cantidadBoton}
                        onPress={() => {
                            const nuevaCantidad = item.attributes.cantidad - 1;
                            if (nuevaCantidad > 0) {
                                actualizarCantidad(item.id, nuevaCantidad);
                            } else {
                                eliminarItem(item.id);
                            }
                        }}
                    >
                        <Icon name="remove" size={20} color="#FFF" />
                    </TouchableOpacity>

                    <Text style={styles.cantidadText}>{item.attributes.cantidad}</Text>

                    <TouchableOpacity
                        style={styles.cantidadBoton}
                        onPress={() => actualizarCantidad(item.id, item.attributes.cantidad + 1)}
                    >
                        <Icon name="add" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.subtotalContainer}>
                <Text style={styles.subtotalText}>
                    ${(item.attributes.precio * item.attributes.cantidad).toFixed(2)}
                </Text>
                <TouchableOpacity
                    style={styles.eliminarBoton}
                    onPress={() => eliminarItem(item.id)}
                >
                    <Icon name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
                <ActivityIndicator size="large" color="#FFF" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <FlatList
                data={carrito}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id?.toString() || 'missing-id'}-${index}`}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={cargarCarrito}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="cart-outline" size={60} color="#FFF" style={styles.emptyIcon} />
                        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                        <TouchableOpacity
                            style={styles.comprarButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.comprarButtonText}>Explorar Productos</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {carrito.length > 0 && (
                <View style={styles.resumenContainer}>
                    <View style={styles.resumenRow}>
                        <Text style={styles.resumenText}>Subtotal:</Text>
                        <Text style={styles.resumenText}>${total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.resumenRow}>
                        <Text style={styles.resumenText}>Envío:</Text>
                        <Text style={styles.resumenText}>$0.00</Text>
                    </View>
                    <View style={[styles.resumenRow, styles.totalRow]}>
                        <Text style={styles.totalText}>Total:</Text>
                        <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.pagarButton}
                        onPress={() => navigation.navigate('Checkout1', { total: total, pagina: 'M'})}
                    >
                        <Text style={styles.pagarButtonText}>Proceder al pago</Text>
                        <Icon name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    listContainer: {
        paddingBottom: 200,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    imagen: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
    },
    nombre: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    precio: {
        color: '#FFD700',
        fontSize: 14,
        marginBottom: 8,
    },
    cantidadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cantidadBoton: {
        backgroundColor: '#4CAF50',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cantidadText: {
        color: '#FFF',
        marginHorizontal: 12,
        fontSize: 16,
    },
    subtotalContainer: {
        alignItems: 'center',
        marginLeft: 10,
    },
    subtotalText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    eliminarBoton: {
        padding: 8,
    },
    resumenContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 16,
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        paddingTop: 8,
        marginTop: 8,
    },
    resumenText: {
        color: '#FFF',
        fontSize: 14,
    },
    totalText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pagarButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    pagarButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginRight: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyIcon: {
        marginBottom: 20,
        opacity: 0.5,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    comprarButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    comprarButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default CarritoScreen;