import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/api';

export default function EditContacto() {
    const route = useRoute();
    const navigation = useNavigation();
    const { contacto } = route.params; // Obtenemos el contacto a editar
    
    // Estados del formulario
    const [telefono, setTelefono] = useState(contacto.attributes.numero || '');
    const [direccion, setDireccion] = useState(contacto.attributes.direccion || '');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState(null);
    const [nick, setNick] = useState(contacto.attributes.nick || '');

    // Verificar cambios en el teléfono
    useEffect(() => {
        // console.log(contacto)
        if (telefono !== contacto.numero && telefono.length >= 8) {
            verificarContactoExistente();
        }
    }, [telefono]);

    const verificarContactoExistente = async () => {
        setValidating(true);
        try {
            const response = await api.get(`/contactos/existe?numero=${encodeURIComponent(telefono)}`);
            
            if (response.data.existe && response.data.data.id !== contacto.id) {
                setError('Este número ya está registrado para otro contacto');
            } else {
                setError(null);
            }
        } catch (error) {
            console.error('Error al verificar contacto:', error);
            setError('Error al verificar el contacto');
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async () => {
        if (!telefono) {
            Alert.alert('Error', 'El número de teléfono es obligatorio');
            return;
        }

        if (error) {
            Alert.alert('Error', error);
            return;
        }

        setLoading(true);

        try {
            const response = await api.put(`/contactos/${contacto.id}`, {
                nick: nick,
                numero: telefono,
                direccion: direccion || null
            });

            Alert.alert('Éxito', 'Contacto actualizado correctamente');
            navigation.goBack();
            
        } catch (error) {
            console.error('Error al actualizar contacto:', error);
            
            let errorMessage = 'No se pudo actualizar el contacto';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={nick}
                        onChangeText={setNick}
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Número de WhatsApp"
                        value={telefono}
                        onChangeText={setTelefono}
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                    />

                    {validating && (
                        <View style={styles.validatingContainer}>
                            <ActivityIndicator size="small" color="#FFF" />
                            <Text style={styles.validatingText}>Verificando...</Text>
                        </View>
                    )}

                    {error && (
                        <View style={styles.errorContainer}>
                            <Icon name="warning" size={20} color="#FF5252" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Dirección (opcional)"
                        value={direccion}
                        onChangeText={setDireccion}
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Icon name="close-circle" size={20} color="#FFF" />
                        <Text style={styles.buttonText}> Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.saveButton, 
                            (loading || error) && styles.disabledButton
                        ]} 
                        onPress={handleSubmit}
                        disabled={loading || error}
                    >
                        <Icon name="save" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Text>
                        {loading && <ActivityIndicator color="#FFF" style={{ marginLeft: 5 }} />}
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        fontSize: 16,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FF5252',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    saveButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#AAAAAA',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    validatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    validatingText: {
        color: '#FFF',
        marginLeft: 5,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 82, 82, 0.2)',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
    },
    errorText: {
        color: '#FF5252',
        marginLeft: 5,
    },
});