// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import QRCode from "react-native-qrcode-svg";

// const DownloadScreen = ({ navigation }) => {
//   const downloadUrl = "http://190.6.81.46/descarga/AppImperio.apk";

//   const handleWhatsAppShare = () => {
//     const message = `Descarga nuestra app: ${downloadUrl}`;
//     Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
//   };

//   return (
//     <LinearGradient
//       colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//       style={styles.container}
//     >
//       {/* Encabezado */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Descargar App</Text>
//       </View>

//       {/* Contenido */}
//       <View style={styles.content}>
//         {/* QR Code */}
//         <View style={styles.qrContainer}>
//           <QRCode
//             value={downloadUrl}
//             size={200}
//             color="#1a3a8f"
//             backgroundColor="white"
//           />
//           <Text style={styles.qrText}>Escanea para descargar</Text>
//         </View>

//         {/* Botón de WhatsApp */}
//         <TouchableOpacity 
//           style={styles.whatsappButton}
//           onPress={handleWhatsAppShare}
//         >
//           <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
//           <Text style={styles.whatsappText}>Compartir por WhatsApp</Text>
//         </TouchableOpacity>

//         {/* Enlace directo */}
//         {/* <TouchableOpacity 
//           style={styles.linkContainer}
//           onPress={() => Linking.openURL(downloadUrl)}
//         >
//           <Text style={styles.linkText}>Descarga directamente aquí</Text>
//         </TouchableOpacity> */}
//       </View>
//     </LinearGradient>
//   );
// };

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const DownloadScreen = ({ navigation }) => {
  const downloadUrl = "http://190.6.81.46/descarga/AppImperio.apk";

  // Solución universal que funciona en ambos sistemas
  const renderQRCode = () => {
    if (Platform.OS === 'web') {
      return (
        <Text style={styles.linkText} onPress={() => Linking.openURL(downloadUrl)}>
          Descargar APK
        </Text>
      );
    }

    try {
      const QRCode = require('react-native-qrcode-svg').default;
      return (
        <View style={styles.qrContainer}>
          <QRCode
            value={downloadUrl}
            size={200}
            color="#1a3a8f"
            backgroundColor="white"
          />
          <Text style={styles.qrText}>Escanea para descargar</Text>
        </View>
      );
    } catch (e) {
      return (
        <Text style={styles.linkText} onPress={() => Linking.openURL(downloadUrl)}>
          No se pudo cargar el QR. Toca para descargar
        </Text>
      );
    }
  };

  return (
    <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Descargar App</Text>
      </View>

      <View style={styles.content}>
        {renderQRCode()}
        
        <TouchableOpacity 
          style={styles.whatsappButton}
          onPress={() => {
            const message = `Descarga nuestra app: ${downloadUrl}`;
            Linking.openURL(
              `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
            );
          }}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
          <Text style={styles.whatsappText}>Compartir</Text>
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
    alignItems: "center",
    padding: 16,
    paddingTop: 35,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  qrText: {
    marginTop: 15,
    color: "#1a3a8f",
    fontWeight: "bold",
  },
  whatsappButton: {
    flexDirection: "row",
    backgroundColor: "#1b9c4aff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: 30
  },
  whatsappText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: "#FFF",
    textDecorationLine: "underline",
  },
});

export default DownloadScreen;