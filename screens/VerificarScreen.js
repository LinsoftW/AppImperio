import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import api from "../api/api";
import { useNavigation, useRoute } from "@react-navigation/native";

const VerificacionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(60);
  const [telefono] = useState(route.params?.telefono || "");

  // Temporizador para reenviar código
  useEffect(() => {
    let intervalo;
    if (tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [tiempoRestante]);

  const handleVerificar = async () => {
    if (!codigo || codigo.length < 6) {
      Alert.alert("Error", "Por favor ingresa el código de verificación");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify", {
        telefono,
        codigo,
      });

      if (response.data.success) {
        Alert.alert(
          "Verificación exitosa",
          "Tu número de teléfono ha sido verificado correctamente",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Código incorrecto. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = async () => {
    setLoading(true);
    try {
      await api.post("/auth/resend-code", { telefono });
      setTiempoRestante(60);
      Alert.alert("Éxito", "Se ha enviado un nuevo código de verificación");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo reenviar el código. Intenta más tarde.");
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
        <Text style={styles.headerTitle}>Verificación de teléfono</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <FontAwesome
          name="mobile-phone"
          size={80}
          color="#FFF"
          style={styles.icon}
        />
        <Text style={styles.title}>
          Verifica tu número de teléfono
        </Text>
        <Text style={styles.subtitle}>
          Hemos enviado un código de 6 dígitos al número {telefono}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Código de verificación"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleVerificar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Verificar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={reenviarCodigo}
          disabled={tiempoRestante > 0 || loading}
        >
          <Text style={styles.resendText}>
            {tiempoRestante > 0
              ? `Reenviar código en ${tiempoRestante}s`
              : "Reenviar código"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    padding: 16,
    paddingTop: 25,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#DDD",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 25,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    marginBottom: 20,
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
  resendButton: {
    marginTop: 10,
  },
  resendText: {
    color: "#FFF",
    textDecorationLine: "underline",
  },
});

export default VerificacionScreen;