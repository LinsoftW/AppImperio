// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Platform,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/Ionicons";
// import api from "../api/api";
// import { RefreshControl } from "react-native-gesture-handler";
// import { Ionicons } from "@expo/vector-icons";
// import * as Clipboard from "expo-clipboard";

// const ListaTarjetasUser = ({ navigation }) => {
//   const [tarjetas, setTarjetas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [contacts, setContacts] = useState([]);

//   // Cargar tarjetas
//   const cargarTarjetas = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("/tarjetas");
//       //   console.log(response.data.data)
//       setTarjetas(response.data.data);
//       await loadContacts();
//     } catch (error) {
//       console.error("Error:", error);
//       Alert.alert("Error", "No se pudieron cargar las tarjetas");
//     } finally {
//       setLoading(false);
//     }
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     cargarTarjetas();
//   }, []);

//   // Eliminar tarjeta
//   const eliminarTarjeta = async (id) => {
//     try {
//       await api.delete(`/tarjetas/${id}`);
//       cargarTarjetas();
//       Alert.alert("Éxito", "Tarjeta eliminada correctamente");
//     } catch (error) {
//       console.error("Error:", error);
//       Alert.alert("Error", "No se pudo eliminar la tarjeta");
//     }
//   };

//   const copiarTarjeta = async (tarjeta) => {
//     try {
//           await Clipboard.setStringAsync(tarjeta);
//           if (Platform.OS === "ios") {
//             Alert.alert("✅ Copiado", "Tarjeta copiada en el portapapeles");
//           } else {
//             Alert.alert("✅ Copiado", "Tarjeta copiada en el portapapeles");
//           }
//         } catch (error) {
//           console.error("Error al copiar al portapapeles:", error);
//         }
//   }

//   // Cargar contactos
//   const loadContacts = async () => {
//     try {
//       const contactsRes = await api.get("/contactos");
//       setContacts(contactsRes.data.datos || []);
//       console.log("📞 Contactos cargados:", contactsRes.data.datos);
//     } catch (error) {
//       console.error("❌ Error cargando contactos:", error);
//     }
//   };

//   // Marcar como preferida
//   const marcarPreferida = async (id) => {
//     try {
//       await api.patch(`/tarjetas/${id}/preferida`);
//       cargarTarjetas();
//     } catch (error) {
//       console.error("Error:", error);
//       Alert.alert("Error", "No se pudo actualizar la tarjeta");
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     cargarTarjetas();
//   };

//   // Renderizar cada tarjeta
//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <View style={styles.itemHeader}>
//         <Text style={styles.numeroText}>
//           **** **** **** {item.numero.slice(-4)}
//         </Text>
//         {item.preferida === "Preferida" && (
//           <Icon name="star" size={20} color="#FFD700" />
//         )}
//       </View>

//       <View style={styles.itemFooter}>
//         <TouchableOpacity
//           onPress={() => marcarPreferida(item.id)}
//           style={styles.preferidaButton}
//         >
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => copiarTarjeta(item.numero)}
//           style={styles.eliminarButton}
//         >
//             <Text style={styles.preferidaText}>
//           <Icon name="copy" size={20} color="#FF3B30" />  Copiar tarjeta
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderItemMovil = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <View style={styles.itemHeader}>
//         <Text style={styles.numeroText}>
//          {item.telefono}
//         </Text>
//         {item.preferida === "Preferida" && (
//           <Icon name="star" size={20} color="#FFD700" />
//         )}
//       </View>

//       <View style={styles.itemFooter}>
//         <TouchableOpacity
//           onPress={() => marcarPreferida(item.id)}
//           style={styles.preferidaButton}
//         >
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => copiarTarjeta(item.numero)}
//           style={styles.eliminarButton}
//         >
//             <Text style={styles.preferidaText}>
//           <Icon name="copy" size={20} color="#FF3B30" />  Copiar tarjeta
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//         style={styles.header}
//       >
//         <View style={styles.header1}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Ionicons name="arrow-back" size={24} color="#FFF" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle1}>      Teléfono y número de tarjeta</Text>
//             <View style={{ width: 24 }} />
//           </View>
//         {/* <Text style={styles.headerText}>Número de tarjeta a pagar</Text> */}
//         <FlatList
//           data={tarjetas}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={
//             tarjetas.length === 0 ? styles.emptyList : null
//           }
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={["#000"]} // Color del spinner (opcional, solo Android)
//               tintColor="#000" // Color del spinner (iOS)
//             />
//           }
//           ListEmptyComponent={
//             <View style={styles.centered}>
//               <Icon name="card-outline" size={50} color="#CCC" />
//               <Text style={styles.emptyText}>No hay tarjetas registradas</Text>
//             </View>
//           }
//         />

//         <FlatList
//           data={tarjetas}
//           renderItem={renderItemMovil}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={
//             tarjetas.length === 0 ? styles.emptyList : null
//           }
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={["#000"]} // Color del spinner (opcional, solo Android)
//               tintColor="#000" // Color del spinner (iOS)
//             />
//           }
//           ListEmptyComponent={
//             <View style={styles.centered}>
//               <Icon name="card-outline" size={50} color="#CCC" />
//               <Text style={styles.emptyText}>No hay telefono registrado</Text>
//             </View>
//           }
//         />

//         {/* <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => navigation.navigate("AgregarTarjeta")}
//         >
//           <Icon name="add" size={30} color="#FFF" />
//         </TouchableOpacity> */}
//       </LinearGradient>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header1: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     top: 10,
//     padding: 16,
//     paddingTop: 10,
//   },
//   headerTitle1: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#FFF",
//     textShadowColor: "rgba(0, 0, 0, 0.3)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   textOverlay: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 100,
//     marginTop: 10,
//     textAlign: "center",
//     color: "black",
//     fontSize: 20,
//     fontWeight: "bold",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//     padding: 10,
//   },
//   textOverlay1: {
//     top: 10,
//     color: "red",
//     fontSize: 20,
//   },
//   cardImage: {
//     marginBottom: 20,
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   containerI: {
//     position: "relative",
//     width: 367,
//     height: 200,
//     top: 1,
//     borderRadius: 10,
//     margin: 3,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },
//   header: {
//     flex: 1,
//     padding: 20,
//     alignItems: "center",
//     paddingBottom: 70, // Espacio para la barra inferior
//   },
//   headerText: {
//     color: "#FFF",
//     fontSize: 22,
//     fontWeight: "bold",
//     paddingTop: 20
//   },
//   itemContainer: {
//     backgroundColor: "#FFF",
//     width: 300,
//     borderRadius: 10,
//     margin: 15,
//     padding: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   itemHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   numeroText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   itemFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   preferidaButton: {
//     padding: 1,
//     marginTop: -30,
//   },
//   preferidaText: {
//     color: "#4c669f",
//     fontWeight: "500",
//   },
//   eliminarButton: {
//     padding: 5,
//     top: 5,
//   },
//   addButton: {
//     position: "absolute",
//     right: 20,
//     bottom: 20,
//     backgroundColor: "#FF6B00",
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     marginTop: 10,
//     color: "#999",
//     fontSize: 16,
//   },
//   emptyList: {
//     flex: 1,
//     justifyContent: "center",
//   },
// });

// export default ListaTarjetasUser;

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import { RefreshControl } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const ListaTarjetasUser = ({ navigation }) => {
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  // Cargar tarjetas y contactos
  const cargarTarjetas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tarjetas");
      setTarjetas(response.data.data);
      await loadContacts();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudieron cargar las tarjetas");
    } finally {
      setLoading(false);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    cargarTarjetas();
  }, []);

  // Combinar datos cuando cambien tarjetas o contactos
  useEffect(() => {
    const combined = [
      // Mapear tarjetas a un formato común
      ...tarjetas.map(tarjeta => ({
        ...tarjeta,
        type: 'tarjeta',
        displayText: `**** **** **** ${tarjeta.numero.slice(-4)}`,
        copyText: tarjeta.numero
      })),
      // Mapear contactos a un formato común
      ...contacts.map(contacto => ({
        ...contacto,
        type: 'contacto',
        displayText: contacto.telefono,
        copyText: contacto.telefono,
        id: contacto.id || `contact-${contacto.telefono}` // Asegurar ID único
      }))
    ];
    setCombinedData(combined);
  }, [tarjetas, contacts]);

  // Cargar contactos
  const loadContacts = async () => {
    try {
      const contactsRes = await api.get("/contactos");
      setContacts(contactsRes.data.datos || []);
    //   console.log("📞 Contactos cargados:", contactsRes.data.datos);
    } catch (error) {
      console.error("❌ Error cargando contactos:", error);
    }
  };

  const copiarTarjeta = async (texto) => {
    try {
      await Clipboard.setStringAsync(texto);
      if (Platform.OS === "ios") {
        Alert.alert("✅ Copiado", "Tarjeta copiada en el portapapeles");
      } else {
        Alert.alert("✅ Copiado", "Tarjeta copiada en el portapapeles");
      }
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
    }
  }

  const copiarMovil = async (texto) => {
    try {
      await Clipboard.setStringAsync(texto);
      if (Platform.OS === "ios") {
        Alert.alert("✅ Copiado", "Móvil copiado en el portapapeles");
      } else {
        Alert.alert("✅ Copiado", "Móvil copiado en el portapapeles");
      }
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    cargarTarjetas();
  };

  // Renderizar cada item (tarjeta o contacto)
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.numeroText}>
          {item.displayText}
        </Text>
        {/* {item.preferida === "Preferida" && item.type === 'tarjeta' && (
          <Icon name="star" size={20} color="#FFD700" />
        )}
        {item.type === 'contacto' && (
          <Icon name="call" size={20} color="#4CAF50" />
        )} */}
      </View>

      <View style={styles.itemFooter}>
        {item.type === 'tarjeta' && (
            <View>
          <TouchableOpacity
            // onPress={() => marcarPreferida(item.id)}
            style={styles.preferidaButton}
          >
            <Text style={styles.preferidaText}>
              {item.preferida === "Preferida" ? "★ Preferida" : "☆ Marcar preferida"}
            </Text>
            
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => copiarTarjeta(item.copyText)}
          style={styles.copyButton}
        >
          <Text style={styles.copyText}>
            <Icon name="copy" size={16} color="#FF3B30" /> Copiar
          </Text>
        </TouchableOpacity>
          </View>
        )}
        
        {item.type === 'contacto' && (
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.attributes.nick || "Sin nombre"}</Text>
            <Text style={styles.contactName}>{item.attributes.numero || "Sin número"}</Text>
             <TouchableOpacity
          onPress={() => copiarMovil(item.attributes.numero)}
          style={styles.copyButton}
        >
          <Text style={styles.copyText}>
            <Icon name="copy" size={16} color="#FF3B30" /> Copiar
          </Text>
        </TouchableOpacity>
          </View>
        )}

        {/* <TouchableOpacity
          onPress={() => copiarTarjeta(item.copyText)}
          style={styles.copyButton}
        >
          <Text style={styles.copyText}>
            <Icon name="copy" size={16} color="#FF3B30" /> Copiar
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Mostrar tipo de item */}
      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>
          {item.type === 'tarjeta' ? '💳 Tarjeta' : '📞 Teléfono'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
        style={styles.header}
      >
        <View style={styles.header1}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle1}>Teléfono y número de tarjeta</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={combinedData}
          renderItem={renderItem}
          keyExtractor={(item) => 
            item.type === 'tarjeta' 
              ? `tarjeta-${item.id}` 
              : `contacto-${item.attributes.numero || item.numero}`
          }
          contentContainerStyle={
            combinedData.length === 0 ? styles.emptyList : styles.listContainer
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#000"]}
              tintColor="#000"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Icon name="card-outline" size={50} color="#CCC" />
              <Text style={styles.emptyText}>
                {loading ? "Cargando..." : "No hay tarjetas ni contactos registrados"}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    padding: 16,
    paddingTop: 10,
  },
  headerTitle1: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    paddingBottom: 70,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#FFF",
    width: 300,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  numeroText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    color: "#666",
    fontStyle: 'italic',
  },
  preferidaButton: {
    padding: 5,
  },
  preferidaText: {
    color: "#4c669f",
    fontWeight: "500",
    fontSize: 12,
  },
  copyButton: {
    padding: 5,
  },
  copyText: {
    color: "#FF3B30",
    fontWeight: "500",
    fontSize: 12,
    left: 190,
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
    textAlign: 'center',
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListaTarjetasUser;