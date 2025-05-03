import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetallesScreen from '../screens/DetailScreen';
import UploadImageScreen from '../screens/AddProductos';
import CarritoScreen from '../screens/CarritoScreen';
// import NavigationHandler from './navigation/NavigationHandler';
import CheckoutScreen from '../screens/PagoScreen';
import CheckoutScreen1 from '../screens/ChecoutScreen';
import EstadoPagoScreen from '../screens/EstadoPagoScreen';
import VerificarPagosScreen from '../screens/AdminPagos';
import DetalleVentaScreen from '../screens/DetallesVentasScreen';
import EditarProducto from '../screens/EditarProducto';

// 1. Crea el Drawer Navigator como componente separado
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Inicio" component={HomeScreen} />
        {/* <Drawer.Screen name="Detalles" component={DetallesScreen} /> */}
        <Drawer.Screen name="Carrito" component={CarritoScreen} options={{ headerShown: false, title: 'Mi carrito' }} />
        {/* <Drawer.Screen name="Checkout1" component={CheckoutScreen1} options={{ headerShown: false, title: 'Pago' }} /> */}
        <Drawer.Screen name="EstadoPago" component={EstadoPagoScreen} options={{ headerShown: false, title: 'Estado del pago' }} />
        {/* <Drawer.Screen name="AgregarProductos" component={UploadImageScreen} />
        <Drawer.Screen name="EditarProductos" component={EditarProducto} /> */}
        {/* Más pantallas del drawer */}
    </Drawer.Navigator>
);

// 2. Crea el Stack Navigator principal
const Stack = createStackNavigator();

const MainStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Pasa DrawerNavigator como COMPONENTE, no como hijo directo */}
        <Stack.Screen
            name="MainDrawer"
            component={DrawerNavigator}
        />
         <Stack.Screen name="Detalles" component={DetallesScreen} />
         {/* <Stack.Screen name="Inicio" component={HomeScreen} /> */}
        {/* <Stack.Screen name="MainDrawer" component={DrawerNavigator} options={{ headerShown: false, title: 'Inicio' }} /> */}
        <Stack.Screen name="Checkout1" component={CheckoutScreen1} options={{ headerShown: false, title: 'Pago' }} />
        <Stack.Screen name="EstadoPago" component={EstadoPagoScreen} options={{ headerShown: false, title: 'Estado del pago' }} />
        {/* <Stack.Screen name="DetalleVenta" component={DetalleVentaScreen} options={{ headerShown: false, title: 'Detalles de la venta' }} /> */}
        {/* Más pantallas del stack */}
    </Stack.Navigator>
);

export default MainStack;