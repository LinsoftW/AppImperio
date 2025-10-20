// import {
//   View,
//   StyleSheet,
//   Text,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";

// const AboutUsScreen = ({ navigation }) => {
//   return (
//     <LinearGradient
//       colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//       style={styles.container}
//     >
//       <View style={styles.container}>
//         <View style={styles.header1}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="#FFF" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Contactos</Text>
//           <View style={{ width: 24 }} />
//         </View>
//         <ScrollView contentContainerStyle={styles.content}>
//           <View style={styles.header}>
//             <Ionicons name="information-circle" size={60} color="#FFF" />
//             <Text style={styles.title}>Quiénes Somos</Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Nuestra Misión</Text>
//             <Text style={styles.cardText}>
//               Somos un equipo comprometido con brindar soluciones tecnológicas
//               innovadoras que mejoren la vida de nuestros usuarios.
//             </Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Nuestra Visión</Text>
//             <Text style={styles.cardText}>
//               Ser líderes en el desarrollo de aplicaciones móviles que faciliten
//               el día a día de las personas, con un enfoque en usabilidad y
//               diseño intuitivo.
//             </Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Nuestro Equipo</Text>
//             <Text style={styles.cardText}>
//               Contamos con un equipo multidisciplinario de desarrolladores,
//               diseñadores y expertos en experiencia de usuario trabajando juntos
//               para ofrecerte la mejor solución.
//             </Text>
//           </View>

//           <View style={styles.contactInfo}>
//             <Text style={styles.contactTitle}>Contáctanos</Text>
//             <View style={styles.contactItem}>
//               <Ionicons name="mail-outline" size={20} color="#FFF" />
//               <Text style={styles.contactText}>
//                 imperio.soporte.servicio@gmail.com
//               </Text>
//             </View>
//             <View style={styles.contactItem}>
//               <Ionicons name="call-outline" size={20} color="#FFF" />
//               <Text style={styles.contactText}>+53 51379680</Text>
//             </View>
//             <View style={styles.contactItem}>
//               <Ionicons name="location-outline" size={20} color="#FFF" />
//               <Text style={styles.contactText}>La Habana, Cuba</Text>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#F9F5FF',
//   },
//   header1: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//     paddingTop: 5,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#FFF",
//     textShadowColor: "rgba(0, 0, 0, 0.3)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   content: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 28,
//     color: "#FFF",
//     fontWeight: "bold",
//     marginTop: 15,
//   },
//   // card: {
//   //   backgroundColor: "rgba(255, 255, 255, 0.1)",
//   //   borderRadius: 15,
//   //   padding: 12,
//   //   marginBottom: 20,
//   //   width: "100%",
//   // },
//   card: {
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     borderRadius: 15,
//     padding: 20,
//     marginHorizontal: 20,
//     marginBottom: 20,
//     shadowColor: "#7D5A94",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardTitle: {
//     color: "#FFF",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   cardText: {
//     color: "#FFF",
//     fontSize: 16,
//     lineHeight: 24,
//     textAlign: "justify",
//   },
//   contactInfo: {
//     marginTop: 20,
//   },
//   contactTitle: {
//     color: "#FFF",
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   contactItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   contactText: {
//     color: "#FFF",
//     fontSize: 16,
//     marginLeft: 10,
//   },
// });

// export default AboutUsScreen;

import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const AboutUsScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Sobre Nosotros</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Sección principal */}
        <View style={styles.mainSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={60} color="#FF6B00" />
          </View>
          <Text style={styles.title}>Quiénes Somos</Text>
        </View>

        {/* Tarjetas de información */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="rocket-outline" size={20} color="#FFF" />
            </View>
            <Text style={styles.cardTitle}>Nuestra Misión</Text>
          </View>
          <Text style={styles.cardText}>
            Somos un equipo comprometido con brindar soluciones tecnológicas
            innovadoras que mejoren la vida de nuestros usuarios.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="eye-outline" size={20} color="#FFF" />
            </View>
            <Text style={styles.cardTitle}>Nuestra Visión</Text>
          </View>
          <Text style={styles.cardText}>
            Ser líderes en el desarrollo de aplicaciones móviles que faciliten
            el día a día de las personas, con un enfoque en usabilidad y diseño
            intuitivo.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="people-outline" size={20} color="#FFF" />
            </View>
            <Text style={styles.cardTitle}>Nuestro Equipo</Text>
          </View>
          <Text style={styles.cardText}>
            Contamos con un equipo multidisciplinario de desarrolladores,
            diseñadores y expertos en experiencia de usuario trabajando juntos
            para ofrecerte la mejor solución.
          </Text>
        </View>

        {/* Sección de contacto */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contáctanos</Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail-outline" size={18} color="#FFF" />
            </View>
            <Text style={styles.contactText}>imperio.soporte.servicio@gmail.com</Text>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="call-outline" size={18} color="#FFF" />
            </View>
            <Text style={styles.contactText}>+53 51379680</Text>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="location-outline" size={18} color="#FFF" />
            </View>
            <Text style={styles.contactText}>La Habana, Cuba</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  title: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    textAlign: 'justify',
  },
  contactSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 107, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#FFF',
    flex: 1,
  },
});

export default AboutUsScreen;
