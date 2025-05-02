import React, { useState, useContext } from 'react';
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
    Button,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useUser } from './UserContext';
import { Config } from '../Config';
// import Config from 'react-native-config';
// import SweetAlert from 'react-native-sweet-alert';

const LoginScreen2 = ({ navigation, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonScale] = useState(new Animated.Value(1));
    const [loading, setLoading] = useState(false);
    const [users, setUsuarios] = useState([]);
    const [resultado, setResultado] = useState(null);

    const { login } = useUser();

    // const { server, puerto } = useContext(useUser); // Usa el hook personalizado

    // const server = '192.168.1.101';
    // const puerto = "5000";

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

    const verificarUsuario = async () => {
        setLoading(true)
        // console.log(Config.server)
        try {
            const response = await axios.get(`http://${Config.server}:${Config.puerto}/usuarios/existe`, {
                params: { email }
            });
            // const data = await response.json();
            // console.log(response.data)
            setResultado(response.data);

            if (response.data.existe) {
                // Guarda TODOS los datos relevantes del usuario
                // login({
                //     id: response.data.usuario.id,
                //     // nombre: response.data.datos.attributes.nombre,
                //     // nick: response.data.usuario.nick,
                //     // telefono: response.data.usuario.telefono,
                //     // direccion: response.data.usuario.direccion
                //     token: response.data.token
                //     // ... otros datos que necesites
                // });
                await AsyncStorage.removeItem('anonUser'); // Limpiar sesión anónima si existe
                login(response.data)// Guardar usuario normal
                onLogin(); // Cambia el estado a logueado
                // Al iniciar sesión exitosamente:
                setLoading(false)
            } else {
                Alert.alert('Error', 'Nick o teléfono no encontrado en el sistema.');
                setLoading(false);
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Error al verificar');
            setLoading(false)
        }
    };

    const handleLogin = async () => {
        setLoading(true);

        // if (await verificarUsuario(email)) {
        //     // navigation.replace('Stock'); // Redirige a la pantalla principal
        //     onLogin(); // Cambia el estado a logueado
        //     setLoading(false);
        // } else {
        //     alert('Correo o contraseña incorrectos');
        //     setLoading(false);

        // }
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
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />

                        {/* <Button
                            title="Verificar"
                            onPress={verificarUsuario}
                            disabled={email.length < 4} // Mínimo 4 caracteres
                        />

                        {resultado && (
                            <View style={styles.resultado}>
                                <Text>Tipo verificado: {resultado.tipo}</Text>
                                <Text>Existe: {resultado.existe ? 'Sí' : 'No'}</Text>
                            </View>
                        )} */}
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

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={[styles.button, loading && styles.disabledButton]}
                            onPress={verificarUsuario}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={loading || email.length < 4}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color="#4c669f" />
                            ) : (
                                <Text style={styles.buttonText}>Iniciar Sesión</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity disabled={loading} onPress={() => navigation.navigate('Registro')}>
                        <Text style={styles.registerText}>
                            ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',
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

export default LoginScreen2;