import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import { MaterialIcons } from "@expo/vector-icons";

const AdminMarcasScreen = ({ navigation }) => {
  const [marcas, setMarcas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Obtener marcas al cargar la pantalla
  useEffect(() => {
    obtenerMarcas();
  }, []);

  const obtenerMarcas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/marcas");
      setMarcas(response.data.datos);
    } catch (error) {
      console.error("Error al obtener marcas:", error);
      Alert.alert("Error", "No se pudieron cargar las marcas");
    } finally {
      setLoading(false);
    }
  };

  // Validar formulario
  const validarFormulario = () => {
    let valid = true;
    let newErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Guardar marca
  const guardarMarca = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/marcas/${editingId}`, { nombre });
        Alert.alert("Éxito", "Marca actualizada correctamente");
      } else {
        await api.post("/marcas", { nombre });
        Alert.alert("Éxito", "Marca creada correctamente");
      }

      setNombre("");
      setEditingId(null);
      setModalVisible(false);
      obtenerMarcas();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo guardar la marca");
    } finally {
      setLoading(false);
    }
  };

  // Editar marca
  const editarMarca = (item) => {
    setNombre(item.attributes.descripcion);
    setEditingId(item.id);
    setModalVisible(true);
  };

  // Eliminar marca
  const eliminarMarca = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro que deseas eliminar esta marca?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/marcas/${id}`);
              Alert.alert("Éxito", "Marca eliminada correctamente");
              obtenerMarcas();
            } catch (error) {
              console.error("Error al eliminar:", error);
              Alert.alert("Error", "No se pudo eliminar la marca");
            }
          },
        },
      ]
    );
  };

  // Renderizar item de marca
  const renderItem = ({ item }) => (
    <View style={styles.marcaItem}>
      <View style={styles.marcaInfo}>
        <MaterialIcons
          name="branding-watermark"
          size={24}
          color="#4c669f"
        />
        <Text style={styles.marcaNombre}>
          {item.attributes.descripcion}
        </Text>
      </View>
      <View style={styles.marcaActions}>
        <TouchableOpacity onPress={() => editarMarca(item)}>
          <Icon
            name="create"
            size={24}
            color="#4c669f"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarMarca(item.id)}>
          <Icon
            name="trash"
            size={24}
            color="#FF3B30"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Administrar Marcas</Text>
      </LinearGradient>
      <View style={styles.content}>
        <FlatList
          data={marcas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay marcas registradas</Text>
          }
          refreshing={loading}
          onRefresh={obtenerMarcas}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setNombre("");
            setEditingId(null);
            setModalVisible(true);
          }}
        >
          <Icon name="add" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Agregar marca</Text>
        </TouchableOpacity>
      </View>


      {/* Modal para agregar/editar marca */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Editar Marca" : "Agregar Marca"}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de la Marca</Text>
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                placeholder="Ej. Nike"
                value={nombre}
                onChangeText={setNombre}
              />
              {errors.nombre && (
                <Text style={styles.errorText}>{errors.nombre}</Text>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={guardarMarca}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading
                    ? editingId
                      ? "Actualizando..."
                      : "Guardando..."
                    : editingId
                    ? "Actualizar"
                    : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  marcaItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  marcaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  marcaNombre: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  marcaActions: {
    flexDirection: "row",
  },
  actionIcon: {
    marginLeft: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    marginTop: 5,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#DDD",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#FF6B00",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdminMarcasScreen;