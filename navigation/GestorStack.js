// OTRA VARIANTE
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetallesScreen from "../screens/DetailScreen";
import UploadImageScreen from "../screens/AddProductos";
import CarritoScreen from "../screens/CarritoScreen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CheckoutScreen from "../screens/PagoScreen";
import CheckoutScreen1 from "../screens/ChecoutScreen";
import EstadoPagoScreen from "../screens/EstadoPagoScreen";
import VerificarPagosScreen from "../screens/AdminPagos";
import DetalleVentaScreen from "../screens/DetallesVentasScreen";
import EditarProducto from "../screens/EditarProducto";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "../screens/SettingsScreen";
import ActualizacionScreen from "../screens/ActualizacionScreen";
import ProfileScreen from "../screens/PerfilesScreen";
import CartIconWithBadge from "../screens/CartIconWithBadge";
import EditarPerfilScreen from "../screens/EditarPerfilScreen";
import FavoritosScreen from "../screens/FavoritosScreen";
import ConfirmacionPagoScreen from "../screens/ConfirmPagoScreen";
import HelpScreen from "../screens/HelpScreen";
import HelpDetailScreen from "../screens/HelpDetallesScreen";
import AboutUsScreen from "../screens/AboutScreen";
import { StyleSheet } from "react-native";
import DownloadScreen from "../screens/CompartirScreen";
import CustomDrawerContent from "../screens/CustomDrawerContent";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import ReporteVentasScreen from "../screens/ReporteVentas";

// 1. Crear Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();

