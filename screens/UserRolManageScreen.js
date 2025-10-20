import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../api/api";
import { useUser } from "../screens/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

const UserRoleManagementScreen = (route) => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("User123**");
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Cargar usuarios y roles al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersResponse = await api.get("/usuarios");
        const rolesResponse = await api.get("/roles");

        // Verifica que la respuesta tenga datos y sea un array
        setUsers(usersResponse.data?.datos || usersResponse.data.datos || []);
        // console.log(rolesResponse.data.datos[0])
        // console.log(usersResponse.data.datos[0])
        // Asegúrate que roles sea siempre un array
        const rolesData =
          rolesResponse.data?.datos || rolesResponse.data.datos || [];
        if (!Array.isArray(rolesData)) {
          console.error("Los roles no son un array:", rolesData);
          setRoles([]);
        } else {
          setRoles(rolesData);
        }

        setFilteredUsers(
          usersResponse.data?.datos || usersResponse.data.datos || []
        );
      } catch (error) {
        console.error("Error cargando datos:", error);
        setUsers([]);
        setRoles([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isFocused, route.params?.refresh]);

  // Función para cambiar contraseña
  const changeUserPassword = async () => {
    if (!selectedUser || !newPassword) return;

    if (selectedUser.attributes.nick === "admin") {
      Alert.alert("Error", "No se puede modificar este usuario.");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/usuarios/${selectedUser.id}/reset-password`, {
        newPassword: newPassword,
      });

      Alert.alert("Éxito", "Contraseña cambiada correctamente");
      setPasswordModalVisible(false);
      setNewPassword("");
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      Alert.alert(
        "Error",
        "La contraseña no cumple los requisitos de seguridad"
      );
    } finally {
      setLoading(false);
    }
  };

  // Actualizar listado
  const actualizar = async () => {
    setUsers([]);
    setRoles([]);
    try {
      setLoading(true);

      const usersResponse = await api.get("/usuarios");
      const rolesResponse = await api.get("/roles");

      // Verifica que la respuesta tenga datos y sea un array
      setUsers(usersResponse.data?.datos || usersResponse.data.datos || []);
      // console.log(rolesResponse.data.datos[0])
      // console.log(usersResponse.data.datos[0])
      // Asegúrate que roles sea siempre un array
      const rolesData =
        rolesResponse.data?.datos || rolesResponse.data.datos || [];
      if (!Array.isArray(rolesData)) {
        console.error("Los roles no son un array:", rolesData);
        setRoles([]);
      } else {
        setRoles(rolesData);
      }

      setFilteredUsers(
        usersResponse.data?.datos || usersResponse.data.datos || []
      );
    } catch (error) {
      console.error("Error cargando datos:", error);
      setUsers([]);
      setRoles([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      // const filtered = users.filter(
      //   (user) =>
      //     user.attributes.nombre
      //       .toLowerCase()
      //       .includes(searchQuery.toLowerCase()) ||
      //     user.attributes.nick.toLowerCase().includes(searchQuery.toLowerCase())
      // );
      const filtered = users.filter((user) => {
        const nombre = user.attributes.nombre || ""; // Si es null/undefined, usa string vacío
        const nick = user.attributes.nick || "";
        return (
          nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nick.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Función para abrir modal de cambio de rol
  const openRoleModal = (user) => {
    // console.log(user.attributes.rol)
    setSelectedUser(user);
    setSelectedRole(user.attributes.rol); // Asume que cada usuario tiene rol_id
    setModalVisible(true);
  };

  // Función para actualizar el rol
  const updateUserRole = async () => {
    if (!selectedUser || !selectedRole) return;

    if (selectedUser.attributes.nick === "admin") {
      Alert.alert("Error", "No se puede modificar este usuario.");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/usuarios/${selectedUser.id}/rol`, {
        rol_id: selectedRole,
      });

      // Actualizar lista de usuarios localmente
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, rol: selectedRole } : u
        )
      );

      setModalVisible(false);
      Alert.alert(
        "Éxito",
        "Se ha cambiado el rol del usuario satisfactoriamente."
      );
      actualizar();
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("Error al actualizar el rol");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (userId) => {
    try {
      setLoading(true);
      await api.post(`/usuarios/${userId}/reset-password`);
      Alert.alert(
        "Éxito",
        "Se ha enviado un correo para restablecer la contraseña."
      );
      actualizar();
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      Alert.alert("Error", "No se pudo restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              if (userId === 2) {
                Alert.alert("Error", "No se puede eliminar este usuario.");
                return;
              }
              setLoading(true);
              await api.delete(`/usuarios/${userId}`);
              Alert.alert("Éxito", "Usuario eliminado correctamente.");
              actualizar();
            } catch (error) {
              console.error("Error al eliminar usuario:", error);
              Alert.alert("Error", "No se pudo eliminar el usuario.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Renderizar cada item de usuario
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      {/* <View style={styles.userInfo}> */}
      {item.attributes.rol === 4 || item.attributes.nick === "admin" ? (
        <>
          {/* <View style={styles.userInfo}> */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {item.attributes.nombre} {item.attributes.apellido1}{" "}
              {item.attributes.apellido2}
            </Text>
            <Text style={styles.userEmail}>
              Usuario: {item.attributes.nick}
            </Text>
            <Text style={styles.userRole}>
              Rol actual:{" "}
              {roles.find((r) => r.id == item.attributes.rol)?.attributes
                .descripcion || "Desconocido"}
            </Text>
          </View>
          {/* <TouchableOpacity
              style={[styles.iconButton, styles.roleButton]}
              onPress={() => openRoleModal(item)}
            >
              <Icon name="swap-vert" size={20} color="white" />
            </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={() => deleteUser(item.id)}
          >
            {/* <Icon name="delete" size={20} color="white" /> */}
            <MaterialIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
          {/* </View> */}
        </>
      ) : (
        <>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {item.attributes.nombre} {item.attributes.apellido1}{" "}
              {item.attributes.apellido2}
            </Text>
            <Text style={styles.userEmail}>
              Usuario: {item.attributes.nick}
            </Text>
            <Text style={styles.userRole}>
              Rol actual:{" "}
              {roles.find((r) => r.id == item.attributes.rol)?.attributes
                .descripcion || "Desconocido"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.iconButton, styles.roleButton]}
            onPress={() => openRoleModal(item)}
          >
            {/* <Icon name="swap-vert" size={20} color="white" /> */}
            <MaterialIcons name="swap-vert" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.passwordButton]}
            onPress={() => {
              setSelectedUser(item);
              setPasswordModalVisible(true);
            }}
          >
            <MaterialIcons name="vpn-key" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={() => deleteUser(item.id)}
          >
            {/* <Icon name="delete" size={20} color="white" /> */}
            <MaterialIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listado de usuarios</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ flex: 1 }}>
        {/* Barra de búsqueda */}
        <Text style={styles.title}></Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Listado de usuarios */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          refreshing={actualizar}
          contentContainerStyle={styles.listContainer}
        />

        {/* Modal para cambiar rol */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cambiar Rol de Usuario</Text>

              <Text style={styles.userInfoModal}>
                Usuario: {selectedUser?.attributes?.nombre} (
                {selectedUser?.attributes?.nick})
              </Text>

              <Text style={styles.pickerLabel}>Seleccionar nuevo rol:</Text>
              <Picker
                selectedValue={selectedRole}
                onValueChange={(itemValue) => setSelectedRole(itemValue)}
                style={styles.picker}
              >
                {roles.map((role) => (
                  <Picker.Item
                    key={role.id}
                    label={role.attributes.descripcion}
                    value={role.id}
                    color="#000"
                  />
                ))}
              </Picker>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={updateUserRole}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={passwordModalVisible}
          onRequestClose={() => setPasswordModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cambiar Contraseña</Text>

              <Text style={styles.userInfoModal}>
                Usuario: {selectedUser?.attributes?.nick}
              </Text>

              <TextInput
                style={styles.passwordInput}
                placeholder="User123**"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setPasswordModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={changeUserPassword}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  passwordButton: {
    backgroundColor: "#9b59b6",
  },
  passwordInput: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  roleButton: {
    backgroundColor: "#3498db",
  },
  resetButton: {
    backgroundColor: "#f39c12",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
    minWidth: 120,
    alignItems: "center",
  },
  changeRoleButton: {
    backgroundColor: "#3498db",
  },
  resetPasswordButton: {
    backgroundColor: "#f39c12",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    // paddingTop: 30
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  userItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
  },
  changeRoleButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  userInfoModal: {
    marginBottom: 16,
    textAlign: "center",
  },
  pickerLabel: {
    marginBottom: 8,
    fontWeight: "bold",
    backgroundColor: Platform.OS === "ios" ? "#f8f8f8" : "transparent",
  },
  picker: {
    // backgroundColor: '#f9f9f9',
    marginBottom: 20,
    backgroundColor: Platform.OS === "ios" ? "#f8f8f8" : "transparent",
  },
  pickerItem: {
    // backgroundColor: '#f9f9f9',
    marginBottom: 20,
    backgroundColor: Platform.OS === "ios" ? "#000" : "transparent",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
  },
});

export default UserRoleManagementScreen;
