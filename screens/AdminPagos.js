import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../api/api";
import RepartidorModal from "./RepartidorModal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";

const VerificarPagosScreen = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPago, setCurrentPago] = useState(null);
  const [numeroTransaccion, setNumeroTransaccion] = useState("");
  const navigation = useNavigation();
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Función para mostrar el toast con animación
  const showToast = (message) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage("");
    });
  };

  const handleConfirmRepartidor = async (repartidor) => {
    const { id } = currentPago;
    const mensajero = repartidor.nombre;
    const telefono = repartidor.telefono;
    const vehiculo = repartidor.vehiculo;
    const tiempoEstimado = repartidor.tiempo;
    const costo_mensajeria = repartidor.costo_mensajeria;
    try {
      const response = await api.put(`/pagos/${id}`, {
        estado: "Confirmado",
        mensajero,
        telefono,
        vehiculo,
        tiempoEstimado,
        costo_mensajeria,
      });

      if (response.data.success) {
        // Envio el ticket al usuario y al administrador
        showToast(
        `✅ Pago confirmado y repartidor asignado`
      );
        // Alert.alert("Éxito", "Pago confirmado y repartidor asignado");
        cargarPagos();
      }
    } catch (error) {
      console.error(error);
      showToast(`❌ No se pudo asignar el repartidor`);
      // Alert.alert("Error", "No se pudo asignar el repartidor");
    }
    // }
  };

  const cargarPagos = async () => {
    try {
      const response = await api.get(`/pagos/pendientes`);
      // console.log(response.data)
      setPagos(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(cargarPagos, 5000);
    // Verificar inmediatamente al cargar
    cargarPagos();

    return () => clearInterval(intervalId);
  }, []);

  // const actualizarEstado = async (id, nuevoEstado, item) => {
  //   try {
  //     if (nuevoEstado === "Confirmado") {
  //       // Actualizo listado de productos
  //       setCurrentPago({ id, item });
  //       const r = await api.get(`/pagos/${id}`);
  //       console.log(r.data)
  //       setNumeroTransaccion(r.data.data);
  //       if (
  //         numeroTransaccion[0].attributes?.transaccion !== undefined ||
  //         numeroTransaccion[0].attributes?.transaccion !== null ||
  //         numeroTransaccion[0].attributes?.transaccion !== ""
  //       ) {
  //         setModalVisible(true); // Abre solo si hay transacción
  //       } else {

  //         Alert.alert(
  //           "El cliente no ha enviado el id de transacción, verifique más tarde."
  //         );
  //       }
  //     } else {
  //       const response = await api.put(`/pagos/${id}`, {
  //         estado: nuevoEstado,
  //       });

  //       // console.log(response.data);
  //       // Verificar si la actualización fue exitosa
  //       if (response.data.success) {
  //         // Actualizar los datos del mensajero en caso de que lleve sino pones en proveedor
  //         // showToast(
  //         //    `✅ Pago confirmado y carrito limpiado`
  //         //   );
  //         Alert.alert(
  //           "Éxito",
  //           nuevoEstado === "Confirmado"
  //             ? "Pago confirmado y carrito limpiado"
  //             : "Estado actualizado"
  //         );
  //         cargarPagos();
  //       } else {
  //         // Alert.alert("Error", "No se pudo actualizar el estado");
  //         showToast(`❌ No se pudo actualizar el estado`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // Alert.alert("Error", "Error de conexión. Intente nuevamente.");
  //     showToast(`❌ Error de conexión. Intente nuevamente`);
  //   }
  // };

  const actualizarEstado = async (id, nuevoEstado, item) => {
  try {
    if (nuevoEstado === "Confirmado") {
      setCurrentPago({ id, item });
      const r = await api.get(`/pagos/${id}`);
      const data = r.data.data; // Asume que esto es el objeto de pago completo
      // Verifica directamente si existe la transacción
      if (data[0]?.attributes?.transaccion) {
        setNumeroTransaccion(data); // Guarda el objeto completo si lo necesitas después
        setModalVisible(true);
      } else {
        showToast("❌ El cliente no ha enviado el ID de transacción");
      }
    } else {
      const response = await api.put(`/pagos/${id}`, {
        estado: nuevoEstado,
      });

      if (response.data.success) {
        showToast(
          nuevoEstado === "Confirmado"
            ? "✅ Pago confirmado y carrito limpiado"
            : "✅ Estado actualizado"
        );
        cargarPagos();
      } else {
        showToast("❌ No se pudo actualizar el estado");
      }
    }
  } catch (error) {
    console.error(error);
    showToast("❌ Error de conexión. Intente nuevamente");
  }
};
  

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>
          {item.attributes.estado === "Enviado" ? "🟡" : "🟠"} $
          {item.attributes.cantidad}.00 de{" "}
          {item.attributes?.nombre_persona || "Anónimo"}
        </Text>
        <Text style={styles.fechaText}>
          {new Date(item.attributes.create_at).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          item.attributes.estado === "Procesando" && styles.buttonConfirmar,
        ]}
        onPress={() => {
          if (item.attributes.estado === "Enviado") {
            actualizarEstado(item.id, "Procesando", item);
          } else {
            actualizarEstado(item.id, "Confirmado", item);
          }
        }}
      >
        <Text style={styles.buttonText}>
          {item.attributes.estado === "Enviado" ? "Verificar" : "Confirmar"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
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
        <Text style={styles.headerTitle}>Pagos pendientes</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.title}>Listado de pagos</Text>

      <FlatList
        data={pagos}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          `${item.id?.toString() || "pago-id"}-${index}`
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay pagos pendientes</Text>
        }
        refreshing={loading}
        onRefresh={cargarPagos}
      />
      <RepartidorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmRepartidor}
      />
      <Animated.View
          style={[styles.toastContainer, { opacity: toastOpacity }]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 1000,
  },
  toastText: {
    color: "#FFF",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 1,
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
    paddingTop: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
  },
  fechaText: {
    color: "#AAA",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonConfirmar: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default VerificarPagosScreen;
