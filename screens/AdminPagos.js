import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Config } from '../Config';
import api from '../api/api';
import RepartidorModal from './RepartidorModal';
import Prompt from 'react-native-prompt-android';

const VerificarPagosScreen = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPago, setCurrentPago] = useState(null);
    const intervalRef = useRef(null);
    const inactivityTimerRef = useRef(null);
    const isActiveRef = useRef(true);

    // Wrap cargarPagos en useCallback para evitar recreación en cada render
    // const cargarPagos = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.get('/pagos/pendientes');
    //         setPagos(response.data.data);
    //     } catch (error) {
    //         console.error(error);
    //         Alert.alert('Error', 'No se pudieron cargar los pagos');
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    const handleConfirmRepartidor = async (repartidor) => {
        const { id } = currentPago;
        const mensajero = repartidor.nombre
        const telefono = repartidor.telefono
        const vehiculo = repartidor.vehiculo
        const tiempoEstimado = repartidor.tiempo
        // console.log(id)
        try {
            const response = await api.put(`/pagos/${id}`, {
                estado: 'Confirmado',
                mensajero, telefono, vehiculo, tiempoEstimado
            });

            if (response.data.success) {
                Alert.alert('Éxito', 'Pago confirmado y repartidor asignado');
                cargarPagos();
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo asignar el repartidor');
        }
    };

    const cargarPagos = async () => {
        try {
            // const response = await axios.get(`http://${Config.server}:${Config.puerto}/pagos/pendientes`);
            const response = await api.get(`/pagos/pendientes`);
            // console.log(response.data.data)
            setPagos(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(cargarPagos, 5000);

        // Verificar inmediatamente al cargar
        cargarPagos();

        return () => clearInterval(intervalId);
    }, []);

    const actualizarEstado = async (id, nuevoEstado, item) => {
        try {
            // console.log(item)
            if (nuevoEstado === 'Confirmado') {
                setCurrentPago({ id, item });
                setModalVisible(true)
            } else {
                const response = await api.put(`/pagos/${id}`, {
                    estado: nuevoEstado
                });

                // Verificar si la actualización fue exitosa
                if (response.data.success) {
                    // Actualizar los datos del mensajero en caso de que lleve sino pones en proveedor
                    Alert.alert('Éxito', nuevoEstado === 'Confirmado'
                        ? 'Pago confirmado y carrito limpiado'
                        : 'Estado actualizado');
                    cargarPagos();
                } else {
                    Alert.alert('Error', 'No se pudo actualizar el estado');
                }
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error de conexión. Intente nuevamente.');
        }

    };

    // useEffect(() => {
    //     cargarPagos();
    // }, []);
    // useEffect(() => {
    //     let isMounted = true;
    //     let intervalId;

    //     const fetchData = async () => {
    //         if (isMounted) {
    //             await cargarPagos();
    //         }
    //     };

    //     // Cargar inmediatamente al montar
    //     fetchData();

    //     // Configurar intervalo
    //     intervalId = setInterval(fetchData, 5000);

    //     // Limpieza al desmontar
    //     return () => {
    //         isMounted = false;
    //         clearInterval(intervalId);
    //     };
    // }, [cargarPagos]); // Dependencia de cargarPagos

    // const cargarPagos = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.get('/pagos/pendientes');
    //         setPagos(response.data.data);
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    // const startInterval = useCallback(() => {
    //     // Limpiar intervalos existentes
    //     stopInterval();

    //     // Iniciar nuevo intervalo
    //     intervalRef.current = setInterval(() => {
    //         if (isActiveRef.current) {
    //             cargarPagos();
    //         }
    //     }, 5000);
    // }, [cargarPagos]);

    // const stopInterval = useCallback(() => {
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //         intervalRef.current = null;
    //     }
    // }, []);

    // const handleUserActivity = useCallback(() => {
    //     // Marcar que hay actividad
    //     isActiveRef.current = false;
    //     stopInterval();

    //     // Cargar datos inmediatamente
    //     cargarPagos();

    //     // Configurar temporizador para reanudar intervalo
    //     if (inactivityTimerRef.current) {
    //         clearTimeout(inactivityTimerRef.current);
    //     }

    //     inactivityTimerRef.current = setTimeout(() => {
    //         isActiveRef.current = true;
    //         startInterval();
    //     }, 15000); // 15 segundos de inactividad para reanudar
    // }, [cargarPagos, startInterval, stopInterval]);

    // useEffect(() => {
    //     // Carga inicial
    //     cargarPagos();
    //     startInterval();

    //     return () => {
    //         stopInterval();
    //         if (inactivityTimerRef.current) {
    //             clearTimeout(inactivityTimerRef.current);
    //         }
    //     };
    // }, [cargarPagos, startInterval, stopInterval]);

    // const actualizarEstado = async (id, nuevoEstado, item) => {
    //     handleUserActivity(); // Registrar actividad

    //     try {
    //         if (nuevoEstado === 'Confirmado') {
    //             setCurrentPago({ id, item });
    //             setModalVisible(true);
    //         } else {
    //             const response = await api.put(`/pagos/${id}`, {
    //                 estado: nuevoEstado
    //             });

    //             if (response.data.success) {
    //                 Alert.alert('Éxito', 'Estado actualizado');
    //                 cargarPagos();
    //             }
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         Alert.alert('Error', 'Error de conexión');
    //     }
    // };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <Text style={styles.itemText}>
                    {item.attributes.estado === 'Enviado' ? '🟡' : '🟠'} ${item.attributes.cantidad}.00 de {item.attributes?.nombre_persona || 'Anónimo'}
                </Text>
                <Text style={styles.fechaText}>
                    {new Date(item.attributes.create_at).toLocaleString()}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    item.attributes.estado === 'Procesando' && styles.buttonConfirmar
                ]}
                // onPressIn={handleUserActivity}
                onPress={() => {
                    if (item.attributes.estado === 'Enviado') {
                        actualizarEstado(item.id, 'Procesando', item);
                    } else {
                        actualizarEstado(item.id, 'Confirmado', item);
                    }
                }}
            >
                <Text style={styles.buttonText}>
                    {item.attributes.estado === 'Enviado' ? 'Verificar' : 'Confirmar'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
                <ActivityIndicator size="large" color="#FFF" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <Text style={styles.title}>Pagos Pendientes</Text>

            <FlatList
                data={pagos}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id?.toString() || 'pago-id'}-${index}`}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay pagos pendientes</Text>
                }
                refreshing={loading}
                onRefresh={cargarPagos}
            />
            <RepartidorModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirmRepartidor}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    item: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemContent: {
        flex: 1,
    },
    itemText: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 5,
    },
    fechaText: {
        color: '#AAA',
        fontSize: 12,
    },
    button: {
        backgroundColor: '#FFA500',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonConfirmar: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#FFF',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});

export default VerificarPagosScreen;