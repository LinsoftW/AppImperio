// import React from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const DetallesScreen = ({ route }) => {
//     const { productoId, precio, imag } = route.params; // Recuperar los parámetros

//     return (

//         <LinearGradient
//             colors={['#4c669f', '#3b5998', '#192f6a']}
//             style={styles.container}
//         >

//             <View style={styles.container}>
//                 <Image source={imag} style={styles.imagen} />
//                 <Text style={styles.title}>Detalles del Producto</Text>
//                 <Text style={styles.text}>Nombre del producto: {productoId}</Text>
//                 <Text style={styles.text}>Precio del producto: {precio}</Text>
//             </View>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1C' },
//     title: { fontSize: 24, color: '#F5F5F5', marginBottom: 20, top: 20 },
//     text: { fontSize: 18, color: '#FFA500' },
//     imagen: {
//         width: 150,
//         height: 150,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#555', // Bordes discretos para combinar con el tema oscuro
//     },
// });

// export default DetallesScreen;

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Config } from '../Config';
// import Config from 'react-native-config';

// const BackButton = () => {
//     const navigation = useNavigation();

//     return (
//         <View >
//             <TouchableOpacity
//                 style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     padding: 10,
//                     color: '#FFF',
//                 }}
//                 onPress={() => navigation.goBack()}
//             >
//                 <Icon name="arrow-back" size={24} color="#000" />
//                 <Text style={{ color: '#FFF', marginLeft: 5, fontSize: 16 }}>
//                     Atrás
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

const DetallesScreen = ({ route, navigation }) => {
    const { productoId, precio, stock, imag, descripcion } = route.params;

    // const server = '192.168.1.101';
    // const puerto = "5000";

    const BackButton = () => {
        const navigation = useNavigation();

        return (
            <View >
                {/* <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        color: '#FFF',
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#000" />
                    <Text style={{ color: '#FFF', marginLeft: 5, fontSize: 16 }}>
                        Atrás
                    </Text>
                </TouchableOpacity> */}
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradientContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalles del Producto</Text>
                </View> */}

                <View style={styles.card}>
                    <Image
                        source={{ uri: `http://${Config.server}:${Config.puerto}/${imag}` }}
                        style={styles.imagen}
                        resizeMode="contain"
                    />

                    <View style={styles.detailsContainer}>
                        <Text style={styles.productName}>{productoId}</Text>
                        <Text style={styles.price}>${precio}</Text>
                        <Text style={styles.productName}>Cantidad en stock: {stock}</Text>

                        <View style={styles.separator} />

                        <Text style={styles.sectionTitle}>Descripción</Text>
                        <Text style={styles.description}>
                            {descripcion}
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.addToCartButton}>
                                <Icon name="cart-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Añadir al carrito</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buyNowButton}>
                                <Icon name="flash-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Comprar ahora</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View>
                {/* <Text style={styles.addToCartButton}> Atrás</Text> */}
                <BackButton />
                {/* <TouchableOpacity style={styles.addToCartButton} onPress={handleExit}>
                    <Icon name="exit" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Atrás</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.buyNowButton} onPress={openWhatsApp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}> Contáctanos</Text>
                </TouchableOpacity> */}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    registerText: {
        color: '#fff',
        marginTop: 20,
    },
    gradientContainer: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton1: {
        padding: 8,
        marginRight: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    imagen: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    detailsContainer: {
        paddingHorizontal: 10,
    },
    productName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 8,
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFD700',
        marginBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        marginBottom: 25,
    },
    buttonContainer: {
        flexDirection: 'row',
        // backgroundColor: '#FFA500',
        justifyContent: 'space-between',
        marginTop: 15,
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
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default DetallesScreen;