// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';

// const EstadoPagoScreen = ({ route, navigation }) => {
//     // Estados del pago
//     const [estadoPago, setEstadoPago] = useState('Pendiente');
//     const [repartidor, setRepartidor] = useState(null);
//     const [tiempoEstimado, setTiempoEstimado] = useState(null);

//     // Simulación de cambio de estado (en un caso real vendría de tu backend)
//     useEffect(() => {
//         // Estado inicial
//         const timer1 = setTimeout(() => {
//             setEstadoPago('Procesando');
//         }, 3000);

//         // Simular confirmación del administrador después de 8 segundos
//         const timer2 = setTimeout(() => {
//             setEstadoPago('Confirmado');
//             setRepartidor({
//                 nombre: 'Carlos Gómez',
//                 telefono: '+51 987 654 321',
//                 vehiculo: 'Moto - ABC123'
//             });
//             setTiempoEstimado('30-45 minutos');
//         }, 8000);

//         return () => {
//             clearTimeout(timer1);
//             clearTimeout(timer2);
//         };
//     }, []);

//     return (
//         <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
//             {/* Encabezado */}
//             <View style={styles.header}>
//                 <Text style={styles.title}>Estado de tu pago</Text>
//             </View>

//             {/* Tarjeta de estado */}
//             <View style={styles.card}>
//                 {/* Icono animado según estado */}
//                 {estadoPago === 'Pendiente' || estadoPago === 'Procesando' ? (
//                     <ActivityIndicator size="large" color="#4CAF50" style={styles.icon} />
//                 ) : (
//                     <Icon name="checkmark-circle" size={80} color="#4CAF50" style={styles.icon} />
//                 )}

//                 {/* Estado actual */}
//                 <Text style={[
//                     styles.estadoText,
//                     estadoPago === 'Confirmado' && styles.estadoConfirmado
//                 ]}>
//                     {estadoPago}
//                 </Text>

//                 {/* Mensaje dinámico */}
//                 <Text style={styles.mensaje}>
//                     {estadoPago === 'Pendiente'
//                         ? 'Estamos validando tu pago...'
//                         : estadoPago === 'Procesando'
//                             ? 'Confirmando con el administrador'
//                             : '¡Pago confirmado exitosamente!'}
//                 </Text>

//                 {/* Detalles de entrega (solo cuando está confirmado) */}
//                 {estadoPago === 'Confirmado' && (
//                     <View style={styles.entregaContainer}>
//                         <Text style={styles.entregaTitle}>Tu pedido está en camino</Text>

//                         <View style={styles.repartidorInfo}>
//                             <Image
//                                 source={require('../assets/card.png')}
//                                 style={styles.repartidorImage}
//                             />
//                             <View>
//                                 <Text style={styles.repartidorText}>Repartidor: {repartidor.nombre}</Text>
//                                 <Text style={styles.repartidorText}>Vehículo: {repartidor.vehiculo}</Text>
//                                 <Text style={styles.repartidorText}>Contacto: {repartidor.telefono}</Text>
//                                 <Text style={styles.tiempoText}>Llega en: {tiempoEstimado}</Text>
//                             </View>
//                         </View>

//                         <TouchableOpacity
//                             style={styles.contactButton}
//                             onPress={() => Linking.openURL(`tel:${repartidor.telefono}`)}
//                         >
//                             <Icon name="call" size={20} color="#FFF" />
//                             <Text style={styles.contactButtonText}>Llamar al repartidor</Text>
//                         </TouchableOpacity>
//                     </View>
//                 )}
//             </View>

//             {/* Botón de acción */}
//             <TouchableOpacity
//                 style={[
//                     styles.actionButton,
//                     {
//                         backgroundColor: estadoPago === 'Confirmado' ? '#4CAF50' : '#FF3B30'
//                     }
//                 ]}
//                 onPress={() => navigation.goBack()}
//             >
//                 <Text style={styles.actionButtonText}>
//                     {estadoPago === 'Confirmado' ? 'Aceptar' : 'Cancelar pedido'}
//                 </Text>
//             </TouchableOpacity>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     header: {
//         alignItems: 'center',
//         marginVertical: 30,
//     },
//     title: {
//         color: '#FFF',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     card: {
//         backgroundColor: 'rgba(255, 255, 255, 0.15)',
//         borderRadius: 15,
//         padding: 25,
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     icon: {
//         marginBottom: 20,
//     },
//     estadoText: {
//         color: '#FFD700',
//         fontSize: 28,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     estadoConfirmado: {
//         color: '#4CAF50',
//     },
//     mensaje: {
//         color: '#FFF',
//         fontSize: 16,
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     entregaContainer: {
//         width: '100%',
//         backgroundColor: 'rgba(255, 255, 255, 0.1)',
//         borderRadius: 10,
//         padding: 15,
//         marginTop: 10,
//     },
//     entregaTitle: {
//         color: '#4CAF50',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     repartidorInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     repartidorImage: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         marginRight: 15,
//     },
//     repartidorText: {
//         color: '#FFF',
//         fontSize: 14,
//         marginBottom: 5,
//     },
//     tiempoText: {
//         color: '#FFD700',
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginTop: 5,
//     },
//     contactButton: {
//         flexDirection: 'row',
//         backgroundColor: '#4CAF50',
//         padding: 12,
//         borderRadius: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     contactButtonText: {
//         color: '#FFF',
//         fontWeight: 'bold',
//         marginLeft: 10,
//     },
//     actionButton: {
//         // backgroundColor: estadoPago === 'Confirmado' ? '#4CAF50' : '#FF3B30',
//         padding: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     actionButtonText: {
//         color: '#FFF',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
// });

// export default EstadoPagoScreen;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from './UserContext';
import api from '../api/api';

const EstadoPagoScreen = ({ route, navigation }) => {
    const { user } = useUser();
    const { params } = route || {};
    const { pagoId, pag } = params || {};
    const [intervalId, setIntervalId] = useState(null);
    const intervalRef = useRef(null);

    // Verifica inmediatamente si recibiste el ID
    useEffect(() => {
        if (!pagoId) {
            Alert.alert('Error', 'No se recibió el ID del pago');
            navigation.goBack();
            return;
        }
        // console.log('ID del pago recibido:', pagoId); // Para depuración
    }, [pagoId]);

    // Estados del pago
    const [estadoPago, setEstadoPago] = useState('Enviado');
    const [repartidor, setRepartidor] = useState(null);
    const [tiempoEstimado, setTiempoEstimado] = useState(null);
    const [loading, setLoading] = useState(true);

    const ActualizaCarrito = async () => {
        // console.log(pag)
        if (pag === "M") {
            const response = await api.put(`/limpia/carrito/${pagoId}`);
        }
    }

    // Función para verificar el estado del pago
    const verificarEstadoPago = async () => {
        // console.log(pag)
        try {
            const response = await api.get(`/pagos/${pagoId}`);
            // console.log(response.data.data[0])
            if (response.data.data[0] !== undefined) {
                const pago = response.data.data[0].attributes;
                // console.log(pago)
                if (pago.estado !== estadoPago) {
                    setEstadoPago(pago.estado);

                    // Detener el intervalo si el estado es "Confirmado"
                    if (pago.estado === 'Confirmado') {
                        if (intervalId) {
                            clearInterval(intervalId);
                            setIntervalId(null);
                        }

                        // Cargar datos del repartidor
                        // console.log(pago)
                        setRepartidor({
                            nombre: pago.mensajero || 'Carlos Gómez',
                            telefono: pago.telefono || '+5300000000',
                            vehiculo: pago.vehiculo || 'Moto - ABC123',
                        });
                        setTiempoEstimado(pago.tiempo || '30-45 minutos');
                    }
                }
            }

            // Verificar si el estado realmente cambió antes de actualizar el estado local
        } catch (error) {
            console.error('Error al verificar estado:', error);
            // No mostrar error al usuario si es un problema temporal
        } finally {
            setLoading(false);
        }
    };

    // Polling cada 5 segundos para verificar estado
    useEffect(() => {
        const intervalId = setInterval(verificarEstadoPago, 5000);
        setIntervalId(intervalId);
        // Verificar inmediatamente al cargar
        verificarEstadoPago();

        return () => { if (intervalId) clearInterval(intervalId) };
    }, []);

    if (loading) {
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.mensaje}>Cargando estado del pago...</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.title}>Estado de tu pago</Text>
            </View>

            {/* Tarjeta de estado */}
            <View style={styles.card}>
                {/* Icono animado según estado */}
                {/* ('Enviado', 'Procesando' */}
                {estadoPago === 'Enviado' || estadoPago === 'Procesando' ? (
                    <>
                        <ActivityIndicator size="large" color="#4CAF50" style={styles.icon} />
                        <Text style={styles.mensaje}>
                            {estadoPago === 'Pendiente'
                                ? 'Estamos validando tu pago...'
                                : 'El administrador está verificando tu pago'}
                        </Text>
                    </>
                ) : (
                    <>
                        <Icon name="checkmark-circle" size={80} color="#4CAF50" style={styles.icon} />
                        <Text style={styles.mensaje}>¡Pago confirmado exitosamente!</Text>
                    </>
                )}

                {/* Estado actual */}
                <Text style={[
                    styles.estadoText,
                    estadoPago === 'Confirmado' && styles.estadoConfirmado
                ]}>
                    {estadoPago}
                </Text>

                {/* Detalles de entrega (solo cuando está confirmado) */}
                {estadoPago === 'Confirmado' && repartidor && (
                    <View style={styles.entregaContainer}>
                        <Text style={styles.entregaTitle}>Tu pedido está en camino</Text>

                        <View style={styles.repartidorInfo}>
                            {/* <Image
                                source={require('../assets/card.png')} // Cambia por tu imagen de repartidor
                                style={styles.repartidorImage}
                            /> */}
                            <View>
                                <Text style={styles.repartidorText}>Repartidor: {repartidor.nombre}</Text>
                                <Text style={styles.repartidorText}>Vehículo: {repartidor.vehiculo}</Text>
                                <Text style={styles.repartidorText}>Contacto: {repartidor.telefono}</Text>
                                <Text style={styles.tiempoText}>Llega en: {tiempoEstimado}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => Linking.openURL(`tel:${repartidor.telefono}`)}
                        >
                            <Icon name="call" size={20} color="#FFF" />
                            <Text style={styles.contactButtonText}>Llamar al repartidor</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Botón de acción */}
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    {
                        backgroundColor: estadoPago === 'Confirmado' ? '#4CAF50' : '#FF3B30'
                    }
                ]}
                onPress={() => {
                    if (estadoPago === 'Confirmado') {
                        ActualizaCarrito()
                        navigation.navigate('MainDrawer');
                    } else {
                        // Opcional: Cancelar el pago
                        navigation.goBack();
                    }
                }}
            >
                <Text style={styles.actionButtonText}>
                    {estadoPago === 'Confirmado' ? 'Aceptar' : 'Cancelar pedido'}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

// Los estilos se mantienen igual que en tu código original
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginVertical: 30,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        marginBottom: 20,
    },
    estadoText: {
        color: '#FFD700',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    estadoConfirmado: {
        color: '#4CAF50',
    },
    mensaje: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    entregaContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
    },
    entregaTitle: {
        color: '#4CAF50',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    repartidorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    repartidorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    repartidorText: {
        color: '#FFF',
        fontSize: 14,
        marginBottom: 5,
    },
    tiempoText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    contactButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    actionButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EstadoPagoScreen;