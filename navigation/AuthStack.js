import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistrarScreen';
import HomeScreen from '../screens/HomeScreen';
import SolicitarCambioPassword from '../screens/SolicitarCambioPassw';
import CambiarPasswordScreen from '../screens/CambioPassword';
import VerificacionScreen from '../screens/VerificarScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} style={{ flex: 1 }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ animationEnabled: false }} />
      <Stack.Screen name="Inicio" component={HomeScreen} options={{ animationEnabled: false }}/>
      <Stack.Screen name="Registro" component={RegistroScreen} options={{ animationEnabled: false }}/>
      <Stack.Screen name="SolicitarCambioPassw" component={SolicitarCambioPassword} options={{ animationEnabled: false }}/>
      <Stack.Screen name="CambiarPassword" component={CambiarPasswordScreen} options={{ animationEnabled: false }}/>
      <Stack.Screen name="VerificarNumero" component={VerificacionScreen} options={{ animationEnabled: false }}/>
    </Stack.Navigator>
  );
}