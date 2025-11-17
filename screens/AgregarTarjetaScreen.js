import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/api';

const AgregarTarjetaScreen = ({ navigation, route }) => {
  const [numero, setNumero] = useState('');
  const [preferida, setPreferida] = useState('No preferida');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar formulario
  const validarFormulario = () => {
    let valid = true;
    let newErrors = {};

    if (!numero.trim() || numero.length < 16) {
      newErrors.numero = 'Número de tarjeta inválido';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Guardar tarjeta
  const guardarTarjeta = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await api.post('/tarjetas', {
        numero,
        preferida
      });
      
      Alert.alert('Éxito', 'Tarjeta guardada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo guardar la tarjeta');
    } finally {
      setLoading(false);
    }
  };

  // Formatear número de tarjeta
  const formatNumero = (input) => {
    // Eliminar todos los caracteres no numéricos
    let cleaned = input.replace(/\D/g, '');
    
    // Agregar espacios cada 4 dígitos
    let formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    
    // Limitar a 16 dígitos (4 grupos de 4)
    formatted = formatted.substring(0, 19);
    
    setNumero(formatted);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Agregar Tarjeta</Text>
      </LinearGradient>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Tarjeta</Text>
          <TextInput
            style={[styles.input, errors.numero && styles.inputError]}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
            value={numero}
            onChangeText={formatNumero}
          />
          {errors.numero && <Text style={styles.errorText}>{errors.numero}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tarjeta Preferida</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={styles.radioButton}
              onPress={() => setPreferida('Preferida')}
            >
              <Icon 
                name={preferida === 'Preferida' ? 'radio-button-on' : 'radio-button-off'} 
                size={24} 
                color="#4c669f" 
              />
              <Text style={styles.radioLabel}>Sí</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.radioButton}
              onPress={() => setPreferida('No preferida')}
            >
              <Icon 
                name={preferida === 'No preferida' ? 'radio-button-on' : 'radio-button-off'} 
                size={24} 
                color="#4c669f" 
              />
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={guardarTarjeta}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Guardando...' : 'Guardar Tarjeta'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    // top: 10
  },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 15
  },
  headerText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  formContainer: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  inputError: {
    borderColor: '#FF3B30'
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 5,
    fontSize: 14
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 10
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333'
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default AgregarTarjetaScreen;