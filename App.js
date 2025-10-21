// import './reanimated-setup';
import React from "react";
import { UserProvider } from "./screens/UserContext";
import RootNavigator from "./navigation/RootNavigator";
import { StyleSheet, View, Platform, Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { CartProvider } from "./screens/CartContext";
import * as Permissions from "expo-camera";

export default function App() {
  // Verificación de permisos al iniciar la app
  React.useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        const { status } = await Permissions.askAsync(
          Permissions.MEDIA_LIBRARY,
          Permissions.CAMERA
        );
        return status === "granted";
      }
      return true;
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <CartProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="auto" />
              <RootNavigator />
          </View>
        </CartProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

// import './patches/fix-reanimated-components';
// import './reanimated-setup';
// import React from "react";
// import { UserProvider } from "./screens/UserContext";
// import RootNavigator from "./navigation/RootNavigator";
// import { StyleSheet, View, Platform, Linking } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { StatusBar } from "expo-status-bar";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import * as ImagePicker from "expo-image-picker";
// import Constants from "expo-constants";
// import { CartProvider } from "./screens/CartContext";

// export default function App() {
//   // Verificación de permisos corregida
//   React.useEffect(() => {
//     (async () => {
//       if (Platform.OS === "android") {
//         // Usar ImagePicker para permisos en lugar de Permissions
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        
//         if (status !== 'granted' || cameraStatus !== 'granted') {
//           console.warn('Permisos de cámara y galería no concedidos');
//         }
//       }
//     })();
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <UserProvider>
//         <CartProvider>
//           <View style={{ flex: 1 }}>
//             <StatusBar style="auto" />
//             <RootNavigator />
//           </View>
//         </CartProvider>
//       </UserProvider>
//     </SafeAreaProvider>
//   );
// }