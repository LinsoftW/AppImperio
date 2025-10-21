import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  FlatList,
  // Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "./UserContext";
import api from "../api/api";
import { useCallback, useEffect, useState } from "react";
import Constants from "expo-constants";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { dirImg } = Constants.expoConfig.extra;

// Definir las constantes de caché
const CACHE_KEYS = {
  PRODUCTS: "Lproductos",
  FEATURED: "Ldestacados",
  CATEGORIES: "Lcategorias",
  FAVORITES: "Lfavoritos",
  TARJETAS: "Ltarjetas",
  CONTACTS: "Lcontacts",
  LAST_UPDATED: "lastUpdated",
  CART: "LcartData",
  USER: "LuserData",
};

const ProfileScreen = ({ navigation, route }) => {
  const {
    user,
    logout,
    changePassword,
    showToast,
    setToastMessage,
    toastMessage,
  } = useUser();
  const [usuario, setUsuario] = useState({ attributes: {} });
  const isFocused = useIsFocused();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("perfil"); // 'pedidos' o 'perfil'
  // const [toastMessage, setToastMessage] = useState("");

  const obtenerUser = async () => {
    try {
      const response = await api.get("usuarios");
      const userData = response.data.datos.find(
        (u) => u.attributes?.nick === user?.nick
      );
      if (userData) setUsuario(userData);
      // console.log("Usuario obtenido:", userData);
    } catch (e) {
      console.error("Error al obtener usuario:", e);
    }
  };

  const validatePasswordsMatch = () => {
     return newPassword === confirmPassword;
  };

  // Función para obtener los pedidos del usuario
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await api.get(`/pedidos?usuario_id=${user.id}`);
      setOrders(response.data.data || []);
      // console.log("Datos completos de pedidos:", response.data);
      // console.log("Datos de pedidos (data array):", response.data.data.length);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const [appData, setAppData] = useState({
    productos: [],
    destacados: [],
    categorias: [],
    favoritos: [],
    tarjetas: [],
    contacts: [],
    filteredProductos: [],
    cartItems: [],
    userDetails: null,
  });

  // Función para cargar desde caché
  const loadFromCache = useCallback(async () => {
    try {
      const [favoritos] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEYS.FAVORITES),
      ]);

      return {
        favoritos: favoritos ? JSON.parse(favoritos) : [],
      };
    } catch (error) {
      console.error("Cache load error:", error);
      return null;
    }
  }, []);

  const ini = async () => {
    try {
      const cachedData = await loadFromCache();
      if (cachedData) {
        // Verifica si cachedData.favoritos existe, si no usa un array vacío
        const favoritos = cachedData.favoritos || [];

        // console.log("Tamaño de favoritos desde caché:", favoritos.length); // Ver aquí el tamaño REAL

        setAppData((prev) => ({
          ...prev,
          favoritos: favoritos, // Asigna solo el array de favoritos
        }));
      }
    } catch (error) {
      console.error("Error al cargar desde caché:", error);
    }
  };

  useEffect(() => {
    if (isFocused || route.params?.refresh) {
      obtenerUser();
      ini();
      if (user?.id) {
        fetchOrders();
      }
    }
  }, [isFocused, route.params?.refresh, user?.id]);

  const handleChangePassword = async () => {
    setError("");

    // Validaciones
    // console.log(currentPassword, newPassword, confirmPassword);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validatePasswordsMatch()) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
         // Mostrar mensaje de éxito
         alert(`✅ Contraseña cambiada satisfactoriamente.`);
        //  showToast(`✅ Éxito', 'Contraseña cambiada correctamente`);
         setShowPasswordModal(false);
      
         // Limpiar formulario
         setCurrentPassword("");
         setNewPassword("");
         setConfirmPassword("");
      }
      
    } catch (error) {
      setError(error.message || "Error al cambiar la contraseña");
    }
  };

  // Componente para renderizar cada pedido
  
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("OrderDetail", { orderId: item.id, orderData: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{item.id}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.attributes.fecha_pedido).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.orderStatusContainer}>
        <View
          style={[
            styles.statusBadge,
            item.attributes.estado === "Confirmado" && styles.statusCompleted,
            item.attributes.estado === "Procesando" && styles.statusPending,
            // Agrega otros estados según sea necesario
          ]}
        >
          <Text style={styles.statusText}>
            {item.attributes.estado.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.orderTotal}>
          ${parseFloat(item.attributes.total).toFixed(2)}
        </Text>
      </View>

      <View style={styles.orderProducts}>
        <Text style={styles.productName}>
          • {item.attributes.cantidad_productos} producto(s)
        </Text>
        <Text style={styles.productName}>
          • Mensajero: {item.attributes.mensajero}
        </Text>
        <Text style={styles.productName}>
          • Tiempo estimado: {item.attributes.tiempo_estimado}
        </Text>
      </View>

      {/* <Ionicons name="chevron-forward" size={20} color="#FFFFFF80" /> */}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeTab === "pedidos" ? "Mis Pedidos" : "Mi Perfil"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "perfil" && styles.activeTab]}
          onPress={() => setActiveTab("perfil")}
        >
          <Ionicons
            name="person"
            size={20}
            color={activeTab === "perfil" ? "#f68f46ff" : "#FFFFFF80"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "perfil" && styles.activeTabText,
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "pedidos" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("pedidos")}
        >
          <MaterialIcons
            name="shopping-bag"
            size={20}
            color={activeTab === "pedidos" ? "#f68f46ff" : "#FFFFFF80"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "pedidos" && styles.activeTabText,
            ]}
          >
            Pedidos
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "pedidos" ? (
        <ScrollView contentContainerStyle={styles.ordersContainer}>
          {loadingOrders ? (
            <ActivityIndicator
              size="large"
              color="#FFF"
              style={styles.loading}
            />
          ) : orders.length === 0 ? (
            <View style={styles.emptyOrders}>
              <Ionicons name="receipt-outline" size={60} color="#FFFFFF50" />
              <Text style={styles.emptyText}>
                No tienes pedidos registrados
              </Text>
              {/* <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate("HomeStack")}
              >
                <Text style={styles.shopButtonText}>Ir a comprar</Text>
              </TouchableOpacity> */}
            </View>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.ordersList}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Contenido existente del perfil */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {usuario?.attributes?.imagen ? (
                <Image
                  source={{
                    uri: `http://${dirImg}${usuario.attributes.imagen.split("/").pop()}`,
                  }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person-circle" size={100} color="#FF6B00" />
              )}
            </View>

            <Text style={styles.userName}>{user?.nick || "Usuario"}</Text>

            <Text style={styles.userEmail}>
              {usuario?.attributes?.nombre} {usuario?.attributes?.apellido1}{" "}
              {usuario?.attributes?.apellido2}
            </Text>
            <Text style={styles.userEmail}>
              {usuario?.attributes?.telefono}
            </Text>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{orders.length}</Text>
              <Text style={styles.statLabel}>Compras</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{appData.favoritos.length}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>

          {/* Opciones */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate("EditarPerfil")}
            >
              <Ionicons name="create-outline" size={24} color="#FF6B00" />
              <Text style={styles.optionText}>Editar perfil</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setShowPasswordModal(true)}
            >
              <Ionicons name="lock-closed-outline" size={24} color="#FF6B00" />
              <Text style={styles.optionText}>Cambiar mi contraseña</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate("FavoritosStack")}
          >
            <Ionicons name="heart-outline" size={24} color="#FF6B00" />
            <Text style={styles.optionText}>Favoritos</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity> */}

            {/* Modal para cambiar contraseña */}
            <Modal
              visible={showPasswordModal}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowPasswordModal(false)}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Cambiar contraseña</Text>

                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Contraseña actual"
                      placeholderTextColor="#999"
                      secureTextEntry={!showCurrentPassword}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      <Ionicons
                        name={
                          showCurrentPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nueva contraseña"
                      placeholderTextColor="#999"
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Ionicons
                        name={
                          showNewPassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirmar nueva contraseña"
                      placeholderTextColor="#999"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setShowPasswordModal(false)}
                    >
                      <Text style={styles.buttonTextPas}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={handleChangePassword}
                    >
                      <Text style={styles.buttonText}>Cambiar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>
          </View>
          {/* ... */}
        </ScrollView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Tabs
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabText: {
    marginLeft: 8,
    color: "#FFFFFF80",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#f68f46ff",
  },

  // Pedidos
  ordersContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderDate: {
    color: "#FFFFFF80",
    fontSize: 14,
  },
  orderStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#3b5998",
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusPending: {
    backgroundColor: "#FFC107",
  },
  statusCancelled: {
    backgroundColor: "#F44336",
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderTotal: {
    color: "#f1e58cff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderProducts: {
    marginBottom: 10,
  },
  productName: {
    color: "#FFFFFFCC",
    fontSize: 14,
    marginBottom: 4,
  },
  moreItems: {
    color: "#FFFFFF80",
    fontSize: 12,
    fontStyle: "italic",
  },
  loading: {
    marginTop: 50,
  },
  emptyOrders: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    color: "#FFFFFF80",
    fontSize: 16,
    marginTop: 15,
    marginBottom: 25,
  },
  shopButton: {
    backgroundColor: "#FF6B00",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shopButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Estilos para el modal
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a3a8f",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  confirmButton: {
    backgroundColor: "#FF6B00",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    // textShadowColor: "#fff"
  },
  buttonTextPas: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    // textShadowColor: "#fff"
  },
  errorText: {
    color: "#FF3B30",
    marginBottom: 15,
    textAlign: "center",
  },

  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B00",
    marginBottom: 15,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  userName: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 1,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6B00",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "white",
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginBottom: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "white",
    marginLeft: 15,
  },
});

export default ProfileScreen;