// 2. Crear el componente BottomTabs que incluirá todas las pantallas que necesitan el tab bar
const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false, // Ocultar header en las tabs
      tabBarStyle: {
        backgroundColor: "#192f6a",
        paddingBottom: 5,
        height: 60,
      },
      tabBarActiveTintColor: "#FF6B00",
      tabBarInactiveTintColor: "#FFFFFF",
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    <Tab.Screen
      name="HomeStack"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Inicio",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="CarritoStack"
      component={CartStackScreen}
      options={{
        tabBarLabel: "Carrito",
        tabBarIcon: ({ color, size }) => (
          <CartIconWithBadge color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="FavoritosStack"
      component={FavoritosStackScreen}
      options={{
        tabBarLabel: "Favoritos",
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="favorite" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="ActualizacionStack"
      component={ActualizacionStackScreen}
      options={{
        tabBarLabel: "Actualización",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="download" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="SettingsStack"
      component={SettingsStackScreen}
      options={{
        tabBarLabel: "Configuración",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-sharp" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

// 3. Crear Stack Navigators para cada tab
const HomeStack = createStackNavigator();
const CartStack = createStackNavigator();
const FavoritosStack = createStackNavigator();
const ActualizacionStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex: 1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    {/* <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} /> */}
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    {/* <HomeStack.Screen name="MainDrawer" component={DrawerNavigator} /> */}
    {/* <HomeStack.Screen name="MainDrawer" component={HomeScreen} options={{ headerShown: false }} /> */}
    {/* <HomeStack.Screen name="Detalles" component={DetallesScreen} /> */}
    {/* <HomeStack.Screen name="Checkout1" component={CheckoutScreen1} /> */}
    <HomeStack.Screen name="EstadoPago" component={EstadoPagoScreen} />
    
    {/* <HomeStack.Screen name="ConfirmarPago" component={ConfirmacionPagoScreen} /> */}
  </HomeStack.Navigator>
);

const CartStackScreen = () => (
  <CartStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex: 1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    <CartStack.Screen
      name="Cart"
      component={CarritoScreen}
      options={{ headerShown: false }}
    />
    {/* <CartStack.Screen name="Checkout1" component={CheckoutScreen1} /> */}
    <CartStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <CartStack.Screen name="EstadoPago" component={EstadoPagoScreen} />
    <CartStack.Screen name="ConfirmarPago" component={ConfirmacionPagoScreen} />
  </CartStack.Navigator>
);

const FavoritosStackScreen = () => (
  <FavoritosStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex: 1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    <FavoritosStack.Screen name="Favoritos" component={FavoritosScreen} />
  </FavoritosStack.Navigator>
);

const ActualizacionStackScreen = () => (
  <ActualizacionStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex: 1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    <ActualizacionStack.Screen
      name="Actualizacion"
      component={ActualizacionScreen}
    />
  </ActualizacionStack.Navigator>
);

const SettingsStackScreen = () => (
  <SettingsStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex: 1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    <SettingsStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
    {/* <SettingsStack.Screen name="EditarPerfil" component={EditarPerfilScreen} /> */}
    {/* <SettingsStack.Screen 
      name="Perfil" 
      component={ProfileScreen} 
      options={{ tabBarVisible: false }} 
    /> */}
    {/* <SettingsStack.Screen name="Checkout1" component={CheckoutScreen1} /> */}
    <SettingsStack.Screen name="Home" component={HomeScreen} />
    <SettingsStack.Screen name="AdminPagos" component={VerificarPagosScreen} />
    <SettingsStack.Screen name="DetalleVenta" component={DetalleVentaScreen} />
    <SettingsStack.Screen name="EditarProducto" component={EditarProducto} />
    <SettingsStack.Screen name="AddProductos" component={UploadImageScreen} />
    <SettingsStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    {/* <SettingsStack.Screen name="FavoritosStack" component={FavoritosScreen} /> */}
    {/* <SettingsStack.Screen name="Ayuda" component={HelpScreen} /> */}
    {/* <SettingsStack.Screen name="DetallesAyuda" component={HelpDetailScreen} />
    <SettingsStack.Screen name="Contactos" component={AboutUsScreen} /> */}
  </SettingsStack.Navigator>
);

// 3. Drawer Navigator (para funciones administrativas)
const MainDrawer = createDrawerNavigator();
const MainDrawerNavigator = () => (
  <MainDrawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerPosition: "left",
      drawerActiveTintColor: "#FF6B00",
      drawerInactiveTintColor: "#FFFFFF",
      drawerStyle: {
        backgroundColor: "#1a3a8f",
        width: 280,
      },
      drawerLabelStyle: {
        marginLeft: -8,
        fontSize: 16,
        fontWeight: "500",
      },
      drawerItemStyle: {
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 4,
      },
      drawerActiveBackgroundColor: "rgba(255, 255, 255, 0.1)",
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex:1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    // drawerContent={(props) => <CustomDrawerContent {...props} />} // Opcional: contenido personalizado
  >
    <MainDrawer.Screen
      name="MainTabs"
      component={BottomTabs}
      options={{
        drawerLabel: "Inicio",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }}
    />
    {/* <MainDrawer.Screen
      name="Favoritos"
      component={FavoritosScreen}
      options={{
        drawerLabel: "Favoritos",
        drawerIcon: ({ color, size }) => (
          <MaterialIcons name="favorite" color={color} size={size} />
        ),
      }}
    /> */}
    <MainDrawer.Screen
      name="Perfil"
      component={ProfileScreen}
      options={{
        drawerLabel: "Mi Perfil",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="person" color={color} size={size} />
        ),
      }}
    />
    <MainDrawer.Screen
      name="ReporteVentas"
      component={ReporteVentasScreen}
      options={{
        drawerLabel: "Reporte de ventas",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="bar-chart" color={color} size={size} />
        ),
      }}
    />
    <MainDrawer.Screen
      name="VerificarPagos"
      component={VerificarPagosScreen}
      options={{
        drawerLabel: "Pagos pendientes",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="cash" color={color} size={size} />
        ),
      }}
    />
    {/* Agrega más items según necesites */}
  </MainDrawer.Navigator>
);
// 4. Crear Root Stack Navigator para pantallas modales o que no deben mostrar el tab bar
const RootStack = createStackNavigator();

//  Nuevo MainStack
const GestorStack = () => (
  <RootStack.Navigator
    screenOptions={{
      headerShown: false,
      // cardStyle: { flex: 1, backgroundColor: "#1a3a8f" },
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex: 1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    {/* Pantalla principal con Drawer */}
    <RootStack.Screen name="MainApp" component={MainDrawerNavigator} />

    {/* Pantallas que no deben mostrar el tab bar ni el drawer */}
    <RootStack.Group>
      <RootStack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
      <RootStack.Screen name="Detalles" component={DetallesScreen} />
      <RootStack.Screen name="FavoritosScreen" component={FavoritosScreen} />
      <RootStack.Screen name="MainTabs" component={BottomTabs} />
      <RootStack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <RootStack.Screen
        name="Checkout1"
        component={CheckoutScreen1}
        options={{
          cardStyle: { flex: 1 },
        }}
      />
      <RootStack.Screen
        name="ConfirmarPago"
        component={ConfirmacionPagoScreen}
        options={{
          cardStyle: { flex: 1 },
        }}
      />
      <RootStack.Screen
        name="Ayuda"
        component={HelpScreen}
        options={{
          cardStyle: { flex: 1 },
        }}
      />
      <RootStack.Screen
        name="Compartir"
        component={DownloadScreen}
        options={{
          cardStyle: { flex: 1 },
        }}
      />
      <RootStack.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarVisible: false, cardStyle: { flex: 1 } }}
      />
      <RootStack.Screen
        name="DetallesAyuda"
        component={HelpDetailScreen}
        options={{
          cardStyle: { flex: 1 },
        }}
      />
      <RootStack.Screen
        name="Contactos"
        component={AboutUsScreen}
        options={{
          cardStyle: { flex: 1 },
        }}
      />
      <RootStack.Screen
        name="FavoritosStack"
        component={FavoritosScreen}
        options={{
          cardStyle: { flex: 1 },
        }}
      />
      <RootStack.Screen
      name="DetalleVenta"
      component={DetalleVentaScreen}
      options={{ headerShown: false, title: "Detalles de la venta" }}
    />
      {/* ... otras pantallas ... */}
    </RootStack.Group>
  </RootStack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1, // Esto es crucial
    // ...otros estilos
  },
});

export default GestorStack;