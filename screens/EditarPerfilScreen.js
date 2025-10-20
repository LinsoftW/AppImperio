import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  // Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "./UserContext";
import api from "../api/api";
import { use, useEffect, useState } from "react";
import Constants from "expo-constants";
// import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
const { server, dirImg } = Constants.expoConfig.extra;

const EditarPerfilScreen = ({ navigation, route }) => {
  const { user, updateUser } = useUser();
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    direccion: "",
    imagen: null,
  });

  const isFocused = useIsFocused();
  const [tempImage, setTempImage] = useState(null);

  // useEffect(() => {
  //   if (isFocused || route.params?.refresh) {
  //     obtenerUser();
  //   }
  // }, [isFocused, route.params?.refresh]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await obtenerUser();
        setTempImage(null); // Resetear imagen temporal al cargar
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const obtenerUser = async () => {
    try {
      const response = await api.get("usuarios");
      for (let index = 0; index < response.data.datos.length; index++) {
        if (response.data.datos[index].attributes.nick === user.nick) {
          const userData = response.data.datos[index].attributes;
          setUsuario({
            nombre: userData.nombre || "",
            apellido1: userData.apellido1 || "",
            apellido2: userData.apellido2 || "",
            telefono: userData.telefono || "",
            direccion: userData.direccion || "",
            imagen: userData.imagen,
          });
          break;
        }
      }
    } catch (e) {
      console.error("Error al obtener usuario", e);
    }
  };

  // const seleccionarImagen = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("Se requieren permisos para acceder a la galería");
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: "Images",
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 0.5,
  //   });

  //   if (!result.canceled && result.assets) {
  //     setTempImage(result.assets[0].uri);
  //   }
  // };

  const seleccionarImagen = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true, // Importante para Android
      });

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setTempImage(selectedFile.uri);
        // setUserData({ ...userData, imagen_id: null });
        return selectedFile.uri;
      }
      return null;
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    }
  };

  const guardarCambios = async () => {
    try {
      let imagen_id = usuario.imagen;

      if (tempImage) {
        const formData = new FormData();
        formData.append("imagen", {
          uri: tempImage,
          name: "profile.jpg",
          type: "image/jpeg",
        });

        const uploadResponse = await api.post("upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log(uploadResponse.data)

        if (uploadResponse.data && uploadResponse.data.id) {
          imagen_id = uploadResponse.data.id;
        }
        const updateData = {
          nombre: usuario.nombre,
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          nick: user.nick,
          imagen_id: imagen_id || null, // Asegurar que siempre se envíe
        };

        // console.log(updateData.imagen_id)
        const response = await api.put(`usuarios/${user.id}`, updateData);
        // console.log(response.data)
        if (response.data) {
          // Actualizar el contexto con la nueva imagen
          updateUser({
            ...user,
            nombre: usuario.nombre,
            apellido1: usuario.apellido1,
            apellido2: usuario.apellido2,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            imagen: imagen_id, // Usar el nuevo ID de imagen
          });

          // Resetear tempImage y forzar recarga
          setTempImage(null);
          await obtenerUser(); // Recargar datos del servidor

          Alert.alert("Éxito", "Perfil actualizado correctamente");
          navigation.goBack();
        }
      } else {
        const updateData = {
          nombre: usuario.nombre,
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          nick: user.nick,
          imagen_id: null, // Asegurar que siempre se envíe
        };

        // console.log(updateData.imagen_id)
        const response = await api.put(`usuarios/${user.id}`, updateData);
        // console.log(response.data)
        if (response.data) {
          // Actualizar el contexto con la nueva imagen
          updateUser({
            ...user,
            nombre: usuario.nombre,
            apellido1: usuario.apellido1,
            apellido2: usuario.apellido2,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            imagen: imagen_id, // Usar el nuevo ID de imagen
          });

          // Resetear tempImage y forzar recarga
          setTempImage(null);
          await obtenerUser(); // Recargar datos del servidor

          Alert.alert("Éxito", "Perfil actualizado correctamente");
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil de usuario</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Encabezado con foto */}
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={seleccionarImagen}>
              <View style={styles.avatarContainer}>
                {tempImage ? (
                  <Image
                    source={{ uri: tempImage }}
                    style={styles.avatar}
                    cachePolicy="memory-disk"
                  />
                ) : usuario?.imagen ? (
                  <Image
                    source={{
                      uri: `http://${dirImg}${usuario.imagen.split("/").pop()}`,
                    }}
                    style={styles.avatar}
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <Ionicons name="person-circle" size={100} color="#FF6B00" />
                )}
                <View style={styles.editIcon}>
                  <Ionicons name="camera" size={24} color="white" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{user?.nick || "Usuario"}</Text>
          </View>

          {/* Formulario de edición */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={usuario.nombre}
                onChangeText={(text) =>
                  setUsuario({ ...usuario, nombre: text })
                }
                placeholder="Nombre"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Primer Apellido</Text>
              <TextInput
                style={styles.input}
                value={usuario.apellido1}
                onChangeText={(text) =>
                  setUsuario({ ...usuario, apellido1: text })
                }
                placeholder="Primer apellido"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Segundo Apellido</Text>
              <TextInput
                style={styles.input}
                value={usuario.apellido2}
                onChangeText={(text) =>
                  setUsuario({ ...usuario, apellido2: text })
                }
                placeholder="Segundo apellido"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={usuario.telefono}
                onChangeText={(text) =>
                  setUsuario({ ...usuario, telefono: text })
                }
                maxLength={8}
                placeholder="Teléfono"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Dirección</Text>
              <TextInput
                style={styles.input}
                value={usuario.direccion}
                onChangeText={(text) =>
                  setUsuario({ ...usuario, direccion: text })
                }
                placeholder="Dirección"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={guardarCambios}
            >
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Estilos (extendidos de PerfilesScreen.js con nuevos elementos)
const styles = StyleSheet.create({
  ...StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      top: 10,
      padding: 16,
      paddingTop: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFF",
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
    },
    profileHeader: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 30,
    },
    avatarContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#FF6B00",
      marginBottom: 15,
    },
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
    editIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#FF6B00",
      borderRadius: 20,
      padding: 5,
    },
    userName: {
      fontSize: 24,
      color: "white",
      fontWeight: "bold",
      marginBottom: 5,
    },
    formContainer: {
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      color: "white",
      marginBottom: 8,
    },
    input: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 10,
      padding: 15,
      color: "white",
      fontSize: 16,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    actionsContainer: {
      marginTop: 20,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 15,
    },
    saveButton: {
      backgroundColor: "#FF6B00",
    },
    cancelButton: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      borderColor: "#FF6B00",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  }),
});

export default EditarPerfilScreen;
