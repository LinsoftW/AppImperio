import { createStackNavigator } from '@react-navigation/stack';
import HomeWithMenu from '../App'; // Importa el Drawer Navigator
import DetallesScreen from '../screens/DetailScreen';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeWithMenu" component={HomeWithMenu} />
      <Stack.Screen name="Detalles" component={DetallesScreen} />
    </Stack.Navigator>
  );
}