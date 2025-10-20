// MEJORADA
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import { useUser } from "./UserContext";
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

const ConfirmacionPagoScreen = ({ navigation, route }) => {
  const { cartItems = [], total = 0, pag, pagoId, tpago } = route.params || {};

  const [numeroTransaccion, setNumeroTransaccion] = useState("");
  const [escribir, setEscribir] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  const { user } = useUser();

  const handleConfirmar = async () => {
    if (!numeroTransaccion) {
      Alert.alert("Error", "Por favor ingrese el número de transacción");
      return;
    }

    await ActualizaCarrito();
  };

  const handleGoBack = () => {
    cancelarPago();
    // navigation.canGoBack()
    //   ? navigation.goBack()
    //   : navigation.replace("AppWithDrawer");
  };

  const ActualizaCarrito = async () => {
    try {
      if (pag === "M") {
        // const response = await api.put(`/limpia/carrito/${pagoId}`);
        const response1 = await api.put(`/transaccion/${pagoId}`, {
          transaccion: numeroTransaccion,
        });
      }
      if (pag === "S") {
        // console.log(cartItems)
        const response1 = await api.put(`/transaccion/${pagoId}`, {
          transaccion: numeroTransaccion,
          productoDirecto: {
            idproducto: cartItems.id,
            cantidad: cartItems.attributes?.cantidad || cartItems.cantidad,
            precio: cartItems.attributes?.precio || cartItems.precio,
          },
        });
        // console.log(response1.data)
        const response = await api.post(`/compras/directa`, {
          idpersona: user.id,
          idproducto: cartItems.id,
          cantidad: cartItems.attributes.cantidad || cartItems.cantidad,
        });
        // console.log(response.data)
        // console.log(response1.data.data)
      }
    } catch {
      console.log(
        "Error",
        "Error realizando proceso de actualización de productos del usuario"
      );
    } finally {
      Alert.alert(
        "✅ Confirmación Exitosa",
        "Su pago ha sido registrado correctamente"
      );
      navigation.replace("MainTabs");
    }
  };

  const copyWithToast = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      // if (Platform.OS === "ios") {
        Alert.alert("✅ Copiado", "Se ha copiado el número a confirmar en el portapapeles.");
      // } else {
      //   Alert.alert("✅ Copiado", "Tarjeta copiada en el portapapeles");
      // }
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
    }
  };

  const restaurarStock = async (carrito) => {
    // console.log(carrito)
    try {
      if (pag === "S") {
        // Compra directa (single)
        if (!carrito?.attributes?.cantidad){
          await api.put(`/incrementa/productos/${carrito.id}`, {
            agregale: carrito.cantidad,
          });
        }else{
          await api.put(`/incrementa/productos/${carrito.id}`, {
            agregale: carrito.attributes.cantidad,
          });
        }
      } else {
        for (const i of carrito) {
          await api.put(`/incrementa/productos/${i.attributes.producto_id}`, {
            agregale: i.attributes.cantidad,
          });
        }
      }
    } catch (error) {
      console.error("Error al restaurar stock:", error);
      throw error;
    }
  };

  const cancelarPago = async () => {
    if (!pagoId) {
      Alert.alert("❌ Error", "No se puede cancelar sin ID de pago.");
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
          "✅ Éxito",
          "Pago cancelado y stock restaurado correctamente."
        );
        navigation.goBack();
      } else {
        Alert.alert("❌ Error", "No se pudo cancelar el pago.");
      }
    } catch (error) {
      console.error("Error al cancelar:", error);
      Alert.alert(
        "❌ Error",
        "Ocurrió un problema al cancelar el pago. Por favor intente más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // copyWithToast("55835034");
    if (tpago === 1) {
      setNumeroTransaccion("Pago en efectivo");
      setEscribir(true);
      // Alert.alert(
      //   "Información",
      //   "Se copió el número a confirmar en el porta papeles."
      // );
    } else {
      setEscribir(false);
      // Alert.alert(
      //   "Información",
      //   "Se copió el número a confirmar en el porta papeles."
      // );
    }
  }, [isFocused, route.params?.refresh]);

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>
        {item.attributes?.nombre || item.nombre || "Producto"}
      </Text>
      <View style={styles.productDetails}>
        <Text style={styles.productText}>
          Cantidad: {item.attributes?.cantidad || item.cantidad || 1}
        </Text>
        <Text style={styles.productText}>
          Precio: ${(item.attributes?.precio || item.precio || 0).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Confirmar Pago</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Tarjeta de contenido */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Detalles del Pago</Text>
            <TouchableOpacity onPress={() => copyWithToast("55835034")}>
              <Text style={styles.sectionTitle1}>
                Número a confirmar: 55835034
              </Text>
            </TouchableOpacity>
            {/* Campo editable: Número de Transacción */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Número de Transacción *</Text>
              {/* <TextInput
                style={[styles.input, !escribir && styles.disabledInput]}
                placeholder="Ej: T-123456789"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={numeroTransaccion}
                onChangeText={setNumeroTransaccion}
                keyboardType="default"
                autoCapitalize="none"
                editable={escribir}
              /> */}
              {/* <TextInput
                style={[
                  styles.input,
                  !escribir && styles.disabledInput,
                  !escribir && { color: "rgba(255,255,255,0.5)" }, // Texto más claro cuando está deshabilitado
                ]}
                placeholder="Ej: T-123456789"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={numeroTransaccion}
                onChangeText={escribir ? setNumeroTransaccion : null} // Agrega esta línea
                keyboardType="default"
                autoCapitalize="none"
                editable={escribir}
                selectTextOnFocus={escribir} // Evita que se pueda seleccionar texto cuando está deshabilitado
              /> */}
              {!escribir ? (
                <TextInput
                  style={styles.input}
                  placeholder="Ej: T-123456789"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={numeroTransaccion}
                  onChangeText={setNumeroTransaccion}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              ) : (
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.disabledText}>
                    {numeroTransaccion || "Ej: T-123456789"}
                  </Text>
                </View>
              )}
              <Text style={styles.helperText}>
                Copie el número de transacción del mensaje que emitió su banco
              </Text>
            </View>

            {/* Lista de productos */}
            <Text style={styles.subSectionTitle}>Productos:</Text>
            <FlatList
              data={Array.isArray(cartItems) ? cartItems : [cartItems]}
              renderItem={renderProductItem}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              scrollEnabled={false}
              style={styles.productsList}
            />

            {/* Resumen del pago */}
            <View style={styles.summaryContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Pagado:</Text>
                <Text style={[styles.detailValue, styles.amount]}>
                  ${typeof total === "number" ? total.toFixed(2) : "0.00"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Botones de acción */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelarPago}
            disabled={loading}
          >
            <Icon name="close-circle" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmar}
            disabled={loading}
          >
            <Icon name="checkmark-circle" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  disabledInput: {
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
  },
  disabledText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16, // Ajusta según el tamaño de tu input
  },
  disabledInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Fondo más oscuro
    borderColor: "rgba(255, 255, 255, 0.2)", // Borde más claro
    // opacity: 0.7, // Puedes mantener esto si quieres
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100, // Más espacio para los botones
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle1: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6aff00ff",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    color: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  helperText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
    fontStyle: "italic",
  },
  productsList: {
    marginBottom: 16,
  },
  productItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productName: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "500",
    marginBottom: 4,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  summaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  detailLabel: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  amount: {
    color: "#A5D6A7",
    fontWeight: "600",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(30, 60, 114, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  confirmButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    borderRadius: 8,
    padding: 16,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ConfirmacionPagoScreen;
