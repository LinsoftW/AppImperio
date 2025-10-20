import { createDrawerNavigator } from "@react-navigation/drawer";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetallesScreen from "../screens/DetailScreen";
import UploadImageScreen from "../screens/AddProductos";
import CarritoScreen from "../screens/CarritoScreen";
// import NavigationHandler from './navigation/NavigationHandler';
import CheckoutScreen from "../screens/PagoScreen";
import CheckoutScreen1 from "../screens/ChecoutScreen";
import EstadoPagoScreen from "../screens/EstadoPagoScreen";
import VerificarPagosScreen from "../screens/AdminPagos";
import DetalleVentaScreen from "../screens/DetallesVentasScreen";
import EditarProducto from "../screens/EditarProducto";
import AgregarTarjetaScreen from "../screens/AgregarTarjetaScreen";
import ListaTarjetasScreen from "../screens/ListarTarjetasScreen";
import EliminarProducto from "../screens/EliminarProducto";
import ReporteVentasScreen from "../screens/ReporteVentas";
import UserRoleManagementScreen from "../screens/UserRolManageScreen";
import AddContacto from "../screens/AddContacto";
import EditContacto from "../screens/EditContacto";
import ContactListScreen from "../screens/ContactListScreen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "../screens/SettingsScreen";
import ActualizacionScreen from "../screens/ActualizacionScreen";
import ProfileScreen from "../screens/PerfilesScreen";
import EditarPerfilScreen from "../screens/EditarPerfilScreen";
import AdminCategoriasScreen from "../screens/AdminCategoriasScreen";
import AddMarca from "../screens/AddMarcas";
import HelpScreen from "../screens/HelpScreen";
import HelpDetailScreen from "../screens/HelpDetallesScreen";
import AboutUsScreen from "../screens/AboutScreen";
import FavoritosScreen from "../screens/FavoritosScreen";
import DownloadScreen from "../screens/CompartirScreen";
import CustomDrawerContent from "../screens/CustomDrawerContent";
import AdminMensajeros from "../screens/AdminMensajeros";
import AdminMapaScreen from "../screens/UbicacionMensajeros";

// Nuevo estilo
// 1. Stacks para cada Tab (con navegación interna)
const HomeStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const FavoritosStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="AdminHome" component={HomeScreen} />
    {/* <HomeStack.Screen name="Detalles" component={DetallesScreen} /> */}
    <HomeStack.Screen
      name="Detalles de Ventas"
      component={DetalleVentaScreen}
    />
    <HomeStack.Screen
      name="Carrito"
      component={CarritoScreen}
      options={{ headerShown: false, title: "Mi carrito" }}
    />
    <HomeStack.Screen name="Editar" component={EditarProducto} />
    <HomeStack.Screen name="AgregarContacto" component={AddContacto} />
    <HomeStack.Screen name="EditarContacto" component={EditContacto} />
    <HomeStack.Screen name="ListaContacto" component={ContactListScreen} />
    <HomeStack.Screen name="AgregarTarjeta" component={AgregarTarjetaScreen} />
    {/* <Stack.Screen name="MainDrawer" component={DrawerNavigator} options={{ headerShown: false, title: 'Inicio' }} /> */}
    <HomeStack.Screen
      name="Checkout1"
      component={CheckoutScreen1}
      options={{ headerShown: false, title: "Pago" }}
    />
    {/* <Stack.Screen name="EstadoPago" component={EstadoPagoScreen} options={{ headerShown: false, title: 'Estado del pago' }} /> */}
    <HomeStack.Screen
      name="DetalleVenta"
      component={DetalleVentaScreen}
      options={{ headerShown: false, title: "Detalles de la venta" }}
    />
    {/* Pantallas secundarias (ej: detalles de productos) */}
    <HomeStack.Screen name="Ayuda" component={HelpScreen} />
    <HomeStack.Screen name="DetallesAyuda" component={HelpDetailScreen} />
    <HomeStack.Screen name="Contactos" component={AboutUsScreen} />
  </HomeStack.Navigator>
);

const SettingsStackScreen = () => (
  <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
    <SettingsStack.Screen name="AdminSettings" component={SettingsScreen} />
    <SettingsStack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
    <SettingsStack.Screen
      name="Perfil"
      component={ProfileScreen}
      options={{ tabBarVisible: false }}
    />
    {/* Otras pantallas de ajustes */}
    {/* <SettingsStack.Screen name="Ayuda" component={HelpScreen} />
    <SettingsStack.Screen name="DetallesAyuda" component={HelpDetailScreen} />
    <SettingsStack.Screen name="Contactos" component={AboutUsScreen} /> */}
  </SettingsStack.Navigator>
);

