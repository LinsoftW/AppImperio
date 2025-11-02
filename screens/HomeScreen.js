// // // // Version PROOO
// // // import React, {
// // //   useEffect,
// // //   useState,
// // //   useRef,
// // //   useCallback,
// // //   useMemo,
// // // } from "react";
// // // import {
// // //   RefreshControl,
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   // FlatList,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Modal,
// // //   Alert,
// // //   ActivityIndicator,
// // //   Linking,
// // //   Dimensions,
// // //   AppState,
// // //   Animated,
// // //   Platform,
// // // } from "react-native";
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { LinearGradient } from "expo-linear-gradient";
// // // import { useIsFocused } from "@react-navigation/native";
// // // import { useUser } from "./UserContext";
// // // import { useCart } from "./CartContext";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import Constants from "expo-constants";
// // // import { Image } from "expo-image";
// // // import { FlashList } from "@shopify/flash-list";
// // // import {
// // //   MaterialIcons,
// // //   Ionicons,
// // //   FontAwesome,
// // //   AntDesign,
// // // } from "@expo/vector-icons";
// // // import api from "../api/api";
// // // import QuantitySelector from "./QuantitySelector";

// // // const { width } = Dimensions.get("window");
// // // const itemWidth = (width - 40) / 2;

// // // // Definir las constantes de caché
// // // const CACHE_KEYS = {
// // //   PRODUCTS: "Lproductos",
// // //   FEATURED: "Ldestacados",
// // //   CATEGORIES: "Lcategorias",
// // //   FAVORITES: "Lfavoritos",
// // //   TARJETAS: "Ltarjetas",
// // //   CONTACTS: "Lcontacts",
// // //   LAST_UPDATED: "lastUpdated",
// // //   CART: "LcartData",
// // //   USER: "LuserData",
// // // };

// // // const CACHE_VALIDITY = {
// // //   PRIMARY: 5 * 60 * 1000,
// // //   SECONDARY: 10 * 60 * 1000,
// // // };

// // // // ======= NUEVA PALETA CLARA =======
// // // const PALETTE = {
// // //   // Gradientes
// // //   gradientStart: '#f2f6ff',   // azul muy tenue
// // //   gradientEnd:   '#ffffff',   // blanco puro

// // //   // Botones / acentos
// // //   primary:       '#0e4d92',   // azul petróleo (mismo contraste)
// // //   primaryLight:  '#1a6bcb',
// // //   secondary:     '#ff6b00',   // naranja característico
// // //   secondaryLight:'#ff8533',

// // //   // Textos sobre fondo claro
// // //   textPrimary:   '#1a1a1a',
// // //   textSecondary: '#555',
// // //   textInverse:   '#fff',      // para botones oscuros
// // // };

// // // const filterProducts = (products, query, category) => {
// // //   if (!Array.isArray(products)) return []; // Asegurar que products sea un array

// // //   return products.filter((product) => {
// // //     // Validación más robusta del producto
// // //     if (!product?.id || !product?.attributes) return false;

// // //     // Verificar si el producto está activo (si tienes ese campo)
// // //     if (product.attributes?.activo === false) return false;

// // //     // Verificar stock (si quieres ocultar productos sin stock)
// // //     if (product.attributes?.cantidad <= 0) return false;

// // //     const matchesSearch =
// // //       query.trim() === "" ||
// // //       (product.attributes.nombre || "")
// // //         .toLowerCase()
// // //         .includes(query.toLowerCase());

// // //     const matchesCategory =
// // //       category === "Todas" ||
// // //       !category ||
// // //       product.attributes.categoria === category;

// // //     return matchesSearch && matchesCategory;
// // //   });
// // // };

// // // // Componente memoizado para ProductItem
// // // const ProductItem = React.memo(
// // //   ({
// // //     item,
// // //     isFavorite,
// // //     favoriteLoading,
// // //     quantity,
// // //     onPress,
// // //     handleAddToCart,
// // //     toggleFavorite,
// // //     handleQuantityChange,
// // //     ComprarAhora,
// // //   }) => {
// // //     const dirImg = Constants.expoConfig.extra.dirImg;

// // //     const itemImageUrl = useMemo(
// // //       () =>
// // //         item?.attributes?.imagen
// // //           ? `http://${dirImg}${item.attributes.imagen.split("/").pop()}`
// // //           : `http://${dirImg}uploads/iconoI.png`,
// // //       [item, dirImg]
// // //     );

// // //     const precio = useMemo(
// // //       () =>
// // //         item?.attributes?.precio
// // //           ? `$ ${Number(item?.attributes?.precio).toFixed(2)}`
// // //           : "Precio no disponible",
// // //       [item]
// // //     );

// // //     const truncatedDescription = useMemo(
// // //       () =>
// // //         item.attributes?.descripcion?.length > 30
// // //           ? `${item.attributes?.descripcion?.substring(0, 25)}...`
// // //           : item.attributes?.descripcion + "\n",
// // //       [item]
// // //     );

// // //     return (
// // //       <TouchableOpacity style={styles.gridItem} onPress={() => onPress(item)}>
// // //         <View style={styles.productCard}>
// // //           <TouchableOpacity
// // //             style={styles.favoriteButton}
// // //             onPress={(e) => {
// // //               e.stopPropagation();
// // //               toggleFavorite(item.id);
// // //             }}
// // //             disabled={favoriteLoading}
// // //           >
// // //             {favoriteLoading === item.id ? (
// // //               <ActivityIndicator size="small" color="#FF0000" />
// // //             ) : (
// // //               <Ionicons
// // //                 name={isFavorite(item.id) ? "heart" : "heart-outline"}
// // //                 size={20}
// // //                 color={isFavorite(item.id) ? "#FF0000" : "#1a3a8f"}
// // //                />
// // //               // <AntDesign
// // //               //   name={isFavorite(item.id) ? "heart" : "hearto"}
// // //               //   size={20}
// // //               //   color={isFavorite(item.id) ? "#FF0000" : "#1a3a8f"}
// // //               // />
// // //             )}
// // //           </TouchableOpacity>

// // //           <Image
// // //             key={`image-${itemImageUrl}`}
// // //             source={{ uri: itemImageUrl }}
// // //             style={styles.gridImage}
// // //             placeholder={require("../assets/sindatos.png")}
// // //             cachePolicy="memory-disk"
// // //             transition={200}
// // //             contentFit="cover"
// // //             recyclingKey={`product-${item.id}`}
// // //           />

// // //           <View style={styles.productInfo}>
// // //             <Text style={styles.productName} numberOfLines={1}>
// // //               {item?.attributes?.nombre || "Nombre no disponible"}
// // //             </Text>
// // //             <Text style={styles.descriptionP} numberOfLines={2}>
// // //               {truncatedDescription} ({item.attributes?.volumen})
// // //             </Text>
// // //             <Text style={styles.productPrice}>{precio}</Text>

// // //             {item?.attributes?.cantidad === 0 ? (
// // //               <Text style={styles.soldOut}>AGOTADO</Text>
// // //             ) : (
// // //               <>
// // //                 <QuantitySelector
// // //                   initialQuantity={quantity}
// // //                   handleQuantityChange={(newQty) =>
// // //                     handleQuantityChange(item.id, newQty)
// // //                   }
// // //                   maxQuantity={item?.attributes?.cantidad}
// // //                   compact={true}
// // //                 />
// // //                 <View style={styles.productActions}>
// // //                   <TouchableOpacity
// // //                     style={styles.actionButton}
// // //                     onPress={() => handleAddToCart(item, quantity)}
// // //                   >
// // //                     <Ionicons name="cart-outline" size={18} color="#FFF" />
// // //                   </TouchableOpacity>
// // //                   <TouchableOpacity
// // //                     style={[styles.actionButton, styles.buyNowButton]}
// // //                     onPress={() =>
// // //                       ComprarAhora(item, quantity, item?.attributes?.precio)
// // //                     }
// // //                   >
// // //                     <Text style={styles.buyNowText}>Comprar</Text>
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   },
// // //   (prevProps, nextProps) =>
// // //     prevProps.item.id === nextProps.item.id &&
// // //     prevProps.isFavorite === nextProps.isFavorite &&
// // //     prevProps.quantity === nextProps.quantity &&
// // //     prevProps.favoriteLoading === nextProps.favoriteLoading
// // // );

// // // // Componente memoizado para FeaturedItem
// // // const FeaturedItem = React.memo(
// // //   ({ item, onPress }) => {
// // //     const dirImg = Constants.expoConfig.extra.dirImg;

// // //     const imageUri = useMemo(
// // //       () =>
// // //         item?.attributes?.imagen
// // //           ? `http://${dirImg}${item.attributes.imagen.split("/").pop()}`
// // //           : `http://${dirImg}uploads/iconoI.png`,
// // //       [item, dirImg]
// // //     );

// // //     const precio = useMemo(
// // //       () =>
// // //         item?.attributes?.precio
// // //           ? `$${Number(item?.attributes?.precio).toFixed(2)}`
// // //           : "Precio no disponible",
// // //       [item]
// // //     );

// // //     const truncatedDescription = useMemo(
// // //       () =>
// // //         item.attributes?.descripcion?.length > 50
// // //           ? `${item.attributes?.descripcion?.substring(0, 50)}...`
// // //           : item.attributes?.descripcion + "\n",
// // //       [item]
// // //     );

// // //     return (
// // //       <TouchableOpacity
// // //         style={styles.featuredItem}
// // //         onPress={() => onPress(item)}
// // //       >
// // //         <Image
// // //           source={{ uri: imageUri }}
// // //           style={styles.featuredImage}
// // //           cachePolicy="memory-disk"
// // //           transition={200}
// // //           contentFit="cover"
// // //           recyclingKey={`featured-${item.id}`}
// // //         />
// // //         <View style={styles.featuredInfo}>
// // //           <Text style={styles.featuredName}>{item?.attributes?.nombre}</Text>
// // //           <Text style={styles.description}>
// // //             {truncatedDescription} ({item?.attributes?.volumen})
// // //           </Text>
// // //           <Text style={styles.featuredPrice}>{precio}</Text>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   },
// // //   (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
// // // );

// // // const HomeScreen = ({ navigation, route }) => {
// // //   const { mensajero } = route.params || {};
// // //   const [appData, setAppData] = useState({
// // //     productos: [],
// // //     destacados: [],
// // //     categorias: [],
// // //     favoritos: [],
// // //     tarjetas: [],
// // //     contacts: [],
// // //     filteredProductos: [],
// // //     cartItems: [],
// // //     userDetails: null,
// // //   });

// // //   const locationIntervalRef = useRef(null);

// // //   useEffect(() => {
// // //     return () => {
// // //       setQuantities({});
// // //     };
// // //   }, []);

// // //   // Compartir ubicacion cada 30 segundos
// // //   //   useEffect(() => {
// // //   //   const interval = setInterval(async () => {
// // //   //     try {
// // //   //       const response = await fetch("https://ipapi.co/json/");
// // //   //       const data = await response.json();
// // //   //       // console.log("TT "+ telefono)
// // //   //       const response1 = await api.post('/repartidor/ubicacion', { latitud: data.latitude, longitud: data.longitude, telefono: user?.telefono });
// // //   //       console.log("Actualizoo")
// // //   //     }catch{
// // //   //       console.log("Error")
// // //   //     }
// // //   //   }, 30000);

// // //   //   return () => clearInterval(interval);
// // //   // }, [user?.esmensajero]);
// // //   useEffect(() => {
// // //     // console.log(user?.esmensajero)
// // //     if (user?.esmensajero) {
// // //       const updateLocation = async () => {
// // //         try {
// // //           const response = await fetch("https://ipapi.co/json/");
// // //           const data = await response.json();
// // //           const response1 = await api.post("/repartidor/ubicacion", {
// // //             latitud: data.latitude,
// // //             longitud: data.longitude,
// // //             telefono: user?.telefono,
// // //           });
// // //           // console.log("Ubicación actualizada");
// // //         } catch (error) {
// // //           console.log("Error al actualizar ubicación", error);
// // //         }
// // //       };

// // //       // Ejecutar inmediatamente y luego cada 30 segundos
// // //       updateLocation();
// // //       locationIntervalRef.current = setInterval(updateLocation, 30000);

// // //       // Limpiar el intervalo cuando el componente se desmonte o el usuario deje de ser repartidor
// // //       return () => {
// // //         if (locationIntervalRef.current) {
// // //           clearInterval(locationIntervalRef.current);
// // //           locationIntervalRef.current = null;
// // //         }
// // //       };
// // //     }
// // //   }, [user?.esmensajero, user?.telefono]);

// // //   const [uiState, setUiState] = useState({
// // //     loading: true,
// // //     refreshing: false,
// // //     selectedCategory: null,
// // //     showCategories: false,
// // //     currentIndex: 0,
// // //     searchQuery: "",
// // //     showContactModal: false,
// // //     page: 1,
// // //     hasMore: true,
// // //     totalProducts: 0,
// // //     backgroundLoading: false,
// // //   });

// // //   const [favoriteLoading, setFavoriteLoading] = useState(null);
// // //   const toastOpacity = useRef(new Animated.Value(0)).current;

// // //   const [toastVisible, setToastVisible] = useState(false);
// // //   const [toastMessage, setToastMessage] = useState("");

// // //   const currentIndexRef = useRef(0);
// // //   const [quantities, setQuantities] = useState({});
// // //   // const { dirImg, imperioAppId } = Constants.expoConfig.extra;
// // //   const { user, logout, setUser } = useUser();
// // //   const { addToCart, loadCart, cartItems } = useCart();
// // //   const isFocused = useIsFocused();
// // //   const featuredListRef = useRef(null);
// // //   const dataVersionRef = useRef(0);
// // //   const appState = useRef(AppState.currentState);

// // //   // Función para cargar desde caché
// // //   const loadFromCache = useCallback(async () => {
// // //     try {
// // //       const [
// // //         productos,
// // //         destacados,
// // //         categorias,
// // //         favoritos,
// // //         tarjetas,
// // //         contacts,
// // //         cartData,
// // //         userData,
// // //       ] = await Promise.all([
// // //         AsyncStorage.getItem(CACHE_KEYS.PRODUCTS),
// // //         AsyncStorage.getItem(CACHE_KEYS.FEATURED),
// // //         AsyncStorage.getItem(CACHE_KEYS.CATEGORIES),
// // //         AsyncStorage.getItem(CACHE_KEYS.FAVORITES),
// // //         AsyncStorage.getItem(CACHE_KEYS.TARJETAS),
// // //         AsyncStorage.getItem(CACHE_KEYS.CONTACTS),
// // //         AsyncStorage.getItem(CACHE_KEYS.CART),
// // //         AsyncStorage.getItem(CACHE_KEYS.USER),
// // //       ]);

// // //       // Validar que los datos sean correctos
// // //       const validateData = (data) => {
// // //         if (!data) return false;
// // //         const parsed = JSON.parse(data);
// // //         return Array.isArray(parsed) && parsed.length > 0;
// // //       };

// // //       return {
// // //         productos: validateData(productos) ? JSON.parse(productos) : [],
// // //         destacados: validateData(destacados) ? JSON.parse(destacados) : [],
// // //         categorias: validateData(categorias) ? JSON.parse(categorias) : [],
// // //         favoritos: validateData(favoritos) ? JSON.parse(favoritos) : [],
// // //         tarjetas: validateData(tarjetas) ? JSON.parse(tarjetas) : [],
// // //         contacts: validateData(contacts) ? JSON.parse(contacts) : [],
// // //         cartItems: validateData(cartData) ? JSON.parse(cartData) : [],
// // //         userDetails: validateData(userData) ? JSON.parse(userData) : null,
// // //       };
// // //     } catch (error) {
// // //       console.error("Cache load error:", error);
// // //       return null;
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     if (appData.filteredProductos.length > 0) {
// // //       setQuantities((prevQuantities) => {
// // //         const newQuantities = { ...prevQuantities };
// // //         appData.filteredProductos.forEach((product) => {
// // //           if (newQuantities[product.id] === undefined) {
// // //             newQuantities[product.id] = 1; // Inicializa solo si no existe
// // //           }
// // //         });
// // //         return newQuantities;
// // //       });
// // //     }
// // //   }, [appData.filteredProductos]);

// // //   // Función para guardar en caché
// // //   const saveToCache = useCallback(async (data) => {
// // //     try {
// // //       const saveOperations = [
// // //         AsyncStorage.setItem(
// // //           CACHE_KEYS.PRODUCTS,
// // //           JSON.stringify(data.productos)
// // //         ),
// // //         AsyncStorage.setItem(
// // //           CACHE_KEYS.FEATURED,
// // //           JSON.stringify(data.destacados)
// // //         ),
// // //         AsyncStorage.setItem(
// // //           CACHE_KEYS.CATEGORIES,
// // //           JSON.stringify(data.categorias)
// // //         ),
// // //         AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATED, Date.now().toString()),
// // //       ];

// // //       if (data.favoritos) {
// // //         saveOperations.push(
// // //           AsyncStorage.setItem(
// // //             CACHE_KEYS.FAVORITES,
// // //             JSON.stringify(data.favoritos)
// // //           )
// // //         );
// // //       }
// // //       if (data.tarjetas) {
// // //         saveOperations.push(
// // //           AsyncStorage.setItem(
// // //             CACHE_KEYS.TARJETAS,
// // //             JSON.stringify(data.tarjetas)
// // //           )
// // //         );
// // //       }
// // //       if (data.contacts) {
// // //         saveOperations.push(
// // //           AsyncStorage.setItem(
// // //             CACHE_KEYS.CONTACTS,
// // //             JSON.stringify(data.contacts)
// // //           )
// // //         );
// // //       }

// // //       await Promise.all(saveOperations);
// // //     } catch (error) {
// // //       console.error("Error saving to cache:", error);
// // //     }
// // //   }, []);

// // //   // Función para inicializar datos
// // //   const initializeData = useCallback(async () => {
// // //     try {
// // //       setUiState((prev) => ({ ...prev, loading: true }));

// // //       // Limpiar completamente los datos antes de cargar nuevos
// // //       setAppData({
// // //         productos: [],
// // //         destacados: [],
// // //         categorias: [],
// // //         favoritos: [],
// // //         tarjetas: [],
// // //         contacts: [],
// // //         filteredProductos: [],
// // //         cartItems: [],
// // //         userDetails: null,
// // //       });
// // //       setQuantities({});

// // //       const cachedData = await loadFromCache();
// // //       const lastUpdated = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATED);
// // //       const isCacheValid =
// // //         lastUpdated &&
// // //         Date.now() - parseInt(lastUpdated) < CACHE_VALIDITY.PRIMARY;

// // //       if (cachedData && isCacheValid) {
// // //         setAppData({
// // //           ...cachedData,
// // //           filteredProductos: filterProducts(
// // //             cachedData.productos,
// // //             uiState.searchQuery,
// // //             uiState.selectedCategory
// // //           ),
// // //         });

// // //         setTimeout(() => {
// // //           loadBackgroundData().catch((e) =>
// // //             console.error("Background load failed:", e)
// // //           );
// // //         }, 2000);
// // //       } else {
// // //         await fetchData();
// // //       }

// // //       try {
// // //         const cachedCart = await AsyncStorage.getItem(CACHE_KEYS.CART);
// // //         if (cachedCart) {
// // //           setAppData((prev) => ({
// // //             ...prev,
// // //             cartItems: JSON.parse(cachedCart),
// // //           }));
// // //         }
// // //       } catch (cacheError) {
// // //         console.error("Error loading cart from cache:", cacheError);
// // //       }
// // //     } catch (error) {
// // //       console.error("Initialization error:", error);
// // //     } finally {
// // //       setUiState((prev) => ({ ...prev, loading: false }));
// // //     }
// // //   }, [loadFromCache, uiState.searchQuery, uiState.selectedCategory]);

// // //   useEffect(() => {
// // //     initializeData();
// // //     // Cargar datos en segundo plano después de un breve retraso
// // //     const bgLoadTimer = setTimeout(() => {
// // //       loadBackgroundData();
// // //     }, 2000); // Esperar 2 segundos antes de cargar datos en segundo plano

// // //     return () => clearTimeout(bgLoadTimer);
// // //   }, []);
// // //   // isFocused

// // //   // Función para mostrar el toast con animación
// // //   const showToast = (message) => {
// // //     setToastMessage(message);
// // //     Animated.sequence([
// // //       Animated.timing(toastOpacity, {
// // //         toValue: 1,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }),
// // //       Animated.delay(2000),
// // //       Animated.timing(toastOpacity, {
// // //         toValue: 0,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }),
// // //     ]).start(() => {
// // //       setToastMessage("");
// // //     });
// // //   };

// // //   useEffect(() => {
// // //     const loadEssentialData = async () => {
// // //       try {
// // //         // 1. Cargar favoritos (si hay usuario)
// // //         if (user?.id) {
// // //           // Primero intenta cargar desde AsyncStorage
// // //           const cachedFavorites = await AsyncStorage.getItem("Lfavoritos");
// // //           if (cachedFavorites) {
// // //             setAppData((prev) => ({
// // //               ...prev,
// // //               favoritos: JSON.parse(cachedFavorites),
// // //             }));
// // //           } else {
// // //             const favoritosResponse = await api.get(
// // //               `/favoritos-detalles/${user.id}`
// // //             );

// // //             const newFavorites = favoritosResponse.data.data || [];
// // //             setAppData((prev) => ({ ...prev, favoritos: newFavorites }));
// // //             await AsyncStorage.setItem(
// // //               CACHE_KEYS.FAVORITES,
// // //               JSON.stringify(newFavorites)
// // //             );
// // //           }

// // //           // 2. Actualizar carrito
// // //           await loadCart();
// // //         }
// // //       } catch (error) {
// // //         console.error("Error updating essential data:", error);
// // //       }
// // //     };

// // //     loadEssentialData();
// // //     // }
// // //   }, [isFocused, user?.id]);

// // //   // Resto de las funciones (fetchData, loadBackgroundData, etc.)...
// // //   const fetchData = async () => {
// // //     try {
// // //       const isRefreshing = uiState.page === 1;

// // //       // Limpiar productos si es un refresh
// // //       if (isRefreshing) {
// // //         setAppData((prev) => ({
// // //           ...prev,
// // //           productos: [],
// // //           destacados: [],
// // //           categorias: [],
// // //           favoritos: [],
// // //           tarjetas: [],
// // //           contacts: [],
// // //           filteredProductos: [],
// // //         }));
// // //       }

// // //       // Obtener datos en paralelo
// // //       const [
// // //         productosRes,
// // //         categoriasRes,
// // //         contactsRes,
// // //         tarjetasRes,
// // //         favoritosRes,
// // //       ] = await Promise.all([
// // //         api.get(`/productos?page=${uiState.page}&limit=20`),
// // //         api.get("/categorias"),
// // //         api.get("/contactos"),
// // //         api.get("/tarjetas"),
// // //         user?.id
// // //           ? api.get(`/favoritos-detalles/${user.id}`)
// // //           : Promise.resolve({ data: { data: [] } }),
// // //         // api.get(`/favoritos-detalles/${user.id}`),
// // //       ]);

// // //       const newProducts = productosRes.data.datos || [];

// // //       // Evitar duplicados
// // //       const mergedProducts = isRefreshing
// // //         ? newProducts
// // //         : [
// // //             ...appData.productos,
// // //             ...newProducts.filter(
// // //               (newItem) =>
// // //                 !appData.productos.some((item) => item.id === newItem.id)
// // //             ),
// // //           ];

// // //       const newData = {
// // //         productos: mergedProducts,
// // //         destacados:
// // //           productosRes.data.datos?.filter(
// // //             (p) =>
// // //               p?.attributes?.destacado === 1 &&
// // //               p?.attributes?.precio !== undefined
// // //           ) || [],
// // //         categorias: categoriasRes.data.datos || [],
// // //         contacts: contactsRes.data.datos || [],
// // //         favoritos: favoritosRes.data.data || [],
// // //         tarjetas: tarjetasRes.data.data || [],
// // //       };

// // //       // Comienza
// // //       if (newData.productos.length > 0) {
// // //         setAppData((prev) => ({
// // //           ...prev,
// // //           ...newData,
// // //           filteredProductos: filterProducts(
// // //             mergedProducts,
// // //             uiState.searchQuery,
// // //             uiState.selectedCategory
// // //           ),
// // //         }));

// // //         setUiState((prev) => ({
// // //           ...prev,
// // //           totalProducts: productosRes.data.pagination?.total || 0,
// // //           hasMore: prev.page < (productosRes.data.pagination?.totalPages || 1),
// // //         }));
// // //       }
// // //       // Termina

// // //       // Guardar en caché solo si es refresh
// // //       if (isRefreshing) {
// // //         await saveToCache(newData);
// // //       }
// // //     } catch (error) {
// // //       console.error("API fetch error:", error);
// // //     }
// // //   };

// // //   const handleAddToCart = async (
// // //     product,
// // //     quantity = quantities[product.id] || 1
// // //   ) => {
// // //     try {
// // //       const qty = quantity;

// // //       let userId = user?.id;

// // //       if (!userId) {
// // //         const anonUser = await AsyncStorage.getItem("anonUser");
// // //         if (anonUser) {
// // //           userId = JSON.parse(anonUser).id;
// // //         }
// // //       }

// // //       if (!userId) {
// // //         Alert.alert(
// // //           "Acción requerida",
// // //           "¿Deseas continuar como invitado o iniciar sesión?",
// // //           [
// // //             { text: "Invitado", onPress: () => registerAnonymous() },
// // //             {
// // //               text: "Iniciar sesión",
// // //               onPress: () => navigation.navigate("Login"),
// // //             },
// // //           ]
// // //         );
// // //         return;
// // //       }

// // //       // Verificar stock - Opción 1: Usar los productos ya cargados
// // //       const productInList = appData.productos.find((p) => p.id === product.id);
// // //       const stockDisponible = productInList?.attributes?.cantidad || 0;

// // //       // Obtener items del carrito
// // //       const carritoRes = await api.get("/carrito");

// // //       const canCarrito = carritoRes.data.datos
// // //         .filter(
// // //           (item) =>
// // //             item.attributes.nick === user?.nick &&
// // //             item.attributes.producto === product.attributes.nombre
// // //         )
// // //         .reduce((sum, item) => sum + item.attributes.cantidad, 0);

// // //       if (canCarrito + qty > stockDisponible) {
// // //         // console.log(productosRes.data.datos);
// // //         showToast(`❌ Solo hay disponible ${stockDisponible} unidades.`);
// // //         return;
// // //       }

// // //       await addToCart({ ...product, cantidad: qty });
// // //       // Mostrar notificación toast
// // //       showToast(
// // //         `✅ ${qty} ${product.attributes.nombre} agregado(s) al carrito`
// // //       );
// // //       setQuantities((prev) => ({ ...prev, [product.id]: 1 })); // Resetear a 1 después de agregar

// // //       if (user?.esAnonimo) {
// // //         Alert.alert(
// // //           "Cuenta temporal",
// // //           "Para finalizar tu compra necesitas registrar una cuenta completa",
// // //           [
// // //             {
// // //               text: "Registrarme",
// // //               onPress: () => navigation.replace("Registro"),
// // //             },
// // //             {
// // //               text: "Iniciar sesión",
// // //               onPress: () => navigation.replace("Login"),
// // //             },
// // //           ]
// // //         );
// // //       }
// // //     } catch (error) {
// // //       console.error("Error adding to cart:", error);
// // //       // Alert.alert("Error", "No se pudo añadir al carrito");
// // //       showToast("❌ No se pudo añadir al carrito");
// // //       // setToastVisible(true);
// // //     }
// // //   };

// // //   // Función de filtrado optimizada
// // //   const updateFilteredProducts = useCallback(() => {
// // //     setAppData((prev) => {
// // //       const newFiltered = filterProducts(
// // //         prev.productos,
// // //         uiState.searchQuery,
// // //         uiState.selectedCategory
// // //       );

// // //       if (
// // //         JSON.stringify(prev.filteredProductos) === JSON.stringify(newFiltered)
// // //       ) {
// // //         return prev;
// // //       }
// // //       return { ...prev, filteredProductos: newFiltered };
// // //     });
// // //   }, [uiState.searchQuery, uiState.selectedCategory]);

// // //   useEffect(() => {
// // //     updateFilteredProducts();
// // //   }, [
// // //     uiState.searchQuery,
// // //     uiState.selectedCategory,
// // //     appData.productos,
// // //     updateFilteredProducts,
// // //   ]);

// // //   // Auto-scroll para productos destacados (versión optimizada)
// // //   useEffect(() => {
// // //     const destacados = appData.destacados.filter(
// // //       (p) => p?.attributes?.destacado === 1
// // //     );

// // //     if (destacados.length > 1) {
// // //       const interval = setInterval(() => {
// // //         const nextIndex = (currentIndexRef.current + 1) % destacados.length;
// // //         // setCurrentIndex(nextIndex);
// // //         currentIndexRef.current = nextIndex;

// // //         if (
// // //           featuredListRef.current &&
// // //           nextIndex >= 0 &&
// // //           nextIndex < destacados.length
// // //         ) {
// // //           try {
// // //             featuredListRef.current.scrollToIndex({
// // //               index: nextIndex,
// // //               animated: true,
// // //             });
// // //           } catch (error) {
// // //             console.log("Error en scrollToIndex:", error);
// // //             clearInterval(interval);
// // //           }
// // //         }
// // //       }, 3000);

// // //       return () => clearInterval(interval);
// // //     }
// // //   }, [appData.destacados]);

// // //   const handleQuantityChange = useCallback((productId, newQuantity) => {
// // //     setQuantities((prev) => ({
// // //       ...prev,
// // //       [productId]: Math.max(
// // //         1,
// // //         Math.min(newQuantity, prev[productId]?.max || 100)
// // //       ), // Límites: 1 ≤ qty ≤ max
// // //     }));
// // //   }, []);

// // //   const irRegistro = () => {
// // //     if (locationIntervalRef.current) {
// // //       clearInterval(locationIntervalRef.current);
// // //       locationIntervalRef.current = null;
// // //     }
// // //     logout();
// // //     navigation.replace("Registro");
// // //   };

// // //   const irLogin = () => {
// // //     if (locationIntervalRef.current) {
// // //       clearInterval(locationIntervalRef.current);
// // //       locationIntervalRef.current = null;
// // //     }
// // //     logout();
// // //     navigation.replace("Login");
// // //   };

// // //   const onRefresh = useCallback(async () => {
// // //     try {
// // //       // Incrementar la versión de datos para forzar recreación
// // //       dataVersionRef.current += 1;
// // //       // Limpiar cantidades
// // //       setQuantities({});
// // //       // Limpiar cache completamente
// // //       // await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
// // //       // 2. Obtener todas las claves de AsyncStorage
// // //       const allKeys = await AsyncStorage.getAllKeys();

// // //       // 3. Filtrar y eliminar solo las claves de la aplicación (evitamos eliminar configuraciones del sistema)
// // //       const appKeys = allKeys.filter(
// // //         (key) =>
// // //           key.startsWith("L") || // Nuestras claves de caché
// // //           // key === "userData" ||
// // //           // key === "anonUser" ||
// // //           // key === "cartItems" ||
// // //           key === "lastUpdated"
// // //       );

// // //       // 4. Eliminar todas las claves de la aplicación
// // //       if (appKeys.length > 0) {
// // //         await AsyncStorage.multiRemove(appKeys);
// // //       }
// // //       setUiState((prev) => ({ ...prev, refreshing: true, page: 1 }));
// // //       setAppData((prev) => ({
// // //         ...prev,
// // //         productos: [],
// // //         destacados: [],
// // //         categorias: [],
// // //         favoritos: [],
// // //         tarjetas: [],
// // //         contacts: [],
// // //         filteredProductos: [],
// // //       }));
// // //       // dataVersionRef.current += 1; // Incrementar versión de datos
// // //       // await fetchData();
// // //       await initializeData();
// // //     } catch (error) {
// // //       console.error("Refresh error:", error);
// // //     } finally {
// // //       setUiState((prev) => ({ ...prev, refreshing: false }));
// // //     }
// // //   }, []);

// // //   const handleLoadMore = useCallback(() => {
// // //     if (!uiState.loading && uiState.hasMore && !uiState.refreshing) {
// // //       setUiState((prev) => ({ ...prev, page: prev.page + 1 }));
// // //     }
// // //   }, [uiState.loading, uiState.hasMore, uiState.refreshing]);

// // //   useEffect(() => {
// // //     if (uiState.page > 1) {
// // //       fetchData();
// // //     }
// // //   }, [uiState.page]);

// // //   const loadBackgroundData = async () => {
// // //     if (uiState.backgroundLoading) return;

// // //     setUiState((prev) => ({ ...prev, backgroundLoading: true }));

// // //     try {
// // //       // 1. Cargar carrito - Con múltiples niveles de fallback
// // //       try {
// // //         await loadCart();
// // //         if (cartItems.length > 0) {
// // //           await AsyncStorage.setItem(
// // //             CACHE_KEYS.CART,
// // //             JSON.stringify(cartItems)
// // //           );
// // //           setAppData((prev) => ({ ...prev, cartItems }));
// // //         }
// // //       } catch (cartError) {
// // //         console.error("Error loading cart:", cartError);
// // //         // Fallback 1: Intentar cargar desde caché
// // //         const cachedCart = await AsyncStorage.getItem(CACHE_KEYS.CART);
// // //         if (cachedCart) {
// // //           setAppData((prev) => ({
// // //             ...prev,
// // //             cartItems: JSON.parse(cachedCart),
// // //           }));
// // //         }
// // //         // Si no hay caché, se mantienen los items actuales
// // //       }

// // //       // 2. Cargar datos de usuario solo si es necesario
// // //       if (user?.id && !appData.userDetails) {
// // //         try {
// // //           // Opción 2: Usar los datos básicos que ya tienes del contexto
// // //           const basicUserDetails = {
// // //             id: user.id,
// // //             nombre: user.nombre,
// // //             email: user.email,
// // //             // ...otros datos básicos que ya tengas
// // //           };

// // //           await AsyncStorage.setItem(
// // //             CACHE_KEYS.USER,
// // //             JSON.stringify(basicUserDetails)
// // //           );
// // //           setAppData((prev) => ({ ...prev, userDetails: basicUserDetails }));
// // //         } catch (userError) {
// // //           console.error("Error loading user details:", userError);
// // //           // Fallback a caché
// // //           const cachedUser = await AsyncStorage.getItem(CACHE_KEYS.USER);
// // //           if (cachedUser) {
// // //             setAppData((prev) => ({
// // //               ...prev,
// // //               userDetails: JSON.parse(cachedUser),
// // //             }));
// // //           }
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error("Background data load error:", error);
// // //     } finally {
// // //       setUiState((prev) => ({ ...prev, backgroundLoading: false }));
// // //     }
// // //   };

// // //   const isFavorite = useCallback(
// // //     (productId) => {
// // //       if (!appData.favoritos || !Array.isArray(appData.favoritos)) return false;
// // //       // Usar un Map para búsquedas más rápidas
// // //       const favoritesMap = new Map(
// // //         appData.favoritos.map((fav) => [
// // //           fav.attributes?.producto?.id || fav.producto_id,
// // //           true,
// // //         ])
// // //       );

// // //       return favoritesMap.has(productId);
// // //     },
// // //     [appData.favoritos]
// // //   );

// // //   // Función optimizada para toggleFavorite
// // //   const toggleFavorite = useCallback(
// // //     async (productId) => {
// // //       if (!user?.id) {
// // //         Alert.alert(
// // //           "Acción requerida",
// // //           "Debes iniciar sesión para guardar favoritos",
// // //           [
// // //             {
// // //               text: "Iniciar sesión",
// // //               onPress: () => navigation.navigate("Login"),
// // //             },
// // //             { text: "Cancelar", style: "cancel" },
// // //           ]
// // //         );
// // //         return;
// // //       }

// // //       if (favoriteLoading === productId) return;
// // //       setFavoriteLoading(productId);

// // //       try {
// // //         const wasFavorite = isFavorite(productId);
// // //         // Actualización optimista
// // //         setAppData((prev) => ({
// // //           ...prev,
// // //           favoritos: wasFavorite
// // //             ? prev.favoritos.filter(
// // //                 (fav) =>
// // //                   fav.attributes?.producto?.id !== productId &&
// // //                   fav.producto_id !== productId
// // //               )
// // //             : [...prev.favoritos, { producto_id: productId }],
// // //         }));

// // //         // Llamada a la API
// // //         if (wasFavorite) {
// // //           await api.delete(`/favoritos/${user.id}/${productId}`);
// // //         } else {
// // //           await api.post("/favoritos", {
// // //             usuario_id: user.id,
// // //             producto_id: productId,
// // //           });
// // //         }

// // //         // Obtener lista actualizada
// // //         const updatedResponse = await api.get(`/favoritos-detalles/${user.id}`);
// // //         const updatedFavorites = updatedResponse.data.data || [];

// // //         // Actualizar estado con datos confirmados
// // //         setAppData((prev) => ({
// // //           ...prev,
// // //           favoritos: updatedFavorites,
// // //         }));

// // //         await AsyncStorage.setItem(
// // //           CACHE_KEYS.FAVORITES,
// // //           JSON.stringify(updatedFavorites)
// // //         );

// // //         showToast(
// // //           wasFavorite
// // //             ? "❌ Producto eliminado de favoritos"
// // //             : "✅ Producto añadido a favoritos"
// // //         );
// // //       } catch (error) {
// // //         console.error("Favorite toggle error:", error);
// // //         showToast("❌ Error al actualizar favoritos");

// // //         // Revertir a los favoritos anteriores
// // //         const cachedFavorites = await AsyncStorage.getItem(
// // //           CACHE_KEYS.FAVORITES
// // //         );
// // //         if (cachedFavorites) {
// // //           setAppData((prev) => ({
// // //             ...prev,
// // //             favoritos: JSON.parse(cachedFavorites),
// // //           }));
// // //         }
// // //       } finally {
// // //         setFavoriteLoading(null);
// // //       }
// // //     },
// // //     [user?.id, navigation, isFavorite]
// // //   );

// // //   const renderCategory = useCallback(
// // //     ({ item }) => (
// // //       <TouchableOpacity
// // //         style={[
// // //           styles.categoryItem,
// // //           uiState.selectedCategory === item.attributes.descripcion &&
// // //             styles.selectedCategoryItem,
// // //         ]}
// // //         onPress={() => {
// // //           setUiState((prev) => ({
// // //             ...prev,
// // //             selectedCategory:
// // //               prev.selectedCategory === item.attributes.descripcion
// // //                 ? null
// // //                 : item.attributes.descripcion,
// // //           }));
// // //         }}
// // //       >
// // //         <View style={styles.categoryContent}>
// // //           <MaterialIcons
// // //             name={item.attributes.icon}
// // //             size={20}
// // //             color={
// // //               uiState.selectedCategory === item.attributes.descripcion
// // //                 ? "#FFF"
// // //                 : "#FFF"
// // //             }
// // //           />
// // //           <Text
// // //             style={[
// // //               styles.categoryText,
// // //               uiState.selectedCategory === item.attributes.descripcion &&
// // //                 styles.selectedCategoryText,
// // //             ]}
// // //             numberOfLines={1}
// // //           >
// // //             {item.attributes.descripcion}
// // //           </Text>
// // //         </View>
// // //       </TouchableOpacity>
// // //     ),
// // //     [uiState.selectedCategory]
// // //   );

// // //   const handleProductPress = useCallback(
// // //     (item) => {
// // //       navigation.navigate("Detalles", {
// // //         producto: item,
// // //         productoId: item?.attributes.nombre,
// // //         precio: item?.attributes.precio,
// // //         stock: item?.attributes.cantidad,
// // //         imag: item?.attributes.imagen,
// // //         descripcion: item.attributes.descripcion,
// // //         id: item.id,
// // //         usuario: user,
// // //         cantActual: quantities[item.id] || 1,
// // //         volumen: item.attributes.volumen,
// // //         sexo: item.attributes.sexo,
// // //         marca: item.attributes.marca,
// // //         categoria: item.attributes.categoria,
// // //         tarjetas: appData.tarjetas,
// // //       });
// // //     },
// // //     [navigation, user, quantities, appData.tarjetas]
// // //   );

// // //   const ComprarAhora = async (
// // //     product,
// // //     quantity = quantities[product.id] || 1,
// // //     costo
// // //   ) => {
// // //     const totalApagar = quantity * costo;
// // //     if (user.esAnonimo === true) {
// // //       Alert.alert(
// // //         "Cuenta temporal",
// // //         "Para finalizar tu compra necesitas registrar una cuenta completa",
// // //         [
// // //           { text: "Registrarme", onPress: () => irRegistro() },
// // //           { text: "Iniciar sesión", onPress: () => irLogin() },
// // //           { text: "Más tarde", style: "cancel" },
// // //         ]
// // //       );
// // //     }
// // //     try {
// // //       // Verificar stock - Opción 1: Usar los productos ya cargados
// // //       const productInList = appData.productos.find((p) => p.id === product.id);
// // //       const stockDisponible = productInList?.attributes?.cantidad || 0;

// // //       if (quantity > stockDisponible) {
// // //         Alert.alert(
// // //           "Error",
// // //           `Solo hay disponible ${stockDisponible} unidades.`
// // //         );
// // //         return;
// // //       }

// // //       if (!appData.tarjetas || appData.tarjetas.length === 0) {
// // //         Alert.alert("Error", "No hay métodos de pago disponibles");
// // //         return;
// // //       }
// // //       product.attributes.cantidad = quantity;
// // //       product.attributes.producto_id = product.id;
// // //       navigation.navigate("Checkout1", {
// // //         total: totalApagar,
// // //         pagina: "S",
// // //         cartItems: product,
// // //       });
// // //     } catch (error) {
// // //       console.error("Checkout error:", error);
// // //       Alert.alert("Error", "No se pudo procesar la compra");
// // //     }
// // //   };

// // //   const openWhatsApp = async (selectedNumber) => {
// // //     const message = "Hola, me interesa uno de tus productos";
// // //     const url = `https://wa.me/+53${selectedNumber}?text=${encodeURIComponent(
// // //       message
// // //     )}`;

// // //     try {
// // //       const supported = await Linking.canOpenURL(url);
// // //       if (supported) {
// // //         await Linking.openURL(url);
// // //       } else {
// // //         const webUrl = `https://web.whatsapp.com/send?phone=${selectedNumber}&text=${encodeURIComponent(
// // //           message
// // //         )}`;
// // //         await Linking.openURL(webUrl);
// // //       }
// // //     } catch (error) {
// // //       Alert.alert("Error", "No se pudo abrir WhatsApp");
// // //     }
// // //   };

// // //   const ProductItemMemo = React.memo(ProductItem, (prevProps, nextProps) => {
// // //     (ProductItem,
// // //       (prevProps, nextProps) => {
// // //         // Comparación más exhaustiva
// // //         const sameItem = prevProps.item.id === nextProps.item.id;
// // //         const sameFavorite =
// // //           prevProps.isFavorite(prevProps.item.id) ===
// // //           nextProps.isFavorite(nextProps.item.id);
// // //         const sameQuantity = prevProps.quantity === nextProps.quantity;
// // //         const sameLoading =
// // //           prevProps.favoriteLoading === nextProps.favoriteLoading;
// // //         const sameStock =
// // //           prevProps.item.attributes?.cantidad ===
// // //           nextProps.item.attributes?.cantidad;

// // //         return (
// // //           sameItem && sameFavorite && sameQuantity && sameLoading && sameStock
// // //         );
// // //       });
// // //   });

// // //   return (
// // //     <View style={styles.mainContainer}>
// // //       {/* ... renderizado del componente ... */}
// // //       <LinearGradient
// // //         colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
// // //         style={styles.container}
// // //       >
// // //         {/* Buscador y selector de categorias */}
// // //         <View>
// // //           {/* <Text style={styles.title}>Inicio</Text> */}
// // //           <View style={styles.topBar}>
// // //             <TouchableOpacity
// // //               onPress={() => navigation.toggleDrawer?.()}
// // //               style={styles.menuButton}
// // //             >
// // //               <Ionicons name="menu" size={28} color="#FFF" />
// // //             </TouchableOpacity>

// // //             <View style={styles.searchContainer}>
// // //               <TextInput
// // //                 style={styles.searchBar}
// // //                 placeholder="Buscar productos..."
// // //                 placeholderTextColor="#888"
// // //                 value={uiState.searchQuery}
// // //                 onChangeText={(text) =>
// // //                   setUiState((prev) => ({ ...prev, searchQuery: text }))
// // //                 }
// // //               />
// // //               {uiState.searchQuery.length > 0 && (
// // //                 <TouchableOpacity
// // //                   style={styles.clearSearchButton}
// // //                   onPress={() =>
// // //                     setUiState((prev) => ({ ...prev, searchQuery: "" }))
// // //                   }
// // //                 >
// // //                   <MaterialIcons name="close" size={20} color="#888" />
// // //                 </TouchableOpacity>
// // //               )}
// // //             </View>
// // //             <TouchableOpacity
// // //               style={styles.categoryToggleButton}
// // //               onPress={() =>
// // //                 setUiState((prev) => ({
// // //                   ...prev,
// // //                   showCategories: !prev.showCategories,
// // //                 }))
// // //               }
// // //             >
// // //               <MaterialIcons
// // //                 name={uiState.showCategories ? "close" : "filter-list"}
// // //                 size={24}
// // //                 color="#FFF"
// // //               />
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Categorías (solo se muestra si showCategories es true) */}
// // //           <View>
// // //             {uiState.showCategories && (
// // //               <View style={styles.categoriesWrapper}>
// // //                 <Text style={styles.sectionTitle}>Categorías</Text>
// // //                 <FlashList
// // //                   // key={`flatlist-categor`}
// // //                   horizontal
// // //                   showsHorizontalScrollIndicator={false}
// // //                   data={[
// // //                     {
// // //                       id: null,
// // //                       attributes: { descripcion: "Todas", icon: "apps" },
// // //                     },
// // //                     ...appData.categorias,
// // //                   ]}
// // //                   renderItem={renderCategory}
// // //                   keyExtractor={(item, index) =>
// // //                     `category-${item?.id || "all"}-${index}`
// // //                   }
// // //                   initialNumToRender={5}
// // //                   maxToRenderPerBatch={5}
// // //                   windowSize={7}
// // //                   contentContainerStyle={styles.categoriesContainer}
// // //                   estimatedItemSize={100}
// // //                 />
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         {/* Lista principal */}

// // //         <FlashList
// // //           key={`flatlist-${dataVersionRef.current}`} // Fuerza recreación completa
// // //           extraData={{
// // //             favorites: appData.favoritos,
// // //             loading: favoriteLoading,
// // //             quantities: quantities,
// // //           }}
// // //           // data={appData.filteredProductos}
// // //           data={appData.filteredProductos.filter(
// // //             (product) =>
// // //               product?.id &&
// // //               product?.attributes &&
// // //               product.attributes.nombre &&
// // //               (product.attributes.cantidad === undefined ||
// // //                 product.attributes.cantidad > 0)
// // //           )}
// // //           keyExtractor={(item) =>
// // //             `prod_${item.id}_${item.attributes?.update_at || "no-name"}`
// // //           }
// // //           initialNumToRender={8}
// // //           maxToRenderPerBatch={8}
// // //           updateCellsBatchingPeriod={50}
// // //           windowSize={11}
// // //           removeClippedSubviews={Platform.OS === "android"} // Liberar memoria de items no visibles
// // //           estimatedItemSize={345}
// // //           // removeClippedSubviews={true}
// // //           getItemLayout={(data, index) => ({
// // //             length: 345, // altura fija de tus items
// // //             offset: 345 * index,
// // //             index,
// // //           })}
// // //           renderItem={useCallback(
// // //             ({ item }) => (
// // //               <ProductItemMemo
// // //                 item={item}
// // //                 isFavorite={isFavorite}
// // //                 favoriteLoading={favoriteLoading === item.id}
// // //                 quantity={quantities[item.id] || 1}
// // //                 onPress={handleProductPress}
// // //                 handleAddToCart={handleAddToCart}
// // //                 toggleFavorite={toggleFavorite}
// // //                 handleQuantityChange={handleQuantityChange}
// // //                 ComprarAhora={ComprarAhora}
// // //               />
// // //             ),
// // //             [
// // //               isFavorite,
// // //               favoriteLoading,
// // //               quantities,
// // //               handleProductPress,
// // //               handleAddToCart,
// // //               toggleFavorite,
// // //               handleQuantityChange,
// // //               ComprarAhora,
// // //             ]
// // //           )}
// // //           numColumns={2}
// // //           ListHeaderComponent={
// // //             <>
// // //               {/* Productos destacados */}
// // //               {appData.destacados.length > 0 && (
// // //                 <View style={styles.featuredContainer}>
// // //                   <Text style={styles.sectionTitle}>Destacados</Text>
// // //                   {appData.destacados.length === 0 ? (
// // //                     <View style={styles.emptyFeatured}>
// // //                       <Text style={styles.emptyFeaturedText}>
// // //                         No hay productos destacados
// // //                       </Text>
// // //                     </View>
// // //                   ) : (
// // //                     // Tu FlatList actual de destacados
// // //                     <FlashList
// // //                       ref={featuredListRef}
// // //                       horizontal
// // //                       pagingEnabled
// // //                       initialNumToRender={3}
// // //                       maxToRenderPerBatch={3}
// // //                       windowSize={3}
// // //                       removeClippedSubviews={true}
// // //                       showsHorizontalScrollIndicator={false}
// // //                       data={appData.destacados}
// // //                       keyExtractor={(item, index) =>
// // //                         `featured-${item?.id || "all"}-${index}`
// // //                       }
// // //                       estimatedItemSize={width * 0.7 + 10}
// // //                       getItemLayout={(data, index) => ({
// // //                         length: width * 0.7 + 10, // Ancho del item + margen derecho
// // //                         offset: (width * 0.7 + 10) * index, // offset acumulado
// // //                         index,
// // //                       })}
// // //                       renderItem={({ item }) => (
// // //                         <FeaturedItem
// // //                           item={item}
// // //                           onPress={handleProductPress}
// // //                         />
// // //                       )}
// // //                       onScrollToIndexFailed={({
// // //                         index,
// // //                         highestMeasuredFrameIndex,
// // //                       }) => {
// // //                         // Fallback más robusto
// // //                         if (
// // //                           !featuredListRef.current ||
// // //                           appData.destacados.length === 0
// // //                         ) {
// // //                           return; // No hacer nada si no hay elementos
// // //                         }
// // //                         if (
// // //                           featuredListRef.current &&
// // //                           index < appData.destacados.length
// // //                         ) {
// // //                           featuredListRef.current.scrollToOffset({
// // //                             offset: index * (width * 0.7 + 10),
// // //                             animated: true,
// // //                           });

// // //                           const wait = new Promise((resolve) =>
// // //                             setTimeout(resolve, 100)
// // //                           );
// // //                           wait.then(() => {
// // //                             featuredListRef.current?.scrollToIndex({
// // //                               index,
// // //                               animated: true,
// // //                             });
// // //                           });
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}

// // //                   {/* Indicadores (Los puntos que estan debajo de los destacados)*/}
// // //                   {/* <View style={styles.dotsContainer}>
// // //                   {appData.destacados.map((_, index) => (
// // //                     <View
// // //                       key={`dot-${index}`}
// // //                       style={[
// // //                         styles.dot,
// // //                         currentIndexRef.current === index && styles.activeDot,
// // //                       ]}
// // //                     />
// // //                   ))}
// // //                 </View> */}
// // //                   {/* <Text style={styles.sectionTitle1}>
// // //                     Productos en la tienda
// // //                   </Text> */}
// // //                 </View>
// // //               )}
// // //             </>
// // //           }
// // //           ListEmptyComponent={
// // //             <Text style={styles.noResults}>
// // //               {uiState.loading ? "Cargando..." : "No se encontraron resultados"}
// // //             </Text>
// // //           }
// // //           ListFooterComponent={
// // //             uiState.loading ? (
// // //               <ActivityIndicator size="large" color="#FFF" />
// // //             ) : (
// // //               !uiState.hasMore && (
// // //                 <Text style={styles.endMessage}>
// // //                   No hay más productos para mostrar
// // //                 </Text>
// // //               )
// // //             )
// // //           }
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={uiState.refreshing}
// // //               onRefresh={onRefresh}
// // //               colors={["#FF6000"]}
// // //               tintColor="#FFF"
// // //             />
// // //           }
// // //           onEndReached={handleLoadMore}
// // //           onEndReachedThreshold={0.3} // Ajustar threshold
// // //           columnWrapperStyle={styles.row}
// // //         />

// // //         {/* Botón de WhatsApp */}
// // //         <TouchableOpacity
// // //           style={styles.whatsappButton}
// // //           onPress={() => {
// // //             if (appData.contacts.length === 1) {
// // //               openWhatsApp(appData.contacts[0].attributes?.numero);
// // //             } else if (appData.contacts.length > 1) {
// // //               setUiState((prev) => ({ ...prev, showContactModal: true }));
// // //             } else {
// // //               Alert.alert("Error", "No hay contactos disponibles");
// // //             }
// // //           }}
// // //         >
// // //           <FontAwesome name="whatsapp" size={40} color="#FFF" />
// // //         </TouchableOpacity>

// // //         {/* Modal de contactos */}
// // //         <Modal
// // //           visible={uiState.showContactModal}
// // //           transparent={true}
// // //           animationType="slide"
// // //           keyExtractor={(item, index) => `contact-${item.id}-${index}`}
// // //           onRequestClose={() =>
// // //             setUiState((prev) => ({ ...prev, showContactModal: false }))
// // //           }
// // //         >
// // //           <View style={styles.modalContainer}>
// // //             <View style={styles.modalContent}>
// // //               <Text style={styles.modalTitle}>Seleccione un contacto</Text>
// // //               {appData.contacts.map((contact, index) => (
// // //                 <TouchableOpacity
// // //                   key={`contact-${index}`}
// // //                   style={styles.contactItem}
// // //                   onPress={() => {
// // //                     openWhatsApp(contact.attributes.numero);
// // //                     setUiState((prev) => ({
// // //                       ...prev,
// // //                       showContactModal: false,
// // //                     }));
// // //                   }}
// // //                 >
// // //                   <Text style={styles.contactName}>
// // //                     {contact.attributes.nick}
// // //                   </Text>
// // //                   <Text style={styles.contactNumber}>
// // //                     {contact.attributes.numero}
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               ))}
// // //               <TouchableOpacity
// // //                 style={styles.cancelButton}
// // //                 onPress={() =>
// // //                   setUiState((prev) => ({ ...prev, showContactModal: false }))
// // //                 }
// // //               >
// // //                 <Text style={styles.cancelButtonText}>Cancelar</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Modal>
// // //         {/* {toastVisible && (
// // //           <View style={styles.toastContainer}>
// // //             <Text style={styles.toastText}>{toastMessage}</Text>
// // //           </View>
// // //         )} */}
// // //         <Animated.View
// // //           style={[styles.toastContainer, { opacity: toastOpacity }]}
// // //         >
// // //           <Text style={styles.toastText}>{toastMessage}</Text>
// // //         </Animated.View>
// // //         {/* </SafeAreaView> */}
// // //       </LinearGradient>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   // fixedHeader: {
// // //   //   paddingHorizontal: 12,
// // //   //   paddingTop: Constants.statusBarHeight + 8,
// // //   //   backgroundColor: "#1a3a8f", // Mismo color que tu gradient
// // //   //   zIndex: 10, // Asegura que el header esté por encima
// // //   // },
// // //   headerContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     paddingHorizontal: 12,
// // //     paddingTop: Constants.statusBarHeight + 8,
// // //     paddingBottom: 8,
// // //   },
// // //   menuButton: {
// // //     // padding: 4,
// // //     padding: 9,
// // //     marginRight: 8,
// // //     backgroundColor: "rgba(255,255,255,0.2)",
// // //     borderRadius: 20,
// // //   },
// // //   emptyView: {
// // //     width: 28, // Mismo ancho que el botón de menú para mantener el balance
// // //   },
// // //   title: {
// // //     color: "#FFF",
// // //     fontSize: 18,
// // //     fontWeight: "bold",
// // //     textAlign: "center",
// // //     paddingTop: 10,
// // //     flex: 1, // Esto hace que el título ocupe el espacio disponible
// // //   },
// // //   toastContainer: {
// // //     position: "absolute",
// // //     bottom: 0,
// // //     right: 20,
// // //     backgroundColor: "rgba(0, 0, 0, 0.7)",
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 15,
// // //     borderRadius: 20,
// // //     zIndex: 1000,
// // //   },
// // //   toastText: {
// // //     color: "#FFF",
// // //     fontSize: 14,
// // //   },
// // //   // ... tus estilos existentes ...
// // //   mainContainer: {
// // //     flex: 1,
// // //     backgroundColor: "#f8f9fa",
// // //   },
// // //   container: {
// // //     flex: 1,
// // //     paddingHorizontal: 12,
// // //   },
// // //   topBar: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 12,
// // //     paddingTop: Constants.statusBarHeight + 20,
// // //     // borderRadius: 20,
// // //   },
// // //   searchContainer: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: "#FFF",
// // //     borderRadius: 24,
// // //     paddingHorizontal: 15,
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 2,
// // //     borderRadius: 20,
// // //   },
// // //   searchBar: {
// // //     flex: 1,
// // //     height: 44,
// // //     fontSize: 15,
// // //     color: "#333",
// // //     paddingVertical: 10,
// // //   },
// // //   clearSearchButton: {
// // //     padding: 8,
// // //     marginLeft: 4,
// // //   },
// // //   categoryToggleButton: {
// // //     padding: 10,
// // //     marginRight: 1,
// // //     marginLeft: 9,
// // //     backgroundColor: "rgba(255,255,255,0.2)",
// // //     borderRadius: 20,
// // //   },
// // //   // title: {
// // //   //   color: "#FFF",
// // //   //   fontSize: 18,
// // //   //   fontWeight: "bold",
// // //   //   // marginBottom: 1,
// // //   //   textAlign: "center",
// // //   //   paddingTop: 5,
// // //   // },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: "700",
// // //     color: "#FFF",
// // //     marginVertical: 12,
// // //     marginLeft: 8,
// // //     // top: 0
// // //   },
// // //   sectionTitle1: {
// // //     fontSize: 20,
// // //     fontWeight: "700",
// // //     color: "#FFF",
// // //     marginTop: 20,
// // //     marginBottom: 12,
// // //     marginLeft: 8,
// // //   },
// // //   featuredContainer: {
// // //     marginBottom: 20,
// // //   },
// // //   featuredItem: {
// // //     width: width * 0.8,
// // //     backgroundColor: "rgba(50, 58, 132, 0.29)",
// // //     borderRadius: 12,
// // //     overflow: "hidden",
// // //     marginRight: 16,
// // //   },
// // //   featuredImage: {
// // //     width: "100%",
// // //     height: 150,
// // //   },
// // //   featuredInfo: {
// // //     padding: 13,
// // //   },
// // //   featuredName: {
// // //     color: "#FFF",
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //     marginBottom: 6,
// // //   },
// // //   description: {
// // //     fontSize: 14,
// // //     color: "rgba(255,255,255,0.85)",
// // //     lineHeight: 20,
// // //     marginBottom: 8,
// // //   },
// // //   featuredPrice: {
// // //     color: "#FFD700",
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     marginTop: 4,
// // //   },
// // //   dotsContainer: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     marginTop: 12,
// // //     marginBottom: 4,
// // //   },
// // //   dot: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: "rgba(255,255,255,0.4)",
// // //     marginHorizontal: 4,
// // //   },
// // //   activeDot: {
// // //     backgroundColor: "#FFF",
// // //     width: 12,
// // //   },
// // //   categoriesContainer: {
// // //     paddingHorizontal: 12,
// // //     paddingBottom: 16,
// // //   },
// // //   categoryItem: {
// // //     // minWidth: 90,
// // //     // alignItems: "center",
// // //     // marginRight: 12,
// // //     // paddingVertical: 10,
// // //     // paddingHorizontal: 12,
// // //     // backgroundColor: "rgba(255,255,255,0.1)",
// // //     // borderRadius: 20,
// // //     // borderWidth: 1,
// // //     // borderColor: "transparent",
// // //     minWidth: 100, // Aumenta un poco el ancho mínimo
// // //     height: 44, // Altura fija
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 12,
// // //     paddingHorizontal: 12,
// // //     backgroundColor: "rgba(255,255,255,0.1)",
// // //     borderRadius: 20,
// // //     borderWidth: 1,
// // //     borderColor: "transparent",
// // //   },
// // //   categoryContent: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 8, // Espacio entre icono y texto
// // //   },
// // //   categoryText: {
// // //     // color: "rgba(255,255,255,0.9)",
// // //     // fontSize: 13,
// // //     // marginTop: 6,
// // //     // textAlign: "center",
// // //     color: "rgba(255,255,255,0.9)",
// // //     fontSize: 13,
// // //     textAlign: "center",
// // //     flexShrink: 1,
// // //   },
// // //   selectedCategoryItem: {
// // //     // backgroundColor: "rgba(255, 255, 255, 0.27)",
// // //     // borderColor: "#FF6B00",
// // //     backgroundColor: "rgba(255, 255, 255, 0.27)",
// // //     borderColor: "#FF6B00",
// // //   },
// // //   selectedCategoryText: {
// // //     color: "#FFF",
// // //     fontWeight: "600",
// // //   },
// // //   row: {
// // //     justifyContent: "space-between",
// // //     paddingHorizontal: 4,
// // //     marginBottom: 16, // Aumentar el margen inferior
// // //     paddingTop: 8, // Añadir padding superior
// // //   },
// // //   gridItem: {
// // //     width: itemWidth,
// // //     paddingHorizontal: 2,
// // //     marginBottom: 10,
// // //   },
// // //   productCard: {
// // //     backgroundColor: "#FFF",
// // //     borderRadius: 12,
// // //     overflow: "hidden",
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     height: 345,
// // //     marginBottom: 5,
// // //   },
// // //   gridImage: {
// // //     width: "100%",
// // //     height: itemWidth - 20,
// // //     resizeMode: "cover",
// // //   },
// // //   productInfo: {
// // //     padding: 12,
// // //     flex: 1,
// // //     justifyContent: "space-between",
// // //   },
// // //   productName: {
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     color: "#333",
// // //     // marginBottom: 6,
// // //     height: 25,
// // //     top: 1,
// // //   },
// // //   descriptionP: {
// // //     fontSize: 13,
// // //     color: "#666",
// // //     lineHeight: 18,
// // //     marginBottom: 2,
// // //     height: 36,
// // //   },
// // //   productPrice: {
// // //     fontSize: 17,
// // //     fontWeight: "700",
// // //     color: "#1a3a8f",
// // //     marginBottom: 8,
// // //   },
// // //   soldOut: {
// // //     color: "#FF0000",
// // //     fontWeight: "700",
// // //     textAlign: "center",
// // //     paddingVertical: 8,
// // //     fontSize: 14,
// // //   },
// // //   productActions: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     // marginTop: 4,
// // //     paddingTop: 8,
// // //     borderTopWidth: 1,
// // //     borderTopColor: "rgba(0,0,0,0.1)",
// // //     height: 50,
// // //   },
// // //   actionButton: {
// // //     backgroundColor: "#1a3a8f",
// // //     borderRadius: 6,
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 12,
// // //     height: 36, // Altura fija
// // //     minWidth: 80, // Ancho mínimo
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     flex: 1,
// // //     marginRight: 8,
// // //     minWidth: 40, // Asegura un mínimo de ancho
// // //   },
// // //   buyNowButton: {
// // //     backgroundColor: "#FF6B00",
// // //     marginLeft: 0,
// // //     flex: 2,
// // //   },
// // //   buyNowText: {
// // //     color: "#FFF",
// // //     fontSize: 10,
// // //     fontWeight: "600",
// // //   },
// // //   favoriteButton: {
// // //     position: "absolute",
// // //     top: 12,
// // //     right: 12,
// // //     zIndex: 1,
// // //     backgroundColor: "rgba(255,255,255,0.8)",
// // //     borderRadius: 20,
// // //     width: 36,
// // //     height: 36,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     elevation: 2,
// // //   },
// // //   whatsappButton: {
// // //     position: "absolute",
// // //     bottom: 24,
// // //     right: 24,
// // //     backgroundColor: "#25D366",
// // //     width: 64,
// // //     height: 64,
// // //     borderRadius: 32,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     elevation: 6,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 3 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //   },
// // //   modalContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(0,0,0,0.5)",
// // //   },
// // //   modalContent: {
// // //     width: "85%",
// // //     backgroundColor: "#FFF",
// // //     borderRadius: 12,
// // //     padding: 20,
// // //     elevation: 5,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     marginBottom: 16,
// // //     textAlign: "center",
// // //     color: "#333",
// // //   },
// // //   contactItem: {
// // //     padding: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: "#EEE",
// // //   },
// // //   contactName: {
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //     color: "#333",
// // //   },
// // //   contactNumber: {
// // //     fontSize: 14,
// // //     color: "#666",
// // //     marginTop: 4,
// // //   },
// // //   cancelButton: {
// // //     marginTop: 16,
// // //     padding: 12,
// // //     backgroundColor: "#FF6000",
// // //     borderRadius: 8,
// // //     alignItems: "center",
// // //   },
// // //   cancelButtonText: {
// // //     color: "#FFF",
// // //     fontWeight: "600",
// // //     fontSize: 16,
// // //   },
// // //   noResults: {
// // //     textAlign: "center",
// // //     marginVertical: 40,
// // //     fontSize: 16,
// // //     color: "#FFF",
// // //   },
// // //   endMessage: {
// // //     textAlign: "center",
// // //     color: "#FFF",
// // //     paddingVertical: 24,
// // //     fontSize: 15,
// // //     opacity: 0.8,
// // //   },
// // //   emptyFeatured: {
// // //     width: width * 0.8,
// // //     height: 160,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(255,255,255,0.1)",
// // //     borderRadius: 12,
// // //     marginRight: 16,
// // //   },
// // //   emptyFeaturedText: {
// // //     color: "#FFF",
// // //     fontSize: 16,
// // //     opacity: 0.8,
// // //   },
// // //   loadingContainer: {
// // //     paddingVertical: 24,
// // //     alignItems: "center",
// // //   },
// // // });

// // // export default React.memo(HomeScreen);


// // // Version PROOO OPTIMIZADA - SIN LOOPS INFINITOS
// // // import React, {
// // //   useEffect,
// // //   useState,
// // //   useRef,
// // //   useCallback,
// // //   useMemo,
// // // } from "react";
// // // import {
// // //   RefreshControl,
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Modal,
// // //   Alert,
// // //   ActivityIndicator,
// // //   Linking,
// // //   Dimensions,
// // //   AppState,
// // //   Animated,
// // //   Platform,
// // // } from "react-native";
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { LinearGradient } from "expo-linear-gradient";
// // // import { useIsFocused } from "@react-navigation/native";
// // // import { useUser } from "./UserContext";
// // // import { useCart } from "./CartContext";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import Constants from "expo-constants";
// // // import { Image } from "expo-image";
// // // import { FlashList } from "@shopify/flash-list";
// // // import {
// // //   MaterialIcons,
// // //   Ionicons,
// // //   FontAwesome,
// // // } from "@expo/vector-icons";
// // // import api from "../api/api";
// // // import QuantitySelector from "./QuantitySelector";

// // // const { width } = Dimensions.get("window");
// // // const itemWidth = (width - 40) / 2;

// // // // Constantes de caché optimizadas
// // // const CACHE_KEYS = {
// // //   PRODUCTS: "Lproductos",
// // //   FEATURED: "Ldestacados",
// // //   CATEGORIES: "Lcategorias",
// // //   FAVORITES: "Lfavoritos",
// // //   TARJETAS: "Ltarjetas",
// // //   CONTACTS: "Lcontacts",
// // //   LAST_UPDATED: "lastUpdated",
// // // };

// // // const CACHE_VALIDITY = {
// // //   PRIMARY: 2 * 60 * 1000,
// // //   SECONDARY: 5 * 60 * 1000,
// // // };

// // // // ======= SISTEMA DE CACHÉ EN MEMORIA =======
// // // const useCache = () => {
// // //   const cacheRef = useRef(new Map());
  
// // //   const get = useCallback((key) => {
// // //     return cacheRef.current.get(key);
// // //   }, []);

// // //   const set = useCallback((key, value) => {
// // //     cacheRef.current.set(key, {
// // //       data: value,
// // //       timestamp: Date.now()
// // //     });
// // //   }, []);

// // //   const isValid = useCallback((key, validity = CACHE_VALIDITY.PRIMARY) => {
// // //     const cached = cacheRef.current.get(key);
// // //     if (!cached) return false;
// // //     return Date.now() - cached.timestamp < validity;
// // //   }, []);

// // //   const clear = useCallback(() => {
// // //     cacheRef.current.clear();
// // //   }, []);

// // //   return { get, set, isValid, clear };
// // // };

// // // // Hook personalizado para gestión de datos
// // // const useAppData = () => {
// // //   const [data, setData] = useState({
// // //     productos: [],
// // //     destacados: [],
// // //     categorias: [],
// // //     favoritos: [],
// // //     tarjetas: [],
// // //     contacts: [],
// // //     filteredProductos: [],
// // //   });

// // //   const updateData = useCallback((updates) => {
// // //     setData(prev => ({ ...prev, ...updates }));
// // //   }, []);

// // //   const resetData = useCallback(() => {
// // //     setData({
// // //       productos: [],
// // //       destacados: [],
// // //       categorias: [],
// // //       favoritos: [],
// // //       tarjetas: [],
// // //       contacts: [],
// // //       filteredProductos: [],
// // //     });
// // //   }, []);

// // //   return { data, updateData, resetData };
// // // };

// // // // Componente ProductItem ultra-optimizado
// // // const ProductItem = React.memo(({
// // //   item,
// // //   isFavorite,
// // //   favoriteLoading,
// // //   quantity,
// // //   onPress,
// // //   handleAddToCart,
// // //   toggleFavorite,
// // //   handleQuantityChange,
// // //   ComprarAhora,
// // //   dirImg
// // // }) => {
// // //   const itemImageUrl = useMemo(() => {
// // //     if (!item?.attributes?.imagen) return `http://${dirImg}uploads/iconoI.png`;
// // //     const imageName = item.attributes.imagen.split("/").pop();
// // //     return `http://${dirImg}${imageName}`;
// // //   }, [item, dirImg]);

// // //   const precio = useMemo(() => 
// // //     item?.attributes?.precio 
// // //       ? `$ ${Number(item.attributes.precio).toFixed(2)}`
// // //       : "Precio no disponible",
// // //     [item]
// // //   );

// // //   const truncatedDescription = useMemo(() => {
// // //     const desc = item.attributes?.descripcion || "";
// // //     return desc.length > 25 ? `${desc.substring(0, 25)}...` : desc;
// // //   }, [item]);

// // //   const handleAddToCartPress = useCallback(() => {
// // //     handleAddToCart(item, quantity);
// // //   }, [item, quantity, handleAddToCart]);

// // //   const handleBuyNowPress = useCallback(() => {
// // //     ComprarAhora(item, quantity, item?.attributes?.precio);
// // //   }, [item, quantity, ComprarAhora]);

// // //   const handleFavoritePress = useCallback((e) => {
// // //     e?.stopPropagation();
// // //     toggleFavorite(item.id);
// // //   }, [item.id, toggleFavorite]);

// // //   const handleProductPress = useCallback(() => {
// // //     onPress(item);
// // //   }, [item, onPress]);

// // //   const handleQtyChange = useCallback((newQty) => {
// // //     handleQuantityChange(item.id, newQty);
// // //   }, [item.id, handleQuantityChange]);

// // //   const isProductFavorite = useMemo(() => isFavorite(item.id), [isFavorite, item.id]);
// // //   // console.log("💚 isFavorite para item", item.id, ":", isProductFavorite);

// // //   return (
// // //     <TouchableOpacity style={styles.gridItem} onPress={handleProductPress}>
// // //       <View style={styles.productCard}>
// // //         <TouchableOpacity
// // //           style={styles.favoriteButton}
// // //           onPress={handleFavoritePress}
// // //           disabled={favoriteLoading === item.id}
// // //         >
// // //           {favoriteLoading === item.id ? (
// // //             <ActivityIndicator size="small" color="#FF0000" />
// // //           ) : (
// // //             <Ionicons
// // //               name={isProductFavorite ? "heart" : "heart-outline"}
// // //               size={20}
// // //               color={isProductFavorite ? "#FF0000" : "#1a3a8f"}
// // //             />
// // //           )}
// // //         </TouchableOpacity>

// // //         <Image
// // //           source={{ uri: itemImageUrl }}
// // //           style={styles.gridImage}
// // //           placeholder={require("../assets/sindatos.png")}
// // //           cachePolicy="memory-disk"
// // //           transition={100}
// // //           contentFit="cover"
// // //           recyclingKey={`product-${item.id}`}
// // //         />

// // //         <View style={styles.productInfo}>
// // //           <Text style={styles.productName} numberOfLines={1}>
// // //             {item.attributes?.nombre || "Nombre no disponible"}
// // //           </Text>
// // //           <Text style={styles.descriptionP} numberOfLines={2}>
// // //             {truncatedDescription} ({item.attributes?.volumen})
// // //           </Text>
// // //           <Text style={styles.productPrice}>{precio}</Text>

// // //           {item.attributes?.cantidad === 0 ? (
// // //             <Text style={styles.soldOut}>AGOTADO</Text>
// // //           ) : (
// // //             <>
// // //               <QuantitySelector
// // //                 initialQuantity={quantity}
// // //                 handleQuantityChange={handleQtyChange}
// // //                 maxQuantity={item.attributes?.cantidad}
// // //                 compact={true}
// // //               />
// // //               <View style={styles.productActions}>
// // //                 <TouchableOpacity
// // //                   style={styles.actionButton}
// // //                   onPress={handleAddToCartPress}
// // //                 >
// // //                   <Ionicons name="cart-outline" size={18} color="#FFF" />
// // //                 </TouchableOpacity>
// // //                 <TouchableOpacity
// // //                   style={[styles.actionButton, styles.buyNowButton]}
// // //                   onPress={handleBuyNowPress}
// // //                 >
// // //                   <Text style={styles.buyNowText}>Comprar</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </>
// // //           )}
// // //         </View>
// // //       </View>
// // //     </TouchableOpacity>
// // //   );
// // // }, (prevProps, nextProps) => {
// // //   return (
// // //     prevProps.item.id === nextProps.item.id &&
// // //     prevProps.isFavorite === nextProps.isFavorite &&
// // //     prevProps.quantity === nextProps.quantity &&
// // //     prevProps.favoriteLoading === nextProps.favoriteLoading &&
// // //     prevProps.dirImg === nextProps.dirImg
// // //   );
// // // });

// // // // Componente FeaturedItem optimizado
// // // const FeaturedItem = React.memo(({ item, onPress, dirImg }) => {
// // //   const imageUri = useMemo(() => {
// // //     if (!item?.attributes?.imagen) return `http://${dirImg}uploads/iconoI.png`;
// // //     const imageName = item.attributes.imagen.split("/").pop();
// // //     return `http://${dirImg}${imageName}`;
// // //   }, [item, dirImg]);

// // //   const precio = useMemo(() => 
// // //     item?.attributes?.precio 
// // //       ? `$${Number(item.attributes.precio).toFixed(2)}`
// // //       : "Precio no disponible",
// // //     [item]
// // //   );

// // //   const truncatedDescription = useMemo(() => {
// // //     const desc = item.attributes?.descripcion || "";
// // //     return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
// // //   }, [item]);

// // //   const handlePress = useCallback(() => {
// // //     onPress(item);
// // //   }, [item, onPress]);

// // //   return (
// // //     <TouchableOpacity style={styles.featuredItem} onPress={handlePress}>
// // //       <Image
// // //         source={{ uri: imageUri }}
// // //         style={styles.featuredImage}
// // //         cachePolicy="memory-disk"
// // //         transition={100}
// // //         contentFit="cover"
// // //         recyclingKey={`featured-${item.id}`}
// // //       />
// // //       <View style={styles.featuredInfo}>
// // //         <Text style={styles.featuredName}>{item.attributes?.nombre}</Text>
// // //         <Text style={styles.description}>
// // //           {truncatedDescription} ({item.attributes?.volumen})
// // //         </Text>
// // //         <Text style={styles.featuredPrice}>{precio}</Text>
// // //       </View>
// // //     </TouchableOpacity>
// // //   );
// // // }, (prevProps, nextProps) => prevProps.item.id === nextProps.item.id);

// // // const HomeScreen = ({ navigation, route }) => {
// // //   const { mensajero } = route.params || {};
// // //   const dirImg = Constants.expoConfig.extra.dirImg;
  
// // //   // Hooks personalizados
// // //   const { data: appData, updateData, resetData } = useAppData();
// // //   const cache = useCache();

// // //   const [uiState, setUiState] = useState({
// // //     loading: false,
// // //     refreshing: false,
// // //     selectedCategory: null,
// // //     showCategories: false,
// // //     searchQuery: "",
// // //     showContactModal: false,
// // //     page: 1,
// // //     hasMore: true,
// // //     loadingMore: false,
// // //   });

// // //   const [favoriteLoading, setFavoriteLoading] = useState(false);
// // //   const [quantities, setQuantities] = useState({});
// // //   const toastOpacity = useRef(new Animated.Value(0)).current;
// // //   const [toastMessage, setToastMessage] = useState("");

// // //   const { user, logout } = useUser();
// // //   const { addToCart, loadCart } = useCart();
// // //   const isFocused = useIsFocused();
  
// // //   const featuredListRef = useRef(null);
// // //   const locationIntervalRef = useRef(null);
// // //   const currentIndexRef = useRef(0);

// // //   // ======= FUNCIÓN DE FILTRADO OPTIMIZADA =======
// // //   const filterProducts = useCallback((products, query, category) => {
// // //     if (!Array.isArray(products)) return [];
    
// // //     const queryLower = query ? query.toLowerCase() : '';
// // //     const isCategoryAll = !category || category === "Todas";
    
// // //     return products.filter((product) => {
// // //       if (!product?.id || !product?.attributes) return false;
// // //       if (product.attributes?.activo === false) return false;
// // //       if (product.attributes?.cantidad <= 0) return false;

// // //       const matchesSearch = !query || 
// // //         (product.attributes.nombre || "").toLowerCase().includes(queryLower);
      
// // //       const matchesCategory = isCategoryAll || 
// // //         product.attributes.categoria === category;

// // //       return matchesSearch && matchesCategory;
// // //     });
// // //   }, []);

// // //   // ======= FUNCIONES DE CARGA OPTIMIZADAS =======
// // //   // const loadInitialData = useCallback(async () => {
// // //   //   try {
// // //   //     setUiState(prev => ({ ...prev, loading: true }));
// // //   //     resetData();
      
// // //   //     // 1. Cargar datos críticos primero (categorías)
// // //   //     const categoriasCache = cache.get(CACHE_KEYS.CATEGORIES);
// // //   //     if (categoriasCache && cache.isValid(CACHE_KEYS.CATEGORIES)) {
// // //   //       updateData({ categorias: categoriasCache.data });
// // //   //     } else {
// // //   //       const categoriasRes = await api.get("/categorias");
// // //   //       const categorias = categoriasRes.data.datos || [];
// // //   //       updateData({ categorias });
// // //   //       cache.set(CACHE_KEYS.CATEGORIES, categorias);
// // //   //     }

// // //   //     // 2. Cargar productos en lote pequeño inicial
// // //   //     const productsCache = cache.get(CACHE_KEYS.PRODUCTS);
// // //   //     if (productsCache && cache.isValid(CACHE_KEYS.PRODUCTS)) {
// // //   //       const cachedProducts = productsCache.data;
// // //   //       updateData({ 
// // //   //         productos: cachedProducts,
// // //   //         filteredProductos: filterProducts(cachedProducts, uiState.searchQuery, uiState.selectedCategory)
// // //   //       });
// // //   //     } else {
// // //   //       await loadProductsBatch(1);
// // //   //     }

// // //   //     // 3. Cargar datos secundarios en paralelo
// // //   //     Promise.allSettled([
// // //   //       loadFeaturedProducts(),
// // //   //       loadContacts(),
// // //   //       loadFavorites(),
// // //   //       loadTarjetas()
// // //   //     ]);

// // //   //   } catch (error) {
// // //   //     console.error("Initial load error:", error);
// // //   //   } finally {
// // //   //     setUiState(prev => ({ ...prev, loading: false }));
// // //   //   }
// // //   // }, []);
// // //   const loadInitialData = useCallback(async () => {
// // //   try {
// // //     setUiState(prev => ({ ...prev, loading: true }));
// // //     resetData();
    
// // //     // Cargar productos de página 1 directamente
// // //     await loadProductsBatch(1);
    
// // //     // Cargar datos secundarios en paralelo
// // //     Promise.allSettled([
// // //       loadCategories(),
// // //       loadFeaturedProducts(),
// // //       loadContacts(),
// // //       loadFavorites(),
// // //       loadTarjetas()
// // //     ]);

// // //   } catch (error) {
// // //     console.error("Initial load error:", error);
// // //   } finally {
// // //     setUiState(prev => ({ ...prev, loading: false }));
// // //   }
// // // }, []);

// // // const loadCategories = useCallback(async () => {
// // //   try {
// // //     const categoriasCache = cache.get(CACHE_KEYS.CATEGORIES);
// // //     if (categoriasCache && cache.isValid(CACHE_KEYS.CATEGORIES)) {
// // //       updateData({ categorias: categoriasCache.data });
// // //     } else {
// // //       const categoriasRes = await api.get("/categorias");
// // //       const categorias = categoriasRes.data.datos || [];
// // //       updateData({ categorias });
// // //       cache.set(CACHE_KEYS.CATEGORIES, categorias);
// // //     }
// // //   } catch (error) {
// // //     console.error("Categories load error:", error);
// // //   }
// // // }, []);

// // //   // Carga de productos por lotes
// // //   // const loadProductsBatch = useCallback(async (page = 1) => {
// // //   //   try {
// // //   //     const response = await api.get(`/productos?page=${page}&limit=20`);
// // //   //     const newProducts = response.data.datos || [];
      
// // //   //     if (page === 1) {
// // //   //       updateData({ 
// // //   //         productos: newProducts,
// // //   //         filteredProductos: filterProducts(newProducts, uiState.searchQuery, uiState.selectedCategory)
// // //   //       });
// // //   //       cache.set(CACHE_KEYS.PRODUCTS, newProducts);
// // //   //     } else {
// // //   //       updateData(prev => {
// // //   //         const mergedProducts = [...prev.productos, ...newProducts.filter(
// // //   //           newItem => !prev.productos.some(item => item.id === newItem.id)
// // //   //         )];
// // //   //         return {
// // //   //           productos: mergedProducts,
// // //   //           filteredProductos: filterProducts(mergedProducts, uiState.searchQuery, uiState.selectedCategory)
// // //   //         };
// // //   //       });
// // //   //     }

// // //   //     setUiState(prev => ({
// // //   //       ...prev,
// // //   //       hasMore: page < (response.data.pagination?.totalPages || 1)
// // //   //     }));

// // //   //   } catch (error) {
// // //   //     console.error("Products batch load error:", error);
// // //   //   }
// // //   // }, [uiState.searchQuery, uiState.selectedCategory]);
// // // //   const loadProductsBatch = useCallback(async (page = 1) => {
// // // //   try {
// // // //     if (page > 1) {
// // // //       setUiState(prev => ({ ...prev, loadingMore: true }));
// // // //     }

// // // //     const response = await api.get(`/productos?page=${page}&limit=20`);
// // // //     const newProducts = response.data.datos || [];
    
// // // //     console.log(`📦 Página ${page}: ${newProducts.length} productos cargados`);
    
// // // //     if (page === 1) {
// // // //       updateData({ 
// // // //         productos: newProducts,
// // // //         filteredProductos: filterProducts(newProducts, uiState.searchQuery, uiState.selectedCategory)
// // // //       });
// // // //       cache.set(CACHE_KEYS.PRODUCTS, newProducts);
// // // //     } else {
// // // //       updateData(prev => {
// // // //         const mergedProducts = [...prev.productos, ...newProducts.filter(
// // // //           newItem => !prev.productos.some(item => item.id === newItem.id)
// // // //         )];
// // // //         return {
// // // //           productos: mergedProducts,
// // // //           filteredProductos: filterProducts(mergedProducts, uiState.searchQuery, uiState.selectedCategory)
// // // //         };
// // // //       });
// // // //     }

// // // //     const totalPages = response.data.pagination?.totalPages || 1;
// // // //     const hasMoreData = page < totalPages;
    
// // // //     setUiState(prev => ({
// // // //       ...prev,
// // // //       hasMore: hasMoreData,
// // // //       loadingMore: false
// // // //     }));


// // // //     console.log(`📄 Total páginas: ${totalPages}, ¿Hay más?: ${hasMoreData}`);

// // // //   } catch (error) {
// // // //     console.error("Products batch load error:", error);
// // // //     setUiState(prev => ({ ...prev, loadingMore: false }));
// // // //   }
// // // // }, [uiState.searchQuery, uiState.selectedCategory]);
// // // const loadProductsBatch = useCallback(async (page = 1) => {
// // //   try {
// // //     if (page > 1) {
// // //       setUiState(prev => ({ ...prev, loadingMore: true }));
// // //     }

// // //     const response = await api.get(`/productos?page=${page}&limit=20`);
// // //     const newProducts = response.data.datos || [];
    
// // //     console.log(`📦 Página ${page}: ${newProducts.length} productos cargados`);
    
// // //     // SIEMPRE actualizar el estado, sin importar la página
// // //     updateData(prev => {
// // //       let mergedProducts;
// // //       if (page === 1) {
// // //         mergedProducts = newProducts;
// // //       } else {
// // //         mergedProducts = [...prev.productos, ...newProducts.filter(
// // //           newItem => !prev.productos.some(item => item.id === newItem.id)
// // //         )];
// // //       }
      
// // //       // Aplicar filtro inmediatamente
// // //       const filteredProductos = filterProducts(mergedProducts, uiState.searchQuery, uiState.selectedCategory);
      
// // //       return {
// // //         productos: mergedProducts,
// // //         filteredProductos: filteredProductos
// // //       };
// // //     });

// // //     const totalPages = response.data.pagination?.totalPages || 1;
// // //     const hasMoreData = page < totalPages;
    
// // //     setUiState(prev => ({
// // //       ...prev,
// // //       hasMore: hasMoreData,
// // //       loadingMore: false
// // //     }));

// // //     console.log(`📄 Total páginas: ${totalPages}, ¿Hay más?: ${hasMoreData}`);

// // //   } catch (error) {
// // //     console.error("Products batch load error:", error);
// // //     setUiState(prev => ({ ...prev, loadingMore: false }));
// // //   }
// // // }, [uiState.searchQuery, uiState.selectedCategory]);


// // //   // Carga de productos destacados
// // //   const loadFeaturedProducts = useCallback(async () => {
// // //     try {
// // //       const featuredCache = cache.get(CACHE_KEYS.FEATURED);
// // //       if (featuredCache && cache.isValid(CACHE_KEYS.FEATURED)) {
// // //         updateData({ destacados: featuredCache.data });
// // //         return;
// // //       }

// // //       const response = await api.get("/productos?destacado=1&limit=10");
// // //       const destacados = response.data.datos?.filter(p => 
// // //         p?.attributes?.destacado === 1 && p?.attributes?.precio !== undefined
// // //       ) || [];
      
// // //       updateData({ destacados });
// // //       cache.set(CACHE_KEYS.FEATURED, destacados);
// // //     } catch (error) {
// // //       console.error("Featured products load error:", error);
// // //     }
// // //   }, []);

// // //   // Carga de contactos
// // //   const loadContacts = useCallback(async () => {
// // //     try {
// // //       const contactsCache = cache.get(CACHE_KEYS.CONTACTS);
// // //       if (contactsCache && cache.isValid(CACHE_KEYS.CONTACTS)) {
// // //         updateData({ contacts: contactsCache.data });
// // //         return;
// // //       }

// // //       const response = await api.get("/contactos");
// // //       const contacts = response.data.datos || [];
// // //       updateData({ contacts });
// // //       cache.set(CACHE_KEYS.CONTACTS, contacts);
// // //     } catch (error) {
// // //       console.error("Contacts load error:", error);
// // //     }
// // //   }, []);

// // //   // Carga de favoritos
// // //   const loadFavorites = useCallback(async () => {
// // //     if (!user?.id) return;
    
// // //     try {
// // //       const favoritesCache = cache.get(CACHE_KEYS.FAVORITES);
// // //       if (favoritesCache && cache.isValid(CACHE_KEYS.FAVORITES)) {
// // //         updateData({ favoritos: favoritesCache.data });
// // //         return;
// // //       }

// // //       const response = await api.get(`/favoritos-detalles/${user.id}`);
// // //       const favoritos = response.data.data || [];
// // //       updateData({ favoritos });
// // //       cache.set(CACHE_KEYS.FAVORITES, favoritos);
// // //     } catch (error) {
// // //       console.error("Favorites load error:", error);
// // //     }
// // //   }, [user?.id]);

// // //   // Carga de tarjetas
// // //   const loadTarjetas = useCallback(async () => {
// // //     try {
// // //       const tarjetasCache = cache.get(CACHE_KEYS.TARJETAS);
// // //       if (tarjetasCache && cache.isValid(CACHE_KEYS.TARJETAS)) {
// // //         updateData({ tarjetas: tarjetasCache.data });
// // //         return;
// // //       }

// // //       const response = await api.get("/tarjetas");
// // //       // console.log("Tarjetas response:", response);
// // //       const tarjetas = response.data.data || [];
// // //       updateData({ tarjetas });
// // //       cache.set(CACHE_KEYS.TARJETAS, tarjetas);
// // //     } catch (error) {
// // //       console.error("Tarjetas load error:", error);
// // //     }
// // //   }, []);

// // //   // ======= EFECTOS PRINCIPALES CORREGIDOS =======
// // //   useEffect(() => {
// // //     loadInitialData();
// // //   }, []);

// // //   useEffect(() => {
// // //     // if (uiState.page > 1) {
// // //     //   loadProductsBatch(uiState.page);
// // //     // }
// // //     if (uiState.page > 1) {
// // //       console.log("🎯 Ejecutando carga de página:", uiState.page);
// // //      loadProductsBatch(uiState.page);
// // //   }
// // //   }, [uiState.page]);

// // //   // EFECTO CORREGIDO PARA FILTRADO - SIN LOOP
// // //   // useEffect(() => {
// // //   //   if (appData.productos.length > 0) {
// // //   //     const filtered = filterProducts(appData.productos, uiState.searchQuery, uiState.selectedCategory);
      
// // //   //     // Actualizar solo si hay cambios reales
// // //   //     if (JSON.stringify(appData.filteredProductos) !== JSON.stringify(filtered)) {
// // //   //       updateData({ filteredProductos: filtered });
// // //   //     }
// // //   //   }
// // //   // }, [uiState.searchQuery, uiState.selectedCategory, appData.productos]);
// // //   useEffect(() => {
// // //   // Solo filtrar si hay productos y no estamos en medio de una carga
// // //   if (appData.productos.length > 0 && !uiState.loading && !uiState.loadingMore) {
// // //     const filtered = filterProducts(appData.productos, uiState.searchQuery, uiState.selectedCategory);
    
// // //     // Usar timeout para evitar conflicto con otras actualizaciones
// // //     const timeoutId = setTimeout(() => {
// // //       updateData({ filteredProductos: filtered });
// // //     }, 100);
    
// // //     return () => clearTimeout(timeoutId);
// // //   }
// // // }, [uiState.searchQuery, uiState.selectedCategory, appData.productos, uiState.loading, uiState.loadingMore]);

// // //   // Auto-scroll para productos destacados
// // //   useEffect(() => {
// // //     const destacados = appData.destacados;
// // //     if (destacados.length > 1) {
// // //       const interval = setInterval(() => {
// // //         const nextIndex = (currentIndexRef.current + 1) % destacados.length;
// // //         currentIndexRef.current = nextIndex;

// // //         if (featuredListRef.current && nextIndex < destacados.length) {
// // //           featuredListRef.current.scrollToIndex({
// // //             index: nextIndex,
// // //             animated: true,
// // //           });
// // //         }
// // //       }, 3000);

// // //       return () => clearInterval(interval);
// // //     }
// // //   }, [appData.destacados]);

// // //   // ======= FUNCIONES DE INTERACCIÓN =======
// // //   const showToast = useCallback((message) => {
// // //     setToastMessage(message);
// // //     Animated.sequence([
// // //       Animated.timing(toastOpacity, {
// // //         toValue: 1,
// // //         duration: 200,
// // //         useNativeDriver: true,
// // //       }),
// // //       Animated.delay(1500),
// // //       Animated.timing(toastOpacity, {
// // //         toValue: 0,
// // //         duration: 200,
// // //         useNativeDriver: true,
// // //       }),
// // //     ]).start(() => setToastMessage(""));
// // //   }, [toastOpacity]);

// // //   const handleAddToCart = useCallback(async (product, quantity = quantities[product.id] || 1) => {
// // //     try {
// // //       let userId = user?.id;
// // //       if (!userId) {
// // //         const anonUser = await AsyncStorage.getItem("anonUser");
// // //         if (anonUser) {
// // //           userId = JSON.parse(anonUser).id;
// // //         }
// // //       }

// // //       if (!userId) {
// // //         Alert.alert(
// // //           "Acción requerida",
// // //           "¿Deseas continuar como invitado o iniciar sesión?",
// // //           [
// // //             { text: "Invitado", onPress: () => {} },
// // //             { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
// // //           ]
// // //         );
// // //         return;
// // //       }

// // //       await addToCart({ ...product, cantidad: quantity });
// // //       showToast(`✅ ${quantity} ${product.attributes.nombre} agregado(s) al carrito`);
// // //       setQuantities(prev => ({ ...prev, [product.id]: 1 }));

// // //     } catch (error) {
// // //       console.error("Error adding to cart:", error);
// // //       showToast("❌ No se pudo añadir al carrito");
// // //     }
// // //   }, [quantities, user?.id, addToCart, showToast, navigation]);

// // //   const isFavorite = useCallback((productId) => {
// // //     if (!appData.favoritos || !Array.isArray(appData.favoritos)) return false;
// // //     return appData.favoritos.some(fav => 
// // //       fav.attributes?.producto?.id === productId || fav.producto_id === productId
// // //     );
// // //   }, [appData.favoritos]);

// // //   const toggleFavorite = useCallback(async (productId) => {
// // //     if (!user?.id) {
// // //       Alert.alert(
// // //         "Acción requerida",
// // //         "Debes iniciar sesión para guardar favoritos",
// // //         [
// // //           { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
// // //           { text: "Cancelar", style: "cancel" },
// // //         ]
// // //       );
// // //       return;
// // //     }

// // //     if (favoriteLoading === productId) return;
// // //     setFavoriteLoading(productId);

// // //     try {
// // //       const wasFavorite = isFavorite(productId);
      
// // //       if (wasFavorite) {
// // //         await api.delete(`/favoritos/${user.id}/${productId}`);
// // //       } else {
// // //         await api.post("/favoritos", {
// // //           usuario_id: user.id,
// // //           producto_id: productId,
// // //         });
// // //       }

// // //       // ✅ Traer la lista NUEVA
// // //     const response = await api.get(`/favoritos-detalles/${user.id}`);
// // //     const newFavorites = response.data.data || [];

// // //     // ✅ Actualizar inmediatamente
// // //     updateData({ favoritos: newFavorites });
// // //     cache.set(CACHE_KEYS.FAVORITES, newFavorites);
// // //       // Recargar favoritos
// // //       await loadFavorites();
// // //       showToast(wasFavorite ? "❌ Eliminado de favoritos" : "✅ Agregado a favoritos");

// // //     } catch (error) {
// // //       console.error("Favorite toggle error:", error);
// // //       showToast("❌ Error al actualizar favoritos");
// // //     } finally {
// // //       setFavoriteLoading(null);
// // //     }
// // //   }, [user?.id, isFavorite, favoriteLoading, loadFavorites, navigation]);

// // //   const handleQuantityChange = useCallback((productId, newQuantity) => {
// // //     setQuantities(prev => ({
// // //       ...prev,
// // //       [productId]: Math.max(1, Math.min(newQuantity, 100))
// // //     }));
// // //   }, []);

// // //   const handleProductPress = useCallback((item) => {
// // //     navigation.navigate("Detalles", {
// // //       producto: item,
// // //       productoId: item?.attributes.nombre,
// // //       precio: item?.attributes.precio,
// // //       stock: item?.attributes.cantidad,
// // //       imag: item?.attributes.imagen,
// // //       descripcion: item.attributes.descripcion,
// // //       id: item.id,
// // //       usuario: user,
// // //       cantActual: quantities[item.id] || 1,
// // //       volumen: item.attributes.volumen,
// // //       sexo: item.attributes.sexo,
// // //       marca: item.attributes.marca,
// // //       categoria: item.attributes.categoria,
// // //       tarjetas: appData.tarjetas,
// // //     });
// // //   }, [navigation, user, quantities, appData.tarjetas]);

// // //   const ComprarAhora = useCallback(async (product, quantity = quantities[product.id] || 1, costo) => {
// // //     const totalApagar = quantity * costo;
    
// // //     if (user?.esAnonimo) {
// // //       Alert.alert(
// // //         "Cuenta temporal",
// // //         "Para finalizar tu compra necesitas registrar una cuenta completa",
// // //         [
// // //           { text: "Registrarme", onPress: () => navigation.replace("Registro") },
// // //           { text: "Iniciar sesión", onPress: () => navigation.replace("Login") },
// // //           { text: "Más tarde", style: "cancel" },
// // //         ]
// // //       );
// // //       return;
// // //     }

// // //     try {
// // //       if (!appData.tarjetas || appData.tarjetas.length === 0) {
// // //         Alert.alert("Error", "No hay métodos de pago disponibles");
// // //         return;
// // //       }
      
// // //       product.attributes.cantidad = quantity;
// // //       product.attributes.producto_id = product.id;
      
// // //       navigation.navigate("Checkout1", {
// // //         total: totalApagar,
// // //         pagina: "S",
// // //         cartItems: product,
// // //       });
// // //     } catch (error) {
// // //       console.error("Checkout error:", error);
// // //       Alert.alert("Error", "No se pudo procesar la compra");
// // //     }
// // //   }, [user, quantities, appData.tarjetas, navigation]);

// // //   const openWhatsApp = useCallback(async (selectedNumber) => {
// // //     const message = "Hola, me interesa uno de tus productos";
// // //     const url = `https://wa.me/+53${selectedNumber}?text=${encodeURIComponent(message)}`;

// // //     try {
// // //       const supported = await Linking.canOpenURL(url);
// // //       if (supported) {
// // //         await Linking.openURL(url);
// // //       } else {
// // //         const webUrl = `https://web.whatsapp.com/send?phone=${selectedNumber}&text=${encodeURIComponent(message)}`;
// // //         await Linking.openURL(webUrl);
// // //       }
// // //     } catch (error) {
// // //       Alert.alert("Error", "No se pudo abrir WhatsApp");
// // //     }
// // //   }, []);

// // //   // ======= FUNCIONES DE UI =======
// // //   // const onRefresh = useCallback(async () => {
// // //   //   try {
// // //   //     setUiState(prev => ({ ...prev, refreshing: true, page: 1 }));
// // //   //     cache.clear();
// // //   //     resetData();
// // //   //     await loadInitialData();
// // //   //   } catch (error) {
// // //   //     console.error("Refresh error:", error);
// // //   //   } finally {
// // //   //     setUiState(prev => ({ ...prev, refreshing: false }));
// // //   //   }
// // //   // }, [cache, resetData, loadInitialData]);
// // //   const onRefresh = useCallback(async () => {
// // //   try {
// // //     setUiState(prev => ({ 
// // //       ...prev, 
// // //       refreshing: true, 
// // //       page: 1,
// // //       hasMore: true 
// // //     }));
// // //     cache.clear();
// // //     resetData();
// // //     await loadProductsBatch(1); // Cargar página 1 directamente
// // //   } catch (error) {
// // //     console.error("Refresh error:", error);
// // //   } finally {
// // //     setUiState(prev => ({ ...prev, refreshing: false }));
// // //   }
// // // }, [cache, resetData, loadProductsBatch]);

// // //   // const handleLoadMore = useCallback(() => {
// // //   //   if (!uiState.loading && uiState.hasMore && !uiState.refreshing) {
// // //   //     setUiState(prev => ({ ...prev, page: prev.page + 1 }));
// // //   //   }
// // //   // }, [uiState.loading, uiState.hasMore, uiState.refreshing]);
// // //   const handleLoadMore = useCallback(() => {
// // //   if (!uiState.loading && uiState.hasMore && !uiState.refreshing && !uiState.loadingMore) {
// // //     console.log("🔄 Cargando más productos, página:", uiState.page + 1);
// // //     setUiState(prev => ({ 
// // //       ...prev, 
// // //       page: prev.page + 1,
// // //       loadingMore: true 
// // //     }));
// // //   }
// // // }, [uiState.loading, uiState.hasMore, uiState.refreshing, uiState.loadingMore, uiState.page]);

// // //   const renderCategory = useCallback(({ item }) => (
// // //     <TouchableOpacity
// // //       style={[
// // //         styles.categoryItem,
// // //         uiState.selectedCategory === item.attributes.descripcion && styles.selectedCategoryItem,
// // //       ]}
// // //       onPress={() => {
// // //         setUiState(prev => ({
// // //           ...prev,
// // //           selectedCategory: prev.selectedCategory === item.attributes.descripcion ? null : item.attributes.descripcion,
// // //         }));
// // //       }}
// // //     >
// // //       <View style={styles.categoryContent}>
// // //         <MaterialIcons
// // //           name={item.attributes.icon}
// // //           size={20}
// // //           color="#FFF"
// // //         />
// // //         <Text
// // //           style={[
// // //             styles.categoryText,
// // //             uiState.selectedCategory === item.attributes.descripcion && styles.selectedCategoryText,
// // //           ]}
// // //           numberOfLines={1}
// // //         >
// // //           {item.attributes.descripcion}
// // //         </Text>
// // //       </View>
// // //     </TouchableOpacity>
// // //   ), [uiState.selectedCategory]);

// // //   const renderProductItem = useCallback(({ item }) => (
// // //     <ProductItem
// // //       item={item}
// // //       isFavorite={isFavorite}
// // //       favoriteLoading={favoriteLoading}
// // //       quantity={quantities[item.id] || 1}
// // //       onPress={handleProductPress}
// // //       handleAddToCart={handleAddToCart}
// // //       toggleFavorite={toggleFavorite}
// // //       handleQuantityChange={handleQuantityChange}
// // //       ComprarAhora={ComprarAhora}
// // //       dirImg={dirImg}
// // //     />
// // //   ), [isFavorite, favoriteLoading, quantities, handleProductPress, handleAddToCart, toggleFavorite, handleQuantityChange, ComprarAhora, dirImg, appData.favoritos, appData.productos]);

// // //   const renderFeaturedItem = useCallback(({ item }) => (
// // //     <FeaturedItem
// // //       item={item}
// // //       onPress={handleProductPress}
// // //       dirImg={dirImg}
// // //     />
// // //   ), [handleProductPress, dirImg]);

// // //   // ======= RENDER PRINCIPAL =======
// // //   return (
// // //     <View style={styles.mainContainer}>
// // //       <LinearGradient
// // //         colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
// // //         style={styles.container}
// // //       >
// // //         {/* Header */}
// // //         <View style={styles.topBar}>
// // //           <TouchableOpacity
// // //             onPress={() => navigation.toggleDrawer?.()}
// // //             style={styles.menuButton}
// // //           >
// // //             <Ionicons name="menu" size={28} color="#FFF" />
// // //           </TouchableOpacity>

// // //           <View style={styles.searchContainer}>
// // //             <TextInput
// // //               style={styles.searchBar}
// // //               placeholder="Buscar productos..."
// // //               placeholderTextColor="#888"
// // //               value={uiState.searchQuery}
// // //               onChangeText={(text) => setUiState(prev => ({ ...prev, searchQuery: text }))}
// // //             />
// // //             {uiState.searchQuery.length > 0 && (
// // //               <TouchableOpacity
// // //                 style={styles.clearSearchButton}
// // //                 onPress={() => setUiState(prev => ({ ...prev, searchQuery: "" }))}
// // //               >
// // //                 <MaterialIcons name="close" size={20} color="#888" />
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>

// // //           <TouchableOpacity
// // //             style={styles.categoryToggleButton}
// // //             onPress={() => setUiState(prev => ({ ...prev, showCategories: !prev.showCategories }))}
// // //           >
// // //             <MaterialIcons
// // //               name={uiState.showCategories ? "close" : "filter-list"}
// // //               size={24}
// // //               color="#FFF"
// // //             />
// // //           </TouchableOpacity>
// // //         </View>

// // //         {/* Categorías */}
// // //         {uiState.showCategories && (
// // //           <View style={styles.categoriesWrapper}>
// // //             <Text style={styles.sectionTitle}>Categorías</Text>
// // //             <FlashList
// // //               horizontal
// // //               showsHorizontalScrollIndicator={false}
// // //               data={[
// // //                 { id: null, attributes: { descripcion: "Todas", icon: "apps" } },
// // //                 ...appData.categorias,
// // //               ]}
// // //               renderItem={renderCategory}
// // //               keyExtractor={(item, index) => `category-${item?.id || "all"}-${index}`}
// // //               estimatedItemSize={100}
// // //               contentContainerStyle={styles.categoriesContainer}
// // //             />
// // //           </View>
// // //         )}

// // //         {/* Lista principal */}
// // //         <FlashList
// // //           key={`main-list-${appData.productos.length}`}
// // //           data={appData.filteredProductos}
// // //           keyExtractor={(item) => `prod_${item.id}`}
// // //           renderItem={renderProductItem}
// // //           numColumns={2}
// // //           estimatedItemSize={345}
// // //           initialNumToRender={8}
// // //           maxToRenderPerBatch={8}
// // //           windowSize={7}
// // //           removeClippedSubviews={Platform.OS === "android"}
// // //           ListHeaderComponent={
// // //             <>
// // //               {/* Productos destacados */}
// // //               {appData.destacados.length > 0 && (
// // //                 <View style={styles.featuredContainer}>
// // //                   <Text style={styles.sectionTitle}>Destacados</Text>
// // //                   <FlashList
// // //                     ref={featuredListRef}
// // //                     horizontal
// // //                     pagingEnabled
// // //                     showsHorizontalScrollIndicator={false}
// // //                     data={appData.destacados}
// // //                     keyExtractor={(item, index) => `featured-${item?.id || "all"}-${index}`}
// // //                     estimatedItemSize={width * 0.8}
// // //                     renderItem={renderFeaturedItem}
// // //                   />
// // //                 </View>
// // //               )}
// // //             </>
// // //           }
// // //           ListEmptyComponent={
// // //             <Text style={styles.noResults}>
// // //               {uiState.loading ? "Cargando..." : "No se encontraron resultados"}
// // //             </Text>
// // //           }
// // //           // ListFooterComponent={
// // //           //   uiState.loading ? (
// // //           //     <ActivityIndicator size="large" color="#FFF" style={styles.loadingContainer} />
// // //           //   ) : (
// // //           //     !uiState.hasMore && appData.filteredProductos.length > 0 && (
// // //           //       <Text style={styles.endMessage}>No hay más productos para mostrar</Text>
// // //           //     )
// // //           //   )
// // //           // }
// // //   //         ListFooterComponent={
// // //   //   uiState.loadingMore ? (
// // //   //     <View style={styles.loadingMoreContainer}>
// // //   //       <ActivityIndicator size="small" color="#FFF" />
// // //   //       <Text style={styles.loadingMoreText}>Cargando más productos...</Text>
// // //   //     </View>
// // //   //   ) : !uiState.hasMore && appData.filteredProductos.length > 0 ? (
// // //   //     <Text style={styles.endMessage}>No hay más productos para mostrar</Text>
// // //   //   ) : null
// // //   // }
// // //   ListFooterComponent={
// // //   uiState.loadingMore ? (
// // //     <View style={styles.loadingMoreContainer}>
// // //       <ActivityIndicator size="small" color="#FFF" />
// // //       <Text style={styles.loadingMoreText}>Cargando más productos...</Text>
// // //     </View>
// // //   ) : !uiState.hasMore && appData.filteredProductos.length > 0 ? (
// // //     <Text style={styles.endMessage}>
// // //       {appData.filteredProductos.length === 0 ? 
// // //         "No se encontraron productos" : 
// // //         "No hay más productos para mostrar"
// // //       }
// // //     </Text>
// // //   ) : null
// // // }
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={uiState.refreshing}
// // //               onRefresh={onRefresh}
// // //               colors={["#FF6000"]}
// // //               tintColor="#FFF"
// // //             />
// // //           }
// // //           onEndReached={handleLoadMore}
// // //           onEndReachedThreshold={0.05}
// // //           columnWrapperStyle={styles.row}
// // //         />

// // //         {/* Botón de WhatsApp */}
// // //         {appData.contacts.length > 0 && (
// // //           <TouchableOpacity
// // //             style={styles.whatsappButton}
// // //             onPress={() => {
// // //               if (appData.contacts.length === 1) {
// // //                 openWhatsApp(appData.contacts[0].attributes?.numero);
// // //               } else if (appData.contacts.length > 1) {
// // //                 setUiState(prev => ({ ...prev, showContactModal: true }));
// // //               }
// // //             }}
// // //           >
// // //             <FontAwesome name="whatsapp" size={40} color="#FFF" />
// // //           </TouchableOpacity>
// // //         )}

// // //         {/* Modal de contactos */}
// // //         <Modal
// // //           visible={uiState.showContactModal}
// // //           transparent={true}
// // //           animationType="slide"
// // //           onRequestClose={() => setUiState(prev => ({ ...prev, showContactModal: false }))}
// // //         >
// // //           <View style={styles.modalContainer}>
// // //             <View style={styles.modalContent}>
// // //               <Text style={styles.modalTitle}>Seleccione un contacto</Text>
// // //               {appData.contacts.map((contact, index) => (
// // //                 <TouchableOpacity
// // //                   key={`contact-${index}`}
// // //                   style={styles.contactItem}
// // //                   onPress={() => {
// // //                     openWhatsApp(contact.attributes.numero);
// // //                     setUiState(prev => ({ ...prev, showContactModal: false }));
// // //                   }}
// // //                 >
// // //                   <Text style={styles.contactName}>{contact.attributes.nick}</Text>
// // //                   <Text style={styles.contactNumber}>{contact.attributes.numero}</Text>
// // //                 </TouchableOpacity>
// // //               ))}
// // //               <TouchableOpacity
// // //                 style={styles.cancelButton}
// // //                 onPress={() => setUiState(prev => ({ ...prev, showContactModal: false }))}
// // //               >
// // //                 <Text style={styles.cancelButtonText}>Cancelar</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Modal>

// // //         {/* Toast */}
// // //         <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
// // //           <Text style={styles.toastText}>{toastMessage}</Text>
// // //         </Animated.View>
// // //       </LinearGradient>
// // //     </View>
// // //   );
// // // };
// // // Version PROOO OPTIMIZADA - CORREGIDA
// // import React, {
// //   useEffect,
// //   useState,
// //   useRef,
// //   useCallback,
// //   useMemo,
// // } from "react";
// // import {
// //   RefreshControl,
// //   View,
// //   Text,
// //   TextInput,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Modal,
// //   Alert,
// //   ActivityIndicator,
// //   Linking,
// //   Dimensions,
// //   Animated,
// //   Platform,
// // } from "react-native";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { useIsFocused } from "@react-navigation/native";
// // import { useUser } from "./UserContext";
// // import { useCart } from "./CartContext";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import Constants from "expo-constants";
// // import { Image } from "expo-image";
// // import { FlashList } from "@shopify/flash-list";
// // import {
// //   MaterialIcons,
// //   Ionicons,
// //   FontAwesome,
// // } from "@expo/vector-icons";
// // import api from "../api/api";
// // import QuantitySelector from "./QuantitySelector";

// // const { width } = Dimensions.get("window");
// // const itemWidth = (width - 40) / 2;

// // // Constantes de caché
// // const CACHE_KEYS = {
// //   PRODUCTS: "Lproductos",
// //   FEATURED: "Ldestacados",
// //   CATEGORIES: "Lcategorias",
// //   FAVORITES: "Lfavoritos",
// //   TARJETAS: "Ltarjetas",
// //   CONTACTS: "Lcontacts",
// //   LAST_UPDATED: "lastUpdated",
// // };

// // const CACHE_VALIDITY = {
// //   PRIMARY: 2 * 60 * 1000,
// //   SECONDARY: 5 * 60 * 1000,
// // };

// // // Sistema de caché en memoria simplificado
// // const useCache = () => {
// //   const cacheRef = useRef(new Map());
  
// //   const get = useCallback((key) => {
// //     return cacheRef.current.get(key);
// //   }, []);

// //   const set = useCallback((key, value) => {
// //     cacheRef.current.set(key, {
// //       data: value,
// //       timestamp: Date.now()
// //     });
// //   }, []);

// //   const isValid = useCallback((key, validity = CACHE_VALIDITY.PRIMARY) => {
// //     const cached = cacheRef.current.get(key);
// //     if (!cached) return false;
// //     return Date.now() - cached.timestamp < validity;
// //   }, []);

// //   const clear = useCallback(() => {
// //     cacheRef.current.clear();
// //   }, []);

// //   return { get, set, isValid, clear };
// // };

// // // Hook para gestión de datos
// // const useAppData = () => {
// //   const [data, setData] = useState({
// //     productos: [],
// //     destacados: [],
// //     categorias: [],
// //     favoritos: [],
// //     tarjetas: [],
// //     contacts: [],
// //     filteredProductos: [],
// //   });

// //   const updateData = useCallback((updates) => {
// //     setData(prev => ({ ...prev, ...updates }));
// //   }, []);

// //   const resetData = useCallback(() => {
// //     setData({
// //       productos: [],
// //       destacados: [],
// //       categorias: [],
// //       favoritos: [],
// //       tarjetas: [],
// //       contacts: [],
// //       filteredProductos: [],
// //     });
// //   }, []);

// //   return { data, updateData, resetData };
// // };

// // // Componente ProductItem
// // const ProductItem = React.memo(({
// //   item,
// //   isFavorite,
// //   favoriteLoading,
// //   quantity,
// //   onPress,
// //   handleAddToCart,
// //   toggleFavorite,
// //   handleQuantityChange,
// //   ComprarAhora,
// //   dirImg
// // }) => {
// //   const itemImageUrl = useMemo(() => {
// //     if (!item?.attributes?.imagen) return `http://${dirImg}uploads/iconoI.png`;
// //     const imageName = item.attributes.imagen.split("/").pop();
// //     return `http://${dirImg}${imageName}`;
// //   }, [item, dirImg]);

// //   const precio = useMemo(() => 
// //     item?.attributes?.precio 
// //       ? `$ ${Number(item.attributes.precio).toFixed(2)}`
// //       : "Precio no disponible",
// //     [item]
// //   );

// //   const truncatedDescription = useMemo(() => {
// //     const desc = item.attributes?.descripcion || "";
// //     return desc.length > 25 ? `${desc.substring(0, 25)}...` : desc;
// //   }, [item]);

// //   const handleAddToCartPress = useCallback(() => {
// //     handleAddToCart(item, quantity);
// //   }, [item, quantity, handleAddToCart]);

// //   const handleBuyNowPress = useCallback(() => {
// //     ComprarAhora(item, quantity, item?.attributes?.precio);
// //   }, [item, quantity, ComprarAhora]);

// //   const handleFavoritePress = useCallback((e) => {
// //     e?.stopPropagation();
// //     toggleFavorite(item.id);
// //   }, [item.id, toggleFavorite]);

// //   const handleProductPress = useCallback(() => {
// //     onPress(item);
// //   }, [item, onPress]);

// //   const handleQtyChange = useCallback((newQty) => {
// //     handleQuantityChange(item.id, newQty);
// //   }, [item.id, handleQuantityChange]);

// //   const isProductFavorite = useMemo(() => isFavorite(item.id), [isFavorite, item.id]);

// //   return (
// //     <TouchableOpacity style={styles.gridItem} onPress={handleProductPress}>
// //       <View style={styles.productCard}>
// //         <TouchableOpacity
// //           style={styles.favoriteButton}
// //           onPress={handleFavoritePress}
// //           disabled={favoriteLoading === item.id}
// //         >
// //           {favoriteLoading === item.id ? (
// //             <ActivityIndicator size="small" color="#FF0000" />
// //           ) : (
// //             <Ionicons
// //               name={isProductFavorite ? "heart" : "heart-outline"}
// //               size={20}
// //               color={isProductFavorite ? "#FF0000" : "#1a3a8f"}
// //             />
// //           )}
// //         </TouchableOpacity>

// //         <Image
// //           source={{ uri: itemImageUrl }}
// //           style={styles.gridImage}
// //           placeholder={require("../assets/sindatos.png")}
// //           cachePolicy="memory-disk"
// //           transition={100}
// //           contentFit="cover"
// //           recyclingKey={`product-${item.id}`}
// //         />

// //         <View style={styles.productInfo}>
// //           <Text style={styles.productName} numberOfLines={1}>
// //             {item.attributes?.nombre || "Nombre no disponible"}
// //           </Text>
// //           <Text style={styles.descriptionP} numberOfLines={2}>
// //             {truncatedDescription} ({item.attributes?.volumen})
// //           </Text>
// //           <Text style={styles.productPrice}>{precio}</Text>

// //           {item.attributes?.cantidad === 0 ? (
// //             <Text style={styles.soldOut}>AGOTADO</Text>
// //           ) : (
// //             <>
// //               <QuantitySelector
// //                 initialQuantity={quantity}
// //                 handleQuantityChange={handleQtyChange}
// //                 maxQuantity={item.attributes?.cantidad}
// //                 compact={true}
// //               />
// //               <View style={styles.productActions}>
// //                 <TouchableOpacity
// //                   style={styles.actionButton}
// //                   onPress={handleAddToCartPress}
// //                 >
// //                   <Ionicons name="cart-outline" size={18} color="#FFF" />
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={[styles.actionButton, styles.buyNowButton]}
// //                   onPress={handleBuyNowPress}
// //                 >
// //                   <Text style={styles.buyNowText}>Comprar</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </>
// //           )}
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );
// // });

// // // Componente FeaturedItem
// // const FeaturedItem = React.memo(({ item, onPress, dirImg }) => {
// //   const imageUri = useMemo(() => {
// //     if (!item?.attributes?.imagen) return `http://${dirImg}uploads/iconoI.png`;
// //     const imageName = item.attributes.imagen.split("/").pop();
// //     return `http://${dirImg}${imageName}`;
// //   }, [item, dirImg]);

// //   const precio = useMemo(() => 
// //     item?.attributes?.precio 
// //       ? `$${Number(item.attributes.precio).toFixed(2)}`
// //       : "Precio no disponible",
// //     [item]
// //   );

// //   const truncatedDescription = useMemo(() => {
// //     const desc = item.attributes?.descripcion || "";
// //     return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
// //   }, [item]);

// //   const handlePress = useCallback(() => {
// //     onPress(item);
// //   }, [item, onPress]);

// //   return (
// //     <TouchableOpacity style={styles.featuredItem} onPress={handlePress}>
// //       <Image
// //         source={{ uri: imageUri }}
// //         style={styles.featuredImage}
// //         cachePolicy="memory-disk"
// //         transition={100}
// //         contentFit="cover"
// //         recyclingKey={`featured-${item.id}`}
// //       />
// //       <View style={styles.featuredInfo}>
// //         <Text style={styles.featuredName}>{item.attributes?.nombre}</Text>
// //         <Text style={styles.description}>
// //           {truncatedDescription} ({item.attributes?.volumen})
// //         </Text>
// //         <Text style={styles.featuredPrice}>{precio}</Text>
// //       </View>
// //     </TouchableOpacity>
// //   );
// // });

