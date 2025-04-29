// import React, { useState } from 'react';
// import { View, Button, Image, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';
// import { FontAwesome } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';

// export default function UploadImageScreen() {
//     const [image, setImage] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const navigation = useNavigation();

//     const pickImage = async () => {
//         try {
//             // Paso 1: Verificar permisos
//             let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

//             if (status !== 'granted') {
//                 const { status: newStatus, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//                 if (newStatus !== 'granted') {
//                     if (!canAskAgain) {
//                         Alert.alert(
//                             'Permiso bloqueado',
//                             'Ve a Configuración > Aplicaciones > Tu App > Permisos para habilitar la galería.',
//                             [{ text: 'OK', onPress: () => Linking.openSettings() }]
//                         );
//                     }
//                     return;
//                 }
//             }

//             // Paso 2: Abrir galería
//             const result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: 'Images',
//                 allowsEditing: true,
//                 aspect: [4, 3],
//                 quality: 1,
//             });

//             if (!result.canceled) {
//                 const selectedImage = result.assets[0];
//                 setImage(selectedImage.uri);
//                 console.log('Imagen seleccionada:', selectedImage);
//             }
//         } catch (error) {
//             Alert.alert('Error', 'No se pudo abrir la galería.');
//         }
//     };

//     // Subir imagen al servidor
//     const uploadImage = async () => {
//         if (!image) {
//             Alert.alert('Error', 'Selecciona una imagen primero.');
//             return;
//         }

//         setUploading(true);

//         const formData = new FormData();
//         formData.append('imagen', {
//             uri: image,
//             name: image.split('/').pop(),
//             type: 'image/jpeg', // Ajusta según el tipo de imagen
//         });

//         try {
//             const response = await axios.post('http://192.168.1.101:5000/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             Alert.alert('Éxito', 'Imagen subida correctamente.');
//             console.log('Respuesta del servidor:', response.data.id);
//         } catch (error) {
//             console.error('Error al subir:', error);
//             Alert.alert('Error', 'No se pudo subir la imagen.');
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (

//         <LinearGradient
//             colors={['#4c669f', '#3b5998', '#192f6a']}
//             style={styles.container}
//         >
//             <View style={styles.container}>
//                 <Button title="Seleccionar imagen" color='#FF0' onPress={pickImage} />
//                 {image && <Image source={{ uri: image }} style={styles.image} />}
//             </View>

//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.addToCartButton} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-back" size={20} color="#FFF" />
//                     <Text style={styles.buttonText}> Atrás</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.buyNowButton} onPress={uploadImage} disabled={uploading || !image}>
//                     <FontAwesome name="upload" size={20} color="#FFF" />
//                     <Text style={styles.buttonText}> Subir imagen</Text>
//                 </TouchableOpacity>
//             </View>

//         </LinearGradient>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//     },
//     image: {
//         width: 200,
//         height: 200,
//         marginVertical: 20,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 1,
//     },
//     addToCartButton: {
//         flex: 1,
//         flexDirection: 'row',
//         backgroundColor: '#FFA500',
//         padding: 12,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 10,
//     },
//     button: {
//         width: 200,
//         height: 50,
//         backgroundColor: '#fff',
//         borderRadius: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 20,
//         elevation: 5,
//     },
//     buyNowButton: {
//         flex: 1,
//         flexDirection: 'row',
//         backgroundColor: '#4CAF50',
//         padding: 12,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, TouchableOpacity, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Config } from '../Config';
// import Config from 'react-native-config';

export default function AddProductos() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [productData, setProductData] = useState({
        nombre: '',
        precio: '',
        cantidad: '',
        descripcion: ''
    });
    const navigation = useNavigation();

    // const server = '192.168.1.101';
    // const puerto = "5000";

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

    const uploadProduct = async () => {
        if (!image) {
            Alert.alert('Error', 'Selecciona una imagen primero.');
            return;
        }

        if (!productData.nombre || !productData.precio || !productData.cantidad || !productData.descripcion) {
            Alert.alert('Error', 'Completa todos los campos del producto.');
            return;
        }

        setUploading(true);

        try {
            // Primero subir la imagen
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

            // Luego crear el producto con la imagen_id
            const productResponse = await axios.post(`http://${Config.server}:${Config.puerto}/productos`, {
                ...productData,
                imagen_id: imageResponse.data.id
            });

            Alert.alert('Éxito', 'Producto creado correctamente.');
            productData.cantidad = "";
            productData.nombre = "";
            productData.precio = "";
            productData.descripcion = ""
            // image = "";
            // navigation.goBack();
            // Después de subir exitosamente:
            // navigation.navigate('Inicio', { refresh: true });
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo crear el producto.');
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
                            <Image source={{ uri: image }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Icon name="camera" size={50} color="#FFF" />
                                <Text style={styles.imageText}>Subir foto</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {/* <Button
                        title="Seleccionar imagen"
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

                    {/* <TouchableOpacity 
                        style={styles.buyNowButton} 
                        onPress={uploadProduct} 
                        disabled={uploading || !image}
                    >
                        <FontAwesome name="upload" size={20} color="#FFF" />
                        <Text style={styles.buttonText}> 
                            {uploading ? 'Subiendo...' : 'Guardar Producto'}
                        </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.buyNowButton} onPress={uploadProduct} disabled={uploading}>
                        <FontAwesome name="upload" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>
                            {uploading ? 'Subiendo...' : 'Guardar Producto'}
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