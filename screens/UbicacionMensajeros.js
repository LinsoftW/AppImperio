import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import api from "../api/api";
import { useIsFocused } from "@react-navigation/native";

const AdminMapaScreen = ({ navigation, route }) => {
  const [mensajeros, setMensajeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [region, setRegion] = useState({
    latitude: 22.2725, // Latitud por defecto (ej: Cuba)
    longitude: -80.5557, // Longitud por defecto
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Referencia para el intervalo
  const intervalRef = useRef(null);

  // Obtener mensajeros al cargar la pantalla
  // Configurar el intervalo cuando el componente se monta o cuando isFocused cambia
  useEffect(() => {
    if (isFocused) {
      // Ejecutar inmediatamente al cargar
      obtenerMensajeros();
      
      // Configurar intervalo para actualizar cada 30 segundos
      intervalRef.current = setInterval(obtenerMensajeros, 30000);
      
      // Limpiar el intervalo al desmontar
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // Si el componente pierde el foco, limpiar el intervalo
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isFocused]);

//   const obtenerMensajeros = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/mensajeros");
//       // console.log(response.data.data)
//       setMensajeros(response.data.data);
//       // Si hay mensajeros, centrar el mapa en el primero
//       if (response.data.data.length > 0) {
//         const primerMensajero = response.data.data[0];
//         setRegion({
//           ...region,
//           latitude: primerMensajero.attributes.ubicacion.latitud,
//           longitude: primerMensajero.attributes.ubicacion.longitud,
//         });
//       }
//     } catch (error) {
//       console.error("Error al obtener mensajeros:", error);
//       Alert.alert("Error", "No se pudieron cargar los mensajeros");
//     } finally {
//       setLoading(false);
//     }
//   };

  // Función para obtener mensajeros
  const obtenerMensajeros = async () => {
    setLoading(true);
    try {
      const response = await api.get("/mensajeros");
      setMensajeros(response.data.data);
      
      if (response.data.data.length > 0) {
        const primerMensajero = response.data.data[0];
        setRegion({
          ...region,
          latitude: primerMensajero.attributes.ubicacion.latitud,
          longitude: primerMensajero.attributes.ubicacion.longitud,
        });
      }
    } catch (error) {
      console.error("Error al obtener mensajeros:", error);
      Alert.alert("Error", "No se pudieron cargar los mensajeros");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la actualización manual
  const handleRefresh = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    await obtenerMensajeros();
    // Reiniciar el intervalo después de la actualización manual
    intervalRef.current = setInterval(obtenerMensajeros, 30000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Ubicación de Mensajeros</Text>
      </LinearGradient>

      <View style={styles.content}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {mensajeros.map((mensajero) => (
            <Marker
              key={mensajero.id}
              coordinate={{
                latitude: mensajero.attributes.ubicacion.latitud,
                longitude: mensajero.attributes.ubicacion.longitud,
              }}
              title={mensajero.attributes.nombre}
              description={`Estado: ${mensajero.attributes.disponible}`}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor:
                      mensajero.attributes.disponible === true ||
                      mensajero.attributes.disponible === "Disponible" ||
                      mensajero.attributes.disponible === 1
                        ? "#4CAF50" // Verde si está disponible
                        : "#F44336", // Rojo si no está disponible
                  },
                ]}
              >
                <Icon name="person" size={24} color="#FFF" />
              </View>
            </Marker>
          ))}
        </MapView>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Icon name="refresh" size={24} color="#FFF" />
          <Text style={styles.refreshButtonText}>
            {loading ? "Actualizando..." : "Actualizar ubicaciones"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  //   marker: {
  //     backgroundColor: "#4c669f",
  //     padding: 5,
  //     borderRadius: 20,
  //     borderWidth: 2,
  //     borderColor: "#FFF",
  //   },
  marker: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  refreshButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default AdminMapaScreen;
