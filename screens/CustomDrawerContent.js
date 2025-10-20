// Crea un nuevo archivo: CustomDrawerContent.js
import React, { use, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useUser } from "./UserContext";
import api from "../api/api";
import Constants from "expo-constants";
import { useIsFocused } from "@react-navigation/native";

const { dirImg } = Constants.expoConfig.extra;

const CustomDrawerContent = (props) => {
  const { user } = useUser();

  const isFocused = useIsFocused();

  // console.log("Datos del usuario:", user);
  const [usuario, setUsuario] = useState({ attributes: {} });

  const obtenerUser = async () => {
    try {
      const response = await api.get("usuarios");
      const userData = response.data.datos.find(
        (u) => u.attributes?.nick === user?.nick
      );
      if (userData) setUsuario(userData);
    } catch (e) {
      console.error("Error al obtener usuario:", e);
    }
  };

  useEffect(() => {
    obtenerUser();
  }, [isFocused]);

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      {/* Encabezado con perfil */}
      <View style={styles.profileContainer}>
        {/* {user?.nick ? (
          <Image
            source={require("../assets/user2.png") }
            style={styles.profileImage}
            onError={(e) =>
              console.log("Error al cargar imagen:", e.nativeEvent.error)
            }
            defaultSource={require("../assets/user2.png")}
          />
        ) : (
          // <Image
          //   source={require("../assets/default-profile.png")}
          //   style={styles.profileImage}
          // />
          <Image
            //   source={user?.photoURL ? { uri: usuario?.attributes.imagen } : require('../assets/user2.png')}
            source={{
              uri: usuario?.attributes?.imagen
                ? `http://${dirImg}${usuario.attributes.imagen.split("/").pop()}`
                : require("../assets/user2.png"),
            }}
            style={styles.profileImage}
            contentFit="cover"
          />
        )} */}
        <Text style={styles.userName}>
          {usuario?.attributes.nombre +
            " " +
            usuario?.attributes.apellido1 +
            " " +
            usuario?.attributes.apellido2 || "Invitado"}{" "}
        </Text>
        <Text style={styles.userEmail}>
          {usuario?.attributes.telefono || ""}
        </Text>
      </View>

      {/* Items del menú */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: "#1a3a8f",
    flex: 1,
  },
  profileContainer: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  userName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userEmail: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textAlign: "center",
  },
});

export default CustomDrawerContent;
