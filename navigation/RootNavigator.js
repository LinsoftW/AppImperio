import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AnonymousStack from './AnonymousStack';
import MainStack from './MainStack';
import { useUser } from '../screens/UserContext';
import LoadingScreen from '../screens/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminScreen from './AdminScreen';

export default function RootNavigator() {
    const { user, loading } = useUser();
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Verificar si hay sesión guardada
            const storedUser = await AsyncStorage.getItem('userData');
            if (storedUser) {
                // Si hay usuario guardado, verificamos si es anónimo
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.esAnonimo) {
                    // Lógica para usuario anónimo
                } else {
                    // Lógica para usuario registrado
                }
            }
            setAppReady(true);
        };

        checkAuth();
    }, []);

    //   if (loading) {
    //     return <LoadingScreen />; // Muestra spinner mientras verifica autenticación
    //   }
    switch (user?.rol) {
        case 1:
            return <AdminScreen />;
        case 2:
            return <MainStack />;
        case 3:
            return <MainStack />;
        case 4:
            return <AnonymousStack />;
        default:
            return <AuthStack />;
    }
}