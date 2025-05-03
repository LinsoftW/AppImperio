// import React, { useEffect, useState } from 'react';
// import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';
// import DetallesScreen from './screens/DetailScreen';
// import LoginScreen2 from './screens/LoginScreen2';
// import UploadImageScreen from './screens/AddProductos';
// import RegistroScreen from './screens/RegistrarScreen';
// import FloatingWhatsApp from './screens/WhatsappFloat';
// import { UserProvider, useUser } from './screens/UserContext';
// import EliminarProducto from './screens/EliminarProducto';
// import EditarProducto from './screens/EditarProducto';
// import CarritoScreen from './screens/CarritoScreen';
// import NavigationHandler from './navigation/NavigationHandler';
// import CheckoutScreen from './screens/PagoScreen';
// import CheckoutScreen1 from './screens/ChecoutScreen';
// import EstadoPagoScreen from './screens/EstadoPagoScreen';
// import VerificarPagosScreen from './screens/AdminPagos';
// import ReporteVentasScreen from './screens/ReporteVentas';
// import DetalleVentaScreen from './screens/DetallesVentasScreen';
// import ListaTarjetasScreen from './screens/ListarTarjetasScreen';
// import AgregarTarjetaScreen from './screens/AgregarTarjetaScreen';
// import AuthStack from './navigation/AuthStack';
// import AnonymousStack from './navigation/AnonymousStack';
// import UserStack from './navigation/UserStack';

// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();
// const { user } = useUser

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   function HomeWithMenu() {
//     return (
//       <Drawer.Navigator>
//         <Drawer.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
//         {/* <Drawer.Screen name="Detalles" component={DetallesScreen} /> */}
//         <Drawer.Screen name="Agregar productos" component={UploadImageScreen} options={{ headerShown: false }} />
//         <Drawer.Screen name="Modificar productos" component={EliminarProducto} options={{ headerShown: false }} />
//         <Drawer.Screen name="Estado de pagos" component={VerificarPagosScreen} options={{ headerShown: false }} />
//         <Drawer.Screen name="Reporte de ventas" component={ReporteVentasScreen} options={{ headerShown: false }} />
//         <Drawer.Screen name="Tarjetas" component={ListaTarjetasScreen} options={{ headerShown: false }} />
//         <Drawer.Screen name="AgregarTarjeta" component={AgregarTarjetaScreen} options={{ headerShown: false }} />
//         {/* Eliminamos el registro del menú lateral ya que es solo para no logueados */}
//       </Drawer.Navigator>
//     );
//   }

//   function AppWrapper() {
//     return (
//       <View style={{ flex: 1 }}>
//         <NavigationContainer>
//           {/* tus navegadores */}
//         </NavigationContainer>
//         <FloatingWhatsApp />
//       </View>
//     );
//   }

//   return (
//     <UserProvider>
//       <NavigationContainer>
//         {/*  Esta variante debe ser la mas eficiente */}

//         {!user ? (
//           <AuthStack />
//         ) : user.esAnonimo ? (
//           <AnonymousStack />
//         ) : (
//           <UserStack />
//         )}

//         {/* <NavigationHandler /> */}
//         {/* <Stack.Navigator>
//           {isLoggedIn ? (
//             // Pantallas con menú (logueado)
//             <>
//               <Stack.Screen
//                 name="Página prinicpal"
//                 component={HomeWithMenu}
//                 options={{ headerShown: false }}
//               />
//               <Stack.Screen
//                 name="Detalles"
//                 component={DetallesScreen}
//                 options={{ headerShown: false, title: 'Detalles del producto' }}
//               />
//               <Stack.Screen
//                 name="Editar"
//                 component={EditarProducto}
//                 options={{ headerShown: false, title: 'Editar producto' }}
//               />
//               <Stack.Screen name="Carrito" component={CarritoScreen} options={{ headerShown: false, title: 'Mi carrito' }} />
//               <Stack.Screen name="Checkout1" component={CheckoutScreen1} options={{ headerShown: false, title: 'Pago' }} />
//               <Stack.Screen name="EstadoPago" component={EstadoPagoScreen} options={{ headerShown: false, title: 'Estado del pago' }} />
//               <Stack.Screen name="DetalleVenta" component={DetalleVentaScreen} options={{ headerShown: false, title: 'Detalles de la venta' }} />
//             </>
//           ) : (
//             // Pantallas sin menú (no logueado)
//             <>
//               <Stack.Screen name="Login" options={{ headerShown: false }}>
//                 {props => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
//               </Stack.Screen>
//               <Stack.Screen
//                 name="Registro"
//                 component={RegistroScreen}
//                 options={{ title: 'Crear cuenta' , headerShown: false}}
//               />
//               <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false, title: 'Inicio' }} />
//             </>
//           )}
//         </Stack.Navigator> */}
//       </NavigationContainer>
//     </UserProvider>
//   );
// }

import React from 'react';
import { UserProvider } from './screens/UserContext';
import RootNavigator from './navigation/RootNavigator';
import FloatingWhatsApp from './screens/WhatsappFloat';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </UserProvider>
  );
}

// const styles = StyleSheet.create({
//   appContainer: {
//     flex: 1,
//     backgroundColor: '#1C1C1C', // Fondo oscuro
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });
