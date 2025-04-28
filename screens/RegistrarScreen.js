import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Config } from '../Config';
// import Config from 'react-native-config';

export default function RegistroScreen({navigation}) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [userData, setUserData] = useState({
        telefono: '',
        nick: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        direccion: '',
        imagen_id: null
    });

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
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const uploadImage = async () => {
        if (!image) {
            // Alert.alert('Error', 'Selecciona una imagen primero');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('imagen', {
            uri: image,
            name: 'profile.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await axios.post(`http://${Config.server}:${Config.puerto}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUserData({ ...userData, imagen_id: response.data.id });
            // return true
            Alert.alert('Éxito', 'Imagen subida correctamente');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error al subir la imagen');
            // return false
        } finally {
            setUploading(false);
        }
    };

    const handleRegister = async () => {

        if (!image) {
            Alert.alert('Error', 'Debes subir una imagen de perfil');
            return;
        } 
        try {
            // console.log(userData)
            const response = await axios.post(`http://${Config.server}:${Config.puerto}/usuarios`, userData);
            // console.log(response)
            // Alert.alert('Éxito',response.data);
            Alert.alert('Éxito', 'Usuario registrado correctamente');
            navigation.replace('Login');
            // Navegar a otra pantalla o limpiar el formulario
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error al registrar usuario');
        }
    };

    const handleChange = (name, value) => {
        setUserData({ ...userData, [name]: value });
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    {/* Sección de imagen */}
                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Icon name="camera" size={50} color="#FFF" />
                                <Text style={styles.imageText}>Subir foto</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {image && !userData.imagen_id && (
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={uploadImage}
                            disabled={uploading}
                        >
                            <Text style={styles.buttonText}>
                                {uploading ? 'Subiendo...' : 'Confirmar imagen'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Campos del formulario */}
                    <TextInput
                        style={styles.input}
                        placeholder="Teléfono"
                        value={userData.telefono}
                        onChangeText={(text) => handleChange('telefono', text)}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nick"
                        value={userData.nick}
                        onChangeText={(text) => handleChange('nick', text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={userData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Primer apellido"
                        value={userData.apellido1}
                        onChangeText={(text) => handleChange('apellido1', text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Segundo apellido"
                        value={userData.apellido2}
                        onChangeText={(text) => handleChange('apellido2', text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Dirección"
                        value={userData.direccion}
                        onChangeText={(text) => handleChange('direccion', text)}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                    // disabled={!userData.imagen_id}
                    >
                        <Text style={styles.buttonText}>
                            {/* Registrarse */}
                            {uploading ? 'Subiendo...' : 'Registrarse'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
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
    },
    input: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
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
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});