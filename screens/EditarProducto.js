import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import RNPickerSelect from "react-native-picker-select";
import Constants from "expo-constants";
import { Image } from "expo-image";
import * as DocumentPicker from "expo-document-picker";

export default function EditarProducto() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sexos, setSexos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pickerKey, setPickerKey] = useState(0);
  const [productData, setProductData] = useState({
    nombre: "",
    precio: "",
    cantidad: "",
    descripcion: "",
    imagen_id: "",
    idsexo: 0,
    idmarca: 0,
    volumen: "",
  });
  const [originalImage, setOriginalImage] = useState(null);
  const { dirImg } = Constants.expoConfig.extra;
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();
  const { producto } = route.params; // Recibimos el producto completo desde EliminarProducto

  // Cargar los datos del producto al montar el componente
  useEffect(() => {
    if (producto) {
      setProductData({
        nombre: producto.attributes.nombre,
        precio: producto.attributes.precio.toString(),
        cantidad: producto.attributes.cantidad.toString(),
        imagen_id: producto.attributes.imagen_id,
        descripcion: producto.attributes.descripcion,
        volumen: producto.attributes.volumen,
        idmarca: producto.attributes.marca,
        idsexo: producto.attributes.sexo,
        idcategoria: producto.attributes.idcategoria,
      });
      if (producto.attributes.imagen == null) {
        setOriginalImage(`http://82.23.146.68/uploads/iconoI.png`);
        setImage(`http://82.23.146.68/uploads/iconoI.png`);
      } else {
        setOriginalImage(
          `http://${dirImg}${producto.attributes.imagen.split("/").pop()}`
        );
        setImage(
          `http://${dirImg}${producto.attributes.imagen.split("/").pop()}`
        );
      }
    }
  }, [producto]);

  const obtenerSexosyMarcas = async () => {
    const Csexos = await api.get("/sexo");
    setSexos(Csexos.data.datos);
    const Cmarcas = await api.get("/marcas");
    setMarcas(Cmarcas.data.datos);
    const Ccategorias = await api.get("/categorias");
    setCategorias(Ccategorias.data.datos);
  };

  useEffect(() => {
    // obtenerSexosyMarcas();
    const loadData = async () => {
      try {
        await obtenerSexosyMarcas();
        if (producto) {
          // Código de inicialización del producto
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos iniciales");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Cuando cambien los datos:
  useEffect(() => {
    setPickerKey((prev) => prev + 1);
  }, [sexos, marcas]);

  const handleChange = (name, value) => {
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const pickImage = async () => {
    try {
      let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        const { status: newStatus, canAskAgain } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (newStatus !== "granted") {
          if (!canAskAgain) {
            Alert.alert(
              "Permiso bloqueado",
              "Ve a Configuración > Aplicaciones > Tu App > Permisos para habilitar la galería.",
              [{ text: "OK", onPress: () => Linking.openSettings() }]
            );
          }
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la galería.");
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true, // Importante para Android
      });

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setImage(selectedFile.uri);
        return selectedFile.uri;
      }
      return null;
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    }
  };

  const isNewImage = (currentImage, originalImage) => {
    if (!currentImage) return false;
    if (currentImage === originalImage) return false;
    if (currentImage.startsWith("http") && currentImage === originalImage)
      return false;
    return true;
  };

  // Subir imagen si cambio solamente
  const updateProduct = async () => {
    setUploading(true);

    try {
      let idimagen = productData.imagen_id;

      const imagenCambiada = isNewImage(image, originalImage);

      if (imagenCambiada === true) {
        // Solo subir nueva imagen si realmente ha cambiado
        const formData = new FormData();
        formData.append("imagen", {
          uri: image,
          name: image.split("/").pop(),
          type: "image/jpeg",
        });

        const imageResponse = await api.post(`/upload`, formData);
        idimagen = imageResponse.data.id;
      }

      // Actualizar el producto
      await api.put(`/productos/${producto.id}`, {
        ...productData,
        imagen_id: idimagen,
      });

      Alert.alert("Éxito", "Producto actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo actualizar el producto.");
    } finally {
      setUploading(false);
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
        <Text style={styles.headerTitle}>Modificar producto</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={pickFile}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="camera" size={50} color="#FFF" />
                <Text style={styles.imageText}>Cambiar imagen</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            value={productData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Precio"
            value={productData.precio}
            onChangeText={(text) => handleChange("precio", text)}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            value={productData.cantidad}
            onChangeText={(text) => handleChange("cantidad", text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Volumen"
            value={productData.volumen}
            onChangeText={(text) => handleChange("volumen", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={productData.descripcion}
            onChangeText={(text) => handleChange("descripcion", text)}
          />
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              key={`sexo-picker-${pickerKey}`}
              placeholder={{ label: "Selecciona un sexo", value: null }}
              onValueChange={(value) => handleChange("idsexo", value)}
              items={sexos.map((sexo) => ({
                label: sexo.attributes?.descripcion || "Sin descripción",
                value: sexo.id,
                key: `sexo-${sexo.id}`,
              }))}
              value={productData.idsexo}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Icon name="chevron-down" size={20} color="gray" />}
              fixAndroidTouchableBug={true}
            />
          </View>

          <View style={styles.pickerContainer}>
            <RNPickerSelect
              key={`marca-picker-${pickerKey}`}
              placeholder={{ label: "Selecciona una marca", value: null }}
              onValueChange={(value) => handleChange("idmarca", value)}
              items={marcas.map((marca) => ({
                label: marca.attributes?.descripcion || "Sin descripción",
                value: marca.id,
                key: `marca-${marca.id}`,
              }))}
              value={productData.idmarca}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Icon name="chevron-down" size={20} color="gray" />}
              fixAndroidTouchableBug={true}
            />
          </View>

          <View style={styles.pickerContainer}>
            <RNPickerSelect
              key={`categoria-picker-${pickerKey}`} // Key única para categoría
              placeholder={{ label: "Selecciona una categoría", value: null }}
              onValueChange={(value) => handleChange("idcategoria", value)}
              items={categorias.map((categoria) => ({
                label: categoria.attributes?.descripcion || "Sin descripción",
                value: categoria.id,
                key: `categoria-${categoria.id}`,
              }))}
              value={productData.idcategoria}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Icon name="chevron-down" size={20} color="gray" />}
              fixAndroidTouchableBug={true}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={20} color="#FFF" />
            <Text style={styles.buttonText}> Atrás</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={updateProduct}
            disabled={uploading}
          >
            <FontAwesome name="save" size={20} color="#FFF" />
            <Text style={styles.buttonText}>
              {uploading ? "Guardando..." : "Guardar Cambios"}
            </Text>
            {uploading && (
              <ActivityIndicator color="#FFF" style={{ marginLeft: 5 }} />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
    marginVertical: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
    marginVertical: 5,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

const styles = StyleSheet.create({
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
  pickerContainer: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  picker: {
    width: "100%",
    color: "#000",
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
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 8,
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
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
});
