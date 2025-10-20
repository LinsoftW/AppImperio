import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import api from "../api/api";
import axios from "axios";
import { useUser } from "./UserContext";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import { Asset } from "expo-asset";
// import Geolocation from '@react-native-community/geolocation';

// 1. Evita que SplashScreen se oculte automáticamente
// SplashScreen.preventAutoHideAsync();

const LoginScreenEste = ({ navigation }) => {
  const [nick, setEmail] = useState("");
  // const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [buttonScale] = useState(new Animated.Value(1));
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [appIsReady, setAppIsReady] = useState(false);

  const { login, loginAnonimo, setLoading } = useUser();
  const { server } = Constants.expoConfig?.extra;

  useEffect(() => {
    const img = Asset.loadAsync(require("../assets/IconoSolo.png"));
  }, []);

  const getLocationByIP = async (telefono) => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    // console.log("TT "+ telefono)
    const response1 = await api.post('/repartidor/ubicacion', { latitud: data.latitude, longitud: data.longitude, telefono: telefono });
    // console.log("Ubicación aproximada:", data.city, data.country);
    // console.log("Coordenadas:", data.latitude, data.longitude);
  } catch (error) {
    console.error("Error al obtener ubicación por IP:", error);
  }
};

  // 2. Carga todos los recursos necesarios
  useEffect(() => {
    async function prepare() {
      try {
        // Simula la carga de recursos (remplaza con tus cargas reales)
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Indica que la aplicación está lista
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // 3. Oculta el SplashScreen cuando todo esté listo
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
    
  }, [appIsReady]);



  const handleAnonymousLogin = async () => {
    Alert.alert(
      "Acceso como invitado",
      "¿Desea continuar sin una cuenta? Tendrá acceso limitado",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: async () => {
            try {
              setCargando(true);
              // 1. Petición al backend
              const response = await api.post("/login-anonimo");

              // 2. Validar estructura de respuesta
              if (!response.data?.token || !response.data?.id) {
                throw new Error("Datos de sesión inválidos");
              }

              // 3. Guardar en AsyncStorage
              const userData = {
                id: response.data.id,
                token: response.data.token,
                nick: response.data.nick || "Invitado",
                rol: response.data.rol || "invitado",
                esAnonimo: true,
              };

              await AsyncStorage.multiRemove(["userData"]); // Limpiar primero
              await AsyncStorage.setItem("userData", JSON.stringify(userData));

              // 4. Actualizar estado y navegar
              if (loginAnonimo) loginAnonimo(userData);
              if (navigation) navigation.navigate("Inicio");
            } catch (error) {
              console.error("Error en login anónimo:", error);
              const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Error desconocido";
              Alert.alert("Error", errorMessage);
            } finally {
              setCargando(false);
            }
          },
        },
      ]
    );
  };

  const handleLogin = async () => {
    // console.log("Entrooooo")
    //  console.log("🔸 Iniciando login...");
    if (!nick || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setCargando(true);
    // console.log(server)
    // / VERIFICAR: ¿De dónde viene 'server'?
  // console.log("🔸 Server URL:", `http://${server}/auth/login`);
  // console.log("🔸 Datos:", { nick, password });

    try {
      const response = await axios.post(`http://${server}/auth/login`, {
        nick,
        password,
      });

      // console.log(response.data)

      // console.log("🔸 Respuesta del servidor:", response.data);
      // console.log("Llegooooo")
      if (response.data) {
        // console.log("🔸 Login exitoso");
        // setTelefono(response.data.user.telefono)
        // console.log("Es mensajero? " + response.data.user.telefono)
        // if (response.data.user.esMensajero === 1){
        //   getLocationByIP(response.data.user.telefono)
        // }
        //  Los ejecutarnos
        const userDataToStore = {
          id: response.data.user.id,
          token: response.data.token,
          nick: response.data.user.nick || null,
          rol: response.data.user.rol,
          telefono: response.data.user.telefono || null,
          esmensajero: response.data.user.esMensajero || 0,
          esAnonimo: false,
        };

        // Guarda en AsyncStorage
        const jsonData = JSON.stringify(userDataToStore);
        if (!jsonData) throw new Error("Error al serializar datos");
        try {
          const jsonValue = JSON.stringify(userDataToStore);
          await AsyncStorage.setItem("userData", jsonValue);
        } catch (e) {
          console.error("Falló el guardado en AsyncStorage:", e);
          // Opcional: Guardar datos mínimos esenciales
          await AsyncStorage.setItem(
            "userData_fallback",
            JSON.stringify({
              id: userDataToStore.id,
              token: userDataToStore.token,
            })
          );
        }
        // Actualizar contexto
        // onLogin() // Cambia el estado de logueo
        setLoading(true);
        login(response.data);
        // Redirigir
        // console.log("Es mensajero? " + response.data.user.esMensajero)
        navigation.replace("Inicio");
      } else {
        // console.log("🔸 Login fallido - respuesta no exitosa");
        Alert.alert("Error", "❌ Usuario o contraseña incorrectas.");
      }
    } catch (error) {
      if (error.response) {
    //      console.error("🔸 Error completo:", error);
    // console.log("🔸 Error response:", error.response);
    // console.log("🔸 Error request:", error.request);
        Alert.alert("Error", "❌ Usuario o contraseña incorrectas.");
      } else if (error.request) {
        // console.log("🔸 No hay respuesta del servidor");
        // No se recibió respuesta
        Alert.alert("Error", "❌ No se pudo conectar al servidor.");
      } else {
        //  console.log("🔸 Error de configuración:", error.message);
        // Error en la configuración de la petición
        Alert.alert("Error", "Error inesperado");
      }
    } finally {
      //  console.log("🔸 Finalizando carga...");
      setCargando(false);
    }
  };

  // Animaciones
  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  // Estilo animado memoizado
  const animatedButtonStyle = {
    transform: [{ scale: buttonScale }],
  };

  if (!appIsReady) {
    return null; // O un componente de carga simple
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
        style={styles.container}
        // style={{ flex: 1 }}
        onLayout={() => {}}
      >
        {/* <SafeAreaView 
        style={{ flex: 1 }}
        edges={Platform.OS === "android" ? ["bottom"] : []} // Solo ajusta el borde inferior en Android
      > */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          // style={styles.container}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.loginContainer}>
              <Image
                source={require("../assets/logoCar.png")}
                style={styles.logo}
                contentFit="contain"
              />

              <Text style={styles.title}>Bienvenido</Text>

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="user"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Nombre de usuario o teléfono"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  value={nick}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!cargando}
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="lock"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña *"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!cargando}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <Animated.View style={animatedButtonStyle}>
                <TouchableOpacity
                  style={[styles.button, cargando && styles.disabledButton]}
                  onPress={handleLogin}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={cargando || !nick || !password}
                  activeOpacity={0.7}
                >
                  {cargando ? (
                    <ActivityIndicator color="#4c669f" />
                  ) : (
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                disabled={cargando}
                onPress={() => navigation.navigate("Registro")}
              >
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.registerLink}>Regístrate</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={cargando}
                onPress={() => navigation.navigate("SolicitarCambioPassw")}
              >
                <Text style={styles.registerLink}>Olvidé mi contraseña </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      {/* </SafeAreaView> */}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1, // Agrega borde para mejor visibilidad
    borderColor: "#DDD",
  },
  container: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    // top: -15,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
  },
  anonymousButton: {
    backgroundColor: "#666",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    borderRadius: 75,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
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
  icon: {
    marginRight: 10,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#4c669f",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    color: "#fff",
    marginTop: 30,
    textAlign: "center",
    fontSize: 15,
  },
  resetPasswText: {
    color: "#fff",
    marginTop: 10,
  },
  registerLink: {
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 20,
    textAlign: "center",
    paddingTop: 10,
  },
});
export default LoginScreenEste;
