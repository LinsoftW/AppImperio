import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetallesScreen from './screens/DetailScreen';
import LoginScreen2 from './screens/LoginScreen2';
import UploadImageScreen from './screens/AddProductos';
import RegistroScreen from './screens/RegistrarScreen';
import FloatingWhatsApp from './screens/WhatsappFloat';
import { UserProvider } from './screens/UserContext';
import EliminarProducto from './screens/EliminarProducto';
import EditarProducto from './screens/EditarProducto';
import CarritoScreen from './screens/CarritoScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function HomeWithMenu() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Inicio" component={HomeScreen} />
        {/* <Drawer.Screen name="Detalles" component={DetallesScreen} /> */}
        <Drawer.Screen name="Agregar productos" component={UploadImageScreen} />
        <Drawer.Screen name="Modificar productos" component={EliminarProducto} />
        {/* Eliminamos el registro del menú lateral ya que es solo para no logueados */}
      </Drawer.Navigator>
    );
  }

  function AppWrapper() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          {/* tus navegadores */}
        </NavigationContainer>
        <FloatingWhatsApp />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            // Pantallas con menú (logueado)
            <>
              <Stack.Screen
                name="Atrás"
                component={HomeWithMenu}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Detalles"
                component={DetallesScreen}
                options={{ headerShown: true, title: 'Detalles del producto' }}
              />
              <Stack.Screen
                name="Editar"
                component={EditarProducto}
                options={{ headerShown: true, title: 'Editar producto' }}
              />
              <Stack.Screen name="Carrito" component={CarritoScreen} options={{ headerShown: true, title: 'Mi carrito' }} />
            </>
          ) : (
            // Pantallas sin menú (no logueado)
            <>
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {props => <LoginScreen2 {...props} onLogin={() => setIsLoggedIn(true)} />}
              </Stack.Screen>
              <Stack.Screen
                name="Registro"
                component={RegistroScreen}
                options={{ title: 'Crear cuenta' }}
              />
              <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: true, title: 'Inicio' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#1C1C1C', // Fondo oscuro
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
