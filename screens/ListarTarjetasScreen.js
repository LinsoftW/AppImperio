import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import { RefreshControl } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const ListaTarjetasScreen = ({ navigation }) => {
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar tarjetas
  const cargarTarjetas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tarjetas");
      //   console.log(response.data.data)
      setTarjetas(response.data.data);
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

  // Eliminar tarjeta
  const eliminarTarjeta = async (id) => {
    try {
      await api.delete(`/tarjetas/${id}`);
      cargarTarjetas();
      Alert.alert("Éxito", "Tarjeta eliminada correctamente");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo eliminar la tarjeta");
    }
  };

  // Marcar como preferida
  const marcarPreferida = async (id) => {
    try {
      await api.patch(`/tarjetas/${id}/preferida`);
      cargarTarjetas();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo actualizar la tarjeta");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    cargarTarjetas();
  };

  // Renderizar cada tarjeta
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.numeroText}>
          **** **** **** {item.numero.slice(-4)}
        </Text>
        {item.preferida === "Preferida" && (
          <Icon name="star" size={20} color="#FFD700" />
        )}
      </View>

      <View style={styles.itemFooter}>
        <TouchableOpacity
          onPress={() => marcarPreferida(item.id)}
          style={styles.preferidaButton}
        >
          <Text style={styles.preferidaText}>
            {item.preferida === "Preferida"
              ? "Preferida"
              : "Marcar como preferida"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => eliminarTarjeta(item.id)}
          style={styles.eliminarButton}
        >
          <Icon name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
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
            <Text style={styles.headerTitle1}>      Listado de tarjetas del sistema</Text>
            <View style={{ width: 24 }} />
          </View>
        <Text style={styles.headerText}>Mis Tarjetas</Text>
        <FlatList
          data={tarjetas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            tarjetas.length === 0 ? styles.emptyList : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#000"]} // Color del spinner (opcional, solo Android)
              tintColor="#000" // Color del spinner (iOS)
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Icon name="card-outline" size={50} color="#CCC" />
              <Text style={styles.emptyText}>No hay tarjetas registradas</Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AgregarTarjeta")}
        >
          <Icon name="add" size={30} color="#FFF" />
        </TouchableOpacity>
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
  textOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    marginTop: 10,
    textAlign: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    padding: 10,
  },
  textOverlay1: {
    top: 10,
    color: "red",
    fontSize: 20,
  },
  cardImage: {
    marginBottom: 20,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  containerI: {
    position: "relative",
    width: 367,
    height: 200,
    top: 1,
    borderRadius: 10,
    margin: 3,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    paddingBottom: 70, // Espacio para la barra inferior
  },
  headerText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    paddingTop: 20
  },
  itemContainer: {
    backgroundColor: "#FFF",
    width: 300,
    borderRadius: 10,
    margin: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  preferidaButton: {
    padding: 1,
    marginTop: -30,
  },
  preferidaText: {
    color: "#4c669f",
    fontWeight: "500",
  },
  eliminarButton: {
    padding: 5,
    top: 5,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF6B00",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
});

export default ListaTarjetasScreen;
