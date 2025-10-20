// import { useIsFocused, useNavigation } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import api from '../api/api';

// const RepartidorModal = ({ visible, onClose, onConfirm }) => {
//   const [nombre, setNombre] = useState('');
//   const [telefono, setTelefono] = useState('');
//   const [vehiculo, setVehiculo] = useState('');
//   const [tiempo, setTiempo] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [mensajeros, setMensajeros] = useState([]);
//   const [costo_mensajeria, setCostoMensajeria] = useState('');
//   const isFocused = useIsFocused();
//   const navigation = useNavigation();

//   useEffect(() => {
//     cargarMensajeros();
//     console.log(mensajeros)
//   }, [isFocused, navigation]);

//   const cargarMensajeros = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(`/mensajeros`);
//       //   console.log(response.data.data)
//       setMensajeros(response.data.data || []);
//     } catch (error) {
//       console.error("Error al cargar mensajeros:", error);
//       Alert.alert("Error", "No se pudo cargar la lista de mensajeros");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.title}>Asignar mensajero</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Nombre del repartidor"
//             value={nombre}
//             onChangeText={setNombre}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Teléfono"
//             value={telefono}
//             onChangeText={setTelefono}
//             keyboardType="phone-pad"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Costo de mensajería"
//             value={costo_mensajeria}
//             onChangeText={setCostoMensajeria}
//             keyboardType="phone-pad"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Vehículo (ej: Moto - ABC123)"
//             value={vehiculo}
//             onChangeText={setVehiculo}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Tiempo estimado (ej: 30-45 min)"
//             value={tiempo}
//             onChangeText={setTiempo}
//           />

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//               <Text style={styles.buttonText}>Cancelar</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.confirmButton}
//               onPress={() => {
//                 if (nombre && telefono && vehiculo && tiempo && costo_mensajeria) {
//                   onConfirm({ nombre, telefono, vehiculo, tiempo, costo_mensajeria });
//                   onClose();
//                 } else {
//                   Alert.alert('Error', 'Todos los campos son obligatorios');
//                 }
//               }}
//             >
//               <Text style={styles.buttonText}>Confirmar</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 15,
//   },
//   cancelButton: {
//     backgroundColor: '#FF3B30',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 5,
//   },
//   confirmButton: {
//     backgroundColor: '#4CAF50',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginLeft: 5,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

// export default RepartidorModal;

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../api/api";

const RepartidorModal = ({ visible, onClose, onConfirm }) => {
  const [selectedMensajero, setSelectedMensajero] = useState(null);
  const [tiempo, setTiempo] = useState("");
  const [costo_mensajeria, setCostoMensajeria] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensajeros, setMensajeros] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    setMensajeros({})
    cargarMensajeros();
  }, [isFocused]);

  const cargarMensajeros = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/mensajeros`);
      // console.log(response.data.data)
      const mensajerosDisponibles =
      response.data.data?.filter((m) => m.attributes.disponible === 1) || [];
      setMensajeros(mensajerosDisponibles);

      // Seleccionar el primer mensajero disponible por defecto si existe
      if (mensajerosDisponibles.length > 0) {
        setSelectedMensajero(mensajerosDisponibles[0]);
      } else {
        setSelectedMensajero(null);
        // Alert.alert("Info", "No hay mensajeros disponibles en este momento");
      }
    } catch (error) {
      console.error("Error al cargar mensajeros:", error);
      // Alert.alert("Error", "No se pudo cargar la lista de mensajeros");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedMensajero || !tiempo || !costo_mensajeria) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const repartidorData = {
      nombre: selectedMensajero.attributes.nombre,
      telefono: selectedMensajero.attributes.telefono,
      vehiculo: selectedMensajero.attributes.vehiculo,
      tiempo,
      costo_mensajeria,
    };

    onConfirm(repartidorData);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Asignar mensajero</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#1a3a8f" />
          ) : (
            <ScrollView>
              <Text style={styles.label}>Seleccionar mensajero:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMensajero}
                  onValueChange={(itemValue) => setSelectedMensajero(itemValue)}
                  style={styles.picker}
                >
                  {mensajeros.map((mensajero) => (
                    <Picker.Item
                      key={mensajero.id}
                      label={`${mensajero.attributes.nombre}`}
                      value={mensajero}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Costo de mensajería:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 5.00"
                value={costo_mensajeria}
                onChangeText={setCostoMensajeria}
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Tiempo estimado:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 30-45 min"
                value={tiempo}
                onChangeText={setTiempo}
              />
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={loading}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#1a3a8f",
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RepartidorModal;
