import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RegistroScreen from '../screens/RegistrarScreen';
import LoginScreenEste from '../screens/LoginScreen';
import DetallesScreen from '../screens/DetailScreen';

const Stack = createStackNavigator();

export default function AnonymousStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreenEste} />
      <Stack.Screen name="Inicio" component={HomeScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="Detalles" component={DetallesScreen} />
    </Stack.Navigator>
  );
}