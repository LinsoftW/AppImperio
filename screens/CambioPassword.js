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
import { Ionicons } from "@expo/vector-icons";
import api from "../api/api";

export default function CambiarPasswordScreen({ route, navigation }) {
  const { telefono } = route.params;
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (nuevaPassword && confirmPassword && nuevaPassword !== confirmPassword) {
      return "Las contraseñas no coinciden";
    }
    if (nuevaPassword && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(nuevaPassword)) {
      return "La contraseña debe tener 8+ caracteres, una mayúscula, una minúscula y un número";
    }
    return "";
  };

  const handleCambiarPassword = async () => {
    const passwordError = validatePassword();
    if (passwordError) {
      Alert.alert("Error", passwordError);
      return;
    }

    if (!codigo) {
      Alert.alert("Error", "Por favor ingresa el código de verificación");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verificar-codigo-cambio", {
        telefono,
        codigo,
        nuevaPassword,
      });

      Alert.alert(
        "Contraseña cambiada",
        "Tu contraseña ha sido actualizada correctamente",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error al cambiar la contraseña. Por favor, inténtalo de nuevo.";
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
            <Ionicons name="key" size={50} color="#FFF" />
            <Text style={styles.title}>Cambiar Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa el código recibido y tu nueva contraseña
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Código de verificación *"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="number-pad"
            editable={!loading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nueva contraseña *"
              value={nuevaPassword}
              onChangeText={setNuevaPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Confirmar nueva contraseña *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {validatePassword() ? (
            <Text style={styles.errorText}>{validatePassword()}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleCambiarPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cambiar Contraseña</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
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
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
    borderWidth: 0,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 1,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
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
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: "#FFF",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
});