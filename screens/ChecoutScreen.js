import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/api';
import { useUser } from './UserContext';

const CheckoutScreen1 = ({ navigation, route }) => {
    const { total, pagina } = route.params;
    const [seleccionado, setSeleccionado] = useState(0); // 0 = nada, 1 = PayPal, 2 = Tarjeta

    const { user } = useUser();

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

    const enviarPago = async () => {
        try {
            const response = await api.post(`/pagos`, {
                idpersona: user.id,
                cantidad: parseFloat(total),
            });
            const idPagoGenerado = response.data.data.id
            Alert.alert('Éxito', 'Pago enviado para verificación');
            navigation.navigate('EstadoPago', { pagoId: idPagoGenerado, pag: pagina });
        } catch (error) {
            Alert.alert('Error', 'No se pudo enviar el pago');
            console.error(error);
        }
    };

    const enviarPagoSimple = async () => {
        try {
            const response = await api.post(`/pagosS`, {
                idpersona: user.id,
                cantidad: parseFloat(total)
            });
            const idPagoGenerado = response.data.data.id
            Alert.alert('Éxito', 'Pago enviado para verificación');
            navigation.navigate('EstadoPago', { pagoId: idPagoGenerado });
        } catch (error) {
            Alert.alert('Error', 'No se pudo enviar el pago');
            console.error(error);
        }
    };

    const handlePago = async () => {
        // console.log(pagina)
        if (seleccionado === 0) {
            Alert.alert('Error', 'Selecciona un método de pago');
            return;
        }

        if (seleccionado === 1) {
            // Abrir PayPal
            // enzona()
            // if (pagina === 'M') {
            enviarPago()
            // }else{
            // console.log("Por aquiiii")
            // enviarPagoSimple()
            // }
        }
        if (seleccionado === 2) {
            // Abrir PayPal
            Alert.alert('Aviso', 'Ha seleccionado pagar por transfermovil');
        }
    };

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            {/* Imagen de tarjeta */}
            <Image
                source={require('../assets/tarjeta.png')}
                style={styles.cardImage}
                resizeMode="contain"
            />

            {/* Monto a pagar */}
            <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Total a pagar</Text>
                <Text style={styles.amountValue}>${total.toFixed(2)}</Text>
            </View>

            {/* Selector de método de pago */}
            <View style={styles.paymentMethodsContainer}>
                <Text style={styles.sectionTitle}>Método de pago</Text>

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
                    <Text style={styles.methodText}>Enzona</Text>
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
                    <Text style={styles.methodText}>Transfermovil</Text>
                    {seleccionado === 2 && <Icon name="checkmark-circle" size={24} color="#4CAF50" />}
                </TouchableOpacity>
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
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    cardImage: {
        width: '80%',
        height: 150,
        marginTop: 30,
        marginBottom: 20,
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
    paymentMethodsContainer: {
        width: '90%',
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedMethod: {
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    methodImage: {
        width: 30,
        height: 30,
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