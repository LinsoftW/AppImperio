import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import api from "../api/api";
import Constants from "expo-constants";

export default function AddContacto() {
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [contactoExistente, setContactoExistente] = useState(false);
  const navigation = useNavigation();
  const { server } = Constants.expoConfig.extra;

  // Verificar si el contacto ya existe mientras se escribe
  useEffect(() => {
    const timer = setTimeout(() => {
      if (telefono.length >= 8) {
        // Número mínimo para buscar
        verificarContactoExistente();
      }
    }, 1000); // Debounce de 1 segundo

    return () => clearTimeout(timer);
  }, [telefono]);

  const verificarContactoExistente = async () => {
    if (!telefono || telefono.length < 8) return;

    setValidating(true);
    try {
      const cleanNumber = telefono.replace(/[^0-9]/g, "");
      const response = await api.get(
        `http://${server}/contactos/existe?numero=${cleanNumber}`
      );

      if (response.data && response.data.existe) {
        setContactoExistente(response.data.data);
      } else {
        setContactoExistente(false);
      }
    } catch (error) {
      console.error("Error al verificar contacto:", error);
      setContactoExistente(false);
    } finally {
      setValidating(false);
    }
  };

  const openWhatsApp = (phoneNumber) => {
    // console.log(phoneNumber)
    if (!phoneNumber) {
      Alert.alert("Error", "No hay número de teléfono");
      return;
    }

    // Limpiar el número (eliminar espacios, guiones, etc.)
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

    // Abrir WhatsApp con el número
    Linking.openURL(`https://wa.me/+53${cleanNumber}`);
  };

  const handleSubmit = async () => {
    if (!telefono) {
      Alert.alert("Error", "El número de teléfono y el nombre son obligatorio");
      return;
    }

    // Limpiar y formatear el número de teléfono
    const cleanNumber = telefono.replace(/[^0-9]/g, "");

    // Verificar que el número tenga la longitud adecuada
    if (cleanNumber.length < 8) {
      Alert.alert("Error", "El número de teléfono es demasiado corto");
      return;
    }

    setLoading(true);

    try {
      // Usar la ruta completa con el servidor de configuración
      const response = await api.post(`http://${server}/contactos`, {
        nick: nick,
        numero: cleanNumber,
        direccion: direccion || null,
      });

      Alert.alert("Éxito", "Contacto agregado correctamente");
      setTelefono("");
      setDireccion("");
      setNick("");
    } catch (error) {
      console.error("Error al agregar contacto:", error);

      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 404) {
          Alert.alert(
            "Error",
            "El servicio de contactos no está disponible (404)"
          );
        } else if (error.response.data && error.response.data.message) {
          Alert.alert("Error", error.response.data.message);
        } else {
          Alert.alert("Error", `Error del servidor: ${error.response.status}`);
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        Alert.alert("Error", "No se recibió respuesta del servidor");
      } else {
        // Error al configurar la solicitud
        Alert.alert("Error", "Error al configurar la solicitud");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar contactos de WhatsApp</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre*"
            value={nick}
            onChangeText={setNick}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Número de WhatsApp*"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />

          {validating && (
            <View style={styles.validatingContainer}>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.validatingText}>Verificando...</Text>
            </View>
          )}

          {contactoExistente && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning" size={20} color="#FFA500" />
              <Text style={styles.warningText}>Este contacto ya existe</Text>
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Dirección (opcional)"
            value={direccion}
            onChangeText={setDireccion}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => openWhatsApp(telefono)}
          disabled={!telefono}
        >
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}> Abrir WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => navigation.navigate("ListaContacto")}
          // disabled={!telefono}
        >
          <FontAwesome name="list" size={20} color="#FFF" />
          <Text style={styles.buttonText}> Ver listado de contactos</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.buyNowButton,
              // contactoExistente && styles.disabledButton
            ]}
            onPress={handleSubmit}
          >
            <FontAwesome name="whatsapp" size={20} color="#FFF" />
            <Text style={styles.buttonText}>
              {loading ? "Guardando..." : "Guardar Contacto"}
            </Text>
            {loading && (
              <ActivityIndicator color="#FFF" style={{ marginLeft: 5 }} />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    padding: 16,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  whatsappButton: {
    backgroundColor: "#25D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  buyNowButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF6000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#AAAAAA",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  validatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  validatingText: {
    color: "#FFF",
    marginLeft: 5,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  warningText: {
    color: "#FFA500",
    marginLeft: 5,
  },
});
