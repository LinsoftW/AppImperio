// import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LoadingScreen = () => {
  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <StatusBar backgroundColor="#192f6a" />

      <View style={styles.content}>
        {/* <Image
          source={require("../assets/splash.png")}
          style={styles.logo}
          resizeMode="contain"
        /> */}

        <ActivityIndicator size="large" color="#FFFFFF" />

        <Text style={styles.text}>Cargando datos...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 40,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 20,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default LoadingScreen;