const FavoritosStackScreen = () => (
  <FavoritosStack.Navigator screenOptions={{ headerShown: false }}>
    <FavoritosStack.Screen name="Favoritos" component={FavoritosScreen} />
  </FavoritosStack.Navigator>
);
// 2. Bottom Tabs Navigator (para Inicio y Ajustes)
const Tab = createBottomTabNavigator();

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={{
      // tabBarActiveTintColor: "#007bff",
      // tabBarInactiveTintColor: "gray",
      // headerShown: false,
      headerShown: false, // Ocultar header en las tabs
      tabBarStyle: {
        backgroundColor: "#192f6a", // Color oscuro que combina con tu tema
        // borderTopColor: '#FF6B00',   // Borde naranja para contraste
        paddingBottom: 5,
        height: 60,
      },
      tabBarActiveTintColor: "#FF6B00", // Naranja para ícono activo
      tabBarInactiveTintColor: "#FFFFFF", // Blanco para íconos inactivos
    }}
  >
    <Tab.Screen
      name="InicioAdmin"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Inicio",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
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
      name="Actualizacion"
      component={ActualizacionScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="download" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="AjustesAdmin"
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

// 3. Drawer Navigator (para funciones administrativas)
const Drawer = createDrawerNavigator();

const AdminDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerPosition: "left",
      drawerActiveTintColor: "#FF6B00", // Color naranja para el ítem activo
      drawerInactiveTintColor: "#FFFFFF", // Color blanco para ítems inactivos
      drawerStyle: {
        backgroundColor: "#1a3a8f", // Fondo azul oscuro
        width: 280, // Ancho un poco mayor
      },
      drawerLabelStyle: {
        marginLeft: -8, // Ajuste para alinear texto con iconos
        fontSize: 16,
        fontWeight: "500",
      },
      drawerItemStyle: {
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 4,
      },
      drawerActiveBackgroundColor: "rgba(255, 255, 255, 0.1)", // Fondo para ítem activo
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      cardStyle: { flex:1, backgroundColor: "transparent" },
      cardOverlayEnabled: true,
      cardShadowEnabled: false,
    }}
  >
    <Drawer.Screen
      name="MainAdminTabs"
      component={AdminTabs}
      options={{
        drawerLabel: "Inicio",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="Perfil"
      component={ProfileScreen}
      options={{
        drawerLabel: "Mi perfil",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="person" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="AgregarProductos"
      component={UploadImageScreen}
      options={{
        drawerLabel: "Agregar productos",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="add-circle" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="AgregarMensajeros"
      component={AdminMensajeros}
      options={{
        drawerLabel: "Agregar mensajeros",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="bicycle" color={color} size={size} />
        ),
      }}
    />
    {/* <Drawer.Screen
      name="UbicarMensajeros"
      component={AdminMapaScreen}
      options={{
        drawerLabel: "Mostrar ubicación mensajeros",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="location" color={color} size={size} />
        ),
      }}
    /> */}
    <Drawer.Screen
      name="Editar productos"
      component={EliminarProducto}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="create" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="AddMarcas"
      component={AddMarca}
      options={{
        drawerLabel: "Editar marcas",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="pricetags" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="Editar categorías"
      component={AdminCategoriasScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="list" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="Listado tarjeta"
      component={ListaTarjetasScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="card" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="GestionRoles"
      component={UserRoleManagementScreen}
      options={{
        drawerLabel: "Gestión de roles",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="people" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="ReporteVentas"
      component={ReporteVentasScreen}
      options={{
        drawerLabel: "Reporte de ventas",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="bar-chart" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="VerificarPagos"
      component={VerificarPagosScreen}
      options={{
        drawerLabel: "Pagos pendientes",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="cash" color={color} size={size} />
        ),
      }}
    />
    <Drawer.Screen
      name="ContactosWhatsApp"
      component={ContactListScreen}
      options={{
        drawerLabel: "Contactos WhatsApp",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="logo-whatsapp" color={color} size={size} />
        ),
      }}
    />
  </Drawer.Navigator>
);

// 4. Stack Navigator principal (para pantallas con header)
const RootStack = createStackNavigator();

const AdminScreen = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="AdminApp" component={AdminDrawer} />
    <RootStack.Screen name="AgregarContacto" component={AddContacto} />
    <RootStack.Screen name="EditarContacto" component={EditContacto} />
    <RootStack.Screen name="ListaContacto" component={ContactListScreen} />
    <RootStack.Screen name="AgregarTarjeta" component={AgregarTarjetaScreen} />
    <RootStack.Screen
      name="AgregarCategoria"
      component={AdminCategoriasScreen}
    />
    <RootStack.Screen
      name="Checkout1"
      component={CheckoutScreen1}
      options={{ headerShown: false, title: "Pago" }}
    />
    <RootStack.Screen
      name="DetalleVenta"
      component={DetalleVentaScreen}
      options={{ headerShown: false, title: "Detalles de la venta" }}
    />
    <RootStack.Screen
      name="Compartir"
      component={DownloadScreen}
      // options={{
      //   cardStyle: { flex: 1 },
      // }}
      options={{ headerShown: false, title: "Compartir" }}
    />
    <RootStack.Screen name="Editar" component={EditarProducto} />
    <RootStack.Screen name="Perfil" component={ProfileScreen} />
    <RootStack.Screen name="Detalles" component={DetallesScreen} />
    <RootStack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
    {/* Pantallas que requieren navegación full-screen (ej: edición detallada) */}
    <RootStack.Screen name="Ayuda" component={HelpScreen} />
    <RootStack.Screen name="DetallesAyuda" component={HelpDetailScreen} />
    <RootStack.Screen name="Contactos" component={AboutUsScreen} />
    <RootStack.Screen name="Favoritos" component={FavoritosScreen} />
  </RootStack.Navigator>
);

export default AdminScreen;
