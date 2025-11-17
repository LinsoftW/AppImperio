import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import api from "../api/api";
import Constants from "expo-constants";
import { useIsFocused } from "@react-navigation/native";

export default function AdminMensajeros() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [disponible, setDisponible] = useState(false);
  const [mensajeros, setMensajeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMensajero, setCurrentMensajero] = useState(null);
  const navigation = useNavigation();
  //   const { server } = Constants.expoConfig.extra;
  const isFocused = useIsFocused();

  // Cargar lista de mensajeros al montar el componente
  useEffect(() => {
    cargarMensajeros();
  }, [isFocused, navigation]);

  const cargarMensajeros = async () => {
    setNombre("");
    setTelefono("");
    setVehiculo("");
    setDisponible(true)
    setEditingId(null);
    setLoading(true);
    try {
      const response = await api.get(`/mensajeros`);
        // console.log(response.data.data)
      setMensajeros(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar mensajeros:", error);
      Alert.alert("Error", "No se pudo cargar la lista de mensajeros");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!nombre || !telefono || !vehiculo) {
      Alert.alert("Error", "Nombre, teléfono y vehículo son obligatorios");
      return;
    }

    // Limpiar y formatear el número de teléfono
    const cleanNumber = telefono.replace(/[^0-9]/g, "");

    setLoading(true);
    // console.log(editingId);
    try {
      if (editingId) {
        // Actualizar mensajero existente
        await api.put(`/mensajeros/${editingId}`, {
          nombre,
          telefono: cleanNumber,
          vehiculo,
          disponible
        });
        Alert.alert("Éxito", "Mensajero actualizado correctamente");
      } else {
        // Crear nuevo mensajero
        // console.log(telefono)
        await api.post(`/mensajeros`, {
          nombre,
          telefono: cleanNumber,
          vehiculo,
          disponible
        });
        Alert.alert("Éxito", "Mensajero agregado correctamente");
      }

      // Limpiar formulario y recargar lista
      setNombre("");
      setTelefono("");
      setVehiculo("");
      setDisponible(false)
      setEditingId(null);
      cargarMensajeros();
    } catch (error) {
      console.error("Error al guardar mensajero:", error);
      Alert.alert("Error", "No se pudo guardar el mensajero");
    } finally {
      setLoading(false);
    }
  };

  const editarMensajero = (mensajero) => {
    setNombre(mensajero.attributes.nombre);
    setTelefono(mensajero.attributes.telefono);
    setVehiculo(mensajero.attributes.vehiculo);
    if (mensajero.attributes.disponible === 1)
    {
      setDisponible(1)
      toggleDisponibilidad(0)
    }else{
      setDisponible(0)
      toggleDisponibilidad(1)
    }
    // console.log(mensajero.attributes.disponible)
    setEditingId(mensajero.id);
  };

  const confirmarEliminar = (mensajero) => {
    setCurrentMensajero(mensajero);
    setModalVisible(true);
  };

  const eliminarMensajero = async () => {
    if (!currentMensajero) return;

    setLoading(true);
    try {
      await api.delete(`/mensajeros/${currentMensajero.id}`);
      Alert.alert("Éxito", "Mensajero eliminado correctamente");
      cargarMensajeros();
    } catch (error) {
      console.error("Error al eliminar mensajero:", error);
      Alert.alert("Error", "No se pudo eliminar el mensajero");
    } finally {
      setLoading(false);
      setModalVisible(false);
      setCurrentMensajero(null);
    }
  };

  const toggleDisponibilidad = async (disponible) => {
    setDisponible(!disponible);
  };

  const renderMensajero = ({ item }) => (
    <View style={styles.mensajeroItem}>
      <View style={styles.mensajeroInfo}>
        <Text style={styles.mensajeroNombre}>{item.attributes.nombre}</Text>
        <Text style={styles.mensajeroTelefono}>{item.attributes.telefono}</Text>
        <Text style={styles.mensajeroTelefono}>{item.attributes.vehiculo}</Text>
      </View>
      <View style={styles.mensajeroActions}>
        <TouchableOpacity
          onPress={() => editarMensajero(item)}
          style={styles.actionButton}
        >
          <MaterialIcons name="edit" size={20} color="#1a3a8f" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmarEliminar(item)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <MaterialIcons name="delete" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Administrar Mensajeros</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del mensajero*"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Número de teléfono*"
          value={telefono}
          onChangeText={setTelefono}
          maxLength={8}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Vehículo*"
          value={vehiculo}
          onChangeText={setVehiculo}
          placeholderTextColor="#999"
        />
        {/* <Switch
            value={disponible}
            onValueChange={() => toggleDisponibilidad(disponible)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={disponible ? "#1a3a8f" : "#f4f3f4"}
          />
          <Text style={styles.sectionTitle}>Disponible</Text> */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Disponible</Text>
          <Switch
            value={disponible}
            onValueChange={() => toggleDisponibilidad(disponible)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={disponible ? "#1a3a8f" : "#f4f3f4"}
          />
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : editingId ? (
              "Actualizar Mensajero"
            ) : (
              "Agregar Mensajero"
            )}
          </Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Lista de Mensajeros</Text>
      </View>

      <View style={styles.listContainer}>
        {loading && mensajeros.length === 0 ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <FlatList
            data={mensajeros}
            renderItem={renderMensajero}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay mensajeros registrados
              </Text>
            }
            refreshing={loading}
            onRefresh={cargarMensajeros}
          />
        )}
      </View>

      {/* Modal de confirmación para eliminar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro que deseas eliminar a{" "}
              {currentMensajero?.attributes.nombre}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={eliminarMensajero}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Eliminando..." : "Eliminar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     paddingTop: Constants.statusBarHeight + 16,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#FFF",
//     textShadowColor: "rgba(0, 0, 0, 0.3)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//   },
//   formContainer: {
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "white",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginVertical: 10,
//     fontSize: 16,
//     color: "#000",
//   },
//   saveButton: {
//     backgroundColor: "#FF6000",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   sectionTitle: {
//     color: "#FFF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//     // marginBottom: 10,
//   },
//   mensajeroItem: {
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   mensajeroInfo: {
//     flex: 1,
//   },
//   mensajeroNombre: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   mensajeroTelefono: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   mensajeroActions: {
//     flexDirection: "row",
//   },
//   actionButton: {
//     padding: 8,
//     marginLeft: 10,
//     backgroundColor: "rgba(255, 255, 255, 0.7)",
//     borderRadius: 20,
//   },
//   deleteButton: {
//     backgroundColor: "rgba(255, 0, 0, 0.1)",
//   },
//   listContainer: {
//     width: "100%",
//     marginTop: 10,
//   },
//   emptyText: {
//     color: "#FFF",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   // Estilos para el modal
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     padding: 20,
//     width: "80%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   modalButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 6,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   cancelButton: {
//     backgroundColor: "#CCC",
//   },
//   confirmButton: {
//     backgroundColor: "#FF6000",
//   },
// });

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  switchText: {
    color: "#333",
    fontSize: 16,
    marginRight: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Constants.statusBarHeight + 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#FF6000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mensajeroItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mensajeroInfo: {
    flex: 1,
  },
  mensajeroNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  mensajeroTelefono: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  mensajeroActions: {
    flexDirection: "row",
    alignItems: "center",
  },
//   switchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   switchText: {
//     marginRight: 5,
//     fontSize: 12,
//     color: "#333",
//   },
  actionButton: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  emptyText: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#CCC",
  },
  confirmButton: {
    backgroundColor: "#FF6000",
  },
});
