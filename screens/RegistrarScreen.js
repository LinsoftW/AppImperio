import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Config } from '../Config';
import api from '../api/api';

export default function RegistroScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [userData, setUserData] = useState({
        telefono: '',
        nick: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        direccion: '',
        email: '',
        password: '',
        imagen_id: null,
        idrol: null
    });

    const validatePassword = () => {
        if (userData.password && confirmPassword && userData.password !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return false;
        }
        setPasswordError('');
        return true;
    };

    // Llama a validatePassword cuando cambien los campos
    useEffect(() => {
        validatePassword();
    }, [userData.password, confirmPassword]);

    // const server = '192.168.1.101';
    // const puerto = "5000";

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                setUserData({ ...userData, imagen_id: null });
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const uploadImage = async () => {
        if (!image) {
            Alert.alert('Aviso', 'Selecciona una imagen primero');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('imagen', {
            uri: image,
            name: `profile_${Date.now()}.jpg`,
            type: 'image/jpeg',
        });

        try {
            // const response = await axios.post(`http://${Config.server}:${Config.puerto}/upload`, formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            //     timeout: 10000 // 10 segundos de timeout
            // });
            const response = await api.post(`/upload`, formData);

            setUserData({ ...userData, imagen_id: response.data.id });
            // return true
            Alert.alert('Éxito', 'Imagen de perfil guardada correctamente');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Error al subir la imagen. Por favor, inténtalo de nuevo.');
            // return false
        } finally {
            setUploading(false);
        }
    };

    const validateForm = () => {
        const requiredFields = ['telefono', 'nick', 'nombre', 'apellido1', 'direccion', 'password'];
        const missingFields = requiredFields.filter(field => !userData[field].trim());

        if (missingFields.length > 0) {
            Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios');
            return false;
        }

        if (!userData.imagen_id) {
            Alert.alert('Imagen requerida', 'Por favor sube y confirma tu imagen de perfil');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {

        if (!image) {
            Alert.alert('Error', 'Debes subir una imagen de perfil');
            return;
        }

        if (!validateForm()) return;

        try {
            // console.log(userData)
            // const response = await axios.post(`http://${Config.server}:${Config.puerto}/auth/register`, userData, {
            //     timeout: 10000 // 10 segundos de timeout
            // });
            const response = await api.post(`/auth/register`, userData);
            // console.log(response)
            Alert.alert(
                'Registro exitoso',
                '¡Tu cuenta ha sido creada con éxito!',
                [
                    { text: 'OK', onPress: () => navigation.replace('Login') }
                ]
            );
            // navigation.replace('Login');
            // Navegar a otra pantalla o limpiar el formulario
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            const errorMessage = error.response?.data?.message ||
                (error.response?.status === 409 ? 'El teléfono o nick ya están en uso' :
                    'Error al registrar usuario. Por favor, inténtalo de nuevo.');
            Alert.alert('Error', errorMessage);
        }
        finally {
            setRegistering(false);
        }
    };

    const handleChange = (name, value) => {
        setUserData({ ...userData, [name]: value });
    };

    return (
        //         <LinearGradient
        //             colors={['#4c669f', '#3b5998', '#192f6a']}
        //             style={styles.container}
        //         >
        //             <ScrollView contentContainerStyle={styles.scrollContainer}>
        //                 <View style={styles.formContainer}>
        //                     {/* Sección de imagen */}
        //                     <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        //                         {image ? (
        //                             <Image source={{ uri: image }} style={styles.profileImage} />
        //                         ) : (
        //                             <View style={styles.imagePlaceholder}>
        //                                 <Icon name="camera" size={50} color="#FFF" />
        //                                 <Text style={styles.imageText}>Subir foto</Text>
        //                             </View>
        //                         )}
        //                     </TouchableOpacity>

        //                     {image && !userData.imagen_id && (
        //                         <TouchableOpacity
        //                             style={styles.uploadButton}
        //                             onPress={uploadImage}
        //                             disabled={uploading}
        //                         >
        //                             <Text style={styles.buttonText}>
        //                                 {uploading ? 'Subiendo...' : 'Confirmar imagen'}
        //                             </Text>
        //                         </TouchableOpacity>
        //                     )}

        //                     {/* Campos del formulario */}
        //                     <TextInput
        //                         style={styles.input}
        //                         placeholder="Teléfono"
        //                         value={userData.telefono}
        //                         onChangeText={(text) => handleChange('telefono', text)}
        //                         keyboardType="phone-pad"
        //                     />

        //                     <TextInput
        //                         style={styles.input}
        //                         placeholder="Nick"
        //                         value={userData.nick}
        //                         onChangeText={(text) => handleChange('nick', text)}
        //                     />

        //                     <TextInput
        //                         style={styles.input}
        //                         placeholder="Nombre"
        //                         value={userData.nombre}
        //                         onChangeText={(text) => handleChange('nombre', text)}
        //                     />

        //                     <TextInput
        //                         style={styles.input}
        //                         placeholder="Primer apellido"
        //                         value={userData.apellido1}
        //                         onChangeText={(text) => handleChange('apellido1', text)}
        //                     />

        //                     <TextInput
        //                         style={styles.input}
        //                         placeholder="Segundo apellido"
        //                         value={userData.apellido2}
        //                         onChangeText={(text) => handleChange('apellido2', text)}
        //                     />

        //                     <TextInput
        //                         style={styles.input}
        //                         placeholder="Dirección"
        //                         value={userData.direccion}
        //                         onChangeText={(text) => handleChange('direccion', text)}
        //                         multiline
        //                     />

        //                     <TouchableOpacity
        //                         style={styles.registerButton}
        //                         onPress={handleRegister}
        //                     // disabled={!userData.imagen_id}
        //                     >
        //                         <Text style={styles.buttonText}>
        //                             {/* Registrarse */}
        //                             {uploading ? 'Subiendo...' : 'Registrarse'}
        //                         </Text>
        //                     </TouchableOpacity>
        //                 </View>
        //             </ScrollView>
        //         </LinearGradient>
        //     );
        // }

        // const styles = StyleSheet.create({
        //     container: {
        //         flex: 1,
        //     },
        //     scrollContainer: {
        //         flexGrow: 1,
        //         padding: 20,
        //     },
        //     formContainer: {
        //         alignItems: 'center',
        //     },
        //     imageButton: {
        //         marginBottom: 20,
        //     },
        //     profileImage: {
        //         width: 150,
        //         height: 150,
        //         borderRadius: 75,
        //         borderWidth: 3,
        //         borderColor: '#FFF',
        //     },
        //     imagePlaceholder: {
        //         width: 150,
        //         height: 150,
        //         borderRadius: 75,
        //         backgroundColor: 'rgba(255,255,255,0.2)',
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         borderWidth: 2,
        //         borderColor: '#FFF',
        //         borderStyle: 'dashed',
        //     },
        //     imageText: {
        //         color: '#FFF',
        //         marginTop: 10,
        //     },
        //     input: {
        //         width: '100%',
        //         backgroundColor: '#FFF',
        //         padding: 15,
        //         borderRadius: 10,
        //         marginBottom: 15,
        //         fontSize: 16,
        //     },
        //     uploadButton: {
        //         backgroundColor: '#4CAF50',
        //         padding: 15,
        //         borderRadius: 10,
        //         marginBottom: 20,
        //         width: '100%',
        //         alignItems: 'center',
        //     },
        //     registerButton: {
        //         backgroundColor: '#FF5722',
        //         padding: 15,
        //         borderRadius: 10,
        //         width: '100%',
        //         alignItems: 'center',
        //         marginTop: 10,
        //     },
        //     buttonText: {
        //         color: '#FFF',
        //         fontWeight: 'bold',
        //         fontSize: 16,
        //     },
        // });
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    {/* Sección de imagen */}
                    <TouchableOpacity
                        style={styles.imageButton}
                        onPress={pickImage}
                        disabled={uploading || registering}
                    >
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Icon name="camera" size={50} color="#FFF" />
                                <Text style={styles.imageText}>Subir foto de perfil</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {image && !userData.imagen_id && (
                        <TouchableOpacity
                            style={[styles.uploadButton, uploading && styles.disabledButton]}
                            onPress={uploadImage}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>Confirmar imagen</Text>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* Campos del formulario */}
                    <TextInput
                        style={styles.input}
                        placeholder="Teléfono *"
                        value={userData.telefono}
                        onChangeText={(text) => handleChange('telefono', text)}
                        keyboardType="phone-pad"
                        editable={!registering}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nick *"
                        value={userData.nick}
                        onChangeText={(text) => handleChange('nick', text)}
                        editable={!registering}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre *"
                        value={userData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                        editable={!registering}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Primer apellido *"
                        value={userData.apellido1}
                        onChangeText={(text) => handleChange('apellido1', text)}
                        editable={!registering}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Segundo apellido"
                        value={userData.apellido2}
                        onChangeText={(text) => handleChange('apellido2', text)}
                        editable={!registering}
                    />

                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        placeholder="Dirección *"
                        value={userData.direccion}
                        onChangeText={(text) => handleChange('direccion', text)}
                        multiline
                        numberOfLines={3}
                        editable={!registering}
                    />

                    {/* <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={userData.password}
                        onChangeText={(text) => handleChange('password', text)}
                        secureTextEntry={true}
                        editable={!registering}
                    />
                    <TextInput
                        style={styles.inputPass}
                        placeholder="Repita la contraseña"
                        // value={userData.password2}
                        // onChangeText={(text) => handleChange('password', text)}
                        secureTextEntry={true}
                        editable={!registering}
                    /> */}
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.inputPass}
                            placeholder="Contraseña *"
                            value={userData.password}
                            onChangeText={(text) => handleChange('password', text)}
                            secureTextEntry={!showPassword}
                            editable={!registering}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Icon
                                name={showPassword ? "eye-off" : "eye"}
                                size={24}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.inputPass}
                            placeholder="Repita la contraseña *"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            editable={!registering}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Icon
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={24}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    <TouchableOpacity
                        style={[styles.registerButton, (uploading || registering) && styles.disabledButton]}
                        onPress={handleRegister}
                        disabled={uploading || registering}
                    >
                        {registering ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Registrarse</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginTop: -10,
        marginBottom: 15,
        marginLeft: 5,
    },
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
    inputPass: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        paddingRight: 40,  // Espacio para el ícono
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    formContainer: {
        alignItems: 'center',
    },
    imageButton: {
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    imagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        borderStyle: 'dashed',
    },
    imageText: {
        color: '#FFF',
        marginTop: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    inputPass: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    registerButton: {
        backgroundColor: '#FF5722',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});