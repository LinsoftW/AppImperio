import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import SweetAlert from 'react-native-sweet-alert';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Validación simple (puedes agregar lógica más compleja)
        if (email === 'admin' && password === '123') {
            navigation.replace('Stock'); // Redirige a la pantalla principal
        } else {
            // alert('Correo o contraseña incorrectos');
            // Para alertas de éxito:
            SweetAlert.showAlert({
                title: 'Éxito',
                subTitle: 'Mensaje enviado correctamente',
                style: 'success', // Cambia el icono y color
            });
        }
    };

    return (
        <>
            <ImageBackground
                source={require('../assets/LogoImperio.jpg')} // Cambia 'path-to-your-image.jpeg' por la ruta de tu archivo
                style={styles.background}
                resizeMode="cover"
            >
                {/* <Text style={styles.title}>Bienvenido a Imperio</Text> */}
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {/* <Button style={styles.buttonText} title="Iniciar sesión" onPress={handleLogin} /> */}
                <TouchableOpacity
                    style={styles.botonAgregar}
                    title="Iniciar sesión" onPress={handleLogin}

                >
                    <Text style={styles.textoBotonAgregar}>Iniciar sesión</Text>
                </TouchableOpacity>

            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        width: '90%', // Centrado con un ancho definido
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: 320,
        height: 50,
        top: -100,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#BDC3C7',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#34495E',
    },
    button: {
        width: 300,
        height: 50,
        // top: 10,
        backgroundColor: '#FFA500', // Naranja llamativo
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4, // Bordes menos redondeados para un estilo similar a Bootstrap
        borderWidth: 1, // Añadir un borde
        borderColor: '#E67E22', // Color del borde complementario al fondo
        shadowColor: '#000', // Efecto de sombra
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3, // Elevación para dar el efecto de botones flotantes
    },
    buttonText: {
        color: '#FFF',
        top: 100,
        fontSize: 25,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    botonAgregar: {
        width: 140, // Ancho igual a la altura para que sea perfectamente circular
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
    textoBotonAgregar: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000', // Texto negro para contraste en el botón naranja
    },
});

export default LoginScreen;
