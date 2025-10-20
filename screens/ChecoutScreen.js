import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import { useUser } from "./UserContext";
import * as Clipboard from "expo-clipboard";

const CheckoutScreen1 = ({ navigation, route }) => {
  const { total: initialTotal, pagina, cartItems } = route.params || {};
  const [seleccionado, setSeleccionado] = useState(0);
  const [tarjetas, setTarjetas] = useState([]);
  const [total, setTotal] = useState(initialTotal || 0); // Estado local para el total

  const { user } = useUser();

  useEffect(() => {
    if (route.params?.total) {
      setTotal(route.params.total);
    }
  }, [route.params?.total]);

  const cargarTarjetas = async () => {
    try {
      const response = await api.get("/tarjetas");
      for (let index = 0; index < response.data.data.length; index++) {
        if (response.data.data[index].preferida === "Preferida") {
          const tarj = response.data.data[index].numero;
          setTarjetas(tarj);
          break;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setTarjetas("null");
      Alert.alert("Error", "No se pudieron cargar las tarjetas");
    } finally {
    }
  };

  useEffect(() => {
    cargarTarjetas();
  }, []);

  // // Función para actualizar el stock de productos
  const actualizarStockProductos = async (items) => {
    try {
      if (items.length >= 2) {
        for (const item of items) {
          await api.put(
            `/decrementa/productos/${item.attributes.producto_id}`,
            {
              quitale: item.attributes.cantidad,
            }
          );
        }
      } else {
        if (pagina === "M") {
          await api.put(
            `/decrementa/productos/${items[0].attributes.producto_id}`,
            {
              quitale: items[0].attributes.cantidad,
            }
          );
        } else {
          // console.log(items)
          if (!items?.attributes?.producto_id){
            // items.attributes.producto_id = items.id;
            // items.attributes.cantidad = items.cantidad;
            await api.put(
              `/decrementa/productos/${items.id}`,
              {
                quitale: items.cantidad,
              }
            );
          }else{
            await api.put(
              `/decrementa/productos/${items.attributes.producto_id}`,
              {
                quitale: items.attributes.cantidad,
              }
            );
          }
        }
      }
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      throw error; // Relanzamos el error para manejarlo en la función que llama
    }
  };

  const enzona = async () => {
    // primero verificar si esta instalada la apk y sino abrir la web si tiene
    // const iSEnzonaInstalda = checkAppInstalled('whatsapp://')
    // try {
    //     await Linking.openURL('whatsapp://');
    // } catch (error) {
    //     Alert.alert('Error', 'WhatsApp no está instalado');
    // }
    // console.log(iSEnzonaInstalda)
    const url =
      "https://identity.enzona.net/authenticationendpoint/login.do?client_id=ofr3Wz9nnfZaFd18OewdZYvuTaEa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fwww.enzona.net%2Fauth%2Fenzona%2Fcallback&response_type=code&scope=openid&state=8ErbQIPelljf2xEWhqfRQCNDsvbL7Mjx308Lukyc&tenantDomain=carbon.super&sessionDataKey=769171b9-3a8d-496a-84e1-9c12b071a8dd&relyingParty=ofr3Wz9nnfZaFd18OewdZYvuTaEa&type=oidc&sp=admin_ppago-apk_PRODUCTION&isSaaSApp=false&authenticators=IdentifierExecutor:LOCAL"; // Reemplaza con tu URL de PayPal
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error al abrir Enzona:", error);
    }
  };

  const transfermovil = async () => {
    // primero verificar si esta instalada la apk y sino abrir la web si tiene
    // const iSEnzonaInstalda = checkAppInstalled('transfermovil://')
    // try {
    //     await Linking.openURL('transfermovil://');
    // } catch (error) {
    //     Alert.alert('Error', 'Transfermovil no está instalado');
    // }
    // console.log(iSEnzonaInstalda)
    // const url = 'https://identity.enzona.net/authenticationendpoint/login.do?client_id=ofr3Wz9nnfZaFd18OewdZYvuTaEa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fwww.enzona.net%2Fauth%2Fenzona%2Fcallback&response_type=code&scope=openid&state=8ErbQIPelljf2xEWhqfRQCNDsvbL7Mjx308Lukyc&tenantDomain=carbon.super&sessionDataKey=769171b9-3a8d-496a-84e1-9c12b071a8dd&relyingParty=ofr3Wz9nnfZaFd18OewdZYvuTaEa&type=oidc&sp=admin_ppago-apk_PRODUCTION&isSaaSApp=false&authenticators=IdentifierExecutor:LOCAL'; // Reemplaza con tu URL de PayPal
    // try {
    //   await Linking.openURL(url);
    // } catch (error) {
    //   console.error("Error al abrir Enzona:", error);
    // }
  };

  const enviarPago = async (metodo) => {
    try {
      // 1. Actualizar el stock de productos (solo si el pago se registró correctamente)
      await actualizarStockProductos(cartItems);

      // 2. Registrar el pago
      const response = await api.post(`/pagos`, {
        idpersona: user.id,
        cantidad: parseFloat(total),
        servicio: pagina,
        tpago: metodo,
      });
      const idPagoGenerado = response.data.data.id;

      // Abro la nueva interface para llenar los datos de la transferencia
      // if (pagina === "S") {
      //   navigation.navigate("ConfirmarPago", {
      //     cartItems: cartItems,
      //     total: total,
      //     pagoId: idPagoGenerado,
      //     pag: pagina,
      //     tpago: metodo
      //   });
      // } else {
      //   navigation.navigate("ConfirmarPago", {
      //     cartItems: cartItems, // Array de productos
      //     total: total,
      //     pagoId: idPagoGenerado,
      //     pag: pagina,
      //     tpago: metodo
      //   });
      // }
      navigation.navigate("ConfirmarPago", {
        cartItems: cartItems,
        total: total,
        pagoId: idPagoGenerado,
        pag: pagina,
        tpago: metodo,
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo completar el proceso de pago");
      console.error(error);
    }
  };

  // Ejemplo rápido: Toast al copiar (usando expo-toast)

  const copyWithToast = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      // if (Platform.OS === "ios") {
      //   Alert.alert("✅ Copiado", "Tarjeta copiada en el portapapeles");
      // } else {
      //   Alert.alert("✅ Copiado", "Tarjeta copiada en el portapapeles");
      // }
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
    }
  };

  const handlePago = async () => {
    if (seleccionado === 0) {
      Alert.alert("Error", "Selecciona un método de pago");
      return;
    }
    if (tarjetas === "null") {
      Alert.alert(
        "Error",
        "El administrador no ha definido una cuenta para recibir pagos. Intente más tarde."
      );
      return;
    } else {
      copyWithToast(tarjetas);
    }

    // Mostrar confirmación antes de proceder
    Alert.alert(
      "Confirmar Pago",
      `¿Estás seguro de realizar el pago de $${total.toFixed(2)}?. La cuenta a la cual se transferirá el dinero se copió en el porta papeles.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            if (seleccionado === 1) {
              enzona();
              await enviarPago(2);
            }
            if (seleccionado === 2) {
              transfermovil();
              await enviarPago(2);
            }
            if (seleccionado === 3) {
              // cash();
              // console.log("Aquiiii")
              await enviarPago(1);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>  Confirmar pago</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Imagen de tarjeta */}
      <View style={styles.containerI}>
        <Image
          source={require("../assets/tarjeta1.png")}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.textOverlay}>
          xxxx xxxx xxxx {tarjetas.slice(-4)}
        </Text>
      </View>

      {/* Monto a pagar */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Total a pagar</Text>
        <Text style={styles.amountValue}>${total.toFixed(2)}</Text>
      </View>

      {/* Selector de método de pago */}
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.sectionTitle}>Seleccione el métodos de pago</Text>

        <View style={styles.methodsRow}>
          {/* <TouchableOpacity
            style={[
              styles.methodButton,
              seleccionado === 1 && styles.selectedMethod,
            ]}
            onPress={() => setSeleccionado(1)}
          >
            <Image
              source={require("../assets/enzona.png")}
              style={styles.methodImage}
            />
            {seleccionado === 1 && (
              <Icon name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.methodButton,
              seleccionado === 1 && styles.selectedMethod,
            ]}
            onPress={() => setSeleccionado(1)}
          >
            <Image
              source={require("../assets/enzona.png")}
              style={styles.methodImage}
            />
            {seleccionado === 1 && (
              <Icon
                name="checkmark-circle"
                size={24}
                color="#4CAF50"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodButton,
              seleccionado === 2 && styles.selectedMethod,
            ]}
            onPress={() => setSeleccionado(2)}
          >
            <Image
              source={require("../assets/transfermovil.png")}
              style={styles.methodImage}
            />
            {/* <Text style={styles.methodText}>Transfermovil</Text> */}
            {seleccionado === 2 && (
              <Icon
                name="checkmark-circle"
                size={24}
                color="#4CAF50"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodButton,
              seleccionado === 3 && styles.selectedMethod,
            ]}
            onPress={() => setSeleccionado(3)}
          >
            <Image
              source={require("../assets/cash.png")}
              style={styles.methodImage}
            />
            {/* <Text style={styles.methodText}>Efectivo</Text> */}
            {seleccionado === 3 && (
              <Icon
                name="checkmark-circle"
                size={24}
                color="#4CAF50"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón de confirmación */}
      <TouchableOpacity style={styles.confirmButton} onPress={handlePago}>
        <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
        <Icon name="lock-closed" size={20} color="#FFF" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

// Estilos (basados en tu diseño anterior con mejoras)
const styles = StyleSheet.create({
  header: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // // top: 5,
    // padding: 5,
    // paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    paddingTop: 17,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    borderRadius: 8,
    // padding: 16,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  textOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 80,
    marginTop: 10,
    textAlign: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  containerI: {
    position: "relative",
    width: 300,
    height: 200,
  },
  cardImage: {
    marginBottom: 20,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  amountContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
    marginBottom: 30,
  },
  amountLabel: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  amountValue: {
    color: "#FFD700",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  paymentMethodsContainer: {
    width: "90%",
    marginBottom: 20,
  },
  // methodsRow: {
  //   flexDirection: "row", // Coloca los botones en fila
  //   justifyContent: "space-between", // Distribuye el espacio entre ellos
  // },
  methodsRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Cambiado de 'space-between' a 'space-around'
    alignItems: "center", // Añadido para centrar verticalmente
  },
  // methodButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center", // Centra el contenido del botón
  //   backgroundColor: "rgba(255, 255, 255, 0.1)",
  //   borderRadius: 8,
  //   padding: 15,
  //   width: "30%", // Ancho proporcional para 3 botones
  //   borderWidth: 1,
  //   borderColor: "transparent",
  // },
  methodButton: {
    alignItems: "center", // Centra el contenido verticalmente
    justifyContent: "center", // Centra el contenido horizontalmente
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 15,
    width: "30%",
    borderWidth: 1,
    borderColor: "transparent",
    marginHorizontal: 5, // Añade un pequeño margen entre botones
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "bold",
  },
  selectedMethod: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  methodImage: {
    width: 40,
    height: 40,
    // marginRight: 15,
  },
  checkIcon: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  methodText: {
    color: "#FFF",
    fontSize: 16,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    width: "90%",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
});

export default CheckoutScreen1;
