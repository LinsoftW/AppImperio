import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import api from '../api/api';

export default function ContactListScreen() {
    const [contactos, setContactos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchContactos = async () => {
        try {
            const response = await api.get('/contactos');
            // console.log(response.data.datos)
            setContactos(response.data.datos || []);
        } catch (error) {
            console.error('Error al obtener contactos:', error);
            Alert.alert('Error', 'No se pudieron cargar los contactos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchContactos();
        }
    }, [isFocused]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchContactos();
    };

    const handleEdit = (contacto) => {
        navigation.navigate('EditarContacto', { contacto });
    };

    const handleDelete = async (id) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este contacto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/contactos/${id}`);
                            fetchContactos();
                            Alert.alert('Éxito', 'Contacto eliminado correctamente');
                        } catch (error) {
                            console.error('Error al eliminar:', error);
                            Alert.alert('Error', 'No se pudo eliminar el contacto');
                        }
                    }
                }
            ]
        );
    };

    const openWhatsApp = (numero) => {
        const phoneNumber = numero.replace(/[^0-9]/g, '');
        Linking.openURL(`https://wa.me/+53${phoneNumber}`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
                <FontAwesome name="whatsapp" size={24} color="#25D366" style={styles.whatsappIcon} />
                <View>
                    {/* <Text style={styles.contactNumber}>{item.attributes.nick}</Text> */}
                    <Text style={styles.contactNumber}>{item.attributes.numero}</Text>
                    {item.direccion && <Text style={styles.contactAddress}>{item.attributes.direccion}</Text>}
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => openWhatsApp(item.attributes.numero)}
                >
                    <MaterialIcons name="message" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]} 
                    onPress={() => handleEdit(item)}
                >
                    <MaterialIcons name="edit" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]} 
                    onPress={() => handleDelete(item.id)}
                >
                    <MaterialIcons name="delete" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Cargando contactos...</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Contactos de WhatsApp</Text>
            <View style={{ width: 24 }} />
          </View>
            <View style={styles.header}>
                <Text style={styles.title}></Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AgregarContacto')}
                >
                    <FontAwesome name="plus" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={contactos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="whatsapp" size={50} color="rgba(255,255,255,0.3)" />
                        <Text style={styles.emptyText}>No hay contactos registrados</Text>
                    </View>
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // top: 1,
    padding: 16,
    paddingTop: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
    container: {
        flex: 1,
        paddingTop: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#25D366',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    contactItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    whatsappIcon: {
        marginRight: 15,
    },
    contactNumber: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactAddress: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginTop: 3,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    editButton: {
        backgroundColor: '#FFA500',
    },
    deleteButton: {
        backgroundColor: '#FF5252',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
    },
});