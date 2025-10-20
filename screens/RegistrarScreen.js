import React, { useEffect, useState } from "react"; // Image
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
// import { Image } from 'react-native-compressor';
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
// import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
// import { Config } from "../Config";
import api from "../api/api";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";

export default function RegistroScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { server, dirImg } = Constants.expoConfig.extra;
  const [userData, setUserData] = useState({
    telefono: "",
    nick: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    direccion: "",
    email: "",
    password: "",
    imagen_id: null,
    idrol: null,
  });

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true, // Importante para Android
      });

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setImage(selectedFile.uri);
        setUserData({ ...userData, imagen_id: null });
        return selectedFile.uri;
      }
      return null;
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    }
  };

  // Enviar sms de verificacion
  // const sendDirectSMS = async () => {
  //     try {
  //         // Solicitar permiso en Android
  //         const granted = await PermissionsAndroid.request(
  //             PermissionsAndroid.PERMISSIONS.SEND_SMS,
  //             {
  //                 title: 'Permiso para enviar SMS',
  //                 message: 'La app necesita permiso para enviar SMS.',
  //                 buttonNeutral: 'Preguntar después',
  //                 buttonNegative: 'Cancelar',
  //                 buttonPositive: 'OK',
  //             }
  //         );

  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //             SMS.send(
  //                 {
  //                     body: 'Mensaje de prueba desde mi app',
  //                     recipients: ['54223460'], // Array de números
  //                     allowAndroidSendWithoutReadPermission: true,
  //                 },
  //                 (completed, cancelled, error) => {
  //                     console.log(
  //                         'SMS Callback:',
  //                         completed, // true si se envió
  //                         cancelled, // true si el usuario canceló
  //                         error      // mensaje de error
  //                     );
  //                 }
  //             );
  //         } else {
  //             console.log('Permiso denegado');
  //         }
  //     } catch (error) {
  //         console.error('Error al enviar SMS:', error);
  //     }
  // };

  const validatePassword = () => {
    if (
      userData.password &&
      confirmPassword &&
      userData.password !== confirmPassword
    ) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const checkImageSize = async (uri) => {
    const stats = await RNFS.stat(uri);
    const sizeInMB = stats.size / (1024 * 1024);
    return sizeInMB > 5; // Retorna true si es mayor a 5MB
  };

  // Llama a validatePassword cuando cambien los campos
  useEffect(() => {
    validatePassword();
  }, [userData.password, confirmPassword]);

  //  Version anterior, casi funcional

  const uploadImage = async () => {
    if (!image) {
      // Alert.alert("Aviso", "Selecciona una imagen primero");
      return;
    }

    setUploading(true);

    // Imagen original al servidor
    const formData = new FormData();
    formData.append("imagen", {
      uri: image,
      name: `profile_${Date.now()}.jpg`,
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(`http://${server}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 segundos de timeout
      });
      // const response = await api.post(`/upload`, formData);

      setUserData({ ...userData, imagen_id: response.data.id });
      // return true
      // Alert.alert("Éxito", "Imagen de perfil guardada correctamente");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Error al subir la imagen. Por favor, inténtalo de nuevo."
      );
      // return false
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validar teléfono
    if (!userData.telefono || !/^\d{8,15}$/.test(userData.telefono)) {
      errors.telefono = "Teléfono debe tener 8-15 dígitos";
    }

    // Validar nick
    if (!userData.nick || userData.nick.length < 4) {
      errors.nick = "El nombre de usuario debe tener al menos 4 caracteres";
    }

    // Validar contraseña
    if (
      !userData.password ||
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(userData.password)
    ) {
      errors.password =
        "La contraseña debe tener 8+ caracteres, una mayúscula, una minúscula y un número";
    }

    // Validar nombres
    // if (
    //   !userData.nombre ||
    //   !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.nombre)
    // ) {
    //   errors.nombre = "Nombre solo puede contener letras";
    // }

    // if (
    //   !userData.apellido1 ||
    //   !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.apellido1)
    // ) {
    //   errors.apellido1 = "Apellido solo puede contener letras";
    // }

    // Validar coincidencia de contraseñas
    if (userData.password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(errors).length > 0) {
      Alert.alert("Errores de validación", Object.values(errors).join("\n"));
      return false;
    }

    return true;
  };

  const verificarSMS = () => {
    // sendDirectSMS()
    // navigation.navigate("Login");
    // Redirige a la pantalla de verificación con el teléfono
    navigation.navigate("VerificarNumero", { telefono: userData.telefono });
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setRegistering(true);

    try {
      // Subir imagen
      if (image){
        uploadImage();
        const dataToSend = {
          telefono: userData.telefono,
          nick: userData.nick,
          // nombre: userData.nombre,
          // apellido1: userData.apellido1,
          password: userData.password,
          // Campos opcionales solo si tienen valor
          // ...(userData.apellido2 && { apellido2: userData.apellido2 }),
          // ...(userData.direccion && { direccion: userData.direccion }),
          ...(userData.imagen_id && { imagen_id: userData.imagen_id }),
        };
        const response = await api.post("/auth/register", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
      }else{
        const dataToSend = {
          telefono: userData.telefono,
          nick: userData.nick,
          // nombre: userData.nombre,
          // apellido1: userData.apellido1,
          password: userData.password,
          // Campos opcionales solo si tienen valor
          // ...(userData.apellido2 && { apellido2: userData.apellido2 }),
          // ...(userData.direccion && { direccion: userData.direccion }),
          ...(userData.imagen_id && { imagen_id: null }),
      }
      const response = await api.post("/auth/register", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
    }
      // Preparar datos para enviar (sin campos vacíos)
      // console.log(dataToSend);
      Alert.alert(
        "Registro exitoso",
        "¡Tu cuenta ha sido creada con éxito!. Teclee el código recibido para verificar que su número de teléfono es real.",
        [{ text: "OK", onPress: () => verificarSMS() }]
      );
    } catch (error) {
      console.error(
        "Error al registrar:",
        error.response?.data || error.message
      );

      let errorMessage = "Error al registrar. Intenta nuevamente.";
      if (error.response?.data?.errors) {
        // Mostrar errores específicos del servidor
        errorMessage = Object.values(error.response.data.errors).join("\n");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  const handleChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
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
        <Text style={styles.headerTitle}>Registro de usuario</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Sección de imagen */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={pickFile}
            disabled={uploading || registering}
          >
            {/* <Image
                            source={require('../assets/User.png')}
                            style={styles.profileImage}
                        /> */}
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={50} color="#FFF" />
                <Text style={styles.imageText}>Subir foto de perfil</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Boton de confirmar imagen */}
          {/* {image && !userData.imagen_id && (
            <TouchableOpacity
              style={[styles.uploadButton, uploading && styles.disabledButton]}
              onPress={uploadImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                
                <Text style={styles.buttonText}>Confirmar imagen</Text>
              )}
            </TouchableOpacity>
          )} */}

          {/* Campos del formulario */}
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
              value={userData.telefono}
              onChangeText={(text) => handleChange("telefono", text)}
              keyboardType="phone-pad"
              maxLength={8}
              autoCapitalize="none"
              editable={!registering}
            />
          </View>
          {/* <TextInput
            style={styles.input}
            placeholder="Teléfono *"
            value={userData.telefono}
            onChangeText={(text) => handleChange("telefono", text)}
            keyboardType="phone-pad"
            color="#000"
            editable={!registering}
          /> */}

          {/* <TextInput
            style={styles.input}
            placeholder="Nombre de usuario *"
            value={userData.nick}
            onChangeText={(text) => handleChange("nick", text)}
            editable={!registering}
            color="#000"
          /> */}

          <View style={styles.inputContainer}>
            <FontAwesome
              name="user"
              size={20}
              color="#fff"
              style={styles.icon}
            />

            <TextInput
              placeholder=" Nombre de usuario"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={userData.nick}
              onChangeText={(text) => handleChange("nick", text)}
              // keyboardType="phone-pad"
              autoCapitalize="none"
              editable={!registering}
            />
          </View>

          {/* <TextInput
            style={styles.input}
            placeholder="Nombre(s) *"
            value={userData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
            editable={!registering}
          />

          <TextInput
            style={styles.input}
            placeholder="Primer apellido *"
            value={userData.apellido1}
            onChangeText={(text) => handleChange("apellido1", text)}
            editable={!registering}
          />

          <TextInput
            style={styles.input}
            placeholder="Segundo apellido"
            value={userData.apellido2}
            onChangeText={(text) => handleChange("apellido2", text)}
            editable={!registering}
          /> */}

          {/* <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Dirección *"
            value={userData.direccion}
            onChangeText={(text) => handleChange("direccion", text)}
            multiline
            numberOfLines={3}
            editable={!registering}
          /> */}
          <View style={styles.inputContainer}>
            <FontAwesome
              name="lock"
              size={20}
              color="#fff"
              style={styles.icon}
            />

            <TextInput
              placeholder=" Contraseña"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={userData.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!showPassword}
              // keyboardType="phone-pad"
              autoCapitalize="none"
              editable={!registering}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome
              name="lock"
              size={20}
              color="#fff"
              style={styles.icon}
            />

            <TextInput
              placeholder=" Repita la contraseña"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              // keyboardType="phone-pad"
              autoCapitalize="none"
              editable={!registering}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Contraseña *"
              value={userData.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!showPassword}
              editable={!registering}
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
              placeholder="Repita la contraseña *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!registering}
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
          </View> */}
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <TouchableOpacity
            style={[
              styles.registerButton,
              (uploading || registering) && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={uploading || registering}
          >
            {registering ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
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
    paddingTop: 25
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 1, // Borde interno
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  // inputPass: {
  //     flex: 1,
  //     padding: 15,
  //     fontSize: 16,
  //     paddingRight: 40,  // Espacio para el ícono
  // },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
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
  imageButton: {
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    borderStyle: "dashed",
  },
  imageText: {
    color: "#FFF",
    marginTop: 10,
    textAlign: "center",
  },
  // input: {
  //   // width: '100%',
  //   // backgroundColor: '#FFF',
  //   // padding: 15,
  //   // borderRadius: 10,
  //   // marginBottom: 10,
  //   // fontSize: 16,
  //   // color: '#000',
  //   // borderWidth: 0,

  //   width: "100%",
  //   backgroundColor: "#FFF",
  //   padding: 15,
  //   borderRadius: 8, // Ajusta para que coincida con el borde del contenedor
  //   fontSize: 16,
  //   color: "#000",
  //   borderWidth: 0, // Elimina cualquier borde interno
  //   marginBottom: 10,
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
    paddingHorizontal: 5,
  },
  // inputContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   width: "100%",
  //   maxWidth: 350,
  //   backgroundColor: "rgba(255, 255, 255, 0.2)",
  //   borderRadius: 25,
  //   paddingHorizontal: 15,
  //   marginBottom: 15,
  // },

  // input: {
  //   flex: 1,
  //   height: 50,
  //   color: "#fff",
  //   fontSize: 16,
  // },
  // inputPass: {
  //     width: '100%',
  //     backgroundColor: '#FFF',
  //     padding: 15,
  //     borderRadius: 10,
  //     marginBottom: 15,
  //     fontSize: 16,
  // },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  registerButton: {
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
});
