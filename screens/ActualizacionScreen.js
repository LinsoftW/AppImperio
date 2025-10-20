import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ProgressBarAndroid from "react-native-paper";
import { ProgressBar } from 'react-native-paper';
// import { FileSystem } from "expo-file-system";
// import { FileSystem } from 'expo';

const ActualizacionScreen = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [storagePermission, setStoragePermission] = useState(false);
  const { update } = Constants.expoConfig.extra;
  const downloadResumableRef = useRef(null);
  const navigation = useNavigation();

  const APK_URL = "http://190.6.81.46/descarga/AppImperio.apk";
  const VERSION_CHECK_URL = `http://${update}`;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused || route.params?.refresh) {
      checkForUpdates();
      setCurrentVersion(Constants.expoConfig.version || "1.0.1");
      checkStoragePermission();
    }
  }, [isFocused, route.params?.refresh]);

  const checkStoragePermission = async () => {
    if (Platform.OS === "android" && Platform.Version < 29) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Permiso de almacenamiento",
            message:
              "La aplicación necesita acceso al almacenamiento para descargar actualizaciones",
            buttonNeutral: "Preguntar después",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );
        setStoragePermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn("Error al solicitar permiso:", err);
        setStoragePermission(false);
      }
    } else {
      setStoragePermission(true); // No se necesita permiso en Android 10+
    }
  };

  const checkForUpdates = async () => {
    try {
      setLoading(true);
      const response = await fetch(VERSION_CHECK_URL);
      const data = await response.json();
      // console.log(data)

      if (data.version && data.version !== Constants.expoConfig.version) {
        setLatestVersion(data.version);
        setUpdateAvailable(true);
      } else {
        setUpdateAvailable(false);
      }
    } catch (error) {
      console.error("Error checking updates:", error);
      Alert.alert(
        "Error",
        "No se pudo verificar actualizaciones. Por favor verifica tu conexión a internet."
      );
    } finally {
      setLoading(false);
    }
  };

  const getDownloadPath = async () => {
    const apkFileName = `AppImperio_${Date.now()}.apk`;

    if (Constants.appOwnership === "expo") {
      Alert.alert(
        "Actualización requerida",
        "Por favor descarga la última versión desde:",
        [
          {
            text: "Descargar",
            onPress: () => Linking.openURL(APK_URL),
          },
        ]
      );
      return;
    }
    // 1. Intentar con directorio de descargas públicas (para Android < 10)
    if (
      Platform.OS === "android" &&
      Platform.Version < 29 &&
      storagePermission
    ) {
      try {
        const downloadsDir = `${FileSystem.documentDirectory}../Downloads/`;
        const dirInfo = await FileSystem.getInfoAsync(downloadsDir);

        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(downloadsDir, {
            intermediates: true,
          });
        }

        const publicPath = `${downloadsDir}${apkFileName}`;
        console.log("Intentando descargar en:", publicPath);
        return publicPath;
      } catch (e) {
        console.log("No se pudo usar Downloads público, usando caché", e);
      }
    }

    // 2. Usar caché como fallback (siempre funciona)
    const cachePath = `${FileSystem.cacheDirectory}${apkFileName}`;
    console.log("Usando ruta de caché:", cachePath);
    return cachePath;
  };

  const installApk = async (apkUri) => {
    try {
      // Método 1: Intentar con ACTION_VIEW
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: apkUri,
        flags: 1,
        type: "application/vnd.android.package-archive",
      });
    } catch (intentError) {
      console.log(
        "IntentLauncher falló, intentando con Linking...",
        intentError
      );

      // Método 2: Usar Linking
      try {
        await Linking.openURL(apkUri);
      } catch (linkingError) {
        console.error("Error al instalar:", linkingError);

        // Método 3: Intentar con FileProvider (para Android 7+)
        try {
          await IntentLauncher.startActivityAsync(
            "android.intent.action.INSTALL_PACKAGE",
            {
              data: apkUri,
              flags: 1,
            }
          );
        } catch (fileProviderError) {
          console.error("Error con FileProvider:", fileProviderError);

          // Si todo falla, mostrar opción manual
          Alert.alert(
            "Instalación manual requerida",
            "Por favor instala manualmente el APK descargado desde tu administrador de archivos.",
            [
              {
                text: "Abrir administrador de archivos",
                onPress: () =>
                  Linking.openURL(
                    "content://com.android.externalstorage.documents/root/primary"
                  ),
              },
              {
                text: "Cancelar",
                style: "cancel",
              },
            ]
          );
        }
      }
    }
  };

  const downloadUpdate = async () => {
    try {
      setLoading(true);
      setIsDownloading(true);
      setDownloadProgress(0);

      const downloadPath = await getDownloadPath();
      console.log("Ruta de descarga final:", downloadPath);

      downloadResumableRef.current = FileSystem.createDownloadResumable(
        APK_URL,
        downloadPath,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const downloadResult = await downloadResumableRef.current.downloadAsync();

      if (!downloadResult) {
        throw new Error("La descarga fue cancelada");
      }

      // Instalar el APK
      await installApk(downloadResult.uri);
    } catch (error) {
      console.error("Error en descarga:", error);

      let errorMessage = "Error desconocido";
      if (error.message.includes("Network request failed")) {
        errorMessage = "Error de red. Verifica tu conexión a internet.";
      } else if (error.message.includes("ENOENT")) {
        errorMessage =
          "Error al acceder al almacenamiento. Intenta nuevamente.";
      } else if (error.message.includes("permission")) {
        errorMessage =
          "Se necesitan permisos de almacenamiento. Por favor concede los permisos.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert(
        "Error",
        `No se pudo completar la descarga: ${errorMessage}`,
        [
          {
            text: "Descargar manualmente",
            onPress: () => Linking.openURL(APK_URL),
          },
          {
            text: "Reintentar",
            onPress: downloadUpdate,
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]
      );
    } finally {
      setLoading(false);
      setIsDownloading(false);
      setDownloadProgress(0);
      downloadResumableRef.current = null;
    }
  };

  const cancelDownload = async () => {
    if (downloadResumableRef.current) {
      try {
        await downloadResumableRef.current.cancelAsync();
        Alert.alert("Descarga cancelada", "Puedes intentarlo más tarde");
      } catch (error) {
        console.error("Error cancelando descarga:", error);
      } finally {
        setLoading(false);
        setIsDownloading(false);
        setDownloadProgress(0);
        downloadResumableRef.current = null;
      }
    }
  };

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Actualización</Text>
        <View style={{ width: 24 }} />
      </View> */}
      <Text style={styles.title1}>Actualización</Text>
      <View style={styles.content}>
        <FontAwesome
          name="cloud-download"
          size={80}
          color="#FFF"
          style={styles.icon}
        />

        <Text style={styles.title}>Actualización de la Aplicación</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Versión actual: {currentVersion}</Text>
          {updateAvailable && (
            <Text style={styles.infoText}>Nueva versión: {latestVersion}</Text>
          )}
        </View>

        {loading && !updateAvailable ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : updateAvailable ? (
          <>
            <Text style={styles.updateText}>
              ¡Nueva actualización disponible!
            </Text>

            {downloadProgress > 0 && downloadProgress < 1 ? (
              <>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    Descargando... {Math.round(downloadProgress * 100)}%
                  </Text>
                  {Platform.OS === "android" ? (
                    <ProgressBar
                      styleAttr="Horizontal"
                      indeterminate={false}
                      progress={downloadProgress}
                      color="#FF6B00"
                      style={styles.progressBar}
                    />
                  ) : (
                    <View style={styles.progressBarIOS}>
                      <View
                        style={{
                          width: `${downloadProgress * 100}%`,
                          height: "100%",
                          backgroundColor: "#FF6B00",
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.updateButton, styles.cancelButton]}
                  onPress={cancelDownload}
                  disabled={!isDownloading}
                >
                  <AntDesign name="closecircleo" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Cancelar descarga</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.updateButton}
                onPress={downloadUpdate}
                disabled={loading}
              >
                <MaterialIcons name="system-update" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Actualizar Ahora</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.noUpdateText}>
            Tu aplicación está actualizada
          </Text>
        )}
      </View>
    </LinearGradient>
  );
};

// Estilos (igual que en tu código original)
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
  noUpdateText: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 20,
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
  title1: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 5,
    textAlign: "center",
  },
  updateText: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  updateButton: {
    flexDirection: "row",
    backgroundColor: "#FF6B00",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: Dimensions.get("window").width * 0.7,
  },
  cancelButton: {
    backgroundColor: "#FF4444",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  progressContainer: {
    width: Dimensions.get("window").width * 0.8,
    marginBottom: 15,
  },
  progressText: {
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 20,
  },
  progressBarIOS: {
    width: "100%",
    height: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
    overflow: "hidden",
  },
});

export default ActualizacionScreen;
