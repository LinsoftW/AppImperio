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
import AgregarTarjetaScreen from '../screens/AgregarTarjetaScreen';
import ListaTarjetasScreen from '../screens/ListarTarjetasScreen';
import EliminarProducto from '../screens/EliminarProducto';
import ReporteVentasScreen from '../screens/ReporteVentas';
import UserRoleManagementScreen from '../screens/UserRolManageScreen';

// 1. Crea el Drawer Navigator como componente separado
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Inicio" component={HomeScreen} />
        {/* <Drawer.Screen name="Agregar Tarjeta" component={AgregarTarjetaScreen} /> */}
        <Drawer.Screen name="Listado Tarjeta" component={ListaTarjetasScreen} />
        <Drawer.Screen name="UserRoleManagement" component={UserRoleManagementScreen} options={{ title: 'Gestión de Roles' }}
        />
        {/* <Drawer.Screen name="Detalles" component={DetallesScreen} /> */}
        {/* <Drawer.Screen name="Carrito" component={CarritoScreen} options={{ headerShown: false, title: 'Mi carrito' }} /> */}
        {/* <Drawer.Screen name="Checkout1" component={CheckoutScreen1} options={{ headerShown: false, title: 'Pago' }} /> */}
        <Drawer.Screen name="Agregar Productos" component={UploadImageScreen} />
        <Drawer.Screen name="Editar Productos" component={EliminarProducto} />
        {/* <Drawer.Screen name="Detalles de Ventas" component={DetalleVentaScreen} /> */}
        <Drawer.Screen name="Estado de pagos" component={VerificarPagosScreen} />
        <Drawer.Screen name="Reporte de ventas" component={ReporteVentasScreen} options={{ headerShown: false }} />
        {/* <Drawer.Screen name="EstadoPago" component={EstadoPagoScreen} options={{ headerShown: false, title: 'Estado del pago' }} /> */}
        {/* Más pantallas del drawer */}
    </Drawer.Navigator>
);

// 2. Crea el Stack Navigator principal
const Stack = createStackNavigator();

const AdminScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Pasa DrawerNavigator como COMPONENTE, no como hijo directo */}
        <Stack.Screen
            name="MainDrawer"
            component={DrawerNavigator}
        />
        <Stack.Screen name="Detalles" component={DetallesScreen} />
        <Stack.Screen name="Detalles de Ventas" component={DetalleVentaScreen} />
        <Stack.Screen name="Editar" component={EditarProducto} />
        <Stack.Screen name="AgregarTarjeta" component={AgregarTarjetaScreen} />
        {/* <Stack.Screen name="MainDrawer" component={DrawerNavigator} options={{ headerShown: false, title: 'Inicio' }} /> */}
        <Stack.Screen name="Checkout1" component={CheckoutScreen1} options={{ headerShown: false, title: 'Pago' }} />
        {/* <Stack.Screen name="EstadoPago" component={EstadoPagoScreen} options={{ headerShown: false, title: 'Estado del pago' }} /> */}
        <Stack.Screen name="DetalleVenta" component={DetalleVentaScreen} options={{ headerShown: false, title: 'Detalles de la venta' }} />
        {/* Más pantallas del stack */}
    </Stack.Navigator>
);

export default AdminScreen;