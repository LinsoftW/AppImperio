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
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import RNPickerSelect from "react-native-picker-select";
import * as DocumentPicker from 'expo-document-picker';
import Constants from "expo-constants";
import { Image } from "expo-image";

export default function AddProductos(route) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sexos, setSexos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pickerKey, setPickerKey] = useState(0);
  const { server } = Constants.expoConfig.extra;

  const [productData, setProductData] = useState({
    nombre: "",
    precio: "",
    cantidad: "",
    volumen: "",
    descripcion: "",
    idsexo: "",
    idmarca: "",
    idcategoria: "",
  });
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const obtenerSexosyMarcas = async () => {
    const Csexos = await api.get("/sexo");
    setSexos(Csexos.data.datos);
    const Cmarcas = await api.get("/marcas");
    setMarcas(Cmarcas.data.datos);
    const Ccategorias = await api.get("/categorias");
    setCategorias(Ccategorias.data.datos);
  };

  useEffect(() => {
    if (isFocused || route.params?.refresh) {
    obtenerSexosyMarcas();
    }
  }, [isFocused, route.params?.refresh]);

  // Cuando cambien los datos:
  useEffect(() => {
    setPickerKey((prev) => prev + 1);
  }, [sexos, marcas, categorias]);

  const handleChange = (name, value) => {
    // console.log(`Cambiando ${name} a:`, value);
    setProductData({
      ...productData,
      [name]: value,
    });
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

  // const uploadProduct = async () => {
  //   if (!image) {
  //     Alert.alert("Error", "Selecciona una imagen primero.");
  //     return;
  //   }

  //   if (
  //     !productData.nombre ||
  //     !productData.precio ||
  //     !productData.cantidad ||
  //     !productData.volumen ||
  //     !productData.idsexo ||
  //     !productData.idmarca ||
  //     !productData.idcategoria
  //   ) {
  //     Alert.alert("Error", "Completa todos los campos del producto.");
  //     return;
  //   }

  //   if (!productData.descripcion){ productData.descripcion = "Sin descripción"}

  //   setUploading(true);

  //   try {
  //     // Primero subir la imagen
  //     const formData = new FormData();
  //     formData.append("imagen", {
  //       uri: image,
  //       name: image.split("/").pop(),
  //       type: "image/jpeg",
  //     });

  //     const imageResponse = await axios.post(
  //       `http://${server}/upload`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         timeout: 30000, // 30 segundos de timeout
  //       }
  //     );

  //     // Luego crear el producto con la imagen_id
  //     const productResponse = await api.post("/productos", {
  //       ...productData,
  //       imagen_id: imageResponse.data.id,
  //     });

  //     Alert.alert("Éxito", "Producto creado correctamente.");
  //     productData.cantidad = "";
  //     productData.nombre = "";
  //     productData.precio = "";
  //     productData.descripcion = "";
  //     productData.volumen = "";
  //     productData.idsexo = "";
  //     productData.idmarca = "";
  //     productData.idcategoria = "";
  //   } catch (error) {
  //     console.error("Error:", error);
  //     Alert.alert(
  //       "Error",
  //       "No se pudo agregar el producto. Intente nuevamente."
  //     );
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const uploadProduct = async () => {
    if (!image) {
      Alert.alert("Error", "Selecciona una imagen primero.");
      return;
    }

    // Validación de campos numéricos
    const precio = parseFloat(productData.precio);
    const cantidad = parseInt(productData.cantidad);

    if (isNaN(precio)) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }

    if (precio <= 0) {
      Alert.alert("Error", "El precio debe ser mayor que 0.");
      return;
    }

    if (isNaN(cantidad)) {
      Alert.alert("Error", "La cantidad debe ser un número válido.");
      return;
    }

    if (cantidad <= 0) {
      Alert.alert("Error", "La cantidad debe ser mayor que 0.");
      return;
    }

    if (
      !productData.nombre ||
      !productData.volumen ||
      !productData.idsexo ||
      !productData.idmarca ||
      !productData.idcategoria
    ) {
      Alert.alert("Error", "Completa todos los campos del producto.");
      return;
    }

    if (!productData.descripcion) {
      productData.descripcion = "Sin descripción";
    }

    setUploading(true);

    try {
      // Primero subir la imagen
      const formData = new FormData();
      formData.append("imagen", {
        uri: image,
        name: image.split("/").pop(),
        type: "image/jpeg",
      });

      const imageResponse = await axios.post(
        `http://${server}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 segundos de timeout
        }
      );

      // Luego crear el producto con la imagen_id
      const productResponse = await api.post("/productos", {
        ...productData,
        precio: precio, // Usamos el valor validado
        cantidad: cantidad, // Usamos el valor validado
        imagen_id: imageResponse.data.id,
      });

      Alert.alert("Éxito", "Producto creado correctamente.");
      // Limpiar el formulario
      setProductData({
        nombre: "",
        precio: "",
        cantidad: "",
        volumen: "",
        descripcion: "",
        idsexo: "",
        idmarca: "",
        idcategoria: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "No se pudo agregar el producto. Intente nuevamente."
      );
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
            <Text style={styles.headerTitle}>Agregar productos</Text>
            <View style={{ width: 24 }} />
          </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={pickFile}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} cachePolicy="memory-disk"/>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="camera" size={50} color="#FFF" />
                <Text style={styles.imageText}>Subir foto</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            value={productData.nombre}
            color="#000"
            onChangeText={(text) => handleChange("nombre", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Precio"
            value={productData.precio}
            color="#000"
            onChangeText={(text) => handleChange("precio", text)}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            value={productData.cantidad}
            onChangeText={(text) => handleChange("cantidad", text)}
            keyboardType="decimal-pad"
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
              key={`sexo-picker-${pickerKey}`} // Fuerza re-render
              placeholder={{ label: "Selecciona un sexo", value: null }}
              onValueChange={(value) => {
                handleChange("idsexo", value);
                setPickerKey((prev) => prev + 1); // Fuerza actualización
              }}
              items={sexos.map((sexo) => ({
                label: sexo.attributes?.descripcion || "Sin descripción",
                value: sexo.id,
                key: sexo.id,
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
              onValueChange={(value) => {
                handleChange("idmarca", value);
                setPickerKey((prev) => prev + 1);
              }}
              items={marcas.map((marca) => ({
                label: marca.attributes?.descripcion || "Sin descripción",
                value: marca.id,
                key: marca.id,
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
              key={`sexo-picker-${pickerKey}`} // Fuerza re-render
              placeholder={{ label: "Selecciona una categoría", value: null }}
              onValueChange={(value) => {
                handleChange("idcategoria", value);
                setPickerKey((prev) => prev + 1); // Fuerza actualización
              }}
              items={categorias.map((categoria) => ({
                label: categoria.attributes?.descripcion || "Sin descripción",
                value: categoria.id,
                key: categoria.id,
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

          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={uploadProduct}
            disabled={uploading}
          >
            <FontAwesome name="upload" size={20} color="#FFF" />
            <Text style={styles.buttonText}>
              {uploading ? "Subiendo..." : "Guardar Producto"}
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
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    padding: 16,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  label: {
    color: "#666",
    fontSize: 14,
    marginTop: 5,
  },
});
