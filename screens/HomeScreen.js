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

  // En la sección de estados, agrega este nuevo estado:
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);

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

  // En los useEffect, agrega este nuevo useEffect para manejar el refresh automático:
useEffect(() => {
  // Configurar el intervalo de refresh automático cada 5 minutos
  const interval = setInterval(() => {
    if (!loading && !refreshing && !loadingMore) {
      console.log("🔄 Refresh automático - Actualizando productos...");
      handleAutoRefresh();
    }
  }, 3 * 60 * 1000); // 5 minutos en milisegundos

  setAutoRefreshInterval(interval);

  // Limpiar el intervalo al desmontar el componente
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, [loading, refreshing, loadingMore]);

// Función para el refresh automático
const handleAutoRefresh = async () => {
  try {
    console.log("🔄 Ejecutando refresh automático...");
    
    // Solo actualizar los productos, no todo el resto de datos
    // const productosRes = await api.get(`/productos?page=1&limit=20`);
    // const nuevosProductos = productosRes.data.datos || [];
    
    // // Actualizar productos y destacados
    // setProductos(nuevosProductos);
    
    // const destacadosData = nuevosProductos.filter(p => 
    //   p?.attributes?.destacado === 1 && p?.attributes?.precio !== undefined
    // );
    // setDestacados(destacadosData);

    // loadFavorites()
    loadAllData();
    
    console.log("✅ Refresh automático completado");
    // console.log(`📦 Productos actualizados: ${nuevosProductos.length}`);
    // console.log(`⭐ Destacados actualizados: ${destacadosData.length}`);
    
  } catch (error) {
    console.error("❌ Error en refresh automático:", error);
  }
};

// También agrega esta función para refrescar manualmente si es necesario
const triggerManualRefresh = () => {
  if (!loading && !refreshing && !loadingMore) {
    handleAutoRefresh();
    showToast("🔄 Actualizando productos...");
  }
};

// No olvides limpiar el intervalo en el cleanup del componente
useEffect(() => {
  return () => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }
  };
}, [autoRefreshInterval]);

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
          //  contentContainerStyle={{
          //    paddingBottom: 100, // Espacio extra en la parte inferior
          //  }}
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
    paddingTop: Constants.statusBarHeight + 1,
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
    top: 100,
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