import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import api from "../api/api";

export default function SolicitarCambioPassScreen({ navigation }) {
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSolicitarCambio = async () => {
    if (!telefono) {
      Alert.alert("Error", "Por favor ingresa tu número de teléfono");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/solicitar-cambio-password", {
        telefono,
      });
      // console.log(response)

      Alert.alert(
        "Código enviado",
        "Se ha enviado un código de verificación a tu teléfono",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("CambiarPassword", { telefono }),
          },
        ]
      );
    } catch (error) {
      console.error("Error al solicitar cambio:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error al solicitar el cambio. Por favor, inténtalo de nuevo.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Ionicons name="lock-closed" size={50} color="#FFF" />
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa tu número de teléfono para recibir un código de
              verificación
            </Text>
          </View>

          {/* <TextInput
            style={styles.input}
            placeholder="Teléfono *"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            editable={!loading}
          /> */}
          <View style={styles.inputContainer}>
            <FontAwesome
              name="phone"
              size={20}
              color="#fff"
              style={styles.icon}
            />

            <TextInput
              placeholder=" Teléfono"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              maxLength={8}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSolicitarCambio}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Solicitar código</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>
              Volver al inicio de sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  formContainer: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  // input: {
  //   width: "100%",
  //   backgroundColor: "#fff",
  //   padding: 15,
  //   borderRadius: 10,
  //   marginBottom: 20,
  //   fontSize: 16,
  // },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: "#FFF",
    textDecorationLine: "underline",
    fontSize: 15,
    paddingTop: 50,
  },
});
