import { createStackNavigator } from '@react-navigation/stack';
import RegistroScreen from '../screens/RegistrarScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreenEste from '../screens/LoginScreen';

const Stack = createStackNavigator();

export default function AnonymousStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreenEste} />
      {/* <Stack.Screen name="Detalles" component={ProductListScreen} /> */}
      {/* <Stack.Screen name="LimitedDetail" component={LimitedDetailScreen} /> */}
      <Stack.Screen 
        name="Registar" 
        component={RegistroScreen}
        options={{ title: 'Completar registro' }}
      />
    </Stack.Navigator>
  );
}