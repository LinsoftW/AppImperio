import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";

const ReporteVentasScreen = ({ navigation }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [fechaFin, setFechaFin] = useState(new Date());
  const [showModalPicker, setShowModalPicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);
  const [totalVentas, setTotalVentas] = useState(0);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  // Generar opciones de fechas para el Picker (últimos 90 días)
  const generateDateOptions = () => {
    return Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarVentas();
    setRefreshing(false);
  };

  const [dateOptions, setDateOptions] = useState(generateDateOptions());

  const renderDateModal = () => (
    <Modal
      transparent={true}
      visible={showModalPicker}
      animationType="slide"
      onRequestClose={() => setShowModalPicker(false)}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            Platform.OS === "ios" && styles.modalContentIOS,
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Seleccionar{" "}
              {currentDateField === "inicio" ? "fecha inicial" : "fecha final"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowModalPicker(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={
                currentDateField === "inicio"
                  ? fechaInicio.toISOString()
                  : fechaFin.toISOString()
              }
              onValueChange={(itemValue) => {
                const selectedDate = new Date(itemValue);
                if (currentDateField === "inicio") {
                  setFechaInicio(selectedDate);
                } else {
                  setFechaFin(selectedDate);
                }
                setShowModalPicker(false);
              }}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              mode={Platform.OS === "android" ? "dropdown" : "dialog"}
            >
              {dateOptions.map((date, index) => (
                <Picker.Item
                  key={index}
                  label={date.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  value={date.toISOString()}
                  color="#000" // Color del texto para iOS
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </Modal>
  );
  // Cargar datos de ventas
  const cargarVentas = async () => {
    setVentas([]);
    setFilteredData([]);
    try {
      setLoading(true);
      const response = await api.get("/reporte-ventas", {
        params: {
          fecha_inicio: fechaInicio.toISOString().split("T")[0],
          fecha_fin: fechaFin.toISOString().split("T")[0],
        },
      });

      if (response.data && response.data.data) {
        setVentas(response.data.data);
        setFilteredData(response.data.data);
        setTotalVentas(response.data.total || 0);
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "No se pudo cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, [fechaInicio, fechaFin, isFocused]);

  // Filtrado de datos
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(ventas);
    } else {
      const filtered = ventas.filter((item) =>
        item.cliente.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, ventas]);

  // Formatear fecha para mostrar
  const formatFecha = (date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Renderizar cada item de venta
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("DetalleVenta", { ventaId: item.id })}
    >
      {/* <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      ></ScrollView> */}
      <View style={styles.itemHeader}>
        <Text style={styles.fechaText}>
          {formatFecha(new Date(item.fecha_venta))}
        </Text>
        <Text style={styles.montoText}>
          ${parseFloat(item.total).toFixed(2)}
        </Text>
      </View>

      <View style={styles.itemBody}>
        <Text style={styles.clienteText}>{item.cliente}</Text>
        <Text style={styles.productoText}>
          {item.producto} x {item.cantidad}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Renderizar encabezado con controles de fecha
  const renderHeader = () => (
    <View style={styles.fixedHeader}>
      <LinearGradient
        colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reporte de ventas</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.dateControls}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCurrentDateField("inicio");
              setShowModalPicker(true);
            }}
          >
            <Icon name="calendar" size={16} color="#FFF" />
            <Text style={styles.dateButtonText}>
              Desde: {formatFecha(fechaInicio)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCurrentDateField("fin");
              setShowModalPicker(true);
            }}
          >
            <Icon name="calendar" size={16} color="#FFF" />
            <Text style={styles.dateButtonText}>
              Hasta: {formatFecha(fechaFin)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${totalVentas.toFixed(2)}</Text>
        </View>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={30}
            color="#000"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar persona..."
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
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Parte fija */}
      {renderHeader()}

      {/* Parte desplazable */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          `${item.id?.toString() || "reporte-id"}-${index}`
        }
        contentContainerStyle={
          ventas.length === 0 ? styles.emptyList : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Icon name="receipt-outline" size={50} color="#CCC" />
            <Text style={styles.emptyText}>No hay ventas en este período</Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {renderDateModal()}
    </View>
  );
};

// Estilos optimizados para ambos sistemas
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // backgroundColor: "#F5F5F5",
  //   padding: 1,
  // },
  fixedHeader: {
    zIndex: 1, // Para que quede por encima
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 1,
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: "50%",
  },
  modalContentIOS: {
    paddingBottom: 30, // Más espacio para iOS
  },
  pickerContainer: {
    height: Platform.OS === "ios" ? 180 : 160,
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    backgroundColor: Platform.OS === "ios" ? "#f8f8f8" : "transparent",
  },
  pickerItem: {
    color: "#000", // Color del texto
    fontSize: Platform.OS === "ios" ? 18 : 16,
    fontWeight: Platform.OS === "ios" ? "500" : "normal",
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "#F5F5F5",
  //   // paddingTop: 1
  // },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  dateControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    top: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dateButtonText: {
    color: "#FFF",
    marginLeft: 5,
    fontSize: 14,
  },
  totalContainer: {
    alignItems: "center",
    padding: 10,
  },
  totalText: {
    color: "#FFf600",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    // paddingTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    // paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  fechaText: {
    color: "#666",
    fontSize: 14,
  },
  montoText: {
    color: "#2ecc71",
    fontWeight: "bold",
  },
  itemBody: {
    marginBottom: 5,
  },
  clienteText: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productoText: {
    color: "#666",
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  // Estilos para el modal del picker de fechas
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  pickerItem: {
    fontSize: 16,
  },
});

export default ReporteVentasScreen;
