import { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "./UserContext";
import { useCart } from "./CartContext";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import QuantitySelector from "./QuantitySelector";
import { Image } from "expo-image";
import api from "../api/api";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2;

const FavoritosScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { addToCart } = useCart();
  const { dirImg } = Constants.expoConfig.extra;
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Actualizar datos cuando elimino un producto de los favoritos

  useEffect(() => {
    const loadData = async () => {
      await cargarProductos();
      await cargarFavoritos(); // Ahora prioriza caché
      // console.log("Datos de favoritos:", favorites);
      // console.log(
      //   "Favoritos registrados:",
      //   favorites.map((f) => ({
      //     id: f.id,
      //     producto_id: f.attributes?.producto_id || f.producto_id,
      //     normalized: normalizeId(
      //       f.attributes?.producto_id || f.producto_id || f.id || f
      //     ),
      //   }))
      // );
    };

    if (isFocused || route.params?.refresh) {
      loadData();
    }
  }, [isFocused, route.params?.refresh]);

  const cargarProductos = async () => {
    try {
      const response = await api.get("/productos");
      setProducts(response.data.datos);
    } catch (error) {
      console.log("Error", "No se pudieron cargar los productos");
    }
  };

  // const cargarFavoritos = async () => {
  //   if (!user?.id) return;

  //   try {
  //     setLoading(true);

  //     // Primero intenta cargar desde AsyncStorage
  //     const cachedFavorites = await AsyncStorage.getItem("Lfavoritos");

  //     if (cachedFavorites) {
  //       setFavorites(JSON.parse(cachedFavorites));
  //       // console.log("Favoritos cargados desde caché");
  //     }

  //     // Luego actualiza desde el API (en segundo plano)
  //     const response = await api.get(`/favoritos/${user.id}`);
  //     const apiFavorites = response.data.data || [];

  //     if (apiFavorites.length > 0) {
  //       setFavorites(apiFavorites);
  //       await AsyncStorage.setItem("Lfavoritos", JSON.stringify(apiFavorites));
  //     }
  //   } catch (error) {
  //     console.error("Error cargando favoritos:", error);
  //     const savedFavorites = await AsyncStorage.getItem("Lfavoritos");
  //     if (savedFavorites) {
  //       setFavorites(JSON.parse(savedFavorites));
  //     }
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  //   // };
  // };

  // const cargarFavoritos = async () => {
  //   if (!user?.id) return;

  //   try {
  //     setLoading(true);

  //     // 1. Primero cargar desde caché (AsyncStorage)
  //     const cachedFavorites = await AsyncStorage.getItem("Lfavoritos");
  //     if (cachedFavorites) {
  //       setFavorites(JSON.parse(cachedFavorites));
  //     }

  //     // 2. Luego actualizar desde API en segundo plano
  //     try {
  //       const response = await api.get(`/favoritos/${user.id}`);
  //       const apiFavorites = response.data.data || [];

  //       // Solo actualizar si hay cambios
  //       if (
  //         JSON.stringify(apiFavorites) !==
  //         JSON.stringify(JSON.parse(cachedFavorites || "[]"))
  //       ) {
  //         setFavorites(apiFavorites);
  //         await AsyncStorage.setItem(
  //           "Lfavoritos",
  //           JSON.stringify(apiFavorites)
  //         );
  //       }
  //     } catch (apiError) {
  //       console.error("Error al actualizar desde API:", apiError);
  //       // No hacemos nada, mantenemos los datos de caché
  //     }
  //   } catch (error) {
  //     console.error("Error cargando favoritos:", error);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  // const cargarFavoritos = async () => {
  //   if (!user?.id) return;

  //   try {
  //     setLoading(true);
  //     const cachedFavorites = await AsyncStorage.getItem("Lfavoritos");
  //     if (cachedFavorites) {
  //       setFavorites(JSON.parse(cachedFavorites));
  //     }

  //     const response = await api.get(`/favoritos/${user.id}`);
  //     const apiFavorites = response.data.data || [];

  //     if (
  //       JSON.stringify(apiFavorites) !== JSON.parse(cachedFavorites || "[]")
  //     ) {
  //       setFavorites(apiFavorites);
  //       await AsyncStorage.setItem("Lfavoritos", JSON.stringify(apiFavorites));
  //     }
  //   } catch (error) {
  //     console.error("Error cargando favoritos:", error);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };
  // const cargarFavoritos = async () => {
  //   if (!user?.id) return;

  //   try {
  //     setLoading(true);
  //     const response = await api.get(`/favoritos/${user.id}`);
  //     // console.log("Respuesta cruda de la API:", response.data);

  //     const apiFavorites = response.data.data || [];
  //     // console.log(apiFavorites);

  //     setFavorites(apiFavorites);
  //     await AsyncStorage.setItem("Lfavoritos", JSON.stringify(apiFavorites));
  //   } catch (error) {
  //     console.error("Error cargando favoritos:", error);
  //     const cachedFavorites = await AsyncStorage.getItem("Lfavoritos");
  //     if (cachedFavorites) {
  //       setFavorites(JSON.parse(cachedFavorites));
  //     }
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };
  // const cargarFavoritos = async () => {
  //   if (!user?.id) return;

  //   try {
  //     setLoading(true);
  //     // Usar el nuevo endpoint
  //     const response = await api.get(`/favoritos-detalles/${user.id}`);
  //     const favoriteProducts = response.data.data || [];
  //     // console.log(favoriteProducts)

  //     setFavorites(favoriteProducts); // Ahora contiene los productos completos
  //     await AsyncStorage.setItem(
  //       "Lfavoritos",
  //       JSON.stringify(favoriteProducts)
  //     );
  //   } catch (error) {
  //     console.error("Error cargando favoritos:", error);
  //     // Manejo de error...
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };
  const cargarFavoritos = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await api.get(`/favoritos-detalles/${user.id}`);
      const favoriteProducts = response.data.data || [];
      // console.log(favoriteProducts[0].attributes.producto)
      // Guardar solo los IDs de los productos favoritos para simplificar
      setFavorites(favoriteProducts);
      await AsyncStorage.setItem(
        "Lfavoritos",
        JSON.stringify(favoriteProducts)
      );
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      // Intentar cargar desde caché
      const cachedFavorites = await AsyncStorage.getItem("Lfavoritos");
      if (cachedFavorites) {
        setFavorites(JSON.parse(cachedFavorites));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para refrescar forzando actualización desde API
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await api.get(`/favoritos-detalles/${user.id}`);
      const apiFavorites = response.data.data || [];
      // console.log("Productos filtrados:", apiFavorites);
      setFavorites(apiFavorites);
      await AsyncStorage.setItem("Lfavoritos", JSON.stringify(apiFavorites));
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      // Mostrar toast de error
      showToast("No se pudo actualizar desde el servidor");
    } finally {
      setRefreshing(false);
    }
    // console.log("Formato de favorites:", favorites);
    // console.log(
    //   "Formato de products:",
    //   products.map((p) => p.id)
    // );
  };

  const irLogin = () => {
    logout();
    navigation.replace("Login");
  };

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("Lfavoritos", JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const isFavorite = (productId) => {
    if (!favorites || !Array.isArray(favorites)) return false;
    // console.log(productId)
    return favorites.some((fav) => fav.attributes.producto.id === productId);
  };

  const toggleFavorite = async (productId) => {
    if (!user?.id) {
      Alert.alert(
        "Acción requerida",
        "Debes iniciar sesión para guardar favoritos",
        [
          { text: "Iniciar sesión", onPress: () => irLogin() },
          { text: "Cancelar", style: "cancel" },
        ]
      );
      return;
    }

    try {
      const wasFavorite = isFavorite(productId);
      // Actualización optimista
      setFavorites((prev) =>
        wasFavorite
          ? prev.filter((fav) => fav.attributes.producto.id !== productId)
          : [
              ...prev,
              {
                attributes: {
                  producto: products.find((p) => p.id === productId),
                },
              },
            ]
      );
      let updatedFavorites;

      if (wasFavorite) {
        // console.log(favorites)
        updatedFavorites = favorites.filter(
          (fav) => fav.attributes.producto.id !== productId
        );
        await api.delete(`/favoritos/${user.id}/${productId}`);
      } else {
        return;
      }
      await AsyncStorage.setItem(
        "Lfavoritos",
        JSON.stringify(updatedFavorites)
      );

      await cargarFavoritos();

      showToast(
        wasFavorite ? "❌ Producto eliminado de favoritos" : "✅ Producto añadido a favoritos"
      );
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      showToast("❌ No se pudo actualizar favoritos");
    }
  };

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

  const handleQuantityChange = (productId, newQuantity) => {
    // console.log(newQuantity)
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id] || 1;
    // console.log(product)
    try {
      // Verificar stock
      const [productosRes, carritoRes] = await Promise.all([
        api.get("/productos"),
        api.get("/carrito"),
      ]);

      // Verificar stock directamente desde el producto favorito
      const stockDisponible = product?.cantidad || 0;
      // console.log(stockDisponible)
      // Verifcar cuantos elementos tiene el carrito del usuario
      const canCarrito = carritoRes.data.datos
        .filter(
          (item) =>
            item.attributes.nick === user?.nick &&
            item.attributes.producto === product.nombre
        )
        .reduce((sum, item) => sum + item.attributes.cantidad, 0);

      if (canCarrito >= stockDisponible) {
        showToast(`❌ Solo hay disponible ${stockDisponible} unidades`);
        // Alert.alert(
        //   "Error",
        //   `Solo hay disponible ${stockDisponible} unidades.`
        // );
        return;
      }

      await addToCart({
        ...product,
        cantidad: quantity,
      });

      showToast(`✅ ${quantity} ${product.nombre} agregado(s) al carrito`);
      // setToastVisible(true);
      // Alert.alert("✅ Añadido", "Producto agregado al carrito");
    } catch (error) {
      showToast(`❌ No se pudo añadir al carrito`);
      // setToastVisible(true);
      // Alert.alert("Error", "No se pudo añadir al carrito");
    }
  };

  // const favoriteProducts = products.filter((product) =>
  //   favorites.some((fav) => fav.id === product.id)
  // );
  // const favoriteProducts = useMemo(() => {
  //   return products.filter((product) =>
  //     favorites.some(
  //       (fav) => String(fav.producto_id || fav.id || fav) === String(product.id)
  //     )
  //   );
  // }, [products, favorites]);

  // useEffect(() => {
  //   console.log("Favoritos actuales:", favorites);
  //   console.log("Productos favoritos filtrados:", favoriteProducts);
  // }, [favorites, favoriteProducts]);

  // const favoriteProducts = useMemo(() => {
  //   return products.filter((product) => isFavorite(product.id));
  // }, [products, favorites]);

  // const favoriteProducts = useMemo(() => {
  //   return products.filter((product) => {
  //     const normalizedProductId = normalizeId(product.id);
  //     return favorites.some((fav) => {
  //       const favId = fav.producto_id || fav.id || fav;
  //       return normalizeId(favId) === normalizedProductId;
  //     });
  //   });
  // }, [products, favorites]);
  // const favoriteProducts = useMemo(() => {
  //   return products.filter((product) => {
  //     const productId = normalizeId(product.id);
  //     return favorites.some((fav) => {
  //       const favId = normalizeId(fav.producto_id || fav.id || fav);
  //       return favId === productId;
  //     });
  //   });
  // }, [products, favorites]);
  // const favoriteProducts = useMemo(() => {
  //   // console.log(
  //   //   "Todos los productos:",
  //   //   products.map((p) => ({ id: p.id, normalized: normalizeId(p.id) }))
  //   // );
  //   console.log(
  //     "Todos los favoritos:",
  //     favorites.map((f) => ({
  //       id: f.id,
  //       producto_id: f.attributes.producto_id,
  //       normalized: normalizeId(f.attributes.producto_id || f.id || f),
  //     }))
  //   );

  //   const result = products.filter((product) => {
  //     const productId = normalizeId(product.id);
  //     return favorites.some((fav) => {
  //       const favId = normalizeId(fav.attributes.producto_id || fav.id || fav);
  //       // console.log(`Comparando: Producto ${productId} con Favorito ${favId}`);
  //       return favId === productId;
  //     });
  //   });

  //   // console.log("Productos favoritos resultantes:", result);
  //   return result;
  // }, [products, favorites]);
  // const favoriteProducts = useMemo(() => {
  //   return products.filter((product) => {
  //     const productId = normalizeId(product.id);
  //     return favorites.some((fav) => {
  //       const favId =
  //         fav.attributes?.producto.id || fav.producto_id || fav.id || fav;
  //       return normalizeId(favId) === productId;
  //     });
  //   });
  // }, [products, favorites]);
  //   const favoriteProducts = useMemo(() => {
  //   console.log("Filtrando productos favoritos...");
  //   const result = products.filter((product) => {
  //     console.log(product)
  //     const productId = normalizeId(product.id);
  //     console.log(productId)
  //     const isFav = favorites.some((fav) => {
  //       const favId = normalizeId(fav.attributes?.producto_id || fav.producto_id);
  //       console.log(`Comparando: ${productId} con ${favId}`);
  //       // console.log(fav)
  //       return favId === productId;
  //     });
  //     console.log(`Producto ${product.id} es favorito?`, isFav);
  //     return isFav;
  //   });
  //   console.log("Productos favoritos resultantes:", result);
  //   return result;
  // }, [products, favorites]);

  const pagar = async (ite) => {
    // console.log(ite)
    // const [productosRes, carritoRes] = await Promise.all([
    //   api.get("/productos"),
    //   // api.get("/carrito"),
    // ]);
    // console.log(ite)
    // const stockDisponible =
    //   productosRes.data.datos.find((p) => p.id === ite.id)?.attributes
    //     ?.cantidad || 0;
    const stockDisponible = ite.cantidad;

    if (quantities[ite.id] > stockDisponible) {
      // Alert.alert("Error", `Solo hay disponible ${stockDisponible} unidades.`);
      showToast(`❌ Solo hay disponible ${stockDisponible} unidades`);
      return;
    }
    // let itemMod = useState({
    //   attributes: 
    //        { cantidad: 0,
    //          producto_id: 0
    //         }
    // })
    ite.cantidad = quantities[ite.id] || 1;
    // itemMod.attributes.cantidad = ite.cantidad;
    // itemMod.attributes.producto_id = ite.id;
    // console.log(itemMod)
    // ite.attributes.producto_id = ite.id;
    // ite.attributes.cantidad = quantities[ite.id] || 1;
    // ite.attributes.producto_id = ite.id;
    navigation.navigate("Checkout1", {
      total: ite?.precio * (quantities[ite.id] || 1),
      pagina: "S",
      cartItems: ite,
    });
  };

  const truncarDescripcion = (item) => {
    if (item) {
      const itemDecripcion =
        item.attributes?.producto.descripcion?.length > 30
          ? `${item.attributes?.producto.descripcion?.substring(0, 25)}...`
          : item.attributes?.producto.descripcion + "\n";
      return itemDecripcion;
    }
  };

  // const truncatedDescription = useMemo(
  //     () =>
  //       truncarDescripcion(item)
  //     [item]
  //   );

  const ProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() =>
        navigation.navigate("Detalles", {
          producto: item.attributes.producto,
          productoId: item?.attributes?.producto.nombre,
          precio: item?.attributes?.producto.precio,
          stock: item?.attributes?.producto.cantidad,
          imag: item?.attributes?.producto.imagen,
          descripcion: item?.attributes?.producto.descripcion,
          id: item?.attributes.producto.id,
          usuario: user,
          volumen: item?.attributes?.producto.volumen,
          sexo: item?.attributes?.producto.sexo,
          marca: item?.attributes?.producto.marca,
          categoria: item?.attributes?.producto.categoria,
        })
      }
    >
      <View style={styles.productCard}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item.attributes.producto.id);
          }}
        >
          {/* <AntDesign
            name={favorites.includes(item.id) ? "hearto" : "heart"}
            size={24}
            color={favorites.includes(item.id) ? "#1a3a8f" : "#FF0000"}
          /> */}
          <AntDesign
            name={isFavorite(item.attributes.producto.id) ? "heart" : "hearto"}
            size={24}
            color={
              isFavorite(item.attributes.producto.id) ? "#FF0000" : "#1a3a8f"
            }
          />
        </TouchableOpacity>

        <Image
          source={{
            uri: item?.attributes?.producto?.imagen
              ? `http://${dirImg}${item.attributes.producto.imagen.split("/").pop()}`
              : `http://${dirImg}uploads/iconoI.png`,
          }}
          style={styles.gridImage}
          cachePolicy="memory-disk"
        />

        <View style={styles.productInfo}>
          {/* <Text style={styles.productName} numberOfLines={1}>
            {item?.id || "Nombre no disponible"}
          </Text> */}
          <Text style={styles.productName} numberOfLines={1}>
            {item?.attributes?.producto.nombre || "Nombre no disponible"}
          </Text>
          <Text style={styles.descriptionP} numberOfLines={2}>
            {truncarDescripcion(item)} ({item.attributes.producto.volumen})
          </Text>
          <Text style={styles.productPrice}>
            ${item?.attributes?.producto.precio}
          </Text>

          {item?.attributes?.producto.cantidad === 0 ? (
            <Text style={styles.soldOut}>AGOTADO</Text>
          ) : (
            <>
              <QuantitySelector
                initialQuantity={quantities[item.attributes.producto.id] || 1}
                handleQuantityChange={(qty) =>
                  handleQuantityChange(item.attributes.producto.id, qty)
                }
                maxQuantity={item?.attributes?.producto.cantidad}
                compact={true}
              />

              <View style={styles.productActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAddToCart(item.attributes.producto)}
                >
                  <Ionicons name="cart-outline" size={18} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buyNowButton]}
                  onPress={() => pagar(item.attributes.producto)}
                >
                  <Text style={styles.buyNowText}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <Text style={styles.title}>Favoritos</Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => <ProductItem item={item} />}
        numColumns={2}
        keyExtractor={(item) => `fav-${item.id}`}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="favorite-border" size={60} color="#FFF" />
            <Text style={styles.emptyText}>No tienes favoritos aún</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6000"]}
            tintColor="#FFF"
          />
        }
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#FFF" /> : null
        }
      />
      <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
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
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    paddingTop: 0,
  },
  gridItem: {
    width: itemWidth,
    marginBottom: 10,
  },
  productCard: {
    // backgroundColor: "rgba(255,255,255,0.9)",
    // borderRadius: 8,
    // overflow: "hidden",
    // elevation: 3,
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 340,
  },
  gridImage: {
    width: "100%",
    height: itemWidth - 20,
  },
  //  productInfo: {
  //     padding: 12,
  //     flex: 1,
  //     justifyContent: "space-between",
  //   },
  productInfo: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
    minHeight: 150, // Añade una altura mínima fija
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    // marginBottom: 6,
    height: 25,
    top: 1,
  },
  descriptionP: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 2,
    height: 36,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a3a8f",
    marginBottom: 8,
  },
  // soldOut: {
  //   color: "#FF0000",
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   paddingVertical: 5,
  // },
  soldOut: {
    color: "#FF0000",
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 14,
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: "#1a3a8f",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buyNowButton: {
    backgroundColor: "#FF6B00",
    flex: 1,
    marginLeft: 5,
  },
  buyNowText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 18,
    marginTop: 10,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
});

export default FavoritosScreen;