// // const HomeScreen = ({ navigation, route }) => {
// //   const { mensajero } = route.params || {};
// //   const dirImg = Constants.expoConfig.extra.dirImg;
  
// //   // Hooks personalizados
// //   const { data: appData, updateData, resetData } = useAppData();
// //   const cache = useCache();

// //   const [uiState, setUiState] = useState({
// //     loading: true,
// //     refreshing: false,
// //     selectedCategory: null,
// //     showCategories: false,
// //     searchQuery: "",
// //     showContactModal: false,
// //     page: 1,
// //     hasMore: true,
// //     loadingMore: false,
// //   });

// //   const [favoriteLoading, setFavoriteLoading] = useState(null);
// //   const [quantities, setQuantities] = useState({});
// //   const toastOpacity = useRef(new Animated.Value(0)).current;
// //   const [toastMessage, setToastMessage] = useState("");

// //   const { user, logout } = useUser();
// //   const { addToCart, loadCart } = useCart();
// //   const isFocused = useIsFocused();
  
// //   const featuredListRef = useRef(null);
// //   const currentIndexRef = useRef(0);

// //   // Función de registro anónimo (FALTABA)
// //   const registerAnonymous = useCallback(async () => {
// //     try {
// //       const response = await api.post("/registro-anonimo");
// //       const userData = response.data;
      
// //       if (userData.success) {
// //         // Guardar usuario anónimo
// //         await AsyncStorage.setItem("anonUser", JSON.stringify(userData.user));
// //         // Actualizar contexto de usuario
// //         // Necesitarías implementar esta función en tu UserContext
// //         console.log("Usuario anónimo registrado:", userData.user);
// //         return userData.user;
// //       }
// //     } catch (error) {
// //       console.error("Error registrando usuario anónimo:", error);
// //       Alert.alert("Error", "No se pudo crear cuenta temporal");
// //     }
// //   }, []);

// //   // Función de filtrado
// //   const filterProducts = useCallback((products, query, category) => {
// //     if (!Array.isArray(products)) return [];
    
// //     const queryLower = query ? query.toLowerCase() : '';
// //     const isCategoryAll = !category || category === "Todas";
    
// //     return products.filter((product) => {
// //       if (!product?.id || !product?.attributes) return false;
// //       if (product.attributes?.activo === false) return false;
// //       if (product.attributes?.cantidad <= 0) return false;

// //       const matchesSearch = !query || 
// //         (product.attributes.nombre || "").toLowerCase().includes(queryLower);
      
// //       const matchesCategory = isCategoryAll || 
// //         product.attributes.categoria === category;

// //       return matchesSearch && matchesCategory;
// //     });
// //   }, []);

// //   // Carga de productos
// //   const loadProductsBatch = useCallback(async (page = 1) => {
// //     try {
// //       if (page > 1) {
// //         setUiState(prev => ({ ...prev, loadingMore: true }));
// //       }

// //       console.log(`📦 Cargando página ${page}...`);
// //       const response = await api.get(`/productos?page=${page}&limit=20`);
// //       const newProducts = response.data.datos || [];
      
// //       console.log(`📦 Página ${page}: ${newProducts.length} productos cargados`);
      
// //       updateData(prev => {
// //         let mergedProducts;
// //         if (page === 1) {
// //           mergedProducts = newProducts;
// //         } else {
// //           mergedProducts = [...prev.productos, ...newProducts.filter(
// //             newItem => !prev.productos.some(item => item.id === newItem.id)
// //           )];
// //         }
        
// //         const filteredProductos = filterProducts(mergedProducts, uiState.searchQuery, uiState.selectedCategory);
        
// //         return {
// //           productos: mergedProducts,
// //           filteredProductos: filteredProductos
// //         };
// //       });

// //       const totalPages = response.data.pagination?.totalPages || 1;
// //       const hasMoreData = page < totalPages;
      
// //       setUiState(prev => ({
// //         ...prev,
// //         hasMore: hasMoreData,
// //         loadingMore: false
// //       }));

// //       console.log(`📄 Total páginas: ${totalPages}, ¿Hay más?: ${hasMoreData}`);

// //     } catch (error) {
// //       console.error("❌ Error cargando productos:", error);
// //       setUiState(prev => ({ ...prev, loadingMore: false }));
// //     }
// //   }, [uiState.searchQuery, uiState.selectedCategory]);

// //   // Carga inicial de datos
// //   const loadInitialData = useCallback(async () => {
// //     try {
// //       setUiState(prev => ({ ...prev, loading: true }));
      
// //       // Cargar productos primero
// //       await loadProductsBatch(1);
      
// //       // Cargar otros datos en paralelo
// //       await Promise.allSettled([
// //         loadCategories(),
// //         loadFeaturedProducts(),
// //         loadContacts(),
// //         loadFavorites(),
// //         loadTarjetas()
// //       ]);

// //     } catch (error) {
// //       console.error("Initial load error:", error);
// //     } finally {
// //       setUiState(prev => ({ ...prev, loading: false }));
// //     }
// //   }, []);

// //   // Carga de categorías
// //   const loadCategories = useCallback(async () => {
// //     try {
// //       const categoriasCache = cache.get(CACHE_KEYS.CATEGORIES);
// //       if (categoriasCache && cache.isValid(CACHE_KEYS.CATEGORIES)) {
// //         updateData({ categorias: categoriasCache.data });
// //         return;
// //       }

// //       const response = await api.get("/categorias");
// //       const categorias = response.data.datos || [];
// //       updateData({ categorias });
// //       cache.set(CACHE_KEYS.CATEGORIES, categorias);
// //     } catch (error) {
// //       console.error("Categories load error:", error);
// //     }
// //   }, []);

// //   // Carga de productos destacados
// //   const loadFeaturedProducts = useCallback(async () => {
// //     try {
// //       const response = await api.get("/productos?destacado=1&limit=10");
// //       const destacados = response.data.datos?.filter(p => 
// //         p?.attributes?.destacado === 1 && p?.attributes?.precio !== undefined
// //       ) || [];
      
// //       updateData({ destacados });
// //       cache.set(CACHE_KEYS.FEATURED, destacados);
// //     } catch (error) {
// //       console.error("Featured products load error:", error);
// //     }
// //   }, []);

// //   // Carga de contactos
// //   const loadContacts = useCallback(async () => {
// //     try {
// //       const response = await api.get("/contactos");
// //       const contacts = response.data.datos || [];
// //       updateData({ contacts });
// //       cache.set(CACHE_KEYS.CONTACTS, contacts);
// //     } catch (error) {
// //       console.error("Contacts load error:", error);
// //     }
// //   }, []);

// //   // Carga de favoritos
// //   const loadFavorites = useCallback(async () => {
// //     if (!user?.id) return;
    
// //     try {
// //       const response = await api.get(`/favoritos-detalles/${user.id}`);
// //       const favoritos = response.data.data || [];
// //       updateData({ favoritos });
// //       cache.set(CACHE_KEYS.FAVORITES, favoritos);
// //     } catch (error) {
// //       console.error("Favorites load error:", error);
// //     }
// //   }, [user?.id]);

// //   // Carga de tarjetas
// //   const loadTarjetas = useCallback(async () => {
// //     try {
// //       const response = await api.get("/tarjetas");
// //       const tarjetas = response.data.data || [];
// //       updateData({ tarjetas });
// //       cache.set(CACHE_KEYS.TARJETAS, tarjetas);
// //     } catch (error) {
// //       console.error("Tarjetas load error:", error);
// //     }
// //   }, []);

// //   // Efectos principales
// //   useEffect(() => {
// //     loadInitialData();
// //   }, []);

// //   useEffect(() => {
// //     if (uiState.page > 1) {
// //       console.log("🎯 Cargando página:", uiState.page);
// //       loadProductsBatch(uiState.page);
// //     }
// //   }, [uiState.page]);

// //   useEffect(() => {
// //     // Actualizar productos filtrados cuando cambia la búsqueda o categoría
// //     if (appData.productos.length > 0) {
// //       const filtered = filterProducts(appData.productos, uiState.searchQuery, uiState.selectedCategory);
// //       updateData({ filteredProductos: filtered });
// //     }
// //   }, [uiState.searchQuery, uiState.selectedCategory, appData.productos]);

// //   // Auto-scroll para productos destacados
// //   useEffect(() => {
// //     const destacados = appData.destacados;
// //     if (destacados.length > 1) {
// //       const interval = setInterval(() => {
// //         const nextIndex = (currentIndexRef.current + 1) % destacados.length;
// //         currentIndexRef.current = nextIndex;

// //         if (featuredListRef.current && nextIndex < destacados.length) {
// //           featuredListRef.current.scrollToIndex({
// //             index: nextIndex,
// //             animated: true,
// //           });
// //         }
// //       }, 3000);

// //       return () => clearInterval(interval);
// //     }
// //   }, [appData.destacados]);

// //   // Funciones de interacción
// //   const showToast = useCallback((message) => {
// //     setToastMessage(message);
// //     Animated.sequence([
// //       Animated.timing(toastOpacity, {
// //         toValue: 1,
// //         duration: 200,
// //         useNativeDriver: true,
// //       }),
// //       Animated.delay(1500),
// //       Animated.timing(toastOpacity, {
// //         toValue: 0,
// //         duration: 200,
// //         useNativeDriver: true,
// //       }),
// //     ]).start(() => setToastMessage(""));
// //   }, [toastOpacity]);

// //   const handleAddToCart = useCallback(async (product, quantity = quantities[product.id] || 1) => {
// //     try {
// //       let userId = user?.id;
// //       if (!userId) {
// //         const anonUser = await AsyncStorage.getItem("anonUser");
// //         if (anonUser) {
// //           userId = JSON.parse(anonUser).id;
// //         } else {
// //           // Crear usuario anónimo si no existe
// //           const newUser = await registerAnonymous();
// //           if (newUser) {
// //             userId = newUser.id;
// //           }
// //         }
// //       }

// //       if (!userId) {
// //         Alert.alert(
// //           "Acción requerida",
// //           "¿Deseas continuar como invitado o iniciar sesión?",
// //           [
// //             { text: "Invitado", onPress: () => registerAnonymous() },
// //             { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
// //           ]
// //         );
// //         return;
// //       }

// //       await addToCart({ ...product, cantidad: quantity });
// //       showToast(`✅ ${quantity} ${product.attributes.nombre} agregado(s) al carrito`);
// //       setQuantities(prev => ({ ...prev, [product.id]: 1 }));

// //     } catch (error) {
// //       console.error("Error adding to cart:", error);
// //       showToast("❌ No se pudo añadir al carrito");
// //     }
// //   }, [quantities, user?.id, addToCart, showToast, navigation, registerAnonymous]);

// //   const isFavorite = useCallback((productId) => {
// //     if (!appData.favoritos || !Array.isArray(appData.favoritos)) return false;
// //     return appData.favoritos.some(fav => 
// //       fav.attributes?.producto?.id === productId || fav.producto_id === productId
// //     );
// //   }, [appData.favoritos]);

// //   const toggleFavorite = useCallback(async (productId) => {
// //     if (!user?.id) {
// //       Alert.alert(
// //         "Acción requerida",
// //         "Debes iniciar sesión para guardar favoritos",
// //         [
// //           { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
// //           { text: "Cancelar", style: "cancel" },
// //         ]
// //       );
// //       return;
// //     }

// //     if (favoriteLoading === productId) return;
// //     setFavoriteLoading(productId);

// //     try {
// //       const wasFavorite = isFavorite(productId);
      
// //       if (wasFavorite) {
// //         await api.delete(`/favoritos/${user.id}/${productId}`);
// //       } else {
// //         await api.post("/favoritos", {
// //           usuario_id: user.id,
// //           producto_id: productId,
// //         });
// //       }

// //       // Recargar favoritos
// //       await loadFavorites();
// //       showToast(wasFavorite ? "❌ Eliminado de favoritos" : "✅ Agregado a favoritos");

// //     } catch (error) {
// //       console.error("Favorite toggle error:", error);
// //       showToast("❌ Error al actualizar favoritos");
// //     } finally {
// //       setFavoriteLoading(null);
// //     }
// //   }, [user?.id, isFavorite, favoriteLoading, loadFavorites, navigation]);

// //   const handleQuantityChange = useCallback((productId, newQuantity) => {
// //     setQuantities(prev => ({
// //       ...prev,
// //       [productId]: Math.max(1, Math.min(newQuantity, 100))
// //     }));
// //   }, []);

// //   const handleProductPress = useCallback((item) => {
// //     navigation.navigate("Detalles", {
// //       producto: item,
// //       productoId: item?.attributes.nombre,
// //       precio: item?.attributes.precio,
// //       stock: item?.attributes.cantidad,
// //       imag: item?.attributes.imagen,
// //       descripcion: item.attributes.descripcion,
// //       id: item.id,
// //       usuario: user,
// //       cantActual: quantities[item.id] || 1,
// //       volumen: item.attributes.volumen,
// //       sexo: item.attributes.sexo,
// //       marca: item.attributes.marca,
// //       categoria: item.attributes.categoria,
// //       tarjetas: appData.tarjetas,
// //     });
// //   }, [navigation, user, quantities, appData.tarjetas]);

// //   const ComprarAhora = useCallback(async (product, quantity = quantities[product.id] || 1, costo) => {
// //     const totalApagar = quantity * costo;
    
// //     if (user?.esAnonimo) {
// //       Alert.alert(
// //         "Cuenta temporal",
// //         "Para finalizar tu compra necesitas registrar una cuenta completa",
// //         [
// //           { text: "Registrarme", onPress: () => navigation.replace("Registro") },
// //           { text: "Iniciar sesión", onPress: () => navigation.replace("Login") },
// //           { text: "Más tarde", style: "cancel" },
// //         ]
// //       );
// //       return;
// //     }

// //     try {
// //       if (!appData.tarjetas || appData.tarjetas.length === 0) {
// //         Alert.alert("Error", "No hay métodos de pago disponibles");
// //         return;
// //       }
      
// //       product.attributes.cantidad = quantity;
// //       product.attributes.producto_id = product.id;
      
// //       navigation.navigate("Checkout1", {
// //         total: totalApagar,
// //         pagina: "S",
// //         cartItems: product,
// //       });
// //     } catch (error) {
// //       console.error("Checkout error:", error);
// //       Alert.alert("Error", "No se pudo procesar la compra");
// //     }
// //   }, [user, quantities, appData.tarjetas, navigation]);

// //   const openWhatsApp = useCallback(async (selectedNumber) => {
// //     const message = "Hola, me interesa uno de tus productos";
// //     const url = `https://wa.me/+53${selectedNumber}?text=${encodeURIComponent(message)}`;

// //     try {
// //       const supported = await Linking.canOpenURL(url);
// //       if (supported) {
// //         await Linking.openURL(url);
// //       } else {
// //         const webUrl = `https://web.whatsapp.com/send?phone=${selectedNumber}&text=${encodeURIComponent(message)}`;
// //         await Linking.openURL(webUrl);
// //       }
// //     } catch (error) {
// //       Alert.alert("Error", "No se pudo abrir WhatsApp");
// //     }
// //   }, []);

// //   // Funciones de UI
// //   const onRefresh = useCallback(async () => {
// //     try {
// //       setUiState(prev => ({ 
// //         ...prev, 
// //         refreshing: true, 
// //         page: 1,
// //         hasMore: true 
// //       }));
// //       cache.clear();
// //       resetData();
// //       await loadProductsBatch(1);
// //     } catch (error) {
// //       console.error("Refresh error:", error);
// //     } finally {
// //       setUiState(prev => ({ ...prev, refreshing: false }));
// //     }
// //   }, [cache, resetData, loadProductsBatch]);

// //   const handleLoadMore = useCallback(() => {
// //     if (!uiState.loading && uiState.hasMore && !uiState.refreshing && !uiState.loadingMore) {
// //       console.log("🔄 Cargando más productos, página:", uiState.page + 1);
// //       setUiState(prev => ({ 
// //         ...prev, 
// //         page: prev.page + 1,
// //         loadingMore: true 
// //       }));
// //     }
// //   }, [uiState.loading, uiState.hasMore, uiState.refreshing, uiState.loadingMore, uiState.page]);

// //   const renderCategory = useCallback(({ item }) => (
// //     <TouchableOpacity
// //       style={[
// //         styles.categoryItem,
// //         uiState.selectedCategory === item.attributes.descripcion && styles.selectedCategoryItem,
// //       ]}
// //       onPress={() => {
// //         setUiState(prev => ({
// //           ...prev,
// //           selectedCategory: prev.selectedCategory === item.attributes.descripcion ? null : item.attributes.descripcion,
// //         }));
// //       }}
// //     >
// //       <View style={styles.categoryContent}>
// //         <MaterialIcons
// //           name={item.attributes.icon}
// //           size={20}
// //           color="#FFF"
// //         />
// //         <Text
// //           style={[
// //             styles.categoryText,
// //             uiState.selectedCategory === item.attributes.descripcion && styles.selectedCategoryText,
// //           ]}
// //           numberOfLines={1}
// //         >
// //           {item.attributes.descripcion}
// //         </Text>
// //       </View>
// //     </TouchableOpacity>
// //   ), [uiState.selectedCategory]);

// //   const renderProductItem = useCallback(({ item }) => (
// //     <ProductItem
// //       item={item}
// //       isFavorite={isFavorite}
// //       favoriteLoading={favoriteLoading}
// //       quantity={quantities[item.id] || 1}
// //       onPress={handleProductPress}
// //       handleAddToCart={handleAddToCart}
// //       toggleFavorite={toggleFavorite}
// //       handleQuantityChange={handleQuantityChange}
// //       ComprarAhora={ComprarAhora}
// //       dirImg={dirImg}
// //     />
// //   ), [isFavorite, favoriteLoading, quantities, handleProductPress, handleAddToCart, toggleFavorite, handleQuantityChange, ComprarAhora, dirImg]);

// //   const renderFeaturedItem = useCallback(({ item }) => (
// //     <FeaturedItem
// //       item={item}
// //       onPress={handleProductPress}
// //       dirImg={dirImg}
// //     />
// //   ), [handleProductPress, dirImg]);

// //   // Render principal
// //   return (
// //     <View style={styles.mainContainer}>
// //       <LinearGradient
// //         colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
// //         style={styles.container}
// //       >
// //         {/* Header */}
// //         <View style={styles.topBar}>
// //           <TouchableOpacity
// //             onPress={() => navigation.toggleDrawer?.()}
// //             style={styles.menuButton}
// //           >
// //             <Ionicons name="menu" size={28} color="#FFF" />
// //           </TouchableOpacity>

// //           <View style={styles.searchContainer}>
// //             <TextInput
// //               style={styles.searchBar}
// //               placeholder="Buscar productos..."
// //               placeholderTextColor="#888"
// //               value={uiState.searchQuery}
// //               onChangeText={(text) => setUiState(prev => ({ ...prev, searchQuery: text }))}
// //             />
// //             {uiState.searchQuery.length > 0 && (
// //               <TouchableOpacity
// //                 style={styles.clearSearchButton}
// //                 onPress={() => setUiState(prev => ({ ...prev, searchQuery: "" }))}
// //               >
// //                 <MaterialIcons name="close" size={20} color="#888" />
// //               </TouchableOpacity>
// //             )}
// //           </View>

// //           <TouchableOpacity
// //             style={styles.categoryToggleButton}
// //             onPress={() => setUiState(prev => ({ ...prev, showCategories: !prev.showCategories }))}
// //           >
// //             <MaterialIcons
// //               name={uiState.showCategories ? "close" : "filter-list"}
// //               size={24}
// //               color="#FFF"
// //             />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Categorías */}
// //         {uiState.showCategories && (
// //           <View style={styles.categoriesWrapper}>
// //             <Text style={styles.sectionTitle}>Categorías</Text>
// //             <FlashList
// //               horizontal
// //               showsHorizontalScrollIndicator={false}
// //               data={[
// //                 { id: null, attributes: { descripcion: "Todas", icon: "apps" } },
// //                 ...appData.categorias,
// //               ]}
// //               renderItem={renderCategory}
// //               keyExtractor={(item, index) => `category-${item?.id || "all"}-${index}`}
// //               estimatedItemSize={100}
// //               contentContainerStyle={styles.categoriesContainer}
// //             />
// //           </View>
// //         )}

// //         {/* Lista principal */}
// //         <FlashList
// //           key={`main-list-${appData.productos.length}`}
// //           data={appData.filteredProductos}
// //           keyExtractor={(item) => `prod_${item.id}`}
// //           renderItem={renderProductItem}
// //           numColumns={2}
// //           estimatedItemSize={345}
// //           initialNumToRender={8}
// //           maxToRenderPerBatch={8}
// //           windowSize={7}
// //           removeClippedSubviews={Platform.OS === "android"}
// //           ListHeaderComponent={
// //             <>
// //               {/* Productos destacados */}
// //               {appData.destacados.length > 0 && (
// //                 <View style={styles.featuredContainer}>
// //                   <Text style={styles.sectionTitle}>Destacados</Text>
// //                   <FlashList
// //                     ref={featuredListRef}
// //                     horizontal
// //                     pagingEnabled
// //                     showsHorizontalScrollIndicator={false}
// //                     data={appData.destacados}
// //                     keyExtractor={(item, index) => `featured-${item?.id || "all"}-${index}`}
// //                     estimatedItemSize={width * 0.8}
// //                     renderItem={renderFeaturedItem}
// //                   />
// //                 </View>
// //               )}
// //             </>
// //           }
// //           ListEmptyComponent={
// //             <Text style={styles.noResults}>
// //               {uiState.loading ? "Cargando..." : "No se encontraron productos"}
// //             </Text>
// //           }
// //           ListFooterComponent={
// //             uiState.loadingMore ? (
// //               <View style={styles.loadingMoreContainer}>
// //                 <ActivityIndicator size="small" color="#FFF" />
// //                 <Text style={styles.loadingMoreText}>Cargando más productos...</Text>
// //               </View>
// //             ) : !uiState.hasMore && appData.filteredProductos.length > 0 ? (
// //               <Text style={styles.endMessage}>No hay más productos para mostrar</Text>
// //             ) : null
// //           }
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={uiState.refreshing}
// //               onRefresh={onRefresh}
// //               colors={["#FF6000"]}
// //               tintColor="#FFF"
// //             />
// //           }
// //           onEndReached={handleLoadMore}
// //           onEndReachedThreshold={0.1}
// //           columnWrapperStyle={styles.row}
// //         />

// //         {/* Botón de WhatsApp */}
// //         {appData.contacts.length > 0 && (
// //           <TouchableOpacity
// //             style={styles.whatsappButton}
// //             onPress={() => {
// //               if (appData.contacts.length === 1) {
// //                 openWhatsApp(appData.contacts[0].attributes?.numero);
// //               } else if (appData.contacts.length > 1) {
// //                 setUiState(prev => ({ ...prev, showContactModal: true }));
// //               }
// //             }}
// //           >
// //             <FontAwesome name="whatsapp" size={40} color="#FFF" />
// //           </TouchableOpacity>
// //         )}

// //         {/* Modal de contactos */}
// //         <Modal
// //           visible={uiState.showContactModal}
// //           transparent={true}
// //           animationType="slide"
// //           onRequestClose={() => setUiState(prev => ({ ...prev, showContactModal: false }))}
// //         >
// //           <View style={styles.modalContainer}>
// //             <View style={styles.modalContent}>
// //               <Text style={styles.modalTitle}>Seleccione un contacto</Text>
// //               {appData.contacts.map((contact, index) => (
// //                 <TouchableOpacity
// //                   key={`contact-${index}`}
// //                   style={styles.contactItem}
// //                   onPress={() => {
// //                     openWhatsApp(contact.attributes.numero);
// //                     setUiState(prev => ({ ...prev, showContactModal: false }));
// //                   }}
// //                 >
// //                   <Text style={styles.contactName}>{contact.attributes.nick}</Text>
// //                   <Text style={styles.contactNumber}>{contact.attributes.numero}</Text>
// //                 </TouchableOpacity>
// //               ))}
// //               <TouchableOpacity
// //                 style={styles.cancelButton}
// //                 onPress={() => setUiState(prev => ({ ...prev, showContactModal: false }))}
// //               >
// //                 <Text style={styles.cancelButtonText}>Cancelar</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Modal>

