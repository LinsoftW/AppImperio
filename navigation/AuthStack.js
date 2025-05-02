import { createStackNavigator } from '@react-navigation/stack';
// import RecoverPasswordScreen from '../screens/RecoverPasswordScreen';
import LoginScreenEste from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistrarScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreenEste} 
        options={{ title: 'Iniciar sesión' }}
      />
      <Stack.Screen 
        name="Registar" 
        component={RegistroScreen} 
        options={{ title: 'Crear cuenta' }}
      />
      {/* <Stack.Screen 
        name="RecoverPassword" 
        component={RecoverPasswordScreen}
        options={{ title: 'Recuperar contraseña' }} 
      /> */}
    </Stack.Navigator>
  );
}