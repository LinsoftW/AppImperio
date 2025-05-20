import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const RepartidorModal = ({ visible, onClose, onConfirm }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [tiempo, setTiempo] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Asignar mensajero</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre del repartidor"
            value={nombre}
            onChangeText={setNombre}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Vehículo (ej: Moto - ABC123)"
            value={vehiculo}
            onChangeText={setVehiculo}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Tiempo estimado (ej: 30-45 min)"
            value={tiempo}
            onChangeText={setTiempo}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={() => {
                if (nombre && telefono && vehiculo && tiempo) {
                  onConfirm({ nombre, telefono, vehiculo, tiempo });
                  onClose();
                } else {
                  Alert.alert('Error', 'Todos los campos son obligatorios');
                }
              }}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RepartidorModal;