// //         {/* Toast */}
// //         <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
// //           <Text style={styles.toastText}>{toastMessage}</Text>
// //         </Animated.View>
// //       </LinearGradient>
// //     </View>
// //   );
// // };

// // // Estilos
// // const styles = StyleSheet.create({
// //   mainContainer: {
// //     flex: 1,
// //     backgroundColor: "#f8f9fa",
// //   },
// //   container: {
// //     flex: 1,
// //     paddingHorizontal: 12,
// //   },
// //   topBar: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 12,
// //     paddingTop: Constants.statusBarHeight + 20,
// //   },
// //   searchContainer: {
// //     flex: 1,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#FFF",
// //     borderRadius: 24,
// //     paddingHorizontal: 15,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 2,
// //   },
// //   searchBar: {
// //     flex: 1,
// //     height: 44,
// //     fontSize: 15,
// //     color: "#333",
// //     paddingVertical: 10,
// //   },
// //   clearSearchButton: {
// //     padding: 8,
// //     marginLeft: 4,
// //   },
// //   categoryToggleButton: {
// //     padding: 10,
// //     marginLeft: 9,
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     borderRadius: 20,
// //   },
// //   categoriesWrapper: {
// //     marginBottom: 16,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: "#FFF",
// //     marginVertical: 12,
// //     marginLeft: 8,
// //   },
// //   categoriesContainer: {
// //     paddingHorizontal: 12,
// //     paddingBottom: 16,
// //   },
// //   categoryItem: {
// //     minWidth: 100,
// //     height: 44,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 12,
// //     paddingHorizontal: 12,
// //     backgroundColor: "rgba(255,255,255,0.1)",
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: "transparent",
// //   },
// //   categoryContent: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //   },
// //   categoryText: {
// //     color: "rgba(255,255,255,0.9)",
// //     fontSize: 13,
// //     textAlign: "center",
// //     flexShrink: 1,
// //   },
// //   selectedCategoryItem: {
// //     backgroundColor: "rgba(255, 255, 255, 0.27)",
// //     borderColor: "#FF6B00",
// //   },
// //   selectedCategoryText: {
// //     color: "#FFF",
// //     fontWeight: "600",
// //   },
// //   featuredContainer: {
// //     marginBottom: 20,
// //   },
// //   featuredItem: {
// //     width: width * 0.8,
// //     backgroundColor: "rgba(50, 58, 132, 0.29)",
// //     borderRadius: 12,
// //     overflow: "hidden",
// //     marginRight: 16,
// //   },
// //   featuredImage: {
// //     width: "100%",
// //     height: 150,
// //   },
// //   featuredInfo: {
// //     padding: 13,
// //   },
// //   featuredName: {
// //     color: "#FFF",
// //     fontSize: 16,
// //     fontWeight: "600",
// //     marginBottom: 6,
// //   },
// //   description: {
// //     fontSize: 14,
// //     color: "rgba(255,255,255,0.85)",
// //     lineHeight: 20,
// //     marginBottom: 8,
// //   },
// //   featuredPrice: {
// //     color: "#FFD700",
// //     fontSize: 18,
// //     fontWeight: "700",
// //     marginTop: 4,
// //   },
// //   row: {
// //     justifyContent: "space-between",
// //     paddingHorizontal: 4,
// //     marginBottom: 16,
// //   },
// //   gridItem: {
// //     width: itemWidth,
// //     paddingHorizontal: 2,
// //     marginBottom: 10,
// //   },
// //   productCard: {
// //     backgroundColor: "#FFF",
// //     borderRadius: 12,
// //     overflow: "hidden",
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     height: 345,
// //     marginBottom: 5,
// //   },
// //   gridImage: {
// //     width: "100%",
// //     height: itemWidth - 20,
// //     resizeMode: "cover",
// //   },
// //   productInfo: {
// //     padding: 12,
// //     flex: 1,
// //     justifyContent: "space-between",
// //   },
// //   productName: {
// //     fontSize: 15,
// //     fontWeight: "600",
// //     color: "#333",
// //     height: 25,
// //   },
// //   descriptionP: {
// //     fontSize: 13,
// //     color: "#666",
// //     lineHeight: 18,
// //     marginBottom: 2,
// //     height: 36,
// //   },
// //   productPrice: {
// //     fontSize: 17,
// //     fontWeight: "700",
// //     color: "#1a3a8f",
// //     marginBottom: 8,
// //   },
// //   soldOut: {
// //     color: "#FF0000",
// //     fontWeight: "700",
// //     textAlign: "center",
// //     paddingVertical: 8,
// //     fontSize: 14,
// //   },
// //   productActions: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     paddingTop: 8,
// //     borderTopWidth: 1,
// //     borderTopColor: "rgba(0,0,0,0.1)",
// //     height: 50,
// //   },
// //   actionButton: {
// //     backgroundColor: "#1a3a8f",
// //     borderRadius: 6,
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //     height: 36,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flex: 1,
// //     marginRight: 8,
// //     minWidth: 40,
// //   },
// //   buyNowButton: {
// //     backgroundColor: "#FF6B00",
// //     marginLeft: 0,
// //     flex: 2,
// //   },
// //   buyNowText: {
// //     color: "#FFF",
// //     fontSize: 10,
// //     fontWeight: "600",
// //   },
// //   favoriteButton: {
// //     position: "absolute",
// //     top: 12,
// //     right: 12,
// //     zIndex: 1,
// //     backgroundColor: "rgba(255,255,255,0.8)",
// //     borderRadius: 20,
// //     width: 36,
// //     height: 36,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     elevation: 2,
// //   },
// //   whatsappButton: {
// //     position: "absolute",
// //     bottom: 24,
// //     right: 24,
// //     backgroundColor: "#25D366",
// //     width: 64,
// //     height: 64,
// //     borderRadius: 32,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     elevation: 6,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 4,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //   },
// //   modalContent: {
// //     width: "85%",
// //     backgroundColor: "#FFF",
// //     borderRadius: 12,
// //     padding: 20,
// //     elevation: 5,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     marginBottom: 16,
// //     textAlign: "center",
// //     color: "#333",
// //   },
// //   contactItem: {
// //     padding: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#EEE",
// //   },
// //   contactName: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     color: "#333",
// //   },
// //   contactNumber: {
// //     fontSize: 14,
// //     color: "#666",
// //     marginTop: 4,
// //   },
// //   cancelButton: {
// //     marginTop: 16,
// //     padding: 12,
// //     backgroundColor: "#FF6000",
// //     borderRadius: 8,
// //     alignItems: "center",
// //   },
// //   cancelButtonText: {
// //     color: "#FFF",
// //     fontWeight: "600",
// //     fontSize: 16,
// //   },
// //   noResults: {
// //     textAlign: "center",
// //     marginVertical: 40,
// //     fontSize: 16,
// //     color: "#FFF",
// //   },
// //   endMessage: {
// //     textAlign: "center",
// //     color: "#FFF",
// //     paddingVertical: 24,
// //     fontSize: 15,
// //     opacity: 0.8,
// //   },
// //   loadingContainer: {
// //     paddingVertical: 24,
// //   },
// //   toastContainer: {
// //     position: "absolute",
// //     bottom: 100,
// //     alignSelf: "center",
// //     backgroundColor: "rgba(0, 0, 0, 0.7)",
// //     paddingVertical: 10,
// //     paddingHorizontal: 15,
// //     borderRadius: 20,
// //     zIndex: 1000,
// //   },
// //   toastText: {
// //     color: "#FFF",
// //     fontSize: 14,
// //   },
// //   menuButton: {
// //     padding: 9,
// //     marginRight: 8,
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     borderRadius: 20,
// //   },
// //   loadingMoreContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingVertical: 16,
// //     gap: 8,
// //   },
// //   loadingMoreText: {
// //     color: '#FFF',
// //     fontSize: 14,
// //   },
// //   endMessage: {
// //     textAlign: "center",
// //     color: "#FFF",
// //     paddingVertical: 24,
// //     fontSize: 15,
// //     opacity: 0.8,
// //   },
// // });

// // export default React.memo(HomeScreen);

// // Version SIMPLIFICADA - FUNCIONAL
// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useCallback,
// } from "react";
// import {
//   RefreshControl,
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   Linking,
//   Dimensions,
//   Animated,
//   Platform,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useUser } from "./UserContext";
// import { useCart } from "./CartContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import { Image } from "expo-image";
// import { FlashList } from "@shopify/flash-list";
// import {
//   MaterialIcons,
//   Ionicons,
//   FontAwesome,
// } from "@expo/vector-icons";
// import api from "../api/api";
// import QuantitySelector from "./QuantitySelector";

// const { width } = Dimensions.get("window");
// const itemWidth = (width - 40) / 2;

// const HomeScreen = ({ navigation, route }) => {
//   const dirImg = Constants.expoConfig.extra.dirImg;
  
//   // Estados simplificados
//   const [productos, setProductos] = useState([]);
//   const [filteredProductos, setFilteredProductos] = useState([]);
//   const [destacados, setDestacados] = useState([]);
//   const [categorias, setCategorias] = useState([]);
//   const [favoritos, setFavoritos] = useState([]);
//   const [contacts, setContacts] = useState([]);
//   const [tarjetas, setTarjetas] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [showCategories, setShowCategories] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [favoriteLoading, setFavoriteLoading] = useState(null);
//   const [quantities, setQuantities] = useState({});

//   const { user, logout } = useUser();
//   const { addToCart, loadCart } = useCart();
  
//   const toastOpacity = useRef(new Animated.Value(0)).current;
//   const [toastMessage, setToastMessage] = useState("");
//   const featuredListRef = useRef(null);

//   // Función para cargar todos los datos
//   const loadAllData = async () => {
//     try {
//       setLoading(true);
//       console.log("🔄 Iniciando carga de datos...");

//       // Cargar productos
//       const productosRes = await api.get(`/productos?page=1&limit=20`);
//       console.log("📦 Productos cargados:", productosRes.data.datos?.length || 0);
      
//       const productosData = productosRes.data.datos || [];
//       setProductos(productosData);
//       setFilteredProductos(productosData);

//       // Cargar destacados
//       const destacadosData = productosData.filter(p => 
//         p?.attributes?.destacado === 1 && p?.attributes?.precio !== undefined
//       );
//       setDestacados(destacadosData);
//       console.log("⭐ Destacados:", destacadosData.length);

//       // Cargar categorías
//       const categoriasRes = await api.get("/categorias");
//       setCategorias(categoriasRes.data.datos || []);
//       console.log("📂 Categorías:", categoriasRes.data.datos?.length || 0);

//       // Cargar contactos
//       const contactsRes = await api.get("/contactos");
//       setContacts(contactsRes.data.datos || []);
//       console.log("📞 Contactos:", contactsRes.data.datos?.length || 0);

//       // Cargar tarjetas
//       const tarjetasRes = await api.get("/tarjetas");
//       setTarjetas(tarjetasRes.data.data || []);
//       console.log("💳 Tarjetas:", tarjetasRes.data.data?.length || 0);

//       // Cargar favoritos si hay usuario
//       if (user?.id) {
//         try {
//           const favoritosRes = await api.get(`/favoritos-detalles/${user.id}`);
//           setFavoritos(favoritosRes.data.data || []);
//           console.log("❤️ Favoritos:", favoritosRes.data.data?.length || 0);
//         } catch (error) {
//           console.log("❌ Error cargando favoritos:", error);
//         }
//       }

//     } catch (error) {
//       console.error("❌ Error cargando datos:", error);
//       Alert.alert("Error", "No se pudieron cargar los productos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cargar datos al inicio
//   useEffect(() => {
//     loadAllData();
//   }, []);

//   // Filtrar productos cuando cambia la búsqueda o categoría
//   useEffect(() => {
//     if (productos.length === 0) return;

//     let filtered = productos.filter(product => {
//       if (!product?.id || !product?.attributes) return false;
//       if (product.attributes?.activo === false) return false;
//       if (product.attributes?.cantidad <= 0) return false;

//       // Filtrar por búsqueda
//       const matchesSearch = !searchQuery || 
//         product.attributes.nombre?.toLowerCase().includes(searchQuery.toLowerCase());

//       // Filtrar por categoría
//       const matchesCategory = !selectedCategory || 
//         selectedCategory === "Todas" || 
//         product.attributes.categoria === selectedCategory;

//       return matchesSearch && matchesCategory;
//     });

//     console.log("🔍 Productos filtrados:", filtered.length);
//     setFilteredProductos(filtered);
//   }, [searchQuery, selectedCategory, productos]);

//   // Funciones básicas
//   const showToast = (message) => {
//     setToastMessage(message);
//     Animated.sequence([
//       Animated.timing(toastOpacity, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.delay(1500),
//       Animated.timing(toastOpacity, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start(() => setToastMessage(""));
//   };

//   const handleAddToCart = async (product, quantity = quantities[product.id] || 1) => {
//     try {
//       let userId = user?.id;
      
//       if (!userId) {
//         Alert.alert(
//           "Acción requerida",
//           "Debes iniciar sesión para agregar al carrito",
//           [
//             { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
//             { text: "Cancelar", style: "cancel" },
//           ]
//         );
//         return;
//       }

//       await addToCart({ ...product, cantidad: quantity });
//       showToast(`✅ ${quantity} ${product.attributes.nombre} agregado(s) al carrito`);
//       setQuantities(prev => ({ ...prev, [product.id]: 1 }));

//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       showToast("❌ No se pudo añadir al carrito");
//     }
//   };

//   const isFavorite = (productId) => {
//     return favoritos.some(fav => 
//       fav.attributes?.producto?.id === productId || fav.producto_id === productId
//     );
//   };

//   const toggleFavorite = async (productId) => {
//     if (!user?.id) {
//       Alert.alert(
//         "Acción requerida",
//         "Debes iniciar sesión para guardar favoritos",
//         [
//           { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
//           { text: "Cancelar", style: "cancel" },
//         ]
//       );
//       return;
//     }

//     if (favoriteLoading === productId) return;
//     setFavoriteLoading(productId);

//     try {
//       const wasFavorite = isFavorite(productId);
      
//       if (wasFavorite) {
//         await api.delete(`/favoritos/${user.id}/${productId}`);
//         setFavoritos(prev => prev.filter(fav => 
//           fav.attributes?.producto?.id !== productId && fav.producto_id !== productId
//         ));
//       } else {
//         await api.post("/favoritos", {
//           usuario_id: user.id,
//           producto_id: productId,
//         });
//         setFavoritos(prev => [...prev, { producto_id: productId }]);
//       }

//       showToast(wasFavorite ? "❌ Eliminado de favoritos" : "✅ Agregado a favoritos");

//     } catch (error) {
//       console.error("Favorite toggle error:", error);
//       showToast("❌ Error al actualizar favoritos");
//     } finally {
//       setFavoriteLoading(null);
//     }
//   };

//   const handleQuantityChange = (productId, newQuantity) => {
//     setQuantities(prev => ({
//       ...prev,
//       [productId]: Math.max(1, Math.min(newQuantity, 100))
//     }));
//   };

//   const handleProductPress = (item) => {
//     navigation.navigate("Detalles", {
//       producto: item,
//       productoId: item?.attributes.nombre,
//       precio: item?.attributes.precio,
//       stock: item?.attributes.cantidad,
//       imag: item?.attributes.imagen,
//       descripcion: item.attributes.descripcion,
//       id: item.id,
//       usuario: user,
//       cantActual: quantities[item.id] || 1,
//       volumen: item.attributes.volumen,
//       sexo: item.attributes.sexo,
//       marca: item.attributes.marca,
//       categoria: item.attributes.categoria,
//       tarjetas: tarjetas,
//     });
//   };

//   const ComprarAhora = async (product, quantity = quantities[product.id] || 1, costo) => {
//     const totalApagar = quantity * costo;
    
//     if (!user?.id) {
//       Alert.alert(
//         "Acción requerida",
//         "Debes iniciar sesión para comprar",
//         [
//           { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
//           { text: "Cancelar", style: "cancel" },
//         ]
//       );
//       return;
//     }

//     try {
//       if (!tarjetas || tarjetas.length === 0) {
//         Alert.alert("Error", "No hay métodos de pago disponibles");
//         return;
//       }
      
//       product.attributes.cantidad = quantity;
//       product.attributes.producto_id = product.id;
      
//       navigation.navigate("Checkout1", {
//         total: totalApagar,
//         pagina: "S",
//         cartItems: product,
//       });
//     } catch (error) {
//       console.error("Checkout error:", error);
//       Alert.alert("Error", "No se pudo procesar la compra");
//     }
//   };

//   const openWhatsApp = async (selectedNumber) => {
//     const message = "Hola, me interesa uno de tus productos";
//     const url = `https://wa.me/+53${selectedNumber}?text=${encodeURIComponent(message)}`;

//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         const webUrl = `https://web.whatsapp.com/send?phone=${selectedNumber}&text=${encodeURIComponent(message)}`;
//         await Linking.openURL(webUrl);
//       }
//     } catch (error) {
//       Alert.alert("Error", "No se pudo abrir WhatsApp");
//     }
//   };

//   const onRefresh = async () => {
//     try {
//       setRefreshing(true);
//       await loadAllData();
//     } catch (error) {
//       console.error("Refresh error:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Componente de Producto
//   const ProductItem = ({ item }) => {
//     const itemImageUrl = item?.attributes?.imagen
//       ? `http://${dirImg}${item.attributes.imagen.split("/").pop()}`
//       : `http://${dirImg}uploads/iconoI.png`;

//     const precio = item?.attributes?.precio
//       ? `$ ${Number(item.attributes.precio).toFixed(2)}`
//       : "Precio no disponible";

//     const truncatedDescription = item.attributes?.descripcion?.length > 25
//       ? `${item.attributes.descripcion.substring(0, 25)}...`
//       : item.attributes?.descripcion;

//     const isProductFavorite = isFavorite(item.id);

//     return (
//       <TouchableOpacity style={styles.gridItem} onPress={() => handleProductPress(item)}>
//         <View style={styles.productCard}>
//           <TouchableOpacity
//             style={styles.favoriteButton}
//             onPress={(e) => {
//               e.stopPropagation();
//               toggleFavorite(item.id);
//             }}
//             disabled={favoriteLoading === item.id}
//           >
//             {favoriteLoading === item.id ? (
//               <ActivityIndicator size="small" color="#FF0000" />
//             ) : (
//               <Ionicons
//                 name={isProductFavorite ? "heart" : "heart-outline"}
//                 size={20}
//                 color={isProductFavorite ? "#FF0000" : "#1a3a8f"}
//               />
//             )}
//           </TouchableOpacity>

//           <Image
//             source={{ uri: itemImageUrl }}
//             style={styles.gridImage}
//             placeholder={require("../assets/sindatos.png")}
//             contentFit="cover"
//           />

//           <View style={styles.productInfo}>
//             <Text style={styles.productName} numberOfLines={1}>
//               {item.attributes?.nombre || "Nombre no disponible"}
//             </Text>
//             <Text style={styles.descriptionP} numberOfLines={2}>
//               {truncatedDescription} ({item.attributes?.volumen})
//             </Text>
//             <Text style={styles.productPrice}>{precio}</Text>

//             {item.attributes?.cantidad === 0 ? (
//               <Text style={styles.soldOut}>AGOTADO</Text>
//             ) : (
//               <>
//                 <QuantitySelector
//                   initialQuantity={quantities[item.id] || 1}
//                   handleQuantityChange={(newQty) => handleQuantityChange(item.id, newQty)}
//                   maxQuantity={item.attributes?.cantidad}
//                   compact={true}
//                 />
//                 <View style={styles.productActions}>
//                   <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={() => handleAddToCart(item, quantities[item.id] || 1)}
//                   >
//                     <Ionicons name="cart-outline" size={18} color="#FFF" />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.actionButton, styles.buyNowButton]}
//                     onPress={() => ComprarAhora(item, quantities[item.id] || 1, item.attributes.precio)}
//                   >
//                     <Text style={styles.buyNowText}>Comprar</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Componente de Producto Destacado
//   const FeaturedItem = ({ item }) => {
//     const imageUri = item?.attributes?.imagen
//       ? `http://${dirImg}${item.attributes.imagen.split("/").pop()}`
//       : `http://${dirImg}uploads/iconoI.png`;

//     const precio = item?.attributes?.precio
//       ? `$${Number(item.attributes.precio).toFixed(2)}`
//       : "Precio no disponible";

//     const truncatedDescription = item.attributes?.descripcion?.length > 50
//       ? `${item.attributes.descripcion.substring(0, 50)}...`
//       : item.attributes?.descripcion;

//     return (
//       <TouchableOpacity style={styles.featuredItem} onPress={() => handleProductPress(item)}>
//         <Image
//           source={{ uri: imageUri }}
//           style={styles.featuredImage}
//           contentFit="cover"
//         />
//         <View style={styles.featuredInfo}>
//           <Text style={styles.featuredName}>{item.attributes?.nombre}</Text>
//           <Text style={styles.description}>
//             {truncatedDescription} ({item.attributes?.volumen})
//           </Text>
//           <Text style={styles.featuredPrice}>{precio}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Render de categoría
//   const renderCategory = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.categoryItem,
//         selectedCategory === item.attributes.descripcion && styles.selectedCategoryItem,
//       ]}
//       onPress={() => {
//         setSelectedCategory(
//           selectedCategory === item.attributes.descripcion ? null : item.attributes.descripcion
//         );
//       }}
//     >
//       <View style={styles.categoryContent}>
//         <MaterialIcons
//           name={item.attributes.icon}
//           size={20}
//           color="#FFF"
//         />
//         <Text
//           style={[
//             styles.categoryText,
//             selectedCategory === item.attributes.descripcion && styles.selectedCategoryText,
//           ]}
//           numberOfLines={1}
//         >
//           {item.attributes.descripcion}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.mainContainer}>
//       <LinearGradient
//         colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//         style={styles.container}
//       >
//         {/* Header */}
//         <View style={styles.topBar}>
//           <TouchableOpacity
//             onPress={() => navigation.toggleDrawer?.()}
//             style={styles.menuButton}
//           >
//             <Ionicons name="menu" size={28} color="#FFF" />
//           </TouchableOpacity>

//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchBar}
//               placeholder="Buscar productos..."
//               placeholderTextColor="#888"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity
//                 style={styles.clearSearchButton}
//                 onPress={() => setSearchQuery("")}
//               >
//                 <MaterialIcons name="close" size={20} color="#888" />
//               </TouchableOpacity>
//             )}
//           </View>

