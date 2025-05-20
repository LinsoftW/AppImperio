import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/api';
import { useUser } from './UserContext';

const CheckoutScreen1 = ({ navigation, route }) => {
    const { total, pagina } = route.params;
    const [seleccionado, setSeleccionado] = useState(0); // 0 = nada, 1 = PayPal, 2 = Tarjeta
    const [tarjetas, setTarjetas] = useState([]);

    const { user } = useUser();

    const cargarTarjetas = async () => {
        try {
            // setLoading(true);
            const response = await api.get('/tarjetas');
            for (let index = 0; index < response.data.data.length; index++) {
                if (response.data.data[index].preferida === 'Preferida') {
                    const tarj = response.data.data[index].numero
                    setTarjetas(tarj);
                    break
                }
            }
            //   console.log(response.data.data)
            // setTarjetas(tarj);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudieron cargar las tarjetas');
        } finally {
            // setLoading(false);
            // console.log(tarjetas)
        }
        // setRefreshing(false)
    };

    useEffect(() => {
        cargarTarjetas();
    }, []);

    const enzona = async () => {
        // primero verificar si esta instalada la apk y sino abrir la web si tiene
        // const iSEnzonaInstalda = checkAppInstalled('whatsapp://')
        // try {
        //     await Linking.openURL('whatsapp://');
        // } catch (error) {
        //     Alert.alert('Error', 'WhatsApp no está instalado');
        // }
        // console.log(iSEnzonaInstalda)
        const url = 'https://identity.enzona.net/authenticationendpoint/login.do?client_id=ofr3Wz9nnfZaFd18OewdZYvuTaEa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fwww.enzona.net%2Fauth%2Fenzona%2Fcallback&response_type=code&scope=openid&state=8ErbQIPelljf2xEWhqfRQCNDsvbL7Mjx308Lukyc&tenantDomain=carbon.super&sessionDataKey=769171b9-3a8d-496a-84e1-9c12b071a8dd&relyingParty=ofr3Wz9nnfZaFd18OewdZYvuTaEa&type=oidc&sp=admin_ppago-apk_PRODUCTION&isSaaSApp=false&authenticators=IdentifierExecutor:LOCAL'; // Reemplaza con tu URL de PayPal
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error al abrir Enzona:', error);
        }
    };

    const transfermovil = async () => {
        // primero verificar si esta instalada la apk y sino abrir la web si tiene
        // const iSEnzonaInstalda = checkAppInstalled('transfermovil://')
        // try {
        //     await Linking.openURL('transfermovil://');
        // } catch (error) {
        //     Alert.alert('Error', 'Transfermovil no está instalado');
        // }
        // console.log(iSEnzonaInstalda)
        // const url = 'https://identity.enzona.net/authenticationendpoint/login.do?client_id=ofr3Wz9nnfZaFd18OewdZYvuTaEa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fwww.enzona.net%2Fauth%2Fenzona%2Fcallback&response_type=code&scope=openid&state=8ErbQIPelljf2xEWhqfRQCNDsvbL7Mjx308Lukyc&tenantDomain=carbon.super&sessionDataKey=769171b9-3a8d-496a-84e1-9c12b071a8dd&relyingParty=ofr3Wz9nnfZaFd18OewdZYvuTaEa&type=oidc&sp=admin_ppago-apk_PRODUCTION&isSaaSApp=false&authenticators=IdentifierExecutor:LOCAL'; // Reemplaza con tu URL de PayPal
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error al abrir Enzona:', error);
        }
    };

    const enviarPago = async () => {
        try {
            const response = await api.post(`/pagos`, {
                idpersona: user.id,
                cantidad: parseFloat(total),
            });
            // console.log(response.data)
            const idPagoGenerado = response.data.data.id
            Alert.alert('Éxito', 'Pago enviado para verificación');
            navigation.navigate('EstadoPago', { pagoId: idPagoGenerado, pag: pagina });
        } catch (error) {
            Alert.alert('Error', 'No se pudo enviar el pago');
            console.error(error);
        }
    };

    const handlePago = async () => {
        if (seleccionado === 0) {
            Alert.alert('Error', 'Selecciona un método de pago');
            return;
        }

        if (seleccionado === 1) {
            // Abrir PayPal
            enzona()
            // if (pagina === 'M') {
            enviarPago()
            // }else{
            // console.log("Por aquiiii")
            // enviarPagoSimple()
            // }
        }
        if (seleccionado === 2) {
            // Abrir PayPal
            transfermovil()
            enviarPago()
            // Alert.alert('Aviso', 'Ha seleccionado pagar por transfermovil');
        }
    };

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            {/* Imagen de tarjeta */}
            <View style={styles.containerI}>
                <Image
                    source={require('../assets/tarjeta1.png')}
                    style={styles.cardImage}
                    resizeMode="contain"
                />
                <Text style={styles.textOverlay}>{tarjetas}</Text>
            </View>

            {/* Monto a pagar */}
            <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Total a pagar</Text>
                <Text style={styles.amountValue}>${total.toFixed(2)}</Text>
            </View>

            {/* Selector de método de pago */}
            <View style={styles.paymentMethodsContainer}>
                <Text style={styles.sectionTitle}>Método de pago</Text>

                <View style={styles.methodsRow}>
                    <TouchableOpacity
                        style={[
                            styles.methodButton,
                            seleccionado === 1 && styles.selectedMethod
                        ]}
                        onPress={() => setSeleccionado(1)}
                    >
                        <Image
                            source={require('../assets/enzona.png')}
                            style={styles.methodImage}
                        />
                        {/* <Text style={styles.methodText}>Enzona</Text> */}
                        {seleccionado === 1 && <Icon name="checkmark-circle" size={24} color="#4CAF50" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.methodButton,
                            seleccionado === 2 && styles.selectedMethod
                        ]}
                        onPress={() => setSeleccionado(2)}
                    >
                        <Image
                            source={require('../assets/transfermovil.png')}
                            style={styles.methodImage}
                        />
                        {/* <Text style={styles.methodText}>Transfermovil</Text> */}
                        {seleccionado === 2 && <Icon name="checkmark-circle" size={24} color="#4CAF50" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.methodButton,
                            seleccionado === 3 && styles.selectedMethod
                        ]}
                        onPress={() => setSeleccionado(3)}
                    >
                        <Image
                            source={require('../assets/cash.png')}
                            style={styles.methodImage}
                        />
                        {/* <Text style={styles.methodText}>Efectivo</Text> */}
                        {seleccionado === 3 && <Icon name="checkmark-circle" size={24} color="#4CAF50" />}
                    </TouchableOpacity>

                </View>
            </View>

            {/* Botón de confirmación */}
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handlePago}
            >
                <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
                <Icon name="lock-closed" size={20} color="#FFF" />
            </TouchableOpacity>
        </LinearGradient>
    );
};

// Estilos (basados en tu diseño anterior con mejoras)
const styles = StyleSheet.create({
    textOverlay: {
        position: 'absolute',
        // bottom: 20,
        left: 0,
        right: 0,
        top: 80,
        marginTop: 10,
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        // textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        padding: 10,
        // backgroundColor: 'rgba(0,0,0,0.3)',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    containerI: {
        position: 'relative',
        width: 300,
        height: 200,
    },
    cardImage: {
        // width: '80%',
        // height: 150,
        // marginTop: 30,
        marginBottom: 20,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    amountContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        marginBottom: 30,
    },
    amountLabel: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 10,
    },
    amountValue: {
        color: '#FFD700',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },
    // paymentMethodsContainer: {
    //     flexDirection: 'row', // Cambia a fila horizontal
    //     justifyContent: 'space-between', // Distribuye el espacio entre los elementos
    //     width: '90%',
    //     marginBottom: 20,
    // },
    // paymentMethodsContainer: {
    //     width: '90%',
    //     marginBottom: 20,
    // },
    // methodsRow: {
    //     flexDirection: 'row',       // Coloca los botones en fila
    //     justifyContent: 'space-between', // Distribuye el espacio entre ellos
    // },
    paymentMethodsContainer: {
        width: '90%',
        marginBottom: 20,
    },
    methodsRow: {
        flexDirection: 'row',       // Coloca los botones en fila
        justifyContent: 'space-between', // Distribuye el espacio entre ellos
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',   // Centra el contenido del botón
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 15,
        width: '30%',              // Ancho proporcional para 3 botones
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    selectedMethod: {
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    methodImage: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    methodText: {
        color: '#FFF',
        fontSize: 16,
        flex: 1,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        width: '90%',
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 10,
    },
});

export default CheckoutScreen1;