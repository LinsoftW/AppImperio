import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  // Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "./UserContext";
import axios from "axios";
import { Config } from "../Config";
import api from "../api/api";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCart } from "./CartContext";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Claves para la caché
const CACHE_KEYS = {
  CART: "cartItemsCache",
  CARDS: "userCardsCache",
  LAST_UPDATED: "cartLastUpdated",
};

// Tiempo de validez de la caché (5 minutos)
const CACHE_VALIDITY = 5 * 60 * 1000;

const CarritoScreen = ({ navigation, route }) => {
  // const { user } = useUser();
  // const [producto, setProducto] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [refreshing, setRefreshing] = useState(false);
  // const [tarjetas, setTarjetas] = useState([]);
  // const { dirImg } = Constants.expoConfig.extra;

  // // const { cartItems, loadCart, updateCartCount } = useCart();
  // const {
  //   cartItems,
  //   loadCart,
  //   updateCartCount,
  //   removeFromCart,
  //   updateCartItem,
  // } = useCart();
  const { user } = useUser();
  const { server, dirImg } = Constants.expoConfig.extra;
  const {
    cartItems,
    loadCart,
    updateCartCount,
    removeFromCart,
    updateCartItem,
  } = useCart();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tarjetas, setTarjetas] = useState([]);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Cargar datos iniciales
  // const initializeData = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setRefreshing(false)

  //     // 1. Intentar cargar desde caché
  //     const [cachedCart, cachedCards, lastUpdated] = await Promise.all([
  //       AsyncStorage.getItem(CACHE_KEYS.CART),
  //       AsyncStorage.getItem(CACHE_KEYS.CARDS),
  //       AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATED),
  //     ]);

  //     const isCacheValid =
  //       lastUpdated && Date.now() - parseInt(lastUpdated) < CACHE_VALIDITY;

  //     if (cachedCart && isCacheValid) {
  //       // Actualizar el contexto con los datos de caché
  //       await loadCart(JSON.parse(cachedCart));
  //     }

  //     if (cachedCards) {
  //       setTarjetas(JSON.parse(cachedCards));
  //     }

  //     // 2. Actualizar en segundo plano
  //     loadBackgroundData();
  //   } catch (error) {
  //     console.error("Error loading initial data:", error);
  //     // Fallback: cargar directamente del servidor
  //     await loadBackgroundData();
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // }, [loadCart]);
  const initializeData = useCallback(async () => {
    try {
      // Verificar caché primero
      const [cachedCart] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEYS.CART),
      ]);

      if (cachedCart) {
        const parsedCart = JSON.parse(cachedCart);
        if (parsedCart.length > 0) {
          await loadCart(parsedCart);
        }
      }

      // Cargar datos frescos solo si es necesario
      if (!cachedCart || JSON.parse(cachedCart).length === 0) {
        await loadBackgroundData();
      }
    } catch (error) {
      console.error("Initialization error:", error);
      await loadBackgroundData(); // Fallback
    }
  }, [loadCart, loadBackgroundData]);

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

  // Cargar datos en segundo plano
  // const loadBackgroundData = useCallback(async () => {
  //   if (backgroundLoading) return;

  //   setBackgroundLoading(true);
  //   try {
  //     // 1. Cargar carrito actualizado
  //     await loadCart();

  //     // 2. Cargar tarjetas
  //     await loadCards();

  //     // 3. Guardar en caché
  //     await saveToCache();
  //   } catch (error) {
  //     console.error("Background load error:", error);
  //   } finally {
  //     setBackgroundLoading(false);
  //   }
  // }, [backgroundLoading, loadCart]);
  const loadBackgroundData = useCallback(async () => {
    if (backgroundLoading) return;

    setBackgroundLoading(true);
    try {
      await loadCart(); // Esto actualiza cartItems en el contexto
      await saveToCache();
    } catch (error) {
      console.error("Background load error:", error);
    } finally {
      setBackgroundLoading(false);
      setRefreshing(false);
      setLoading(false);
    }
  }, [backgroundLoading, loadCart, saveToCache]);

  // Cargar tarjetas de pago
  const loadCards = useCallback(async () => {
    try {
      const response = await api.get("/tarjetas");
      const cardsData = response.data.data || [];

      // Buscar tarjeta preferida
      const preferredCard = cardsData.find(
        (card) => card.preferida === "Preferida"
      );
      setTarjetas(preferredCard ? preferredCard.numero : "null");

      // Guardar en caché
      await AsyncStorage.setItem(CACHE_KEYS.CARDS, JSON.stringify(cardsData));
    } catch (error) {
      console.error("Error loading cards:", error);
      // Intentar cargar desde caché
      const cachedCards = await AsyncStorage.getItem(CACHE_KEYS.CARDS);
      if (cachedCards) {
        const cards = JSON.parse(cachedCards);
        const preferredCard = cards.find(
          (card) => card.preferida === "Preferida"
        );
        setTarjetas(preferredCard ? preferredCard.numero : "null");
      } else {
        setTarjetas("null");
      }
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Guardar datos en caché
  const saveToCache = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(CACHE_KEYS.CART, JSON.stringify(cartItems)),
        AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATED, Date.now().toString()),
      ]);
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
    setRefreshing(false);
    setLoading(false);
  }, [cartItems]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     loadCart();
  //   });
  //   return unsubscribe;
  // }, [navigation, loadCart]);

  // const isFocused = useIsFocused();

  const cargarTarjetas = async () => {
    try {
      const response = await api.get("/tarjetas");
      if (response.data.data.length === 0) {
        setTarjetas("null");
      }
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
      showToast(`❌ No se pudieron cargar las tarjetas`);
      // Alert.alert("Error", "No se pudieron cargar las tarjetas");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const cargarCarrito = async () => {
    try {
      setRefreshing(true);
      await loadCart(); // Esto ya actualiza el contexto
    } catch (error) {
      showToast(`❌ No se pudo cargar el carrito`);
      // Alert.alert("Error", "No se pudo cargar el carrito");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Antiguo
  const actualizarCantidad = async (itemId, nuevaCantidad) => {
    const producto = cartItems.find((item) => item.id === itemId);
    try {
      const response = await api.put(`/carrito/${itemId}`, {
        cantidad: nuevaCantidad,
      });
      if (response.data.success) {
        updateCartCount(nuevaCantidad);
        await loadCart();
        if (producto && nuevaCantidad > response.data.stockDisponible) {
          showToast(`❌Stock insuficiente. Solo hay ${response.data.stockDisponible} unidades disponibles`);
          // Alert.alert(
          //   "Stock insuficiente",
          //   `Solo hay ${response.data.stockDisponible} unidades disponibles`
          // );
          const response = await api.put(`/carrito/${itemId}`, {
            cantidad: response.data.stockDisponible,
          });
          updateCartCount(response.data.stockDisponible);
          await loadCart();
          return;
        } else {
        }
      } else {
        showToast(`❌Error. ${response.data.error} || "No se pudo actualizar`); 
        // Alert.alert("Error", response.data.error || "No se pudo actualizar");
        cargarCarrito(); // Recargar datos actuales
      }
    } catch (error) {

      if (error.response?.data?.stockDisponible) {
        showToast(`❌Stock insuficiente. Solo hay ${error.response.data.stockDisponible} unidades disponibles`);
        // Alert.alert(
        //   "Stock insuficiente",
        //   `Solo hay ${error.response.data.stockDisponible} unidades disponibles`
        // );
        const response = await api.put(`/carrito/${itemId}`, {
          cantidad: error.response.data.stockDisponible,
        });
        updateCartCount(error.response.data.stockDisponible);
        await loadCart();
        // setCarrito((prev) =>
        //   prev.map((item) =>
        //     item.id === itemId
        //       ? {
        //           ...item,
        //           attributes: {
        //             ...item.attributes,
        //             cantidad: error.response.data.stockDisponible,
        //           },
        //         }
        //       : item
        //   )
        // );
      } else {
        showToast(`❌ No se pudo actualizar la cantidad`);
        // Alert.alert("Error", "No se pudo actualizar la cantidad");
      }
      cargarCarrito(); // Recargar datos actuales
    }
    cargarCarrito(); // Recargar datos actuales
    setRefreshing(false);
    setLoading(false);
  };

  // Actualizar cantidad de un item
  // const actualizarCantidad = useCallback(async (itemId, nuevaCantidad) => {
  //   const item = cartItems.find((item) => item.id === itemId);
  //   if (!item) return;

  //   try {
  //     const response = await api.put(`/carrito/${itemId}`, {
  //       cantidad: nuevaCantidad,
  //     });

  //     if (response.data.success) {
  //       // Actualizar contexto local
  //       updateCartItem(itemId, { cantidad: nuevaCantidad });

  //       // Verificar stock
  //       if (nuevaCantidad > response.data.stockDisponible) {
  //         Alert.alert(
  //           "Stock insuficiente",
  //           `Solo hay ${response.data.stockDisponible} unidades disponibles`
  //         );
  //         await updateCartItem(itemId, { cantidad: response.data.stockDisponible });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating quantity:", error);
  //     if (error.response?.data?.stockDisponible) {
  //       Alert.alert(
  //         "Stock insuficiente",
  //         `Solo hay ${error.response.data.stockDisponible} unidades disponibles`
  //       );
  //       await updateCartItem(itemId, { cantidad: error.response.data.stockDisponible });
  //     } else {
  //       Alert.alert("Error", "No se pudo actualizar la cantidad");
  //     }
  //   }
  // }, [cartItems, updateCartItem]);

  // Antiguo
  const eliminarItem = async (itemId) => {
    try {
      // await axios.delete(`http://${Config.server}:${Config.puerto}/carrito/${itemId}`);
      await api.delete(`/carrito/${itemId}`);
      await loadCart();
      // cargarCarrito();
      await saveToCache();
      showToast(`✅ Eliminado el producto del carrito`);
      
    } catch (error) {
      showToast(`❌ No se pudo eliminar el elemento`);
      // Alert.alert("Error", "No se pudo eliminar el item");
      console.error("Error eliminando item:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Eliminar item del carrito
  // const eliminarItem = useCallback(async (itemId) => {
  //   try {
  //     await api.delete(`/carrito/${itemId}`);
  //     removeFromCart(itemId);
  //     await saveToCache();
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //     Alert.alert("Error", "No se pudo eliminar el item");
  //   }
  // }, [removeFromCart, saveToCache]);

  // Antiguo
  // const verificarPago = async () => {
  //   // setCarrito([]);
  //   const response1 = await api.get(`/productos`);
  //   setProducto(response1.data.datos);
  //   // console.log(producto)
  //   // const response = await api.get(`/carrito/usuario/${user.id}`);
  //   // setCarrito(response.data.data);
  //   // console.log(response.data.data)
  //   // let tot = total;
  //   // let listProducComprados = [];
  //   // for (let index = 0; index < producto.length; index++) {
  //   //   for (let j = 0; j < response.data.data.length; j++) {
  //   //     if (
  //   //       producto[index].id != response.data.data[j].attributes.producto_id
  //   //     ) {
  //   //       tot =
  //   //         tot -
  //   //         response.data.data[j].attributes.cantidad *
  //   //           response.data.data[j].attributes.precio;
  //   //       // listProducComprados.push(response.data.data[j].attributes.cantidad)
  //   //     }
  //   //   }
  //   // }
  //   if (tarjetas === "null") {
  //     Alert.alert(
  //       "Error",
  //       "El administrador no ha definido una cuenta para recibir pagos. Intente más tarde."
  //     );
  //     return;
  //   } else {
  //     // Calcular el total correctamente basado en cartItems
  //     const calculatedTotal = cartItems.reduce(
  //       (sum, item) => sum + item.attributes.precio * item.attributes.cantidad,
  //       0
  //     );
  //     // console.log(carrito)
  //     navigation.navigate("Checkout1", {
  //       total: calculatedTotal,
  //       pagina: "M",
  //       cartItems: [...cartItems],
  //     });
  //   }
  // };

  // Proceder al pago
  const verificarPago = useCallback(async () => {
    if (tarjetas === "null") {
      showToast(`❌ El administrador no ha definido una cuenta para recibir pagos. Intente más tarde`); 
      // Alert.alert(
      //   "Error",
      //   "El administrador no ha definido una cuenta para recibir pagos. Intente más tarde."
      // );
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.attributes.precio * item.attributes.cantidad,
      0
    );

    navigation.navigate("Checkout1", {
      total,
      pagina: "M",
      cartItems: [...cartItems],
    });
  }, [cartItems, tarjetas, navigation]);

  // Efectos
  // useEffect(() => {
  //   if (isFocused || route.params?.refresh) {
  //     initializeData();
  //   }
  // }, [isFocused, route.params?.refresh, initializeData]);
  useEffect(() => {
    if (isFocused || route.params?.refresh) {
      const loadData = async () => {
        setLoading(true);
        try {
          await initializeData();
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isFocused, route.params?.refresh]);

  // Antiguo
  // const renderItem = ({ item }) => (
  //   <View style={styles.itemContainer}>
  //     {/* <Image
  //               source={{ uri: `http://${dirImg}${item.attributes.imagen.split('/').pop()}` }}
  //               style={styles.imagen}
  //           /> */}
  //     {item.attributes.imagen === null ? (
  //       <>
  //         <Image
  //           source={{ uri: `http://190.6.81.46/uploads/iconoI.png` }}
  //           style={styles.imagen}
  //           onPress={() =>
  //             navigation.navigate("Detalles", {
  //               productoId: item.attributes.nombre,
  //               precio: item.attributes.precio,
  //               stock: item.attributes.cantidad,
  //               imag: item.attributes.imagen,
  //               descripcion: item.attributes.descripcion,
  //               id: item.id,
  //               usuario: user,
  //               cantActual: quantities[item.id] || 1,
  //               volumen: item.attributes.volumen,
  //               sexo: item.attributes.sexo,
  //               marca: item.attributes.marca,
  //             })
  //           }
  //           cachePolicy="memory-disk"
  //         />
  //       </>
  //     ) : (
  //       <>
  //         <Image
  //           source={{
  //             uri: `http://${dirImg}${item.attributes.imagen.split("/").pop()}`,
  //           }}
  //           style={styles.imagen}
  //           onPress={() =>
  //             navigation.navigate("Detalles", {
  //               productoId: item.attributes.nombre,
  //               precio: item.attributes.precio,
  //               stock: item.attributes.cantidad,
  //               imag: item.attributes.imagen,
  //               descripcion: item.attributes.descripcion,
  //               id: item.id,
  //               usuario: user,
  //               cantActual: quantities[item.id] || 1,
  //               volumen: item.attributes.volumen,
  //               sexo: item.attributes.sexo,
  //               marca: item.attributes.marca,
  //             })
  //           }
  //           cachePolicy="memory-disk"
  //         />
  //       </>
  //     )}
  //     <View style={styles.infoContainer}>
  //       <Text style={styles.nombre}>{item.attributes.nombre}</Text>
  //       <Text style={styles.precio}>
  //         ${item.attributes.precio.toFixed(2)} c/u
  //       </Text>

  //       <View style={styles.cantidadContainer}>
  //         <TouchableOpacity
  //           style={styles.cantidadBoton}
  //           onPress={() => {
  //             const nuevaCantidad = item.attributes.cantidad - 1;
  //             if (nuevaCantidad > 0) {
  //               actualizarCantidad(item.id, nuevaCantidad);
  //             } else {
  //               eliminarItem(item.id);
  //             }
  //           }}
  //         >
  //           <Icon name="remove" size={20} color="#FFF" />
  //         </TouchableOpacity>

  //         <Text style={styles.cantidadText}>{item.attributes.cantidad}</Text>

  //         <TouchableOpacity
  //           style={styles.cantidadBoton}
  //           onPress={() =>
  //             actualizarCantidad(item.id, item.attributes.cantidad + 1)
  //           }
  //         >
  //           <Icon name="add" size={20} color="#FFF" />
  //         </TouchableOpacity>
  //       </View>
  //     </View>

  //     <View style={styles.subtotalContainer}>
  //       <Text style={styles.subtotalText}>
  //         ${(item.attributes.precio * item.attributes.cantidad).toFixed(2)}
  //       </Text>
  //       <TouchableOpacity
  //         style={styles.eliminarBoton}
  //         onPress={() => eliminarItem(item.id)}
  //       >
  //         <Icon name="trash" size={20} color="#FF3B30" />
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );
  // Render Item optimizado con memo
  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemContainer}>
        <Image
          source={{
            uri: item.attributes.imagen
              ? `http://${dirImg}${item.attributes.imagen.split("/").pop()}`
              : `http://${dirImg}uploads/iconoI.png`,
          }}
          style={styles.imagen}
          cachePolicy="memory-disk"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{item.attributes.nombre}</Text>
          <Text style={styles.precio}>
            ${item.attributes.precio.toFixed(2)} c/u
          </Text>

          <View style={styles.cantidadContainer}>
            <TouchableOpacity
              style={styles.cantidadBoton}
              onPress={() => {
                const nuevaCantidad = item.attributes.cantidad - 1;
                nuevaCantidad > 0
                  ? actualizarCantidad(item.id, nuevaCantidad)
                  : eliminarItem(item.id);
              }}
            >
              <Icon name="remove" size={20} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.cantidadText}>{item.attributes.cantidad}</Text>

            <TouchableOpacity
              style={styles.cantidadBoton}
              onPress={() =>
                actualizarCantidad(item.id, item.attributes.cantidad + 1)
              }
            >
              <Icon name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            ${(item.attributes.precio * item.attributes.cantidad).toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.eliminarBoton}
            onPress={() => eliminarItem(item.id)}
          >
            <Icon name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [actualizarCantidad, eliminarItem, dirImg]
  );

  if (loading && cartItems.length === 0) {
    return (
      <LinearGradient
        colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  // if (loading && !refreshing) {
  //   return (
  //     <LinearGradient
  //       colors={["#4c669f", "#3b5998", "#192f6a"]}
  //       style={styles.container}
  //     >
  //       <ActivityIndicator size="large" color="#FFF" />
  //     </LinearGradient>
  //   );
  // }
  // if (loading && !refreshing && cartItems.length === 0) {
  //   return (
  //     <LinearGradient
  //       colors={["#4c669f", "#3b5998", "#192f6a"]}
  //       style={styles.container}
  //     >
  //       <ActivityIndicator size="large" color="#FFF" />
  //     </LinearGradient>
  //   );
  // }

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <Text style={styles.title}>Carrito</Text>
      <FlatList
        // data={carrito}
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          `${item.id?.toString() || "missing-id"}-${index}`
        }
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={cargarCarrito}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="cart-outline"
              size={60}
              color="#FFF"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            {/* <TouchableOpacity
              style={styles.comprarButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.comprarButtonText}>Explorar Productos</Text>
            </TouchableOpacity> */}
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.resumenContainer}>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenText}>Subtotal:</Text>
            <Text style={styles.resumenText}>
              $
              {cartItems
                .reduce(
                  (sum, item) =>
                    sum + item.attributes.precio * item.attributes.cantidad,
                  0
                )
                .toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenText}>Envío:</Text>
            <Text style={styles.resumenText}>$0.00</Text>
          </View>
          <View style={[styles.resumenRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>
              $
              {cartItems
                .reduce(
                  (sum, item) =>
                    sum + item.attributes.precio * item.attributes.cantidad,
                  0
                )
                .toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.pagarButton}
            onPress={() => verificarPago()}
          >
            <Text style={styles.pagarButtonText}>Proceder al pago</Text>
            <Icon name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
      <Animated.View
          style={[styles.toastContainer, { opacity: toastOpacity }]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingTop: 0,
  },
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
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 200,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  precio: {
    color: "#FFD700",
    fontSize: 14,
    marginBottom: 8,
  },
  cantidadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cantidadBoton: {
    backgroundColor: "#4CAF50",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cantidadText: {
    color: "#FFF",
    marginHorizontal: 12,
    fontSize: 16,
  },
  subtotalContainer: {
    alignItems: "center",
    marginLeft: 10,
  },
  subtotalText: {
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  eliminarBoton: {
    padding: 8,
  },
  resumenContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 16,
  },
  resumenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 8,
    marginTop: 8,
  },
  resumenText: {
    color: "#FFF",
    fontSize: 14,
  },
  totalText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  pagarButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  pagarButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  comprarButton: {
    backgroundColor: "#FF6000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  comprarButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default CarritoScreen;
