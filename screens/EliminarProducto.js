// import React, { useEffect, useState, useCallback } from "react";
// import {
//   RefreshControl,
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   StyleSheet,
//   Button,
//   TouchableOpacity,
//   Modal,
//   StatusBar,
//   BackHandler,
//   Alert,
//   Platform,
//   Animated,
//   ActivityIndicator,
//   Linking,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons"; // Importar íconos
// import { LinearGradient } from "expo-linear-gradient";
// import { useIsFocused } from "@react-navigation/native";
// import { useUser } from "./UserContext";
// // import { Config } from '../Config';
// import api from "../api/api";
// import Constants from "expo-constants";
// import { Image } from "expo-image";
// import { Ionicons } from "@expo/vector-icons";
// // import Config from 'react-native-config';

// const EliminarProducto = ({ navigation, route }) => {
//   const { user } = useUser(); // Usa el hook personalizado

//   const [productos, setProductos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [buttonScale] = useState(new Animated.Value(1));
//   const [refreshing, setRefreshing] = useState(false);
//   const { server, dirImg } = Constants.expoConfig.extra;

//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 100, // Ajusta según lo que permita tu backend
//     total: 0,
//     totalPages: 1,
//   });
//   const [allProducts, setAllProducts] = useState([]); // Todos los productos acumulados
//   const [loadingMore, setLoadingMore] = useState(false);

//   const isFocused = useIsFocused();

//   // const server = '192.168.1.101';
//   // const puerto = "5000";

//   // useEffect(() => {
//   //   setProductos([]);
//   //   if (isFocused || route.params?.refresh) {
//   //     cargarProductos();
//   //   }
//   // }, [isFocused, route.params?.refresh]);
//   useEffect(() => {
//     const loadData = async () => {
//       if (isFocused || route.params?.refresh) {
//         await cargarProductos();
//       }
//     };
//     loadData();
//   }, [isFocused, route.params?.refresh]);

//   // const handleLoadMore = () => {
//   //   if (!loadingMore && pagination.page < pagination.totalPages) {
//   //     setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
//   //     cargarProductos(true);
//   //   }
//   // };

//   const handleLoadMore = () => {
//     if (!loadingMore && pagination.page < pagination.totalPages) {
//       cargarProductos(true); // Pasar true para indicar que es carga adicional
//     }
//   };

//   // Eliminar todos
//   // const eliminarTodos = async () => {
//   //   // if (!user || !user.esAdmin) {
//   //   //     Alert.alert('Acceso denegado', 'Solo administradores pueden realizar esta acción');
//   //   //     return;
//   //   // }

//   //   if (productos == []) {
//   //     Alert.alert("No hay productos en el almacen");
//   //     return;
//   //   }
//   //   Alert.alert(
//   //     "Confirmar eliminación",
//   //     "¿Estás SEGURO de eliminar TODOS los productos? Esta acción no se puede deshacer.",
//   //     [
//   //       {
//   //         text: "Cancelar",
//   //         style: "cancel",
//   //       },
//   //       {
//   //         text: "ELIMINAR TODOS",
//   //         style: "destructive",
//   //         onPress: async () => {
//   //           setLoading(true);
//   //           try {
//   //             // const response = await axios.delete(`http://${Config.server}:${Config.puerto}/productos`, {
//   //             //     data: { confirm: 'true' },
//   //             // });
//   //             // const response1 = await fetch(`http://${server}/productos`);
//   //             const response1 = await api.get(`/productos`);
//   //             // const data = await response1.json();
//   //             // console.log(response1.data)
//   //             if (response1.data.datos == "") {
//   //               Alert.alert("Error", `No hay productos en el almacén`, [
//   //                 { text: "OK", onPress: () => navigation.goBack() },
//   //               ]);
//   //               return;
//   //             }
//   //             const response = await api.delete(`/productos`, {
//   //               data: { confirm: "true" },
//   //             });

//   //             Alert.alert(
//   //               "Éxito",
//   //               `Se eliminaron ${response.data.deletedCount} productos`,
//   //               [{ text: "OK", onPress: () => navigation.goBack() }]
//   //             );
//   //           } catch (error) {
//   //             console.error("Error eliminando:", error);
//   //             Alert.alert(
//   //               "Error",
//   //               error.response?.data?.error || "Error al eliminar productos"
//   //             );
//   //           } finally {
//   //             setLoading(false);
//   //             setProductos([]);
//   //           }
//   //         },
//   //       },
//   //     ]
//   //   );
//   // };

//   const eliminarTodos = async () => {
//     Alert.alert(
//       "Confirmar eliminación",
//       "¿Estás SEGURO de eliminar TODOS los productos? Esta acción no se puede deshacer.",
//       [
//         {
//           text: "Cancelar",
//           style: "cancel",
//         },
//         {
//           text: "ELIMINAR TODOS",
//           style: "destructive",
//           onPress: async () => {
//             setLoading(true);
//             try {
//               const response = await api.delete(`/productos`, {
//                 data: { confirm: "true" },
//               });

//               Alert.alert(
//                 "Éxito",
//                 `Se eliminaron ${response.data.deletedCount} productos`,
//                 [
//                   {
//                     text: "OK",
//                     onPress: () => {
//                       // Resetear paginación y recargar
//                       setPagination({
//                         page: 1,
//                         limit: 100,
//                         total: 0,
//                         totalPages: 1,
//                       });
//                       cargarProductos();
//                     },
//                   },
//                 ]
//               );
//             } catch (error) {
//               console.error("Error eliminando:", error);
//               Alert.alert(
//                 "Error",
//                 error.response?.data?.error || "Error al eliminar productos"
//               );
//             } finally {
//               setLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   // const cargarProductos = async () => {
//   //   setLoading(true);
//   //   setProductos([]);
//   //   try {
//   //     // const response = await fetch(`http://${server}/productos`);
//   //     const response = await api.get("/productos");
//   //     // const data = await response.json();
//   //     // console.log(data.datos)
//   //     setProductos(response.data.datos); // Suponiendo que "data" contiene un array de productos
//   //     setFilteredData(response.data.datos);
//   //   } catch (error) {
//   //     // console.error('Error al cargar productos:', error);
//   //     Alert.alert("Error", "Error al cargar productos.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Función para manejar el refresh

//   const [loadedIds, setLoadedIds] = useState(new Set());

//   // const cargarProductos = async (loadMore = false) => {
//   //   if (loadMore) {
//   //     if (pagination.page >= pagination.totalPages) return;
//   //     setLoadingMore(true);
//   //   } else {
//   //     setLoading(true);
//   //     setAllProducts([]); // Solo limpia si es una recarga completa
//   //   }

//   //   try {
//   //     const response = await api.get(
//   //       `/productos?page=${pagination.page}&limit=${pagination.limit}`
//   //     );

//   //     // const processedData = processProducts(response.data.datos);
//   //     // Eliminar duplicados antes de procesar
//   //     const uniqueData = response.data.datos.filter(
//   //       (item, index, self) => index === self.findIndex((t) => t.id === item.id)
//   //     );

//   //     const processedData = processProducts(uniqueData);

//   //     if (!response.data || !response.data.datos) {
//   //       throw new Error("Estructura de respuesta inválida");
//   //     }

//   //     // // Filtrar para evitar duplicados
//   //     // const newItems = response.data.datos.filter(
//   //     //   (newItem) =>
//   //     //     !allProducts.some((existingItem) => existingItem.id === newItem.id)
//   //     // );
//   //     // Filtrar productos ya cargados
//   //     const newProduct = response.data.datos.filter(
//   //       (product) => !loadedIds.has(product.id)
//   //     );

//   //     // Actualizar conjunto de IDs cargados
//   //     const newIds = new Set(loadedIds);
//   //     newProduct.forEach((product) => newIds.add(product.id));
//   //     setLoadedIds(newIds);

//   //     // Actualiza la paginación
//   //     setPagination({
//   //       page: response.data.pagination?.page || pagination.page,
//   //       limit: response.data.pagination?.limit || pagination.limit,
//   //       total: response.data.pagination?.total || 0,
//   //       totalPages: response.data.pagination?.totalPages || 1,
//   //     });

//   //     // Acumula los productos si es carga adicional
//   //     const newProducts = loadMore
//   //       ? [...allProducts, ...response.data.datos]
//   //       : response.data.datos;

//   //     setAllProducts(newProducts);
//   //     setFilteredData(newProducts);
//   //   } catch (error) {
//   //     console.error("Error al cargar productos:", error);
//   //     Alert.alert(
//   //       "Error",
//   //       error.response?.data?.message || "Error al cargar productos"
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //     setLoadingMore(false);
//   //     setRefreshing(false);
//   //   }
//   // };

//   // const cargarProductos = async (loadMore = false) => {
//   //   if (loadMore) {
//   //     if (pagination.page >= pagination.totalPages) return;
//   //     setLoadingMore(true);
//   //   } else {
//   //     setLoading(true);
//   //     setAllProducts([]);
//   //     setLoadedIds(new Set()); // Resetear IDs cargados al refrescar
//   //   }

//   //   try {
//   //     const response = await api.get(
//   //       `/productos?page=${pagination.page}&limit=${pagination.limit}`
//   //     );

//   //     if (!response.data || !response.data.datos) {
//   //       throw new Error("Estructura de respuesta inválida");
//   //     }

//   //     // 1. Filtrar productos duplicados en la respuesta actual
//   //     const uniqueData = response.data.datos.filter(
//   //       (item, index, self) => index === self.findIndex((t) => t.id === item.id)
//   //     );

//   //     // 2. Filtrar productos que no hayamos cargado antes
//   //     const newProducts = uniqueData.filter(
//   //       (product) => !loadedIds.has(product.id)
//   //     );

//   //     // 3. Procesar los productos (asegurar IDs únicos)
//   //     const processedData = processProducts(newProducts);

//   //     // Actualizar conjunto de IDs cargados
//   //     const updatedIds = new Set(loadedIds);
//   //     newProducts.forEach((product) => updatedIds.add(product.id));
//   //     setLoadedIds(updatedIds);

//   //     // Actualizar paginación
//   //     setPagination({
//   //       page: response.data.pagination?.page || pagination.page,
//   //       limit: response.data.pagination?.limit || pagination.limit,
//   //       total: response.data.pagination?.total || 0,
//   //       totalPages: response.data.pagination?.totalPages || 1,
//   //     });

//   //     // Actualizar estado de productos
//   //     const updatedProducts = loadMore
//   //       ? [...allProducts, ...processedData]
//   //       : processedData;

//   //     setAllProducts(updatedProducts);
//   //     setFilteredData(updatedProducts);

//   //     // DEBUG: Verificar datos
//   //     console.log("Página actual:", pagination.page);
//   //     console.log("Productos nuevos:", newProducts.length);
//   //     console.log("Total productos:", updatedProducts.length);
//   //   } catch (error) {
//   //     console.error("Error al cargar productos:", error);
//   //     Alert.alert(
//   //       "Error",
//   //       error.response?.data?.message || "Error al cargar productos"
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //     setLoadingMore(false);
//   //     setRefreshing(false);
//   //   }
//   // };

//   const cargarProductos = async (loadMore = false) => {
//     if (loadMore) {
//       if (pagination.page >= pagination.totalPages) return;
//       setLoadingMore(true);
//     } else {
//       setLoading(true);
//       setAllProducts([]);
//       setLoadedIds(new Set());
//       setPagination((prev) => ({ ...prev, page: 1 })); // Resetear a página 1 al refrescar
//     }

//     try {
//       const response = await api.get(
//         `/productos?page=${loadMore ? pagination.page + 1 : 1}&limit=${pagination.limit}`
//       );

//       if (!response.data?.datos) {
//         throw new Error("Estructura de respuesta inválida");
//       }

//       // Filtrar duplicados en la respuesta actual
//       const newProducts = response.data.datos.filter(
//         (product) => !loadedIds.has(product.id)
//       );

//       // Actualizar IDs cargados
//       const newIds = new Set(loadedIds);
//       newProducts.forEach((product) => newIds.add(product.id));
//       setLoadedIds(newIds);

//       // Actualizar paginación
//       setPagination({
//         page:
//           response.data.pagination?.page ||
//           (loadMore ? pagination.page + 1 : 1),
//         limit: response.data.pagination?.limit || pagination.limit,
//         total: response.data.pagination?.total || 0,
//         totalPages: response.data.pagination?.totalPages || 1,
//       });

//       // Actualizar productos
//       setAllProducts((prev) =>
//         loadMore ? [...prev, ...newProducts] : newProducts
//       );