//           <TouchableOpacity
//             style={styles.categoryToggleButton}
//             onPress={() => setShowCategories(!showCategories)}
//           >
//             <MaterialIcons
//               name={showCategories ? "close" : "filter-list"}
//               size={24}
//               color="#FFF"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Categorías */}
//         {showCategories && (
//           <View style={styles.categoriesWrapper}>
//             <Text style={styles.sectionTitle}>Categorías</Text>
//             <FlashList
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               data={[
//                 { id: null, attributes: { descripcion: "Todas", icon: "apps" } },
//                 ...categorias,
//               ]}
//               renderItem={renderCategory}
//               keyExtractor={(item, index) => `category-${item?.id || "all"}-${index}`}
//               estimatedItemSize={100}
//               contentContainerStyle={styles.categoriesContainer}
//             />
//           </View>
//         )}

//         {/* Lista principal */}
//         <FlashList
//           data={filteredProductos}
//           keyExtractor={(item) => `prod_${item.id}`}
//           renderItem={({ item }) => <ProductItem item={item} />}
//           numColumns={2}
//           estimatedItemSize={345}
//           initialNumToRender={8}
//           ListHeaderComponent={
//             <>
//               {/* Productos destacados */}
//               {destacados.length > 0 && (
//                 <View style={styles.featuredContainer}>
//                   <Text style={styles.sectionTitle}>Destacados</Text>
//                   <FlashList
//                     ref={featuredListRef}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     data={destacados}
//                     keyExtractor={(item, index) => `featured-${item?.id || "all"}-${index}`}
//                     estimatedItemSize={width * 0.8}
//                     renderItem={({ item }) => <FeaturedItem item={item} />}
//                   />
//                 </View>
//               )}
//             </>
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.noResults}>
//                 {loading ? "Cargando productos..." : "No se encontraron productos"}
//               </Text>
//               {!loading && (
//                 <TouchableOpacity style={styles.retryButton} onPress={loadAllData}>
//                   <Text style={styles.retryButtonText}>Reintentar</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           }
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={["#FF6000"]}
//               tintColor="#FFF"
//             />
//           }
//           columnWrapperStyle={styles.row}
//         />

//         {/* Botón de WhatsApp */}
//         {contacts.length > 0 && (
//           <TouchableOpacity
//             style={styles.whatsappButton}
//             onPress={() => {
//               if (contacts.length === 1) {
//                 openWhatsApp(contacts[0].attributes?.numero);
//               } else if (contacts.length > 1) {
//                 setShowContactModal(true);
//               }
//             }}
//           >
//             <FontAwesome name="whatsapp" size={40} color="#FFF" />
//           </TouchableOpacity>
//         )}

//         {/* Modal de contactos */}
//         <Modal
//           visible={showContactModal}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowContactModal(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Seleccione un contacto</Text>
//               {contacts.map((contact, index) => (
//                 <TouchableOpacity
//                   key={`contact-${index}`}
//                   style={styles.contactItem}
//                   onPress={() => {
//                     openWhatsApp(contact.attributes.numero);
//                     setShowContactModal(false);
//                   }}
//                 >
//                   <Text style={styles.contactName}>{contact.attributes.nick}</Text>
//                   <Text style={styles.contactNumber}>{contact.attributes.numero}</Text>
//                 </TouchableOpacity>
//               ))}
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setShowContactModal(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancelar</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* Toast */}
//         <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
//           <Text style={styles.toastText}>{toastMessage}</Text>
//         </Animated.View>
//       </LinearGradient>
//     </View>
//   );
// };

// // Estilos (los mismos que tenías)
// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 12,
//   },
//   topBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     paddingTop: Constants.statusBarHeight + 20,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     borderRadius: 24,
//     paddingHorizontal: 15,
//     elevation: 2,
//   },
//   searchBar: {
//     flex: 1,
//     height: 44,
//     fontSize: 15,
//     color: "#333",
//     paddingVertical: 10,
//   },
//   clearSearchButton: {
//     padding: 8,
//     marginLeft: 4,
//   },
//   categoryToggleButton: {
//     padding: 10,
//     marginLeft: 9,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 20,
//   },
//   categoriesWrapper: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFF",
//     marginVertical: 12,
//     marginLeft: 8,
//   },
//   categoriesContainer: {
//     paddingHorizontal: 12,
//     paddingBottom: 16,
//   },
//   categoryItem: {
//     minWidth: 100,
//     height: 44,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//     paddingHorizontal: 12,
//     backgroundColor: "rgba(255,255,255,0.1)",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   categoryContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   categoryText: {
//     color: "rgba(255,255,255,0.9)",
//     fontSize: 13,
//     textAlign: "center",
//     flexShrink: 1,
//   },
//   selectedCategoryItem: {
//     backgroundColor: "rgba(255, 255, 255, 0.27)",
//     borderColor: "#FF6B00",
//   },
//   selectedCategoryText: {
//     color: "#FFF",
//     fontWeight: "600",
//   },
//   featuredContainer: {
//     marginBottom: 20,
//   },
//   featuredItem: {
//     width: width * 0.8,
//     backgroundColor: "rgba(50, 58, 132, 0.29)",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginRight: 16,
//   },
//   featuredImage: {
//     width: "100%",
//     height: 150,
//   },
//   featuredInfo: {
//     padding: 13,
//   },
//   featuredName: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 6,
//   },
//   description: {
//     fontSize: 14,
//     color: "rgba(255,255,255,0.85)",
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   featuredPrice: {
//     color: "#FFD700",
//     fontSize: 18,
//     fontWeight: "700",
//     marginTop: 4,
//   },
//   row: {
//     justifyContent: "space-between",
//     paddingHorizontal: 4,
//     marginBottom: 16,
//   },
//   gridItem: {
//     width: itemWidth,
//     paddingHorizontal: 2,
//     marginBottom: 10,
//   },
//   productCard: {
//     backgroundColor: "#FFF",
//     borderRadius: 12,
//     overflow: "hidden",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     height: 345,
//     marginBottom: 5,
//   },
//   gridImage: {
//     width: "100%",
//     height: itemWidth - 20,
//   },
//   productInfo: {
//     padding: 12,
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   productName: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#333",
//     height: 25,
//   },
//   descriptionP: {
//     fontSize: 13,
//     color: "#666",
//     lineHeight: 18,
//     marginBottom: 2,
//     height: 36,
//   },
//   productPrice: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#1a3a8f",
//     marginBottom: 8,
//   },
//   soldOut: {
//     color: "#FF0000",
//     fontWeight: "700",
//     textAlign: "center",
//     paddingVertical: 8,
//     fontSize: 14,
//   },
//   productActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: "rgba(0,0,0,0.1)",
//     height: 50,
//   },
//   actionButton: {
//     backgroundColor: "#1a3a8f",
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     height: 36,
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//     marginRight: 8,
//     minWidth: 40,
//   },
//   buyNowButton: {
//     backgroundColor: "#FF6B00",
//     marginLeft: 0,
//     flex: 2,
//   },
//   buyNowText: {
//     color: "#FFF",
//     fontSize: 10,
//     fontWeight: "600",
//   },
//   favoriteButton: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     zIndex: 1,
//     backgroundColor: "rgba(255,255,255,0.8)",
//     borderRadius: 20,
//     width: 36,
//     height: 36,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 2,
//   },
//   whatsappButton: {
//     position: "absolute",
//     bottom: 24,
//     right: 24,
//     backgroundColor: "#25D366",
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 6,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     width: "85%",
//     backgroundColor: "#FFF",
//     borderRadius: 12,
//     padding: 20,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 16,
//     textAlign: "center",
//     color: "#333",
//   },
//   contactItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEE",
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   contactNumber: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   cancelButton: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: "#FF6000",
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   cancelButtonText: {
//     color: "#FFF",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   emptyContainer: {
//     alignItems: "center",
//     marginVertical: 40,
//   },
//   noResults: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#FFF",
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: "#FF6B00",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: "#FFF",
//     fontWeight: "600",
//   },
//   toastContainer: {
//     position: "absolute",
//     bottom: 100,
//     alignSelf: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     zIndex: 1000,
//   },
//   toastText: {
//     color: "#FFF",
//     fontSize: 14,
//   },
//   menuButton: {
//     padding: 9,
//     marginRight: 8,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 20,
//   },
// });

// export default HomeScreen;

// Version CON PAGINACIÓN - COMPLETA
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  RefreshControl,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "./UserContext";
import { useCart } from "./CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import api from "../api/api";
import QuantitySelector from "./QuantitySelector";

const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2;

const HomeScreen = ({ navigation, route }) => {
  const dirImg = Constants.expoConfig.extra.dirImg;
  
  // Estados simplificados
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(null);
  const [quantities, setQuantities] = useState({});

  const { user, logout } = useUser();
  const { addToCart, loadCart } = useCart();
  
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [toastMessage, setToastMessage] = useState("");
  const featuredListRef = useRef(null);

  // Función para cargar productos con paginación
  const loadProducts = async (pageNum = 1, isRefresh = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // console.log(`📦 Cargando página ${pageNum}...`);
      const productosRes = await api.get(`/productos?page=${pageNum}&limit=20`);
      const nuevosProductos = productosRes.data.datos || [];
      
      // console.log(`📦 Página ${pageNum}: ${nuevosProductos.length} productos cargados`);
      
      if (pageNum === 1 || isRefresh) {
        // Primera página o refresh - reemplazar todos los productos
        setProductos(nuevosProductos);
        setFilteredProductos(nuevosProductos);
        
        // Actualizar destacados
        const destacadosData = nuevosProductos.filter(p => 
          p?.attributes?.destacado === 1 && p?.attributes?.precio !== undefined
        );
        setDestacados(destacadosData);
        // console.log("⭐ Destacados actualizados:", destacadosData.length);
      } else {
        // Página siguiente - agregar productos
        setProductos(prev => {
          const productosCombinados = [...prev, ...nuevosProductos.filter(
            nuevo => !prev.some(existente => existente.id === nuevo.id)
          )];
          return productosCombinados;
        });
        
        setFilteredProductos(prev => {
          const productosCombinados = [...prev, ...nuevosProductos.filter(
            nuevo => !prev.some(existente => existente.id === nuevo.id)
          )];
          return productosCombinados;
        });
      }

      // Verificar si hay más páginas
      const totalPages = productosRes.data.pagination?.totalPages || 1;
      const hayMasPaginas = pageNum < totalPages;
      setHasMore(hayMasPaginas);
      
      // console.log(`📄 Total páginas: ${totalPages}, ¿Hay más?: ${hayMasPaginas}`);
      // console.log(`📊 Total productos cargados: ${pageNum === 1 ? nuevosProductos.length : productos.length + nuevosProductos.length}`);

    } catch (error) {
      console.error("❌ Error cargando productos:", error);
      Alert.alert("Error", "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Función para cargar todos los datos iniciales
  const loadAllData = async () => {
    try {
      // console.log("🔄 Iniciando carga de datos...");

      // Cargar productos (página 1)
      await loadProducts(1, true);

      // Cargar otros datos en paralelo
      await Promise.all([
        loadCategories(),
        loadContacts(),
        loadTarjetas(),
        loadFavorites()
      ]);

    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    }
  };

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const categoriasRes = await api.get("/categorias");
      setCategorias(categoriasRes.data.datos || []);
      // console.log("📂 Categorías cargadas:", categoriasRes.data.datos?.length || 0);
    } catch (error) {
      console.error("❌ Error cargando categorías:", error);
    }
  };

  // Cargar contactos
  const loadContacts = async () => {
    try {
      const contactsRes = await api.get("/contactos");
      setContacts(contactsRes.data.datos || []);
      // console.log("📞 Contactos cargados:", contactsRes.data.datos?.length || 0);
    } catch (error) {
      console.error("❌ Error cargando contactos:", error);
    }
  };

  // Cargar tarjetas
  const loadTarjetas = async () => {
    try {
      const tarjetasRes = await api.get("/tarjetas");
      setTarjetas(tarjetasRes.data.data || []);
      // console.log("💳 Tarjetas cargadas:", tarjetasRes.data.data?.length || 0);
    } catch (error) {
      console.error("❌ Error cargando tarjetas:", error);
    }
  };

  // Cargar favoritos
  const loadFavorites = async () => {
    if (!user?.id) return;
    
    try {
      const favoritosRes = await api.get(`/favoritos-detalles/${user.id}`);
      setFavoritos(favoritosRes.data.data || []);
      // console.log("❤️ Favoritos cargados:", favoritosRes.data.data?.length || 0);
    } catch (error) {
      // console.log("❌ Error cargando favoritos:", error);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    loadAllData();
  }, []);

  // Cargar más productos cuando cambia la página
  useEffect(() => {
    if (page > 1) {
      // console.log("🎯 Cambió la página a:", page);
      loadProducts(page);
    }
  }, [page]);

  // Filtrar productos cuando cambia la búsqueda o categoría
  useEffect(() => {
    if (productos.length === 0) return;

    let filtered = productos.filter(product => {
      if (!product?.id || !product?.attributes) return false;
      if (product.attributes?.activo === false) return false;
      if (product.attributes?.cantidad <= 0) return false;

      // Filtrar por búsqueda
      const matchesSearch = !searchQuery || 
        product.attributes.nombre?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtrar por categoría
      const matchesCategory = !selectedCategory || 
        selectedCategory === "Todas" || 
        product.attributes.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // console.log("🔍 Productos filtrados:", filtered.length);
    setFilteredProductos(filtered);
  }, [searchQuery, selectedCategory, productos]);

  // Función para cargar más productos
  const handleLoadMore = () => {
    if (!loading && hasMore && !loadingMore && !refreshing) {
      // console.log("🔄 Cargando más productos...");
      setPage(prev => prev + 1);
    }
  };

  // Funciones básicas
  const showToast = (message) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(""));
  };

  const handleAddToCart = async (product, quantity = quantities[product.id] || 1) => {
    try {
      let userId = user?.id;
      
      if (!userId) {
        Alert.alert(
          "Acción requerida",
          "Debes iniciar sesión para agregar al carrito",
          [
            { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
            { text: "Cancelar", style: "cancel" },
          ]
        );
        return;
      }

      await addToCart({ ...product, cantidad: quantity });
      showToast(`✅ ${quantity} ${product.attributes.nombre} agregado(s) al carrito`);
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));

    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("❌ No se pudo añadir al carrito");
    }
  };

  const isFavorite = (productId) => {
    return favoritos.some(fav => 
      fav.attributes?.producto?.id === productId || fav.producto_id === productId
    );
  };

  const toggleFavorite = async (productId) => {
    if (!user?.id) {
      Alert.alert(
        "Acción requerida",
        "Debes iniciar sesión para guardar favoritos",
        [
          { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
          { text: "Cancelar", style: "cancel" },
        ]
      );
      return;
    }

    if (favoriteLoading === productId) return;
    setFavoriteLoading(productId);

    try {
      const wasFavorite = isFavorite(productId);
      
      if (wasFavorite) {
        await api.delete(`/favoritos/${user.id}/${productId}`);
        setFavoritos(prev => prev.filter(fav => 
          fav.attributes?.producto?.id !== productId && fav.producto_id !== productId
        ));
      } else {
        await api.post("/favoritos", {
          usuario_id: user.id,
          producto_id: productId,
        });
        setFavoritos(prev => [...prev, { producto_id: productId }]);
      }

      showToast(wasFavorite ? "❌ Eliminado de favoritos" : "✅ Agregado a favoritos");

    } catch (error) {
      console.error("Favorite toggle error:", error);
      showToast("❌ Error al actualizar favoritos");
    } finally {
      setFavoriteLoading(null);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(newQuantity, 100))
    }));
  };

  const handleProductPress = (item) => {
    navigation.navigate("Detalles", {
      producto: item,
      productoId: item?.attributes.nombre,
      precio: item?.attributes.precio,
      stock: item?.attributes.cantidad,
      imag: item?.attributes.imagen,
      descripcion: item.attributes.descripcion,
      id: item.id,
      usuario: user,
      cantActual: quantities[item.id] || 1,
      volumen: item.attributes.volumen,
      sexo: item.attributes.sexo,
      marca: item.attributes.marca,
      categoria: item.attributes.categoria,
      tarjetas: tarjetas,
    });
  };

  const ComprarAhora = async (product, quantity = quantities[product.id] || 1, costo) => {
    const totalApagar = quantity * costo;
    
    if (!user?.id) {
      Alert.alert(
        "Acción requerida",
        "Debes iniciar sesión para comprar",
        [
          { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
          { text: "Cancelar", style: "cancel" },
        ]
      );
      return;
    }

    try {
      if (!tarjetas || tarjetas.length === 0) {
        Alert.alert("Error", "No hay métodos de pago disponibles");
        return;
      }
      
      product.attributes.cantidad = quantity;
      product.attributes.producto_id = product.id;
      
      navigation.navigate("Checkout1", {
        total: totalApagar,
        pagina: "S",
        cartItems: product,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Error", "No se pudo procesar la compra");
    }
  };

  const openWhatsApp = async (selectedNumber) => {
    const message = "Hola, me interesa uno de tus productos";
    const url = `https://wa.me/+53${selectedNumber}?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const webUrl = `https://web.whatsapp.com/send?phone=${selectedNumber}&text=${encodeURIComponent(message)}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir WhatsApp");
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(1);
      setHasMore(true);
      await loadAllData();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Componente de Producto
  const ProductItem = ({ item }) => {
    const itemImageUrl = item?.attributes?.imagen
      ? `http://${dirImg}${item.attributes.imagen.split("/").pop()}`
      : `http://${dirImg}uploads/iconoI.png`;

    const precio = item?.attributes?.precio
      ? `$ ${Number(item.attributes.precio).toFixed(2)}`
      : "Precio no disponible";

    const truncatedDescription = item.attributes?.descripcion?.length > 25
      ? `${item.attributes.descripcion.substring(0, 25)}...`
      : item.attributes?.descripcion;

    const isProductFavorite = isFavorite(item.id);

    return (
      <TouchableOpacity style={styles.gridItem} onPress={() => handleProductPress(item)}>
        <View style={styles.productCard}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            disabled={favoriteLoading === item.id}
          >
            {favoriteLoading === item.id ? (
              <ActivityIndicator size="small" color="#FF0000" />
            ) : (
              <Ionicons
                name={isProductFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isProductFavorite ? "#FF0000" : "#1a3a8f"}
              />
            )}
          </TouchableOpacity>

          <Image
            source={{ uri: itemImageUrl }}
            style={styles.gridImage}
            placeholder={require("../assets/sindatos.png")}
            contentFit="cover"
          />

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.attributes?.nombre || "Nombre no disponible"}
            </Text>
            <Text style={styles.descriptionP} numberOfLines={2}>
              {truncatedDescription} ({item.attributes?.volumen})
            </Text>
            <Text style={styles.productPrice}>{precio}</Text>

            {item.attributes?.cantidad === 0 ? (
              <Text style={styles.soldOut}>AGOTADO</Text>
            ) : (
              <>
                <QuantitySelector
                  initialQuantity={quantities[item.id] || 1}
                  handleQuantityChange={(newQty) => handleQuantityChange(item.id, newQty)}
                  maxQuantity={item.attributes?.cantidad}
                  compact={true}
                />
                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAddToCart(item, quantities[item.id] || 1)}
                  >
                    <Ionicons name="cart-outline" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.buyNowButton]}
                    onPress={() => ComprarAhora(item, quantities[item.id] || 1, item.attributes.precio)}
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
  };

  // Componente de Producto Destacado
  const FeaturedItem = ({ item }) => {
    const imageUri = item?.attributes?.imagen
      ? `http://${dirImg}${item.attributes.imagen.split("/").pop()}`
      : `http://${dirImg}uploads/iconoI.png`;

    const precio = item?.attributes?.precio
      ? `$${Number(item.attributes.precio).toFixed(2)}`
      : "Precio no disponible";

    const truncatedDescription = item.attributes?.descripcion?.length > 50
      ? `${item.attributes.descripcion.substring(0, 50)}...`
      : item.attributes?.descripcion;

    return (
      <TouchableOpacity style={styles.featuredItem} onPress={() => handleProductPress(item)}>
        <Image
          source={{ uri: imageUri }}
          style={styles.featuredImage}
          contentFit="cover"
        />
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredName}>{item.attributes?.nombre}</Text>
          <Text style={styles.description}>
            {truncatedDescription} ({item.attributes?.volumen})
          </Text>
          <Text style={styles.featuredPrice}>{precio}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render de categoría
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.attributes.descripcion && styles.selectedCategoryItem,
      ]}
      onPress={() => {
        setSelectedCategory(
          selectedCategory === item.attributes.descripcion ? null : item.attributes.descripcion
        );
      }}
    >
      <View style={styles.categoryContent}>
        <MaterialIcons
          name={item.attributes.icon}
          size={20}
          color="#FFF"
        />
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item.attributes.descripcion && styles.selectedCategoryText,
          ]}
          numberOfLines={1}
        >
          {item.attributes.descripcion}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Componente de footer para loading
  const ListFooterComponent = () => {
    if (loadingMore) {
      return (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#FFF" />
          <Text style={styles.loadingMoreText}>Cargando más productos...</Text>
        </View>
      );
    }
    
    if (!hasMore && filteredProductos.length > 0) {
      return (
        <View style={styles.endMessageContainer}>
          <Text style={styles.endMessage}>No hay más productos para mostrar</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer?.()}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Buscar productos..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery("")}
              >
                <MaterialIcons name="close" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.categoryToggleButton}
            onPress={() => setShowCategories(!showCategories)}
          >
            <MaterialIcons
              name={showCategories ? "close" : "filter-list"}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

        {/* Categorías */}
        {showCategories && (
          <View style={styles.categoriesWrapper}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <FlashList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[
                { id: null, attributes: { descripcion: "Todas", icon: "apps" } },
                ...categorias,
              ]}
              renderItem={renderCategory}
              keyExtractor={(item, index) => `category-${item?.id || "all"}-${index}`}
              estimatedItemSize={100}
              contentContainerStyle={styles.categoriesContainer}
            />
          </View>
        )}

        {/* Lista principal */}
        <FlashList
          data={filteredProductos}
          keyExtractor={(item) => `prod_${item.id}`}
          renderItem={({ item }) => <ProductItem item={item} />}
          numColumns={2}
          estimatedItemSize={345}
          initialNumToRender={8}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={
            <>
              {/* Productos destacados */}
              {destacados.length > 0 && (
                <View style={styles.featuredContainer}>
                  <Text style={styles.sectionTitle}>Destacados</Text>
                  <FlashList
                    ref={featuredListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={destacados}
                    keyExtractor={(item, index) => `featured-${item?.id || "all"}-${index}`}
                    estimatedItemSize={width * 0.8}
                    renderItem={({ item }) => <FeaturedItem item={item} />}
                  />
                </View>
              )}
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.noResults}>
                {loading ? "Cargando productos..." : "No se encontraron productos"}
              </Text>
              {!loading && (
                <TouchableOpacity style={styles.retryButton} onPress={loadAllData}>
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          ListFooterComponent={ListFooterComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF6000"]}
              tintColor="#FFF"
            />
          }
          columnWrapperStyle={styles.row}
        />

        {/* Botón de WhatsApp */}
        {contacts.length > 0 && (
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={() => {
              if (contacts.length === 1) {
                openWhatsApp(contacts[0].attributes?.numero);
              } else if (contacts.length > 1) {
                setShowContactModal(true);
              }
            }}
          >
            <FontAwesome name="whatsapp" size={40} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Modal de contactos */}
        <Modal
          visible={showContactModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowContactModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccione un contacto</Text>
              {contacts.map((contact, index) => (
                <TouchableOpacity
                  key={`contact-${index}`}
                  style={styles.contactItem}
                  onPress={() => {
                    openWhatsApp(contact.attributes.numero);
                    setShowContactModal(false);
                  }}
                >
                  <Text style={styles.contactName}>{contact.attributes.nick}</Text>
                  <Text style={styles.contactNumber}>{contact.attributes.numero}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowContactModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Toast */}
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

// Estilos (agregando los nuevos)
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingTop: Constants.statusBarHeight + 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingHorizontal: 15,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: "#333",
    paddingVertical: 10,
  },
  clearSearchButton: {
    padding: 8,
    marginLeft: 4,
  },
  categoryToggleButton: {
    padding: 10,
    marginLeft: 9,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginVertical: 12,
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  categoryItem: {
    minWidth: 100,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  categoryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    textAlign: "center",
    flexShrink: 1,
  },
  selectedCategoryItem: {
    backgroundColor: "rgba(255, 255, 255, 0.27)",
    borderColor: "#FF6B00",
  },
  selectedCategoryText: {
    color: "#FFF",
    fontWeight: "600",
  },
  featuredContainer: {
    marginBottom: 20,
  },
  featuredItem: {
    width: width * 0.8,
    backgroundColor: "rgba(50, 58, 132, 0.29)",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  featuredImage: {
    width: "100%",
    height: 150,
  },
  featuredInfo: {
    padding: 13,
  },
  featuredName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
    marginBottom: 8,
  },
  featuredPrice: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  gridItem: {
    width: itemWidth,
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 345,
    marginBottom: 5,
  },
  gridImage: {
    width: "100%",
    height: itemWidth - 20,
  },
  productInfo: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    height: 25,
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    height: 50,
  },
  actionButton: {
    backgroundColor: "#1a3a8f",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
    minWidth: 40,
  },
  buyNowButton: {
    backgroundColor: "#FF6B00",
    marginLeft: 0,
    flex: 2,
  },
  buyNowText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  whatsappButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#25D366",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  contactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  contactNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FF6000",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFF",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  toastContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
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
  menuButton: {
    padding: 9,
    marginRight: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingMoreText: {
    color: '#FFF',
    fontSize: 14,
  },
  endMessageContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  endMessage: {
    color: '#FFF',
    fontSize: 15,
    opacity: 0.8,
  },
});

export default HomeScreen;