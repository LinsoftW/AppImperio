import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "./CartContext";
import api from "../api/api";
import { useUser } from "./UserContext";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");

const DetallesScreen = ({ route }) => {
  const {
    producto,
    productoId,
    precio,
    stock,
    imag,
    descripcion,
    id,
    volumen,
    sexo,
    marca,
    categoria,
    tarjetas,
  } = route.params;

  const { dirImg } = Constants.expoConfig.extra;
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const { user } = useUser();
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

  const handleAddToCart = async () => {
    try {
      if (user?.esAnonimo) {
        Alert.alert(
          "Cuenta temporal",
          "Para finalizar tu compra necesitas registrar una cuenta completa",
          [
            { text: "Registrarme", onPress: () => irRegistro() },
            { text: "Iniciar sesión", onPress: () => irLogin() },
            { text: "Más tarde", style: "cancel" },
          ]
        );
      } else {
        const stockDisponible = producto?.attributes?.cantidad || 0;

        // Obtener items del carrito
        const carritoRes = await api.get("/carrito");
        // Verifcar cuantos elementos tiene el carrito del usuario
        const canCarrito = carritoRes.data.datos
          .filter(
            (item) =>
              item.attributes.nick === user?.nick &&
              item.attributes.producto === producto.attributes.nombre
          )
          .reduce((sum, item) => sum + item.attributes.cantidad, 0);

        if (canCarrito >= stockDisponible) {
          showToast(`❌ Solo hay disponible ${stockDisponible} unidades`);
          return;
        }
      }

      // Mostrar notificación toast
      await addToCart({
        id,
        cantidad: quantity,
        productoId,
        precio,
        imag,
        marca,
        volumen,
        sexo,
      });
      showToast(`✅ ${quantity} producto(s) agregado(s) al carrito`);
    } catch (error) {
      // Alert.alert("✅ Añadido", "Producto agregado al carrito");
      showToast(`❌ No se pudo añadir al carrito`);
      // Alert.alert("Error", "No se pudo añadir al carrito");
    }
  };

  const handleBuyNow = async () => {
    if (user?.esAnonimo) {
      Alert.alert(
        "Cuenta temporal",
        "Para finalizar tu compra necesitas registrar una cuenta completa",
        [
          { text: "Registrarme", onPress: () => irRegistro() },
          { text: "Iniciar sesión", onPress: () => irLogin() },
          { text: "Más tarde", style: "cancel" },
        ]
      );
    } else {
      const stockDisponible = producto?.attributes?.cantidad || 0;

      if (quantity > stockDisponible) {
        showToast(`❌ Solo hay disponible ${stockDisponible} unidades`);
        return;
      }
      if (tarjetas === "null") {
        showToast(
          `❌ El administrador no ha definido una cuenta para recibir pagos. Intente más tarde`
        );
        return;
      } else {
        producto.attributes.cantidad = quantity;
        producto.attributes.producto_id = producto.id;
        navigation.navigate("Checkout1", {
          total: precio * quantity,
          pagina: "S",
          cartItems: producto,
        });
      }
    }
  };

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header con botón de regreso */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detalles del Producto</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Tarjeta de contenido con efecto de vidrio */}
          <View style={styles.card}>
            {/* Imagen del producto */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: imag
                    ? `http://${dirImg}${imag.split("/").pop()}`
                    : "https://via.placeholder.com/300",
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>

            {/* Información del producto */}
            <View style={styles.infoContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.productName}>{productoId}</Text>
                <Text style={styles.price}>${precio.toFixed(2)}</Text>
              </View>

              <Text style={styles.stockText}>
                Disponibles: {stock} unidades
              </Text>
              <Text style={styles.description}>{descripcion}</Text>

              {/* Selector de cantidad */}
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Cantidad:</Text>
                <View style={styles.quantityButtons}>
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    style={styles.quantityButton}
                  >
                    <Icon name="remove" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.min(stock, quantity + 1))}
                    style={styles.quantityButton}
                  >
                    <Icon name="add" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Metadatos */}
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Icon name="pricetag" size={16} color="#FFF" />
                  <Text style={styles.metaText}>{categoria}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="business" size={16} color="#FFF" />
                  <Text style={styles.metaText}>{marca}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="people" size={16} color="#FFF" />
                  <Text style={styles.metaText}>{sexo}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="flask" size={16} color="#FFF" />
                  <Text style={styles.metaText}>{volumen}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Barra de acciones fija */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleAddToCart}
          >
            <Icon name="cart-outline" size={20} color="#2F80ED" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleBuyNow}>
            <Text style={styles.primaryButtonText}>
              Comprar ahora (${(precio * quantity).toFixed(2)})
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[styles.toastContainer, { opacity: toastOpacity }]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// Estilos mejorados con gradiente y efectos premium
const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 80,
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
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80, // Espacio para la barra de acciones
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
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    margin: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  imageContainer: {
    height: width * 0.6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFF",
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFD700",
    marginLeft: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  quantityLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  quantityButtons: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  quantityValue: {
    width: 50,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  metaText: {
    fontSize: 14,
    color: "#FFF",
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 16,
    color: "#A5D6A7",
    fontWeight: "500",
    marginBottom: 8,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(30, 60, 114, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 14,
    marginRight: 10,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#2F80ED",
    fontWeight: "600",
    marginLeft: 8,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default DetallesScreen;
