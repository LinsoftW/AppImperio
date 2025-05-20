import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/api';
import { RefreshControl } from 'react-native-gesture-handler';

const ListaTarjetasScreen = ({ navigation }) => {
    const [tarjetas, setTarjetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Cargar tarjetas
    const cargarTarjetas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tarjetas');
            //   console.log(response.data.data)
            setTarjetas(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudieron cargar las tarjetas');
        } finally {
            setLoading(false);
        }
        setRefreshing(false)
    };

    useEffect(() => {
        cargarTarjetas();
    }, []);

    // Eliminar tarjeta
    const eliminarTarjeta = async (id) => {
        try {
            await api.delete(`/tarjetas/${id}`);
            cargarTarjetas();
            Alert.alert('Éxito', 'Tarjeta eliminada correctamente');
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo eliminar la tarjeta');
        }
    };

    // Marcar como preferida
    const marcarPreferida = async (id) => {
        try {
            await api.patch(`/tarjetas/${id}/preferida`);
            cargarTarjetas();
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo actualizar la tarjeta');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true)
        cargarTarjetas()
    };

    // Renderizar cada tarjeta
    const renderItem = ({ item }) => (
        // <View style={styles.containerI}>
        //     {/* <TouchableOpacity
        //         onPress={() => marcarPreferida(item.id)}
        //         style={styles.preferidaButton}
        //     >
        //         <Text style={styles.preferidaText}>
        //             {item.preferida === 'Preferida' ? 'Preferida' : 'Marcar como preferida'}
        //         </Text>
        //     </TouchableOpacity> */}
        //     <TouchableOpacity
        //         onPress={() => eliminarTarjeta(item.id)}
        //         style={styles.eliminarButton}
        //     >
        //         <Icon name="trash-outline" style={styles.textOverlay1} size={20} color="#FF3B30" />
        //     </TouchableOpacity>

        //     {item.preferida === "Preferida" ? (
        //         <>
        //             <Image
        //                 source={require('../assets/tarjeta1.png')}
        //                 style={styles.cardImage}
        //                 resizeMode="contain"
        //             />
        //             <Text style={styles.textOverlay}>{item.numero}</Text>
        //         </>
        //     ) :
        //         <>
        //             <Image
        //                 source={require('../assets/tarjeta2.png')}
        //                 style={styles.cardImage}
        //                 resizeMode="contain"
        //             />
        //             {/* <Icon name="trash-outline" style={styles.textOverlay} size={20} color="#FF3B30" /> */}
        //             <Text style={styles.textOverlay}>{item.numero}</Text>
        //         </>
        //     }
        //      <TouchableOpacity
        //         onPress={() => marcarPreferida(item.id)}
        //         style={styles.preferidaButton}
        //     >
        //         <Text style={styles.preferidaText}>
        //             {item.preferida === 'Preferida' ? 'Preferida' : 'Marcar como preferida'}
        //         </Text>
        //     </TouchableOpacity>

        // </View>
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Text style={styles.numeroText}>**** **** **** {item.numero.slice(-4)}</Text>
                {item.preferida === 'Preferida' && (
                    <Icon name="star" size={20} color="#FFD700" />
                )}
            </View>

            <View style={styles.itemFooter}>
                <TouchableOpacity
                    onPress={() => marcarPreferida(item.id)}
                    style={styles.preferidaButton}
                >
                    <Text style={styles.preferidaText}>
                        {item.preferida === 'Preferida' ? 'Preferida' : 'Marcar como preferida'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => eliminarTarjeta(item.id)}
                    style={styles.eliminarButton}
                >
                    <Icon name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
            {/* <View style={styles.containerI}>
                <Image
                    source={require('../assets/tarjeta1.png')}
                    style={styles.cardImage}
                    resizeMode="contain"
                />
                <Text style={styles.textOverlay}>{item.numero}</Text> 
            </View>*/}
            {/* <TouchableOpacity
                onPress={() => marcarPreferida(item.id)}
                style={styles.preferidaButton}
            >
                <Text style={styles.preferidaText}>
                    {item.preferida === 'Preferida' ? 'Preferida' : 'Marcar como preferida'}
                </Text>
            </TouchableOpacity> */}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4c669f', '#3b5998']} style={styles.header}>
                <Text style={styles.headerText}>Mis Tarjetas</Text>
            </LinearGradient>

            <FlatList
                data={tarjetas}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={tarjetas.length === 0 ? styles.emptyList : null}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#000']} // Color del spinner (opcional, solo Android)
                        tintColor="#000" // Color del spinner (iOS)
                    />
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Icon name="card-outline" size={50} color="#CCC" />
                        <Text style={styles.emptyText}>No hay tarjetas registradas</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AgregarTarjeta')}
            >
                <Icon name="add" size={30} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    textOverlay: {
        position: 'absolute',
        // bottom: 20,
        left: 0,
        right: 0,
        top: 100,
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
    textOverlay1: {
        // position: 'absolute',
        // bottom: 20,
        // left: 0,
        // right: 0,
        top: 10,
        // marginTop: 10,
        // textAlign: 'center',
        color: 'red',
        fontSize: 20,
        // fontWeight: 'bold',
        // textShadowColor: 'rgba(0, 0, 0, 0.75)',
        // textShadowOffset: { width: 1, height: 1 },
        // textShadowRadius: 5,
        // padding: 10,
        // backgroundColor: 'rgba(0,0,0,0.3)',
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
    containerI: {
        position: 'relative',
        width: 367,
        height: 200,
        top: 1,
        // backgroundColor: '#FFF',
        borderRadius: 10,
        margin: 3,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    header: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 15,
        alignItems: 'center'
    },
    headerText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold'
    },
    itemContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        margin: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    numeroText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    preferidaButton: {
        padding: 1,
        // top: 10,
        marginTop: -30
    },
    preferidaText: {
        color: '#4c669f',
        fontWeight: '500'
    },
    eliminarButton: {
        padding: 5,
        // left: 300,
        top: 5
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#4c669f',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 16
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center'
    }
});

export default ListaTarjetasScreen;