// import React from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// const HelpScreen = ({ navigation }) => {
//   const features = [
//     {
//       title: "Iniciar Sesión",
//       icon: "log-in",
//       steps: [
//         "Ve a la pantalla de 'Login'",
//         "Ingresa tu nombre de usuario o número de teléfono y contraseña",
//         "Presiona 'Iniciar Sesión'",
//       ],
//     },
//     {
//       title: "Registrarse",
//       icon: "person-add",
//       steps: [
//         "Ve a '¿No tienes cuenta? Regístrate' desde el Login",
//         "Completa todos los campos",
//         "Click en 'Registrase'",
//       ],
//     },
//     {
//       title: "Recuperar Contraseña",
//       icon: "key",
//       steps: [
//         "En el Login, presiona 'Olvidé mi contraseña'",
//         "Ingresa tu número de teléfono registrado",
//         "Click en Solicitar Código y espera a recibir el código por Whatsapp, luego lo insertar en la nueva vista y tecleas la nueva contraseña",
//       ],
//     },
//     {
//       title: "Explorar Productos",
//       icon: "search",
//       steps: [
//         "Navega por la lista de productos",
//         "Usa filtros por categoría si lo necesitas",
//         "Toca un producto para ver detalles",
//       ],
//     },
//     {
//       title: "Añadir al Carrito",
//       icon: "cart",
//       steps: [
//         "En la pantalla de producto, selecciona cantidad",
//         "Presiona el botón %ICON_CART% para añadir",
//         "Ve a 'Carrito' para finalizar compra",
//       ],
//     },
//     {
//       title: "Favoritos",
//       icon: "heart",
//       steps: [
//         "Toca el icono ❤️ en cualquier producto",
//         "Ve a 'Favoritos' desde tu perfil",
//         "Encuentra tus productos guardados",
//       ],
//     },
//   ];

//   return (
//     <LinearGradient
//       colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Guía Rápida</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* <ScrollView style={styles.container}>
//       <Text style={styles.title}>Guía Rápida</Text>
      
//       {features.map((feature, index) => (
//         <TouchableOpacity 
//           key={index}
//           style={styles.card}
//           onPress={() => navigation.navigate('DetallesAyuda', { feature })}
//         >
//           <View style={styles.cardHeader}>
//             <Ionicons name={feature.icon} size={24} color="#1a3a8f" />
//             <Text style={styles.cardTitle}>{feature.title}</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#888" />
//         </TouchableOpacity>
//       ))}
//     </ScrollView> */}
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {features.map((feature, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.card}
//             // onPress={() => navigation.navigate("DetallesAyuda", { feature })}
//             onPress={() =>
//               navigation.navigate("DetallesAyuda", {
//                 feature: {
//                   ...feature,
//                   steps: feature.steps.map((step) =>
//                     typeof step === "string" ? step : "[icon]"
//                   ),
//                 },
//               })
//             }
//           >
//             <View style={styles.cardContent}>
//               <Ionicons name={feature.icon} size={28} color="#1a3a8f" />
//               <Text style={styles.cardTitle}>{feature.title}</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#888" />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#f5f5f5'
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     color: '#1a3a8f',
// //     textAlign: 'center'
// //   },
// //   card: {
// //     backgroundColor: 'white',
// //     borderRadius: 10,
// //     padding: 15,
// //     marginBottom: 15,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     elevation: 2
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10
// //   },
// //   cardTitle: {
// //     fontSize: 16,
// //     fontWeight: '600'
// //   }
// // });
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     paddingTop: 10,
//     backgroundColor: "rgba(0,0,0,0.2)",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#FFF",
//     textAlign: "center",
//   },
//   scrollContainer: {
//     padding: 15,
//   },
//   card: {
//     backgroundColor: "rgba(255,255,255,0.9)",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cardContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
// });

// export default HelpScreen;

import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const HelpScreen = ({ navigation }) => {
  const features = [
    {
      title: "Iniciar Sesión",
      icon: "log-in",
      steps: [
        "Ve a la pantalla de 'Login'",
        "Ingresa tu nombre de usuario o número de teléfono y contraseña",
        "Presiona 'Iniciar Sesión'",
      ],
    },
    {
      title: "Registrarse",
      icon: "person-add",
      steps: [
        "Ve a '¿No tienes cuenta? Regístrate' desde el Login",
        "Completa todos los campos",
        "Click en 'Registrarse'",
      ],
    },
    {
      title: "Recuperar Contraseña",
      icon: "key",
      steps: [
        "En el Login, presiona 'Olvidé mi contraseña'",
        "Ingresa tu número de teléfono registrado",
        "Click en Solicitar Código y espera a recibir el código por Whatsapp, luego lo insertar en la nueva vista y tecleas la nueva contraseña",
      ],
    },
    {
      title: "Explorar Productos",
      icon: "search",
      steps: [
        "Navega por la lista de productos",
        "Usa filtros por categoría si lo necesitas",
        "Toca un producto para ver detalles",
      ],
    },
    {
      title: "Añadir al Carrito",
      icon: "cart",
      steps: [
        "En la pantalla de producto, selecciona cantidad",
        "Presiona el botón %ICON_CART% para añadir",
        "Ve a 'Carrito' para finalizar compra",
      ],
    },
    {
      title: "Favoritos",
      icon: "heart",
      steps: [
        "Toca el icono ❤️ en cualquier producto",
        "Ve a 'Favoritos' desde tu perfil",
        "Encuentra tus productos guardados",
      ],
    },
  ];

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guía Rápida</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("DetallesAyuda", {
                feature: {
                  ...feature,
                  steps: feature.steps.map((step) =>
                    typeof step === "string" ? step : "[icon]"
                  ),
                },
              })
            }
          >
            <View style={styles.cardIcon}>
              <Ionicons name={feature.icon} size={20} color="#FFF" />
            </View>
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    // backgroundColor: "rgba(0,0,0,0.2)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
});

export default HelpScreen;
