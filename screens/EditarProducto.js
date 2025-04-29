import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert, TouchableOpacity, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Config } from '../Config';

export default function EditarProducto() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [productData, setProductData] = useState({
        nombre: '',
        precio: '',
        cantidad: '',
        imagen_id: ''
    });
    const [originalImage, setOriginalImage] = useState(null);

    const navigation = useNavigation();
    const route = useRoute();
    const { producto } = route.params; // Recibimos el producto completo desde EliminarProducto

    // Cargar los datos del producto al montar el componente
    useEffect(() => {
        if (producto) {
            setProductData({
                nombre: producto.attributes.nombre,
                precio: producto.attributes.precio.toString(),
                cantidad: producto.attributes.cantidad.toString(),
                imagen_id: producto.attributes.imagen_id,
                descripcion: producto.attributes.descripcion
            });
            setOriginalImage(`http://${Config.server}:${Config.puerto}/${producto.attributes.imagen}`);
            setImage(`http://${Config.server}:${Config.puerto}/${producto.attributes.imagen}`);
        }
    }, [producto]);

    const handleChange = (name, value) => {
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const pickImage = async () => {
        try {
            let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                const { status: newStatus, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (newStatus !== 'granted') {
                    if (!canAskAgain) {
                        Alert.alert(
                            'Permiso bloqueado',
                            'Ve a Configuración > Aplicaciones > Tu App > Permisos para habilitar la galería.',
                            [{ text: 'OK', onPress: () => Linking.openSettings() }]
                        );
                    }
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir la galería.');
        }
    };

    const updateProduct = async () => {
        setUploading(true);

        try {
            let imagen_id = productData.imagen_id;

            // Si la imagen ha cambiado (es una nueva URI local)
            if (image && image !== originalImage && !image.startsWith('http')) {
                // Subir la nueva imagen
                const formData = new FormData();
                formData.append('imagen', {
                    uri: image,
                    name: image.split('/').pop(),
                    type: 'image/jpeg',
                });

                const imageResponse = await axios.post(`http://${Config.server}:${Config.puerto}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                imagen_id = imageResponse.data.id;
            }

            // Actualizar el producto
            await axios.put(`http://${Config.server}:${Config.puerto}/productos/${producto.id}`, {
                ...productData,
                imagen_id: imagen_id
            });

            Alert.alert('Éxito', 'Producto actualizado correctamente.');
            navigation.goBack();
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo actualizar el producto.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.image} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Icon name="camera" size={50} color="#FFF" />
                                <Text style={styles.imageText}>Cambiar imagen</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {/* <Button
                        title="Cambiar imagen"
                        color='#FF0'
                        onPress={pickImage}
                    />

                    {image && <Image source={{ uri: image }} style={styles.image} />} */}

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del producto"
                        value={productData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Precio"
                        value={productData.precio}
                        onChangeText={(text) => handleChange('precio', text)}
                        keyboardType="numeric"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Cantidad"
                        value={productData.cantidad}
                        onChangeText={(text) => handleChange('cantidad', text)}
                        keyboardType="numeric"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={productData.descripcion}
                        onChangeText={(text) => handleChange('descripcion', text)}
                    // keyboardType="numeric"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-back" size={20} color="#FFF" />
                        <Text style={styles.buttonText}> Atrás</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buyNowButton}
                        onPress={updateProduct}
                        disabled={uploading}
                    >
                        <FontAwesome name="save" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>
                            {uploading ? 'Guardando...' : 'Guardar Cambios'}
                        </Text>
                        {uploading && <ActivityIndicator color="#FFF" style={{ marginLeft: 5 }} />}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
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
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
        borderRadius: 10,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    addToCartButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFA500',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    buyNowButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});