//       // Actualizar datos filtrados
//       setFilteredData((prev) =>
//         loadMore ? [...prev, ...newProducts] : newProducts
//       );
//     } catch (error) {
//       console.error("Error al cargar productos:", error);
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Error al cargar productos"
//       );
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = async () => {
//     setProductos([]);
//     setLoading(true);
//     try {
//       // const response = await fetch(`http://${server}/productos`);
//       const response = await api.get("/productos");
//       // const data = await response.json();
//       // console.log(data)
//       setProductos(response.data.datos); // Suponiendo que "data" contiene un array de productos
//       setFilteredData(response.data.datos);
//     } catch (error) {
//       // console.error('Error al cargar productos:', error);
//       Alert.alert("Error", "Error al cargar productos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProductos = async () => {
//     setLoading(true);
//     setProductos([]);
//     try {
//       // const response = await fetch(`http://${server}/productos`);
//       const response = await api.get("/productos");
//       // const data = await response.json();
//       // console.log(data.datos)
//       setProductos(response.data.datos); // Suponiendo que "data" contiene un array de productos
//       setFilteredData(response.data.datos);
//     } catch (error) {
//       // console.error('Error al cargar productos:', error);
//       Alert.alert("Error", "Error al cargar productos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Llamada a la API
//     setProductos([]);
//     fetchProductos();
//   }, []);

//   // Filtrado de datos
//   // useEffect(() => {
//   //   if (searchQuery.trim() === "") {
//   //     setFilteredData(productos);
//   //   } else {
//   //     const filtered = productos.filter(
//   //       (item) =>
//   //         item.attributes.nombre
//   //           .toLowerCase()
//   //           .includes(searchQuery.toLowerCase())
//   //       // || item.category.toLowerCase().includes(searchQuery.toLowerCase())
//   //     );
//   //     setFilteredData(filtered);
//   //   }
//   // }, [searchQuery, productos]);

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredData(allProducts);
//     } else {
//       // Resetear a primera página al buscar
//       setPagination((prev) => ({ ...prev, page: 1 }));
//       const filtered = allProducts.filter((item) =>
//         item.attributes.nombre.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   }, [searchQuery, allProducts]);

//   const handleExit = () => {
//     Alert.alert("Confirmar salida", "¿Estás seguro de que quieres salir?", [
//       {
//         text: "Cancelar",
//         style: "cancel",
//       },
//       {
//         text: "Salir",
//         onPress: () => {
//           if (Platform.OS === "android") {
//             BackHandler.exitApp();
//           } else {
//             // Alternativa para iOS (no cierra, pero muestra mensaje)
//             Alert.alert("iOS", "Presiona el botón Home para salir", [
//               { text: "OK" },
//             ]);
//           }
//         },
//       },
//     ]);
//   };

//   // Eliminar producto
//   const handleDelete = async (itemId) => {
//     const fadeAnim = new Animated.Value(1);
//     // console.log('URL:', `http://${server}:${puerto}/productos/${itemId}`);
//     // console.log(itemId)
//     Alert.alert(
//       "Confirmar eliminación",
//       "¿Estás seguro de que quieres eliminar este elemento?",
//       [
//         {
//           text: "Cancelar",
//           style: "cancel",
//         },
//         {
//           text: "Eliminar",
//           onPress: async () => {
//             Animated.timing(fadeAnim, {
//               toValue: 0,
//               duration: 300,
//               useNativeDriver: true,
//             }).start(async () => {
//               // await axios.delete(`http://${server}:${puerto}/productos/${itemId}`);
//               // fetchProductos(); // Actualizar la lista después de eliminar
//               try {
//                 // Cambia esta línea (asegúrate que la URL sea correcta)
//                 // const response = await axios.delete(`http://${Config.server}:${Config.puerto}/productos/${itemId}`);
//                 const response = await api.delete(`/productos/${itemId}`);
//                 // console.log(response.data)
//                 if (response.data.success) {
//                   // Actualiza el estado local para evitar recargar toda la lista
//                   setProductos((prev) =>
//                     prev.filter((item) => item.id !== itemId)
//                   );
//                   setFilteredData((prev) =>
//                     prev.filter((item) => item.id !== itemId)
//                   );
//                   Alert.alert("Éxito", "Producto eliminado correctamente.");
//                 } else {
//                   Alert.alert("Error", "No se pudo eliminar");
//                 }
//               } catch (error) {
//                 console.error("Error eliminando:", error);
//                 Alert.alert(
//                   "Error",
//                   error.response?.data?.error || "Error de conexión"
//                 );
//               }
//             });
//           },
//         },
//       ]
//     );
//   };
//   // Whatsapp

//   // const phoneNumber = '5354223460'; // Reemplaza con el número en formato internacional (sin +)
//   const message = "Hola, me interesa tu producto"; // Mensaje opcional

//   const openWhatsApp = async () => {
//     // Formatea la URL para WhatsApp
//     const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

//     try {
//       // Verifica si WhatsApp está instalado
//       const supported = await Linking.canOpenURL(url);

//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         // Si WhatsApp no está instalado, abre el navegador con la versión web
//         const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
//         await Linking.openURL(webUrl);
//       }
//     } catch (error) {
//       Alert.alert("Error", "No se pudo abrir WhatsApp");
//       // console.error('Error al abrir WhatsApp:', error);
//     }
//   };
//   // Fin whatsapp

//   const renderProducto = ({ item }) => (
//     <View
//       style={styles.itemContainer}
//       key={`product-${item.id}-${item.attributes?.nombre || "no-name"}`}
//     >
//       {item.attributes.imagen === null ? (
//         <>
//           <Image
//             source={{ uri: `http://190.6.81.46/uploads/iconoI.png` }}
//             cachePolicy="memory-disk"
//             style={styles.imagen}
//             onPress={() =>
//               navigation.navigate("Detalles", {
//                 productoId: item.attributes.nombre,
//                 precio: item.attributes.precio,
//                 stock: item.attributes.cantidad,
//                 imag: "uploads/iconoI.png",
//                 descripcion: item.attributes.descripcion,
//                 id: item.id,
//                 usuario: user,
//                 cantActual: quantities[item.id] || 1,
//                 volumen: item.attributes.volumen,
//                 sexo: item.attributes.sexo,
//                 marca: item.attributes.marca,
//                 descripcion: item.attributes.descripcion,
//                 categoria: item.attributes.categoria,
//               })
//             }
//           />
//         </>
//       ) : (
//         <>
//           <Image
//             source={{
//               uri: `http://${dirImg}${item.attributes.imagen.split("/").pop()}`,
//             }}
//             cachePolicy="memory-disk"
//             style={styles.imagen}
//             onPress={() =>
//               navigation.navigate("Detalles", {
//                 productoId: item.attributes.nombre,
//                 precio: item.attributes.precio,
//                 stock: item.attributes.cantidad,
//                 imag: item.attributes.imagen,
//                 descripcion: item.attributes.descripcion,
//                 id: item.id,
//                 usuario: user,
//                 cantActual: quantities[item.id] || 1,
//                 volumen: item.attributes.volumen,
//                 sexo: item.attributes.sexo,
//                 marca: item.attributes.marca,
//                 descripcion: item.attributes.descripcion,
//                 categoria: item.attributes.categoria,
//               })
//             }
//           />
//         </>
//       )}
//       {/* <Image source={{ uri: `http://${Config.dirImg}${item.attributes.imagen.split('/').pop()}` }} style={styles.imagen} onPress={() => navigation.navigate('Detalles', { productoId: item.attributes.nombre, precio: item.attributes.precio, stock: item.attributes.cantidad, imag: item.attributes.imagen, volumen: item.attributes.volumen, sexo: item.attributes.sexo, marca: item.attributes.marca, descripcion: item.attributes.descripcion })} /> */}
//       <View style={styles.info}>
//         <Text
//           style={styles.nombre}
//           onPress={() =>
//             navigation.navigate("Detalles", {
//               productoId: item.attributes.nombre,
//               precio: item.attributes.precio,
//               stock: item.attributes.cantidad,
//               imag: item.attributes.imagen,
//               volumen: item.attributes.volumen,
//               sexo: item.attributes.sexo,
//               marca: item.attributes.marca,
//               descripcion: item.attributes.descripcion,
//               categoria: item.attributes.categoria,
//             })
//           }
//         >
//           {item.attributes.nombre}
//         </Text>
//         <Text style={styles.precio}>$ {item.attributes.precio}</Text>
//         <View style={styles.botonesContainer}>
//           {/* <TouchableOpacity
//                         style={styles.botonAgregar}
//                         // onPress={agregarAlCarrito(item.id, 1)}
//                     >
//                         <Icon name="cart-outline" size={20} color="#000" style={styles.iconoCarrito} />
//                     </TouchableOpacity> */}
//           <TouchableOpacity
//             style={styles.botonAgregar}
//             onPress={() => navigation.navigate("Editar", { producto: item })}
//           >
//             <Icon
//               name="pencil"
//               size={20}
//               color="#FFF"
//               style={styles.iconoCarrito}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.botonDetalles}
//             onPress={() => handleDelete(item.id)}
//           >
//             <Icon name="trash" size={20} color="#FFF" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   // const uniqueProducts = response.data.datos.filter(
//   //   (product, index, self) =>
//   //     index === self.findIndex((p) => p.id === product.id)
//   // );

//   // setAllProducts(
//   //   loadMore ? [...allProducts, ...uniqueProducts] : uniqueProducts
//   // );

//   const processProducts = (data) => {
//     if (!data || !Array.isArray(data)) return [];

//     return data.map((item) => {
//       // Asegurar que cada item tenga un ID único
//       if (!item.id) {
//         return {
//           ...item,
//           id: `temp-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         };
//       }
//       return item;
//     });
//   };

//   return (
//     <LinearGradient
//       colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Modificar productos</Text>
//         <View style={{ width: 24 }} />
//       </View>
//       <View style={styles.container}>
//         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
//           <View
//             style={[styles.titulo1, loading && styles.disabledButton]}
//             disabled={loading}
//             activeOpacity={0.7}
//           >
//             {/* {loading ? (
//               <ActivityIndicator color="#FFF" />
//             ) : (
//               <Text style={styles.titulo}>Productos en Stock</Text>
//             )} */}
//           </View>
//         </Animated.View>
//         {/* <Text style={styles.titulo}>Productos en Stock</Text> */}

//         {/* Barra de búsqueda */}
//         <View style={styles.searchContainer}>
//           <Icon
//             name="search"
//             size={20}
//             color="#000"
//             style={styles.searchIcon}
//           />
//           {/* <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} /> */}
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Buscar productos..."
//             placeholderTextColor="#888"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             autoCapitalize="none"
//             autoCorrect={false}
//           />
//           {searchQuery !== "" && (
//             <TouchableOpacity onPress={() => setSearchQuery("")}>
//               <Icon name="close" size={20} color="#888" />
//             </TouchableOpacity>
//           )}
//         </View>
//         {/* Resultados */}
//         {/* <FlatList
//           data={filteredData}
//           keyExtractor={(item, index) =>
//             `${item.id?.toString() || "missing-id"}-${index}`
//           }
//           renderItem={renderProducto}
//           ListEmptyComponent={
//             <Text style={styles.noResults}>No se encontraron resultados</Text>
//           }
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={["#FFF"]} // Color del spinner (opcional, solo Android)
//               tintColor="#FFF" // Color del spinner (iOS)
//             />
//           }
//         /> */}
//         <FlatList
//           data={filteredData}
//           // keyExtractor={(item) => item.id.toString()}
//           keyExtractor={(item, index) => {
//             if (!item.id) {
//               console.warn("Producto sin ID:", item);
//               return `temp-${index}-${Date.now()}`;
//             }
//             return `prod-${item.id}-${item.attributes?.create_at || "0"}-${index}`;
//           }}
//           renderItem={renderProducto}
//           ListEmptyComponent={
//             loading ? (
//               <ActivityIndicator size="large" color="#FFF" />
//             ) : (
//               <Text style={styles.noResults}>No se encontraron productos</Text>
//             )
//           }
//           // refreshControl={
//           //   <RefreshControl
//           //     refreshing={refreshing}
//           //     onRefresh={() => {
//           //       setPagination((prev) => ({ ...prev, page: 1 }));
//           //       cargarProductos();
//           //     }}
//           //     colors={["#FFF"]}
//           //     tintColor="#FFF"
//           //   />
//           // }
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={() => cargarProductos()}
//               colors={["#FFF"]}
//               tintColor="#FFF"
//             />
//           }
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={
//             loadingMore ? (
//               <ActivityIndicator
//                 size="small"
//                 color="#FFF"
//                 style={styles.loadingMore}
//               />
//             ) : pagination.page < pagination.totalPages ? (
//               <TouchableOpacity
//                 style={styles.loadMoreButton}
//                 onPress={handleLoadMore}
//               >
//                 <Text style={styles.loadMoreText}>Cargar más productos</Text>
//               </TouchableOpacity>
//             ) : null
//           }
//         />
//       </View>
//       <View style={styles.buttonContainer}>
//         {/* <TouchableOpacity style={styles.addToCartButton} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-back" size={20} color="#FFF" />
//                     <Text style={styles.buttonText}> Atrás</Text>
//                 </TouchableOpacity> */}
//         <TouchableOpacity style={styles.buyNowButton1} onPress={eliminarTodos}>
//           {/* <FontAwesome name="whatsapp" size={20} color="#FFF" /> */}
//           <Icon name="trash" size={20} color="#FFF" />
//           <Text style={styles.buttonText}> Eliminar todos</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity
//                     style={styles.whatsappButton}
//                     onPress={openWhatsApp}
//                 >
//                     <FontAwesome name="whatsapp" size={20} color="#FFF" />
//                 </TouchableOpacity> */}
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   loadingMore: {
//     marginVertical: 20,
//   },
//   loadMoreButton: {
//     padding: 15,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 8,
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   loadMoreText: {
//     color: "#FFF",
//     fontWeight: "600",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     top: 10,
//     padding: 16,
//     paddingTop: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#FFF",
//     textShadowColor: "rgba(0, 0, 0, 0.3)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   whatsappButton: {
//     position: "absolute",
//     bottom: 50,
//     right: 1,
//     backgroundColor: "#25D366", // Verde de WhatsApp
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 5, // Sombra en Android
//     shadowColor: "#000", // Sombra en iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   appContainer: {
//     flex: 1, // Ocupa toda la pantalla
//     backgroundColor: "#1C1C1C", // Fondo oscuro o el que prefieras
//   },
//   botonesContainer: {
//     flexDirection: "row", // Coloca los botones en la misma línea
//     marginTop: 10,
//     justifyContent: "space-between", // Espacio uniforme entre botones
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     // backgroundColor: '#1C1C1C', // Fondo oscuro
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     // backgroundColor: '#FFA500',
//     justifyContent: "space-between",
//     marginTop: 1,
//   },
//   addToCartButton: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "#FFA500",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   button: {
//     width: 200,
//     height: 50,
//     backgroundColor: "#fff",
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//     elevation: 5,
//   },
//   buyNowButton: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "#4CAF50",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buyNowButton1: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "#FF6B00",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   titulo: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFF",
//     top: 0,
//     marginBottom: 10,
//     textAlign: "center",
//     textShadowColor: "rgba(0,0,0,0.2)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   titulo1: {
//     fontSize: 25,
//     fontWeight: "700",
//     color: "#FFF",
//     marginBottom: 20,
//     textAlign: "center",
//     textShadowColor: "rgba(0,0,0,0.2)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   salir: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#FFF",
//     marginBottom: 1,
//     textAlign: "center",
//     textShadowColor: "rgba(0,0,0,0.2)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   itemContainer: {
//     flexDirection: "row",
//     backgroundColor: "rgba(255,255,255,0.15)",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.1)",
//   },
//   imagen: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#555", // Bordes discretos para combinar con el tema oscuro
//   },
//   info: {
//     marginLeft: 15,
//     justifyContent: "space-between",
//     flex: 1,
//   },
//   nombre: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#F5F5F5", // Texto claro para buena visibilidad
//   },
//   precio: {
//     fontSize: 16,
//     color: "#FFA500", // Precio naranja vibrante que resalta en el tema oscuro
//     fontWeight: "bold",
//   },
//   botonAgregar: {
//     width: 40, // Ancho igual a la altura para que sea perfectamente circular
//     height: 40,
//     // left:90,
//     backgroundColor: "#3498db", // Color naranja llamativo
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 25, // Radio igual a la mitad de la altura para hacerlo circular
//     elevation: 3, // Sombra para dar profundidad
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   iconoCarrito: {
//     color: "#000", // Ícono en negro para contraste
//   },
//   textoBotonAgregar: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000", // Texto negro para contraste en el botón naranja
//   },
//   botonComprar: {
//     width: 40, // Ancho igual a la altura para que sea perfectamente circular
//     height: 40,
//     left: "50%",
//     backgroundColor: "#00FA23", // Color naranja llamativo
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 25, // Radio igual a la mitad de la altura para hacerlo circular
//     elevation: 3, // Sombra para dar profundidad
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   botonDetalles: {
//     width: 40, // Ancho igual a la altura para que sea perfectamente circular
//     height: 40,
//     // left: '75%',
//     backgroundColor: "#ff413e", // Color naranja llamativo
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 25, // Radio igual a la mitad de la altura para hacerlo circular
//     elevation: 3, // Sombra para dar profundidad
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginBottom: 16,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#333",
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   itemCategory: {
//     fontSize: 14,
//     color: "#888",
//     marginTop: 4,
//   },
//   noResults: {
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 16,
//     color: "#FFF",
//   },
//   buttonText: {
//     color: "#FFF",
//     fontWeight: "600",
//     marginLeft: 8,
//   },
// });

// export default EliminarProducto;

import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  BackHandler,
  ActivityIndicator,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useUser } from "./UserContext";
import api from "../api/api";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const EliminarProducto = ({ navigation, route }) => {
  const { user } = useUser();
  const { dirImg } = Constants.expoConfig.extra;

  // Estados principales
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonScale] = useState(new Animated.Value(1));

  // Estados para productos y paginación
  const [allProducts, setAllProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loadedIds, setLoadedIds] = useState(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 1,
  });

  const isFocused = useIsFocused();

  // Efecto para cargar datos al montar o cuando cambia el foco
  useEffect(() => {
    const loadData = async () => {
      if (isFocused || route.params?.refresh) {
        await cargarProductos();
      }
    };
    loadData();
  }, [isFocused, route.params?.refresh]);

  // Función principal para cargar productos
  // const cargarProductos = async (loadMore = false) => {
  //   // No cargar más si ya estamos en la última página
  //   if (loadMore && pagination.page >= pagination.totalPages) return;

  //   // Configurar estados de carga
  //   if (loadMore) {
  //     setLoadingMore(true);
  //   } else {
  //     setLoading(true);
  //     setAllProducts([]);
  //     setLoadedIds(new Set());
  //     setPagination((prev) => ({ ...prev, page: 1 }));
  //   }

  //   try {
  //     // Calcular página a cargar
  //     const pageToLoad = loadMore ? pagination.page + 1 : 1;

  //     // Hacer la petición a la API
  //     const response = await api.get(
  //       `/productos?page=${pageToLoad}&limit=${pagination.limit}`
  //     );

  //     if (!response.data?.datos) {
  //       throw new Error("Estructura de respuesta inválida");
  //     }

  //     // Filtrar productos duplicados y ya cargados
  //     const newProducts = response.data.datos.filter(
  //       (product) => !loadedIds.has(product.id)
  //     );

  //     // Actualizar IDs cargados
  //     const newIds = new Set(loadedIds);
  //     newProducts.forEach((product) => newIds.add(product.id));
  //     setLoadedIds(newIds);

  //     // Actualizar paginación con datos del servidor o valores por defecto
  //     setPagination({
  //       page: response.data.pagination?.page || pageToLoad,
  //       limit: response.data.pagination?.limit || pagination.limit,
  //       total: response.data.pagination?.total || 0,
  //       totalPages: response.data.pagination?.totalPages || 1,
  //     });

  //     // Actualizar lista de productos
  //     setAllProducts((prev) =>
  //       loadMore ? [...prev, ...newProducts] : newProducts
  //     );

  //     // Actualizar datos filtrados
  //     setFilteredData((prev) =>
  //       loadMore ? [...prev, ...newProducts] : newProducts
  //     );
  //   } catch (error) {
  //     console.error("Error al cargar productos:", error);
  //     Alert.alert(
  //       "Error",
  //       error.response?.data?.message || "Error al cargar productos"
  //     );
  //   } finally {
  //     setLoading(false);
  //     setLoadingMore(false);
  //     setRefreshing(false);
  //   }
  // };

  // const cargarProductos = async (loadMore = false) => {
  //   // No cargar más si ya estamos en la última página
  //   if (loadMore && pagination.page >= pagination.totalPages) return;

  //   // Configurar estados de carga
  //   if (loadMore) {
  //     setLoadingMore(true);
  //   } else {
  //     setRefreshing(true); // <-- Usar refreshing en lugar de loading para pull-to-refresh
  //     setLoadedIds(new Set());
  //   }

  //   try {
  //     // Calcular página a cargar
  //     const pageToLoad = loadMore ? pagination.page + 1 : 1;

  //     // Hacer la petición a la API
  //     const response = await api.get(
  //       `/productos?page=${pageToLoad}&limit=${pagination.limit}`
  //     );

  //     if (!response.data?.datos) {
  //       throw new Error("Estructura de respuesta inválida");
  //     }

  //     // Filtrar productos duplicados
  //     const newProducts = response.data.datos.filter(
  //       (product) => !loadedIds.has(product.id)
  //     );

  //     // Actualizar IDs cargados
  //     const newIds = new Set(loadedIds);
  //     newProducts.forEach((product) => newIds.add(product.id));

  //     // Actualizar paginación
  //     setPagination({
  //       page: pageToLoad,
  //       limit: response.data.pagination?.limit || pagination.limit,
  //       total: response.data.pagination?.total || 0,
  //       totalPages: response.data.pagination?.totalPages || 1,
  //     });

  //     // Actualizar productos (diferente enfoque para refresh)
  //     if (loadMore) {
  //       setAllProducts((prev) => [...prev, ...newProducts]);
  //       setFilteredData((prev) => [...prev, ...newProducts]);
  //     } else {
  //       setAllProducts(newProducts);
  //       setFilteredData(newProducts);
  //       setLoadedIds(newIds); // <-- Mover aquí para refresh
  //     }
  //   } catch (error) {
  //     console.error("Error al cargar productos:", error);
  //     Alert.alert(
  //       "Error",
  //       error.response?.data?.message || "Error al cargar productos"
  //     );
  //   } finally {
  //     setLoading(false);
  //     setLoadingMore(false);
  //     setRefreshing(false);
  //   }
  // };

  const cargarProductos = async (loadMore = false) => {
    // No cargar más si ya estamos en la última página
    if (loadMore && pagination.page >= pagination.totalPages) return;

    // Configurar estados de carga
    if (loadMore) {
      setLoadingMore(true);
    } else {
      // Reset completo para refresh
      setRefreshing(true);
      setLoading(true);
      setPagination((prev) => ({ ...prev, page: 1 }));
      setLoadedIds(new Set());
      setAllProducts([]);
      setFilteredData([]);
    }

    try {
      const pageToLoad = loadMore ? pagination.page + 1 : 1;

      const response = await api.get(
        `/productos?page=${pageToLoad}&limit=${pagination.limit}`
      );

      if (!response.data?.datos) {
        throw new Error("Estructura de respuesta inválida");
      }

      const newProducts = response.data.datos;

      // Actualizar paginación
      setPagination({
        page: pageToLoad,
        limit: response.data.pagination?.limit || pagination.limit,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 1,
      });

      // Actualizar productos
      if (loadMore) {
        setAllProducts((prev) => [...prev, ...newProducts]);
        setFilteredData((prev) => [...prev, ...newProducts]);
      } else {
        setAllProducts(newProducts);
        setFilteredData(newProducts);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al cargar productos"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Función para cargar más productos al hacer scroll
  const handleLoadMore = () => {
    if (!loadingMore && pagination.page < pagination.totalPages) {
      cargarProductos(true);
    }
  };

  // Función para eliminar un producto individual
  const handleDelete = async (itemId) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este elemento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await api.delete(`/productos/${itemId}`);

              if (response.data.success) {
                // Actualizar listas sin recargar toda la data
                setAllProducts((prev) =>
                  prev.filter((item) => item.id !== itemId)
                );
                setFilteredData((prev) =>
                  prev.filter((item) => item.id !== itemId)
                );
                Alert.alert("Éxito", "Producto eliminado correctamente.");
              } else {
                Alert.alert("Error", "No se pudo eliminar el producto");
              }
            } catch (error) {
              console.error("Error eliminando:", error);
              Alert.alert(
                "Error",
                error.response?.data?.error || "Error de conexión"
              );
            }
          },
        },
      ]
    );
  };

  // Función para eliminar todos los productos
  const eliminarTodos = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás SEGURO de eliminar TODOS los productos? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "ELIMINAR TODOS",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await api.delete(`/productos`, {
                data: { confirm: "true" },
              });

              Alert.alert(
                "Éxito",
                `Se eliminaron ${response.data.deletedCount} productos`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Resetear todo y recargar
                      setPagination({
                        page: 1,
                        limit: 100,
                        total: 0,
                        totalPages: 1,
                      });
                      cargarProductos();
                    },
                  },
                ]
              );
            } catch (error) {
              console.error("Error eliminando:", error);
              Alert.alert(
                "Error",
                error.response?.data?.error || "Error al eliminar productos"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Efecto para filtrar productos según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(allProducts);
    } else {
      const filtered = allProducts.filter((item) =>
        item.attributes.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, allProducts]);

  // Componente para renderizar cada producto
  const renderProducto = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri:
            item.attributes.imagen === null
              ? `http://190.6.81.46/uploads/iconoI.png`
              : `http://${dirImg}${item.attributes.imagen.split("/").pop()}`,
        }}
        cachePolicy="memory-disk"
        style={styles.imagen}
      />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.attributes.nombre}</Text>
        <Text style={styles.precio}>$ {item.attributes.precio}</Text>
        <View style={styles.botonesContainer}>
          <TouchableOpacity
            style={styles.botonAgregar}
            onPress={() => navigation.navigate("Editar", { producto: item })}
          >
            <Icon name="pencil" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonDetalles}
            onPress={() => handleDelete(item.id)}
          >
            <Icon name="trash" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modificar productos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#000"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de productos */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) =>
            item.id?.toString() || `temp-${Math.random()}`
          }
          renderItem={renderProducto}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#FFF" />
            ) : (
              <Text style={styles.noResults}>No se encontraron productos</Text>
            )
          }
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={cargarProductos}
          //     colors={["#FFF"]}
          //     tintColor="#FFF"
          //   />
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                cargarProductos(); // Ya maneja el reinicio internamente
              }}
              colors={["#FFF"]}
              tintColor="#FFF"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color="#FFF"
                style={styles.loadingMore}
              />
            ) : null
          }
        />
      </View>

      {/* Botón para eliminar todos */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buyNowButton1} onPress={eliminarTodos}>
          <Icon name="trash" size={20} color="#FFF" />
          <Text style={styles.buttonText}> Eliminar todos</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Estilos (se mantienen iguales)
const styles = StyleSheet.create({
  loadingMore: {
    marginVertical: 20,
  },
  loadMoreButton: {
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  loadMoreText: {
    color: "#FFF",
    fontWeight: "600",
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
  appContainer: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  botonesContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
  buyNowButton1: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF6B00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#555",
  },
  info: {
    marginLeft: 15,
    justifyContent: "space-between",
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F5F5F5",
  },
  precio: {
    fontSize: 16,
    color: "#FFA500",
    fontWeight: "bold",
  },
  botonAgregar: {
    width: 40,
    height: 40,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  botonDetalles: {
    width: 40,
    height: 40,
    backgroundColor: "#ff413e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#FFF",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default EliminarProducto;
