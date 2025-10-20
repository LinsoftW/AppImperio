import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "./UserContext";
import * as Clipboard from "expo-clipboard";

const CheckoutScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const [seleccionado, setSeleccionado] = useState(0); // Asumimos que es 1 si selecciona enzona y 2 si tranfermovil
  const total = route.params?.total || 0;

  const handleSeleccion = (opcion) => {
    setSeleccionado(opcion);
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
    const url = "https://enzona.net";
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error al abrir Enzona:", error);
    }
  };

  const procesarPago = () => {
    if (seleccionado === 1) {
      // console.log('Entro')
      // Lógica para enzona
    //   copyToClipboard('Texto a copiar')
      enzona();
    } else if (seleccionado === 2) {
      // Lógica para tarjeta
    } else if (seleccionado === 3) {
      // Logica para cash
    } else {
      Alert.alert("Error", "Selecciona un método de pago");
    }
  };

  const checkAppInstalled = async (scheme) => {
    // console.log(scheme);
    if (scheme == 1) {
      try {
        const supported = await Linking.canOpenURL(scheme);
        return supported;
      } catch (error) {
        return false;
      }
    } else {
      Alert.alert("Aviso", "Seleccionó transfermóvil");
    }
  };

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Imagen de tarjeta magnética */}
        {/* <View style={styles.cardContainer}>
                    <Image
                        source={require('../assets/card.png')} // Asegúrate de tener esta imagen en tus assets
                        style={styles.cardImage}
                        resizeMode="contain"
                    />
                </View> */}
        <View style={styles.amountContainer}>
          <Image
            source={require("../assets/splash.png")} // Asegúrate de tener esta imagen en tus assets
            style={styles.cardImage}
            resizeMode="contain"
          />
          <Text style={styles.amountLabel}>Tarjeta del proveedor</Text>
          <Text style={styles.amountValue1}>9204-XXXX-XXXX-9929</Text>
        </View>

        {/* Monto a pagar */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total a pagar</Text>
          <Text style={styles.amountValue}>${total.toFixed(2)}</Text>
        </View>

        {/* Selección de método de pago */}
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Selecciona tu método de pago</Text>

          <View style={styles.methodsRow}>
            <TouchableOpacity
              style={[
                styles.metodoPago,
                seleccionado === 1 && styles.metodoSeleccionado,
              ]}
              onPress={() => handleSeleccion(1)}
            >
              <Image
                source={require("../assets/enzona.png")} // Imagen combinada de Visa/Mastercard
                style={styles.methodImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.metodoPago,
                seleccionado === 2 && styles.metodoSeleccionado,
              ]}
              onPress={() => handleSeleccion(2)}
            >
              <Image
                source={require("../assets/splash.png")} // Logo de PayPal
                style={styles.methodImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de confirmación */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => procesarPago}
        >
          <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
          <Icon name="lock-closed" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  metodoSeleccionado: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 15,
    width: 100,
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  cardImage: {
    width: 100,
    height: 120,
  },
  amountContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
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
  },
  amountValue1: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
  },
  paymentMethodsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  methodsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  methodButton: {
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    width: 100,
    alignItems: "center",
  },
  methodImage: {
    width: 80,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
});

export default CheckoutScreen;
