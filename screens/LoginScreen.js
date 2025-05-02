import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useUser, setUser } from './UserContext';
import { Config } from '../Config';
import api from '../api/api';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreenEste = ({ navigation, onLogin }) => {
    const [nick, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonScale] = useState(new Animated.Value(1));
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const { login } = useUser();

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handleAnonymousLogin = async () => {
        Alert.alert(
            'Acceso como invitado',
            '¿Desea continuar sin una cuenta? Tendrá acceso limitado',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Continuar',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const response = await api.post('/login-anonimo');

                            await AsyncStorage.setItem('userData', JSON.stringify({
                                id: response.data.id,
                                token: response.data.token,
                                esAnonimo: true
                            }));

                            navigation.replace('Inicio');
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.message || 'Error al acceder');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleLogin = async () => {
        if (!nick || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`http://${Config.server}:${Config.puerto}/auth/login`,
                { nick, password }, { timeout: 10000 }
            );
            // console.log(response.data)

            if (response.data.success) {
                // Guardar datos de usuario
                // Prepara los datos para AsyncStorage
                const userDataToStore = {
                    id: response.data.user.id,
                    token: response.data.token,
                    nick: response.data.user.nick || null,
                    esAnonimo: false
                };

                // Guarda en AsyncStorage
                const jsonData = JSON.stringify(userDataToStore);
                if (!jsonData) throw new Error('Error al serializar datos');
                try {
                    const jsonValue = JSON.stringify(userDataToStore);
                    await AsyncStorage.setItem('userData', jsonValue);
                } catch (e) {
                    console.error('Falló el guardado en AsyncStorage:', e);
                    // Opcional: Guardar datos mínimos esenciales
                    await AsyncStorage.setItem('userData_fallback', JSON.stringify({
                        id: userDataToStore.id,
                        token: userDataToStore.token
                    }));
                }
                // Actualizar contexto
                onLogin() // Cambia el estado de logueo
                login(response.data)
                // Redirigir
                navigation.replace('Inicio');
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            if (error.response) {
                // Error del servidor (4xx, 5xx)
                Alert.alert('Error', error.response.data.message || 'Credenciales incorrectas.');
            } else if (error.request) {
                // No se recibió respuesta
                Alert.alert('Error', 'No se pudo conectar al servidor');
            } else {
                // Error en la configuración de la petición
                Alert.alert('Error', 'Error inesperado');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.loginContainer}>
                    <Image
                        source={require('../assets/LogoImperio.jpg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Bienvenido</Text>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="user" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Nick o teléfono"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={nick}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Contraseña"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!loading}
                        />
                    </View> */}
                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña *"
                            placeholderTextColor="#aaa"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showConfirmPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Icon
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={24}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={[styles.button, loading && styles.disabledButton]}
                            onPress={handleLogin}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={loading || !nick || !password}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color="#4c669f" />
                            ) : (
                                <Text style={styles.buttonText}>Iniciar Sesión</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => navigation.navigate('Registro')}
                    >
                        <Text style={styles.registerText}>
                            ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleAnonymousLogin}
                        style={{ marginTop: 15 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.registerText}>Continuar como <Text style={styles.registerLink}>Invitado</Text></Text>
                        )}
                        {/* <Text style={styles.registerText}>
                            Continuar como <Text style={styles.registerLink}>Invitado</Text>
                        </Text> */}
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        style={styles.registerText}
                        onPress={handleAnonymousLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.registerText}>Entrar como invitado</Text>
                        )}
                    </TouchableOpacity> */}
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,  // Agrega borde para mejor visibilidad
        borderColor: '#DDD',
    },
    container: {
        flex: 1,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',
    },
    anonymousButton: {
        backgroundColor: '#666',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
        borderRadius: 75,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#fff',
        fontSize: 16,
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
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#4c669f',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerText: {
        color: '#fff',
        marginTop: 20,
    },
    registerLink: {
        color: '#fff',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
export default LoginScreenEste;
