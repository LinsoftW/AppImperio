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
    // const [ids, setIDs] = useState([]);
    const [producto, setProducto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [total, setTotal] = useState(0);
    let ids = []

    const cargarCarrito = async () => {
        setCarrito([])
        try {
            setRefreshing(true);
            // const response = await axios.get(
            //     `http://${Config.server}/carrito/usuario/${user.id}`
            // );
            // Cargo el carrito del usuario
            // Cargar los productos y verificar si estan eliminados o si no tienen ya en stock, si es asi se los elimino al usuario del carrito
            // // Obtener la cantidad actual en stock
            // const response1 = await api.get(`/productos`);
            // setProducto(response1.data.datos)
            // console.log(producto[0].id)
            // const response = await api.get(`/carrito/usuario/${user.id}`)
            // setCarrito([])
            // console.log(response.data.data[0].attributes.producto_id)
            // let tot = 0;
            // for (let index = 0; index < producto.length; index++) {
            //     for (let j = 0; j < response.data.data.length; j++) {
            //         if (producto[index].id == response.data.data[j].attributes.producto_id) {
            //             // eliminarItem(producto[index].id)
            //             // await api.delete(`/carrito/${producto[index].id}`);
            //             console.log("elimina el ID", producto[index].id)
            //             // setIDs(producto[index].id)
            //             ids.push(producto[index].id)
            //             // console.log("esta")
            //             // carrito.push(response.data.data[j])
            //             // tot = tot + response.data.data[j].attributes.subtotal
            //             // setNewCarrito([])
            //         }
            //     }
            // }
            // console.log(ids.length)
            // await api.delete(`/carrito/${ids}`);
            // setCarrito(carrito)
            // setTotal(tot)
            // setTotal(carrito.total.toFixed())
            const response2 = await api.get(`/carrito/usuario/${user.id}`)
            if (response2.data.success) {
                setCarrito(response2.data.data);
                setTotal(response2.data.total);
            }
            // console.log(carrito)
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar el carrito');
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user.id) {
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
                    const response = await api.put(`/carrito/${itemId}`, {
                        cantidad: response.data.stockDisponible
                    });
                    setCarrito(prev => prev.map(item =>
                        item.id === itemId
                            ? {
                                ...item,
                                attributes: {
                                    ...item.attributes,
                                    cantidad: response.data.stockDisponible
                                }
                            }
                            : item
                    ));
                    return;
                } else {
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
                }
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
                const response = await api.put(`/carrito/${itemId}`, {
                    cantidad: error.response.data.stockDisponible
                });
                setCarrito(prev => prev.map(item =>
                    item.id === itemId
                        ? {
                            ...item,
                            attributes: {
                                ...item.attributes,
                                cantidad: error.response.data.stockDisponible
                            }
                        }
                        : item
                ));
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

    const verificarPago = async () => {
        const response1 = await api.get(`/productos`);
        setProducto(response1.data.datos)
        // console.log(producto)
        const response = await api.get(`/carrito/usuario/${user.id}`)
        // setCarrito([])
        // console.log(response.data.data)
        let tot = total;
        let listProducComprados = []
        for (let index = 0; index < producto.length; index++) {
            for (let j = 0; j < response.data.data.length; j++) {
                if (producto[index].id != response.data.data[j].attributes.producto_id) {
                    tot = tot - (response.data.data[j].attributes.cantidad * response.data.data[j].attributes.precio)
                    // listProducComprados.push(response.data.data[j].attributes.cantidad)
                }
            }
        }
        navigation.navigate('Checkout1', { total: tot, pagina: 'M' })
// Para     restar la cantidad de productos del stock
        // for (let i = 0; i < response.data.data.length; i++) {
        //     try {
        //         // Decremento la cantidad de productos de la compra
        //         const r = await api.put(`/decrementa/productos/` + response.data.data[i].attributes.producto_id, { quitale: response.data.data[i].attributes.cantidad })
        //         // console.log(r.data.data)
        //     }
        //     catch (error) {
        //         console.error(error)
        //     }
        // }
        
    }

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            {/* <Image
                source={{ uri: `http://${Config.dirImg}${item.attributes.imagen.split('/').pop()}` }}
                style={styles.imagen}
            /> */}
            {item.attributes.imagen === null ?
                (
                    <>
                        <Image source={{ uri: `http://190.6.81.46/uploads/iconoI.png` }} style={styles.imagen} onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen, descripcion: item.attributes.descripcion, id: item.id, usuario: user, cantActual: quantities[item.id] || 1, volumen: item.attributes.volumen, sexo: item.attributes.sexo, marca: item.attributes.marca })} />
                    </>
                ) : (
                    <>
                        <Image source={{ uri: `http://${Config.dirImg}${item.attributes.imagen.split('/').pop()}` }} style={styles.imagen} onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen, descripcion: item.attributes.descripcion, id: item.id, usuario: user, cantActual: quantities[item.id] || 1, volumen: item.attributes.volumen, sexo: item.attributes.sexo, marca: item.attributes.marca })} />
                    </>
                )
            }
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
                        onPress={() => verificarPago()}
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
        paddingTop: 35
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
        borderRadius: 50,
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