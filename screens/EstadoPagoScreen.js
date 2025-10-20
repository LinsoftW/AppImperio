import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "./UserContext";
import api from "../api/api";

const EstadoPagoScreen = ({ route, navigation }) => {
  const { user } = useUser();
  const { params } = route || {};
  const { pagoId, pag, cartItems } = params || {};
  const [intervalId, setIntervalId] = useState(null);
  const [verificaTodos, setVerificarTodos] = useState("");
  const intervalRef = useRef(null);

  // Función para restaurar el stock de productos
  const restaurarStock = async (carrito) => {
    // console.log(pag)
    // console.log(cartItems)
    try {
      if (pag === "S") { // Compra directa (single)
        await api.put(`/incrementa/productos/${carrito.id}`, {
          agregale: carrito.attributes.cantidad
        });
      } else { // Carrito (multiple)
        // console.log(cartItems[0].attributes)
        
        for (const i of carrito) {
          // console.log(i)
          await api.put(`/incrementa/productos/${i.attributes.producto_id}`, {
            agregale: i.attributes.cantidad
          });
        }
      }
    } catch (error) {
      console.error("Error al restaurar stock:", error);
      throw error;
    }
  };

  // Función para cancelar el pago
  const cancelarPago = async () => {
    // console.log(pagoId)
    if (!pagoId) {
      Alert.alert("Error", "No se puede cancelar sin ID de pago.");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Cancelar el pago en el backend
      const response = await api.put(`/pagos/cancelar/${pagoId}`);
      
      if (response.data.success) {
        // 2. Restaurar el stock de productos
        await restaurarStock(cartItems);
        
        Alert.alert(
          "Éxito", 
          "Pago cancelado y stock restaurado correctamente."
        );
        navigation.replace("MainDrawer");
      } else {
        Alert.alert("Error", "No se pudo cancelar el pago.");
      }
    } catch (error) {
      console.error("Error al cancelar:", error);
      Alert.alert(
        "Error", 
        "Ocurrió un problema al cancelar el pago. Por favor intente más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Verifica inmediatamente si recibiste el ID
  useEffect(() => {
    if (!pagoId) {
      Alert.alert("Error", "No se recibió el ID del pago");
      navigation.goBack();
      return;
    }
  }, [pagoId]);

  // Estados del pago
  const [estadoPago, setEstadoPago] = useState("Enviado");
  const [repartidor, setRepartidor] = useState(null);
  const [tiempoEstimado, setTiempoEstimado] = useState(null);
  const [loading, setLoading] = useState(true);

  const ActualizaCarrito = async () => {
    // console.log(pag)
    if (pag === "M") {
      const response = await api.put(`/limpia/carrito/${pagoId}`);
    }
    // console.log(cartItems)
    // console.log(pag)
    // console.log(cartItems.attributes.cantidad)
    if (pag === "S") {
      const response = await api.post(`/compras/directa`, {
        idpersona: user.id,
        idproducto: cartItems.id,
        cantidad: cartItems.attributes.cantidad,
      });
    }
    // console.log(cartItems);
    // await actualizarStockProductos(cartItems);
    navigation.navigate("Home");
  };

  // Función para actualizar el stock de productos
  const actualizarStockProductos = async (items) => {
    // console.log(items.length);
    // try {
    if (!items.length) {
      //   console.log(items.attributes.cantidad);
      try {
        await api.put(`/decrementa/productos/${items.id}`, {
          quitale: items.attributes.cantidad,
        });
      } catch {
        console.error("Error al actualizar stock:", error);
        throw error;
      }
    } else {
      try {
        for (const item of items) {
          await api.put(
            `/decrementa/productos/${item.attributes.producto_id}`,
            {
              quitale: item.attributes.cantidad,
            }
          );
        }
      } catch (error) {
        console.error("Error al actualizar stock:", error);
        throw error; // Relanzamos el error para manejarlo en la función que llama
      }
    }
    // console.log('Stock actualizado correctamente');
  };

  // Función para verificar el estado del pago
  const verificarEstadoPago = async () => {
    try {
      if (!pagoId) {
        const response = await api.get(`/pagosP/${user.id}`);
        if (response.data.data.length > 1) {
          setVerificarTodos("1");
          const response = await api.get(`/pagos/${pagoId}`);
        } else {
          setVerificarTodos("2");
          const response = await api.get(`/pagos/${pagoId}`);
          if (response.data.data[0] !== undefined) {
            const pago = response.data.data[0].attributes;
            // console.log(pago)
            if (pago.estado !== estadoPago) {
              setEstadoPago(pago.estado);

              // Detener el intervalo si el estado es "Confirmado"
              if (pago.estado === "Confirmado") {
                if (intervalId) {
                  clearInterval(intervalId);
                  setIntervalId(null);
                }

                // Cargar datos del repartidor
                // console.log(pago)
                setRepartidor({
                  nombre: pago.mensajero || "Carlos Gómez",
                  telefono: pago.telefono || "+5300000000",
                  vehiculo: pago.vehiculo || "Moto - ABC123",
                });
                setTiempoEstimado(pago.tiempo || "30-45 minutos");
              }
            }
            // }
          }
        }
      } else {
        setVerificarTodos("2");
        const response = await api.get(`/pagos/${pagoId}`);
        if (response.data.data[0] !== undefined) {
          const pago = response.data.data[0].attributes;
          if (pago.estado !== estadoPago) {
            setEstadoPago(pago.estado);

            // Detener el intervalo si el estado es "Confirmado"
            if (pago.estado === "Confirmado") {
              if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
              }

              // Cargar datos del repartidor
              setRepartidor({
                nombre: pago.mensajero || "Carlos Gómez",
                telefono: pago.telefono || "+5300000000",
                vehiculo: pago.vehiculo || "Moto - ABC123",
              });
              setTiempoEstimado(pago.tiempo || "30-45 minutos");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar estado:", error);
    } finally {
      setLoading(false);
    }
  };

  // Polling cada 5 segundos para verificar estado
  useEffect(() => {
    const intervalId = setInterval(verificarEstadoPago, 5000);
    setIntervalId(intervalId);
    verificarEstadoPago();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.mensaje}>Cargando estado del pago...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Estilo para el contenido interno
        showsVerticalScrollIndicator={false} // Opcional: Oculta la barra de desplazamiento
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Estado de tu pago</Text>
        </View>

        {/* Tarjeta de estado */}
        <View style={styles.card}>
          {/* Icono animado según estado */}
          {/* ('Enviado', 'Procesando' */}
          {verificaTodos === "1" ? (
            <>
              <Icon
                name="checkmark-circle"
                size={80}
                color="#4CAF50"
                style={styles.icon}
              />
              <Text style={styles.mensaje}>No tiene envíos pendientes</Text>
            </>
          ) : (
            <>
              {/* <Text>Uno {estadoPagos}</Text> */}
              {/* <Text style={styles.mensaje}>{ verificaTodos }</Text> */}
              {estadoPago === "Enviado" || estadoPago === "Procesando" ? (
                <>
                  <ActivityIndicator
                    size="large"
                    color="#4CAF50"
                    style={styles.icon}
                  />
                  <Text style={styles.mensaje}>
                    {estadoPago === "Pendiente"
                      ? "Estamos validando tu pago..."
                      : "El administrador está verificando tu pago"}
                  </Text>
                </>
              ) : (
                <>
                  <Icon
                    name="checkmark-circle"
                    size={80}
                    color="#4CAF50"
                    style={styles.icon}
                  />
                  <Text style={styles.mensaje}>
                    ¡Pago confirmado exitosamente!
                  </Text>
                </>
              )}
            </>
          )}

          {/* Estado actual */}
          <Text
            style={[
              styles.estadoText,
              estadoPago === "Confirmado" && styles.estadoConfirmado,
            ]}
          >
            {estadoPago}
          </Text>

          {/* Detalles de entrega (solo cuando está confirmado) */}
          {estadoPago === "Confirmado" &&
            verificaTodos === "2" &&
            repartidor && (
              <View style={styles.entregaContainer}>
                <Text style={styles.entregaTitle}>
                  Tu pedido está en camino
                </Text>

                <View style={styles.repartidorInfo}>
                  {/* <Image
                                source={require('../assets/card.png')} // Cambia por tu imagen de repartidor
                                style={styles.repartidorImage}
                            /> */}
                  <View>
                    <Text style={styles.repartidorText}>
                      Repartidor: {repartidor.nombre}
                    </Text>
                    <Text style={styles.repartidorText}>
                      Vehículo: {repartidor.vehiculo}
                    </Text>
                    <Text style={styles.repartidorText}>
                      Contacto: {repartidor.telefono}
                    </Text>
                    <Text style={styles.tiempoText}>
                      Llega en: {tiempoEstimado}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => Linking.openURL(`tel:${repartidor.telefono}`)}
                >
                  <Icon name="call" size={20} color="#FFF" />
                  <Text style={styles.contactButtonText}>
                    Llamar al repartidor
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    estadoPago === "Confirmado" ? "#4CAF50" : "#FF3B30",
                },
              ]}
              onPress={() => {
                if (estadoPago === "Confirmado") {
                  ActualizaCarrito();
                  navigation.navigate("MainDrawer");
                } else {
                  // Opcional: Cancelar el pago
                  navigation.goBack();
                }
              }}
            >
              <Text style={styles.actionButtonText}>
                {estadoPago === "Confirmado" ? "Aceptar" : "Cancelar pedido"}
              </Text>
            </TouchableOpacity> */}
              </View>
            )}
        </View>

        {/* Botón de acción */}
        {/* <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor:
                estadoPago === "Confirmado" ? "#4CAF50" : "#FF3B30",
            },
          ]}
          onPress={() => {
            if (estadoPago === "Confirmado") {
              ActualizaCarrito();
              navigation.navigate("MainDrawer");
            } else {
              // Opcional: Cancelar el pago
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {estadoPago === "Confirmado" ? "Aceptar" : "Cancelar pedido"}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor:
                estadoPago === "Confirmado" ? "#4CAF50" : "#FF3B30",
            },
          ]}
          onPress={() => {
            if (estadoPago === "Confirmado") {
              ActualizaCarrito();
              navigation.navigate("MainDrawer");
            } else {
              Alert.alert(
                "Cancelar pedido",
                "¿Estás seguro de que deseas cancelar este pago? Se restaurará el stock de los productos.",
                [
                  { text: "No", style: "cancel" },
                  { text: "Sí, cancelar", onPress: () => cancelarPago() },
                ]
              );
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {estadoPago === "Confirmado" ? "Aceptar" : "Cancelar pedido"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// Los estilos se mantienen igual que en tu código original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1, // ← Permite que el ScrollView se expanda
    padding: 20, // ← Añade padding si es necesario
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginBottom: 20,
  },
  estadoText: {
    color: "#FFD700",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  estadoConfirmado: {
    color: "#4CAF50",
  },
  mensaje: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  entregaContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  entregaTitle: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  repartidorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  repartidorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  repartidorText: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 5,
  },
  tiempoText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  contactButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EstadoPagoScreen;
