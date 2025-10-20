// import React from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// const HelpDetailScreen = ({ route }) => {
//   const { feature } = route.params;

//   // Diccionario de iconos
//   const ICONS = {
//     '%ICON_CART%': <Ionicons name="cart" size={16} color="#1a3a8f" style={{ marginHorizontal: 4 }} />,
//     '%ICON_HEART%': <Ionicons name="heart" size={16} color="#FF0000" style={{ marginHorizontal: 4 }} />
//   };

//    const renderStep = (step, index) => {
//     const parts = step.split(/(%ICON_\w+%)/);
    
//     return (
//       <Text key={index} style={styles.stepText}>
//         {parts.map((part, i) => (
//           ICONS[part] || part
//         ))}
//       </Text>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//         <Ionicons name={feature.icon} size={30} color="#FF6B00" />
//         <Text style={styles.title}>{feature.title}</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.stepsContainer}>
//         {feature.steps.map((step, index) => (
//           <View key={index} style={styles.stepCard}>
//             <Text style={styles.stepNumber}>{index + 1}.</Text>
//             {renderStep(step, index)}
//           </View>
//         ))}
//       </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// };
// import React from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useIsFocused } from "@react-navigation/native";

// const HelpDetailScreen = ({ navigation,route }) => {
//   const { feature } = route.params;

//   // Diccionario de iconos
//   const ICONS = {
//     '%ICON_CART%': <Ionicons name="cart" size={16} color="#1a3a8f" style={{ marginHorizontal: 4 }} />,
//     '%ICON_HEART%': <Ionicons name="heart" size={16} color="#FF0000" style={{ marginHorizontal: 4 }} />
//   };

//   const renderStep = (step, index) => {
//     const parts = step.split(/(%ICON_\w+%)/);
    
//     return (
//       <Text key={`step-text-${index}`} style={styles.stepText}>
//         {parts.map((part, i) => (
//           <React.Fragment key={`step-part-${index}-${i}`}>
//             {ICONS[part] || part}
//           </React.Fragment>
//         ))}
//       </Text>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//          <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>
//         <Ionicons name={feature.icon} size={30} color="#FF6B00" />
//         <Text style={styles.title}>{feature.title}</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.stepsContainer}>
//           {feature.steps.map((step, index) => (
//             <View key={`step-${index}`} style={styles.stepCard}>
//               <Text style={styles.stepNumber}>{index + 1}.</Text>
//               {renderStep(step, index)}
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//     padding: 20,
//     backgroundColor: "rgba(0,0,0,0.2)",
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(255,255,255,0.1)",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#FFF",
//   },
//   scrollContainer: {
//     padding: 20,
//   },
//   stepsContainer: {
//     gap: 12,
//   },
//   stepCard: {
//     backgroundColor: "rgba(255,255,255,0.9)",
//     borderRadius: 8,
//     padding: 15,
//     flexDirection: "row",
//     alignItems: "flex-start",
//   },
//   stepNumber: {
//     fontWeight: "bold",
//     color: "#FF6B00",
//     marginRight: 8,
//   },
// stepText: {
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   alignItems: 'center',
//   color: '#333',
//   fontSize: 15,
// }
// });

// export default HelpDetailScreen;

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const HelpDetailScreen = ({ navigation, route }) => {
  const { feature } = route.params;

  // Diccionario de iconos
  const ICONS = {
    '%ICON_CART%': <Ionicons name="cart" size={16} color="#FF6B00" style={{ marginHorizontal: 4 }} />,
    '%ICON_HEART%': <Ionicons name="heart" size={16} color="#FF6B00" style={{ marginHorizontal: 4 }} />
  };

  const renderStep = (step, index) => {
    const parts = step.split(/(%ICON_\w+%)/);
    
    return (
      <Text key={`step-text-${index}`} style={styles.stepText}>
        {parts.map((part, i) => (
          <React.Fragment key={`step-part-${index}-${i}`}>
            {ICONS[part] || part}
          </React.Fragment>
        ))}
      </Text>
    );
  };

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
        <View style={styles.headerIcon}>
          <Ionicons name={feature.icon} size={24} color="#FFF" />
        </View>
        <Text style={styles.title}>{feature.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.stepsContainer}>
          {feature.steps.map((step, index) => (
            <View key={`step-${index}`} style={styles.stepCard}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              {renderStep(step, index)}
            </View>
          ))}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 35,
    // backgroundColor: "rgba(0,0,0,0.2)",
    // borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  stepsContainer: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 14,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumber: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
  },
});

export default HelpDetailScreen;
